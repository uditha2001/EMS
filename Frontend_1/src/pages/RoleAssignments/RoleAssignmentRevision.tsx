import React, { useState, useEffect } from 'react';
import useApi from '../../api/api';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useAuth from '../../hooks/useAuth';
import SearchableSelectBox from '../../components/SearchableSelectBox';

interface Examination {
  id: string;
  year: string;
  level: string;
  semester: string;
  degreeProgramName: string;
}

interface RoleAssignment {
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

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const RoleAssignmentRevision: React.FC = () => {
  const { auth } = useAuth();
  const userId = Number(auth.id);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<string>('');
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [courses, setCourses] = useState<
    { id: number; code: string; name: string }[]
  >([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedPaperType, setSelectedPaperType] = useState<
    'THEORY' | 'PRACTICAL'
  >('THEORY');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [previousUser, setPreviousUser] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [newUserId, setNewUserId] = useState<string>('');
  const [revisedById, setRevisedById] = useState<string>('');
  const [revisionReason, setRevisionReason] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    getExaminations,
    fetchRoleAssignments,
    fetchUsers,
    reviseRoleAssignments,
  } = useApi();

  useEffect(() => {
    setRevisedById(userId.toString());
  }, [userId]);

  // Fetch examinations
  useEffect(() => {
    getExaminations()
      .then((response) => setExaminations(response.data.data))
      .catch((error) => {
        console.error('Error fetching examinations:', error);
        setErrorMessage('Failed to fetch examinations.');
      });
  }, []);

  // Fetch role assignments and courses for the selected examination
  useEffect(() => {
    if (selectedExamination) {
      fetchRoleAssignments(Number(selectedExamination))
        .then((response) => {
          // Filter only authorized role assignments
          const authorizedAssignments = response.data.data.filter(
            (assignment: RoleAssignment) => assignment.isAuthorized,
          );
          setRoleAssignments(authorizedAssignments);

          // Extract unique courses from authorized role assignments
          const uniqueCourses = authorizedAssignments.reduce(
            (
              acc: { id: number; code: string; name: string }[],
              assignment: RoleAssignment,
            ) => {
              if (!acc.some((course) => course.id === assignment.courseId)) {
                acc.push({
                  id: assignment.courseId,
                  code: assignment.courseCode,
                  name: assignment.courseName,
                });
              }
              return acc;
            },
            [],
          );
          setCourses(uniqueCourses);
        })
        .catch((error) => {
          console.error('Error fetching role assignments:', error);
          setErrorMessage('Failed to fetch role assignments.');
        });
    } else {
      setRoleAssignments([]);
      setCourses([]);
    }
  }, [selectedExamination]);

  // Fetch users
  useEffect(() => {
    fetchUsers()
      .then((response) => setUsers(response))
      .catch((error) => {
        console.error('Error fetching users:', error);
        setErrorMessage('Failed to fetch users.');
      });
  }, []);

  // Update previous user when role is selected
  useEffect(() => {
    if (selectedCourse && selectedPaperType && selectedRole) {
      const assignment = roleAssignments.find(
        (role) =>
          role.courseId === Number(selectedCourse) &&
          role.paperType === selectedPaperType &&
          role.roleName === selectedRole,
      );
      if (assignment) {
        setPreviousUser(assignment.user);
      } else {
        setPreviousUser('');
      }
    } else {
      setPreviousUser('');
    }
  }, [selectedCourse, selectedPaperType, selectedRole, roleAssignments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedExamination ||
      !selectedCourse ||
      !selectedPaperType ||
      !selectedRole ||
      !newUserId ||
      !revisedById ||
      !revisionReason
    ) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    const assignment = roleAssignments.find(
      (role) =>
        role.courseId === Number(selectedCourse) &&
        role.paperType === selectedPaperType &&
        role.roleName === selectedRole,
    );

    if (!assignment) {
      setErrorMessage('Selected role assignment not found.');
      return;
    }

    const payload = {
      roleAssignmentId: assignment.id,
      newUserId: Number(newUserId),
      revisedById: Number(revisedById),
      revisionReason,
    };

    try {
      const response = await reviseRoleAssignments([payload]);
      setSuccessMessage('Role assignment revised successfully.');
      setErrorMessage('');
      console.log('Revision Response:', response);
    } catch (error) {
      setErrorMessage('Failed to revise role assignment. Please try again.');
      setSuccessMessage('');
      console.error('Error revising role assignment:', error);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Role Assignment Revision" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Revise Role Assignments
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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Examination Selection */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Examination
                </label>
                <select
                  value={selectedExamination}
                  onChange={(e) => setSelectedExamination(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Examination</option>
                  {examinations.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.year} - Level {exam.level} - Semester{' '}
                      {exam.semester} - {exam.degreeProgramName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selection */}
              {selectedExamination && (
                <div>
                  <SearchableSelectBox
                    options={courses.map((course) => ({
                      id: course.id.toString(),
                      name: `${course.code} - ${course.name}`,
                    }))}
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    label="Course"
                    placeholder="Select Course"
                  />
                </div>
              )}

              {/* Paper Type Selection */}
              {selectedCourse && (
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Paper Type
                  </label>
                  <select
                    value={selectedPaperType}
                    onChange={(e) =>
                      setSelectedPaperType(
                        e.target.value as 'THEORY' | 'PRACTICAL',
                      )
                    }
                    className="input-field"
                    required
                  >
                    <option value="THEORY">Theory</option>
                    <option value="PRACTICAL">Practical</option>
                  </select>
                </div>
              )}

              {/* Role Selection */}
              {selectedPaperType && (
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select Role</option>
                    {roleAssignments
                      .filter(
                        (role) =>
                          role.courseId === Number(selectedCourse) &&
                          role.paperType === selectedPaperType,
                      )
                      .map((role) => (
                        <option key={role.roleId} value={role.roleName}>
                          {role.roleName}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Previous User */}
              {previousUser && (
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Previous User
                  </label>
                  <input
                    type="text"
                    value={previousUser}
                    className="input-field"
                    disabled
                  />
                </div>
              )}

              {/* New User Selection */}
              <div>
                <SearchableSelectBox
                  options={users.map((user) => ({
                    id: user.id.toString(),
                    name: `${user.firstName} ${user.lastName}`,
                  }))}
                  value={newUserId}
                  onChange={setNewUserId}
                  label="New User"
                  placeholder="Select New User"
                />
              </div>
            </div>

            {/* Revision Reason */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Revision Reason
              </label>
              <textarea
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                className="input-field"
                required
                maxLength={100}
                placeholder="Maximum 100 characters"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary">
              Submit Revision
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentRevision;
