import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../api/api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import EditRoleModal from '../../components/Modals/EditRoleModal';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import { faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const PreviewAssignedRoles: React.FC = () => {
  const { examinationId } = useParams<{ examinationId: string }>();
  const [assignedRoles, setAssignedRoles] = useState<AssignedRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AssignedRole | null>(null);
  const [users, setUsers] = useState<
    { id: number; firstName: string; lastName: string }[]
  >([]);

  const { fetchRoleAssignments, editRoleAssignment, fetchUsers } = useApi();

  useEffect(() => {
    if (examinationId) {
      setIsLoading(true);
      fetchRoleAssignments(Number(examinationId))
        .then((response) => {
          if (response?.data.data && Array.isArray(response.data.data)) {
            setAssignedRoles(response.data.data);
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
        setSuccessMessage('Roles successfully assigne');
      })
      .catch((error) => {
        console.error('Error saving role assignment:', error);
        setErrorMessage(
          'Failed to update the role assignment. Please try again.',
        );
      });
  };

  // Group roles by courseId and paperType
  const groupedRoles = assignedRoles.reduce(
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

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Preview Assigned Roles" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Assigned Exam Roles
          </h3>
        </div>

        <div className="p-6.5">
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
                <div key={courseId} className="mb-6">
                  <h4 className="font-medium text-black dark:text-white">
                    {course.courseCode} - {course.courseName}
                  </h4>

                  {/* Render THEORY roles */}
                  {course.roles.THEORY.length > 0 && (
                    <div className="overflow-x-auto my-4">
                      <h5 className="font-medium text-black dark:text-white mb-4">
                        Theory
                      </h5>
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
                                  {role.isAuthorized
                                    ? 'Authorized'
                                    : 'Pending'}
                                </span>
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {!role.isAuthorized && (
                                  <a
                                    href="#"
                                    className="text-blue-500"
                                    onClick={() => handleOpenModal(role)}
                                  >
                                    Edit
                                  </a>
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
                    <div className="overflow-x-auto my-8">
                      <h5 className="font-medium text-black dark:text-white mb-4">
                        Practical
                      </h5>
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
                                  {role.isAuthorized
                                    ? 'Authorized'
                                    : 'Pending'}
                                </span>
                              </td>
                              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                {!role.isAuthorized && (
                                  <a
                                    href="#"
                                    className="text-blue-500"
                                    onClick={() => handleOpenModal(role)}
                                  >
                                    Edit
                                  </a>
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
    </div>
  );
};

export default PreviewAssignedRoles;
