import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useApi from '../../api/api';
import SearchableSelectBox from '../../components/SearchableSelectBox';

interface Examination {
  id: string;
  year: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  courseType: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface RoleAssignments {
  PAPER_CREATOR: string;
  PAPER_MODERATOR: string;
  FIRST_MAKER: string;
  SECOND_MAKER: string;
  [key: string]: string; // Add this line
}

interface AssignedRoleRow {
  course: Course;
  assignments: RoleAssignments;
}

const AssignRoles: React.FC = () => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<string>('');
  const [roleAssignments, setRoleAssignments] = useState<
    Record<string, RoleAssignments>
  >({});
  const [assignedRoles, setAssignedRoles] = useState<AssignedRoleRow[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    getExaminations,
    fetchUsers,
    getExaminationsCourses,
    createRoleAssignment,
    fetchRoleAssignments,
  } = useApi();

  // Fetch examinations and users
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getExaminations(),
      fetchUsers(),
      fetchRoleAssignments(Number(selectedExamination)),
    ])
      .then(([examResponse, userResponse]) => {
        setExaminations(examResponse.data.data);
        setUsers(userResponse);
      })
      .catch((error) => console.error('Error fetching initial data', error))
      .finally(() => setIsLoading(false));
  }, []);

  // Fetch courses and existing role assignments for the selected examination
  useEffect(() => {
    if (selectedExamination) {
      setIsLoading(true);
      Promise.all([
        getExaminationsCourses(Number(selectedExamination)),
        fetchRoleAssignments(Number(selectedExamination)),
      ])
        .then(([courseResponse, roleAssignmentResponse]) => {
          const coursesData = courseResponse.data?.activeCourses || [];
          setCourses(coursesData);

          // Initialize role assignments for each course
          const initialAssignments = coursesData.reduce(
            (acc: Record<string, RoleAssignments>, course: Course) => ({
              ...acc,
              [course.id]: roleAssignmentResponse.data[course.id] || {
                PAPER_CREATOR: '',
                PAPER_MODERATOR: '',
                FIRST_MAKER: '',
                SECOND_MAKER: '',
              },
            }),
            {},
          );
          setRoleAssignments(initialAssignments);
        })
        .catch((error) => {
          console.error('Error fetching courses and role assignments', error);
          setCourses([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setCourses([]);
      setRoleAssignments({});
    }
  }, [selectedExamination]);

  const getRoleIdByName = (roleName: string): number => {
    const roleMap: Record<string, number> = {
      PAPER_CREATOR: 1,
      PAPER_MODERATOR: 2,
      FIRST_MAKER: 3,
      SECOND_MAKER: 4,
    };
    return roleMap[roleName] || 0;
  };

  const handleRoleChange = (courseId: string, role: string, userId: string) => {
    setRoleAssignments((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [role]: userId,
      },
    }));
  };

  const handleAssignRole = (
    course: Course,
    paperType: 'THEORY' | 'PRACTICAL',
  ) => {
    const assignments = roleAssignments[course.id];

    if (
      assignments.PAPER_CREATOR &&
      assignments.PAPER_MODERATOR &&
      assignments.FIRST_MAKER &&
      assignments.SECOND_MAKER
    ) {
      setIsLoading(true);

      // Prepare the payload for the specified paperType
      const payload = Object.entries(assignments).map(([role, userId]) => ({
        courseId: Number(course.id),
        roleId: getRoleIdByName(role),
        userId: Number(userId),
        examinationId: Number(selectedExamination),
        isAuthorized: true,
        paperType,
      }));

      createRoleAssignment(payload)
        .then(() => {
          setAssignedRoles((prev) => [...prev, { course, assignments }]);
          setCourses((prev) =>
            prev.filter(
              (c) =>
                c.id !== course.id ||
                (course.courseType === 'BOTH' && paperType === 'PRACTICAL'),
            ),
          );
          setSuccessMessage(
            `Roles successfully assigned for ${course.name} (${paperType})`,
          );
        })
        .catch((error) => {
          console.error('Error assigning roles:', error);
          setErrorMessage('Failed to assign roles. Please try again.');
        })
        .finally(() => setIsLoading(false));
    } else {
      setErrorMessage('Please assign all roles before submitting.');
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Assign Roles" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Assign Exam Roles
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

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Examination
            </label>
            <select
              value={selectedExamination}
              onChange={(e) => setSelectedExamination(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
              required
            >
              <option value="">Select Examination</option>
              {examinations?.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.year}
                </option>
              ))}
            </select>
          </div>

          {courses?.length > 0 && (
            <div className="overflow-x-auto my-8">
              <h4 className="font-medium text-black dark:text-white mb-4">
                Pending Assignments
              </h4>
              <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-100 dark:bg-form-input">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Course Code
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Course Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Course Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Paper Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Roles
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const rows = [];

                    // Add Theory row
                    rows.push(
                      <tr
                        key={`${course.id}-theory`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="border px-4 py-2">{course.code}</td>
                        <td className="border px-4 py-2">{course.name}</td>
                        <td className="border px-4 py-2">
                          {course.courseType}
                        </td>
                        <td className="border px-4 py-2">Theory</td>
                        <td className="border px-4 py-2">
                          {[
                            'PAPER_CREATOR',
                            'PAPER_MODERATOR',
                            'FIRST_MAKER',
                            'SECOND_MAKER',
                          ].map((role) => (
                            <SearchableSelectBox
                              key={role}
                              options={users.map((user) => ({
                                id: user.id,
                                name: `${user.firstName} ${user.lastName}`,
                              }))}
                              value={roleAssignments[course.id]?.[role] || ''}
                              onChange={(value) =>
                                handleRoleChange(course.id, role, value)
                              }
                              placeholder={`Select ${role.replace('_', ' ')}`}
                              label={''}
                            />
                          ))}
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => handleAssignRole(course, 'THEORY')}
                            className="bg-primary text-white px-4 py-2 rounded"
                          >
                            Assign Theory
                          </button>
                        </td>
                      </tr>,
                    );

                    // Add Practical row if course type is "BOTH"
                    if (course.courseType === 'BOTH') {
                      rows.push(
                        <tr
                          key={`${course.id}-practical`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="border px-4 py-2">{course.code}</td>
                          <td className="border px-4 py-2">{course.name}</td>
                          <td className="border px-4 py-2">
                            {course.courseType}
                          </td>
                          <td className="border px-4 py-2">Practical</td>
                          <td className="border px-4 py-2">
                            {[
                              'PAPER_CREATOR',
                              'PAPER_MODERATOR',
                              'FIRST_MAKER',
                              'SECOND_MAKER',
                            ].map((role) => (
                              <SearchableSelectBox
                                key={role}
                                options={users.map((user) => ({
                                  id: user.id,
                                  name: `${user.firstName} ${user.lastName}`,
                                }))}
                                value={roleAssignments[course.id]?.[role] || ''}
                                onChange={(value) =>
                                  handleRoleChange(course.id, role, value)
                                }
                                placeholder={`Select ${role.replace('_', ' ')}`}
                                label={''}
                              />
                            ))}
                          </td>
                          <td className="border px-4 py-2">
                            <button
                              onClick={() =>
                                handleAssignRole(course, 'PRACTICAL')
                              }
                              className="bg-primary text-white px-4 py-2 rounded"
                            >
                              Assign Practical
                            </button>
                          </td>
                        </tr>,
                      );
                    }

                    return rows;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignRoles;
