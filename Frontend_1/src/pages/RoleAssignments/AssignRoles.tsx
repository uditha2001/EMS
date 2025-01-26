import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useApi from '../../api/api';

interface Examination {
  id: string;
  year: string;
}

interface DegreeProgram {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface RoleAssignments {
  [courseId: string]: {
    PAPER_CREATOR: string;
    PAPER_MODERATOR: string;
    FIRST_MAKER: string;
    SECOND_MAKER: string;
  };
}

const AssignRoles: React.FC = () => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<string>('');
  const [selectedDegreeProgram, setSelectedDegreeProgram] =
    useState<string>('');
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignments>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const { getExaminations, getDegreePrograms, fetchUsers } = useApi();

  useEffect(() => {
    setIsLoading(true);
    getExaminations()
      .then((response) => setExaminations(response.data.data))
      .catch((error) => console.error('Error fetching academic years', error));

    getDegreePrograms()
      .then((response) => setDegreePrograms(response.data))
      .catch((error) => console.error('Error fetching degree programs', error));

    axiosPrivate;
    fetchUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users', error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDegreeProgram) {
      setIsLoading(true);
      axiosPrivate
        .get(`/courses?degreeProgramId=${selectedDegreeProgram}`)
        .then((response) => {
          setCourses(response.data.data);
          const initialAssignments = response.data.data.reduce(
            (acc: RoleAssignments, course: Course) => {
              acc[course.id] = {
                PAPER_CREATOR: '',
                PAPER_MODERATOR: '',
                FIRST_MAKER: '',
                SECOND_MAKER: '',
              };
              return acc;
            },
            {} as RoleAssignments,
          );
          setRoleAssignments(initialAssignments);
        })
        .catch((error) => console.error('Error fetching courses', error))
        .finally(() => setIsLoading(false));
    } else {
      setCourses([]);
      setRoleAssignments({});
    }
  }, [selectedDegreeProgram]);

  const handleRoleChange = (courseId: string, role: string, userId: string) => {
    setRoleAssignments((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [role]: userId,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedExamination || !selectedDegreeProgram) {
      setErrorMessage('Please select both academic year and degree program.');
      return;
    }

    const payload = Object.keys(roleAssignments)
      .map((courseId) => {
        const assignments = [
          {
            roleId: 1,
            courseId,
            userId: roleAssignments[courseId].PAPER_CREATOR,
          },
          {
            roleId: 2,
            courseId,
            userId: roleAssignments[courseId].PAPER_MODERATOR,
          },
          {
            roleId: 3,
            courseId,
            userId: roleAssignments[courseId].FIRST_MAKER,
          },
          {
            roleId: 4,
            courseId,
            userId: roleAssignments[courseId].SECOND_MAKER,
          },
        ]
          .filter((assignment) => assignment.userId) // Filter out empty userIds
          .map((assignment) => ({
            ...assignment,
            examinationId: selectedExamination,
            isAuthorized: true,
          }));

        return assignments;
      })
      .flat();

    axiosPrivate
      .post('/role-assignments/bulk', payload)
      .then((response) => {
        if (response.status === 201) {
          setSuccessMessage('Roles assigned successfully!');
          setErrorMessage('');
        }
      })
      .catch((error) => {
        setErrorMessage('Error assigning roles');
        console.error('Error assigning roles:', error);
      });
  };

  const handleBack = () => {
    window.history.back();
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

        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            {/* Success and Error Messages */}
            <SuccessMessage
              message={successMessage}
              onClose={() => setSuccessMessage('')}
            />
            <ErrorMessage
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />

            {/* Examination and Degree Program */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  {examinations.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Degree Program
                </label>
                <select
                  value={selectedDegreeProgram}
                  onChange={(e) => setSelectedDegreeProgram(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
                  required
                >
                  <option value="">Select Degree Program</option>
                  {degreePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Assignments Table */}
            {courses.length > 0 && !isLoading && (
              <div className="overflow-x-auto my-8">
                <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-form-input">
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Course Code
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Course Name
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        PAPER CREATOR
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        PAPER MODERATOR
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        FIRST MAKER
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        SECOND MAKER
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                          {course.code}
                        </td>
                        <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                          {course.name}
                        </td>
                        {[
                          'PAPER_CREATOR',
                          'PAPER_MODERATOR',
                          'FIRST_MAKER',
                          'SECOND_MAKER',
                        ].map((role) => (
                          <td
                            key={role}
                            className="border border-gray-300 dark:border-strokedark px-4 py-2"
                          >
                            <select
                              onChange={(e) =>
                                handleRoleChange(
                                  course.id,
                                  role,
                                  e.target.value,
                                )
                              }
                              className="w-full py-3 px-5 text-black bg-transparent outline-none transition focus:ring-0 dark:text-white dark:bg-transparent dark:focus:ring-0 appearance-none"
                            >
                              <option value="">Select User</option>
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.firstName} {user.lastName}
                                </option>
                              ))}
                            </select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
              >
                Create Roles Assign Sheet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoles;
