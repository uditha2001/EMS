import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApi from '../../api/api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import EditRoleModal from '../../components/Modals/EditRoleModal';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import { faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { jsPDF } from 'jspdf';
import useHasPermission from '../../hooks/useHasPermission';
import autoTable from 'jspdf-autotable';

interface AssignedRole {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  roleId: number;
  roleName: string;
  userId: number;
  user: string;
  examinationId: number;
  isAuthorized: boolean;
  paperType: 'THEORY' | 'PRACTICAL';
}

interface Examination {
  id: string;
  year: string;
  level: string;
  semester: string;
  degreeProgramName: string;
}

const PreviewAssignedRoles: React.FC = () => {
  const { examinationId } = useParams<{ examinationId: string }>();
  const [assignedRoles, setAssignedRoles] = useState<AssignedRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<AssignedRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AssignedRole | null>(null);
  const [users, setUsers] = useState<
    { id: number; firstName: string; lastName: string }[]
  >([]);
  const [examination, setExamination] = useState<Examination | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<() => void>(() => {});

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterByPaperType, setFilterByPaperType] = useState<
    'ALL' | 'THEORY' | 'PRACTICAL'
  >('ALL');
  const [filterByAuthorization, setFilterByAuthorization] = useState<
    'ALL' | 'AUTHORIZED' | 'UNAUTHORIZED'
  >('ALL');
  const hasApprovePermission = useHasPermission('APPROVE_EXAM_ROLE');

  const {
    fetchRoleAssignments,
    editRoleAssignment,
    fetchUsers,
    getExaminationById,
    authorizeRoleAssignment,
    authorizeRoleByExamination,
    authorizeRoleByCourseAndPaperType,
  } = useApi();

  useEffect(() => {
    if (examinationId) {
      setIsLoading(true);
      // Fetch examination details
      getExaminationById(Number(examinationId))
        .then((exam) => setExamination(exam))
        .catch(() => setErrorMessage('Failed to fetch examination details.'));
      fetchRoleAssignments(Number(examinationId))
        .then((response) => {
          if (response?.data.data && Array.isArray(response.data.data)) {
            setAssignedRoles(response.data.data);
            setFilteredRoles(response.data.data); // Initialize filtered roles
          } else {
            setErrorMessage('The response data is not in the expected format.');
          }
        })
        .catch((error) => {
          console.error('Error fetching assigned roles:', error);
          setErrorMessage('Failed to fetch assigned roles. Please try again.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [examinationId]);

  // Apply search and filters whenever searchQuery, filterByPaperType, or filterByAuthorization changes
  useEffect(() => {
    let filtered = assignedRoles;

    // Filter by search query (course code, course name, role name, or user name)
    if (searchQuery) {
      filtered = filtered.filter(
        (role) =>
          role.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.user.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by paper type
    if (filterByPaperType !== 'ALL') {
      filtered = filtered.filter(
        (role) => role.paperType === filterByPaperType,
      );
    }

    // Filter by authorization status
    if (filterByAuthorization !== 'ALL') {
      filtered = filtered.filter(
        (role) =>
          (filterByAuthorization === 'AUTHORIZED' && role.isAuthorized) ||
          (filterByAuthorization === 'UNAUTHORIZED' && !role.isAuthorized),
      );
    }

    setFilteredRoles(filtered);
  }, [searchQuery, filterByPaperType, filterByAuthorization, assignedRoles]);

  const handleOpenModal = (role: AssignedRole) => {
    setSelectedRole(role);
    // Fetch users when the modal is opened
    fetchUsers()
      .then((response) => {
        if (response && Array.isArray(response)) {
          setUsers(response);
        } else {
          setErrorMessage('Failed to fetch users. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setErrorMessage('Failed to fetch users. Please try again.');
      });
    setIsModalOpen(true);
  };

  const handleAuthorizeRole = (roleAssignmentId: number) => {
    authorizeRoleAssignment(roleAssignmentId)
      .then(() => {
        setSuccessMessage('Role authorized successfully.');
        refreshRoleAssignments();
      })
      .catch(() => setErrorMessage('Failed to authorize role.'));
  };

  const handleAuthorizeByExamination = () => {
    authorizeRoleByExamination(Number(examinationId))
      .then(() => {
        setSuccessMessage('All roles authorized for this examination.');
        refreshRoleAssignments();
      })
      .catch(() =>
        setErrorMessage('Failed to authorize roles for examination.'),
      );
  };

  const handleAuthorizeByCourseAndPaperType = (
    courseId: number,
    paperType: 'THEORY' | 'PRACTICAL',
  ) => {
    authorizeRoleByCourseAndPaperType(courseId, paperType)
      .then(() => {
        setSuccessMessage(
          `Roles authorized for ${paperType} in Course ID ${courseId}.`,
        );
        refreshRoleAssignments();
      })
      .catch(() =>
        setErrorMessage('Failed to authorize roles by course and paper type.'),
      );
  };

  const onSave = (roleAssignmentId: number, userId: number) => {
    editRoleAssignment(roleAssignmentId, userId)
      .then(() => {
        // Re-fetch assigned roles to reflect the updated data
        fetchRoleAssignments(Number(examinationId))
          .then((response) => {
            if (response?.data.data && Array.isArray(response.data.data)) {
              setAssignedRoles(response.data.data); // Update the table with the new data
            } else {
              setErrorMessage(
                'The response data is not in the expected format.',
              );
            }
          })
          .catch((error) => {
            console.error('Error fetching updated assigned roles:', error);
            setErrorMessage(
              'Failed to fetch assigned roles. Please try again.',
            );
          });

        setIsModalOpen(false); // Close the modal after saving
        setSuccessMessage('Roles successfully assigned');
      })
      .catch((error) => {
        console.error('Error saving role assignment:', error);
        setErrorMessage(
          'Failed to update the role assignment. Please try again.',
        );
      });
  };

  const refreshRoleAssignments = () => {
    fetchRoleAssignments(Number(examinationId))
      .then((response) => {
        if (response?.data.data && Array.isArray(response.data.data)) {
          setAssignedRoles(response.data.data);
        } else {
          setErrorMessage('Failed to refresh role assignments.');
        }
      })
      .catch(() => setErrorMessage('Failed to refresh role assignments.'));
  };

  // Check if all roles are authorized
  const allRolesAuthorized = assignedRoles.every((role) => role.isAuthorized);

  // Group roles by courseId and paperType
  const groupedRoles = filteredRoles.reduce(
    (acc, role) => {
      if (!acc[role.courseId]) {
        acc[role.courseId] = {
          courseCode: role.courseCode,
          courseName: role.courseName,
          roles: {
            THEORY: [],
            PRACTICAL: [],
          },
        };
      }
      acc[role.courseId].roles[role.paperType].push(role);
      return acc;
    },
    {} as Record<
      number,
      {
        courseCode: string;
        courseName: string;
        roles: Record<'THEORY' | 'PRACTICAL', AssignedRole[]>;
      }
    >,
  );

  // Handle confirmation for authorization actions
  const confirmAction = (action: () => void) => {
    setActionToConfirm(() => action);
    setIsConfirmationModalOpen(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 40; // Initial Y position

    // Check if all roles are authorized
    const allRolesAuthorized = Object.values(groupedRoles).every((course) =>
      (['THEORY', 'PRACTICAL'] as ('THEORY' | 'PRACTICAL')[]).every(
        (paperType) =>
          course.roles[paperType].every((role) => role.isAuthorized),
      ),
    );

    // Header Section (Centered)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('University of Ruhuna', pageWidth / 2, 15, { align: 'center' });
    doc.text('Department of Computer Science', pageWidth / 2, 25, {
      align: 'center',
    });

    // Exam Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Examination: ${examination?.degreeProgramName} - Level ${examination?.level} - Semester ${examination?.semester} - ${examination?.year}`,
      margin,
      currentY,
    );
    doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5); // Separator line
    currentY += 15;

    // Title
    doc.setFontSize(14);
    const titleText = allRolesAuthorized
      ? 'Exam Role Assignment Sheet (Authorized)'
      : 'Exam Role Assignment Sheet (Unauthorized)';
    doc.text(titleText, margin, currentY);
    currentY += 10;

    // Table Headers
    const tableHeaders = ['Role', 'Assigned User'];

    Object.values(groupedRoles).forEach((course) => {
      // **Course Header**
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${course.courseCode} - ${course.courseName}`, margin, currentY);
      currentY += 8;

      ['THEORY', 'PRACTICAL'].forEach((paperType) => {
        const roles = course.roles[paperType as 'THEORY' | 'PRACTICAL'];
        if (roles.length === 0) return; // Skip empty paper types

        // **Paper Type Sub-Header**
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`${paperType} Paper`, margin, currentY);
        currentY += 6;

        // Data for the table
        const tableData: any[] = roles.map((role) => [
          role.roleName.toLowerCase(),
          role.user,
        ]);

        // Generate Table
        autoTable(doc, {
          startY: currentY,
          head: [tableHeaders],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Green header
          margin: { top: 10 },
        });

        // Update Y position after the table
        currentY = (doc as any).lastAutoTable.finalY + 10;

        // Handle page breaks
        if (currentY > pageHeight - 40) {
          doc.addPage();
          currentY = 20; // Reset Y position for the new page
        }
      });

      currentY += 15; // Space between courses
    });

    // Footer Section with time
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      currentY + 10,
    );
    currentY += 20;

    // Signatures
    const colWidth = (pageWidth - 3 * margin) / 2;
    doc.setFontSize(10);
    doc.text('Created by:', margin, currentY);
    doc.line(margin + 30, currentY + 2, margin + colWidth - 20, currentY + 2);

    doc.text('Authorized by:', margin + colWidth, currentY);
    doc.line(
      margin + colWidth + 30,
      currentY + 2,
      margin + 2 * colWidth - 20,
      currentY + 2,
    );

    // Save PDF
    const fileName = `assigned-roles-overview-${examination?.degreeProgramName}-${examination?.year}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Preview Assigned Roles" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke dark:border-strokedark py-6 px-8">
          <header className="text-center mb-6">
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              University of Ruhuna
            </h4>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Department of Computer Science
            </h3>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Exam Role Assignment Sheet (
              {allRolesAuthorized ? 'Authorized' : 'Unauthorized'})
            </h2>
          </header>

          {/* Responsive row for exam details and button */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
              Examination: {examination?.degreeProgramName} - Level{' '}
              {examination?.level} - Semester {examination?.semester} -{' '}
              {examination?.year}
            </h3>

            {!allRolesAuthorized && hasApprovePermission && (
              <button
                className="bg-primary hover:bg-blue-700 text-white font-medium px-5 py-2 rounded transition duration-200 whitespace-nowrap"
                onClick={() => confirmAction(handleAuthorizeByExamination)}
              >
                Authorize All Roles for This Examination
              </button>
            )}
            <button className="btn-primary whitespace-nowrap" onClick={generatePDF}>
              Download PDF
            </button>
            <Link
              className="btn-primary whitespace-nowrap"
              to={`/paper/preview-assigned-revision/${examinationId}`}
            >
              Revisions
            </Link>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="p-6.5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by course code, course name, role, or user"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2 rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4"
            />

            {/* Filter by Paper Type */}
            <select
              value={filterByPaperType}
              onChange={(e) =>
                setFilterByPaperType(
                  e.target.value as 'ALL' | 'THEORY' | 'PRACTICAL',
                )
              }
              className="w-full md:w-1/4 rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4"
            >
              <option value="ALL">All Paper Types</option>
              <option value="THEORY">Theory</option>
              <option value="PRACTICAL">Practical</option>
            </select>

            {/* Filter by Authorization Status */}
            <select
              value={filterByAuthorization}
              onChange={(e) =>
                setFilterByAuthorization(
                  e.target.value as 'ALL' | 'AUTHORIZED' | 'UNAUTHORIZED',
                )
              }
              className="w-full md:w-1/4 rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4"
            >
              <option value="ALL">All Statuses</option>
              <option value="AUTHORIZED">Authorized</option>
              <option value="UNAUTHORIZED">Unauthorized</option>
            </select>
          </div>

          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
          {isLoading ? (
            <Loader />
          ) : (
            Object.keys(groupedRoles).map((courseId) => {
              const course = groupedRoles[Number(courseId)];
              return (
                <div
                  key={courseId}
                  className="mb-6 border-b border-stroke dark:border-strokedark"
                >
                  <h4 className="font-semibold  text-black dark:text-white">
                    {course.courseCode} - {course.courseName}
                  </h4>

                  {/* Render THEORY roles */}
                  {course.roles.THEORY.length > 0 && (
                    <div className="overflow-x-auto my-4 ">
                      <h5 className="font-medium text-black dark:text-white mb-4">
                        Theory
                      </h5>
                      {!allRolesAuthorized && hasApprovePermission && (
                        <button
                          className="bg-primary text-white px-4 py-2 rounded mb-4 inline-block"
                          onClick={() =>
                            confirmAction(() =>
                              handleAuthorizeByCourseAndPaperType(
                                Number(courseId),
                                'THEORY',
                              ),
                            )
                          }
                        >
                          Authorize Theory Roles
                        </button>
                      )}
                      <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-form-input">
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Role
                            </th>
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Assigned User
                            </th>
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Status
                            </th>
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.roles.THEORY.map((role) => (
                            <tr
                              key={role.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {role.roleName}
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {role.user}
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                <FontAwesomeIcon
                                  icon={
                                    role.isAuthorized ? faCheckCircle : faClock
                                  }
                                  className={`text-${
                                    role.isAuthorized ? 'green' : 'yellow'
                                  }-500`}
                                />
                                <span className="ml-2">
                                  {role.isAuthorized ? 'Authorized' : 'Pending'}
                                </span>
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {!role.isAuthorized ? (
                                  <>
                                    <button
                                      className="text-blue-500 mr-4"
                                      onClick={() => handleOpenModal(role)}
                                    >
                                      Edit
                                    </button>
                                    {hasApprovePermission && (
                                      <button
                                        className="text-green-500"
                                        onClick={() =>
                                          confirmAction(() =>
                                            handleAuthorizeRole(role.id),
                                          )
                                        }
                                      >
                                        Authorize
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-green-600">
                                    Role Authorized
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Render PRACTICAL roles */}
                  {course.roles.PRACTICAL.length > 0 && (
                    <div className="overflow-x-auto my-4">
                      <h5 className="font-medium text-black dark:text-white mb-4">
                        Practical
                      </h5>
                      {!allRolesAuthorized && hasApprovePermission && (
                        <button
                          className="bg-primary text-white px-4 py-2 rounded mb-4 inline-block"
                          onClick={() =>
                            confirmAction(() =>
                              handleAuthorizeByCourseAndPaperType(
                                Number(courseId),
                                'PRACTICAL',
                              ),
                            )
                          }
                        >
                          Authorize Practical Roles
                        </button>
                      )}
                      <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-form-input">
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Role
                            </th>
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Assigned User
                            </th>
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Status
                            </th>
                            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.roles.PRACTICAL.map((role) => (
                            <tr
                              key={role.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {role.roleName}
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {role.user}
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                <FontAwesomeIcon
                                  icon={
                                    role.isAuthorized ? faCheckCircle : faClock
                                  }
                                  className={`text-${
                                    role.isAuthorized ? 'green' : 'yellow'
                                  }-500`}
                                />
                                <span className="ml-2">
                                  {role.isAuthorized ? 'Authorized' : 'Pending'}
                                </span>
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {!role.isAuthorized ? (
                                  <>
                                    <button
                                      className="text-blue-500 mr-4"
                                      onClick={() => handleOpenModal(role)}
                                    >
                                      Edit
                                    </button>
                                    {hasApprovePermission && (
                                      <button
                                        className="text-green-500"
                                        onClick={() =>
                                          confirmAction(() =>
                                            handleAuthorizeRole(role.id),
                                          )
                                        }
                                      >
                                        Authorize
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-green-600">
                                    Role Authorized
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Render the EditRoleModal */}
      {isModalOpen && selectedRole && (
        <EditRoleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onSave}
          roleAssignmentId={selectedRole.id}
          currentUserId={selectedRole.userId}
          users={users} // Pass the list of users here
        />
      )}

      {/* Render the ConfirmationModal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to authorize these roles? Once authorized, you won't be able to edit them, and assigned users will inherit their permissions."
          onConfirm={() => {
            actionToConfirm();
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PreviewAssignedRoles;
