import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

interface AcademicYear {
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
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [selectedDegreeProgram, setSelectedDegreeProgram] =
    useState<string>('');
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignments>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/v1/academic-years')
      .then((response) => setAcademicYears(response.data.data))
      .catch((error) => console.error('Error fetching academic years', error));

    axios
      .get('http://localhost:8080/degreePrograms')
      .then((response) => setDegreePrograms(response.data))
      .catch((error) => console.error('Error fetching degree programs', error));

    axios
      .get('http://localhost:8080/api/v1/user')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users', error));
  }, []);

  useEffect(() => {
    if (selectedDegreeProgram) {
      axios
        .get(
          `http://localhost:8080/api/v1/courses?degreeProgramId=${selectedDegreeProgram}`,
        )
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
            {},
          );
          setRoleAssignments(initialAssignments);
        })
        .catch((error) => console.error('Error fetching courses', error));
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

    // Prepare payload based on current role assignments
    const payload = Object.keys(roleAssignments)
      .map((courseId) => {
        const assignments = [
          {
            roleId: 1, // Example role ID for PAPER_CREATOR
            courseId,
            userId: roleAssignments[courseId].PAPER_CREATOR,
            academicYearId: selectedAcademicYear,
            isAuthorized: true,
          },
          {
            roleId: 2, // Example role ID for PAPER_MODERATOR
            courseId,
            userId: roleAssignments[courseId].PAPER_MODERATOR,
            academicYearId: selectedAcademicYear,
            isAuthorized: true,
          },
          {
            roleId: 3, // Example role ID for FIRST_MAKER
            courseId,
            userId: roleAssignments[courseId].FIRST_MAKER,
            academicYearId: selectedAcademicYear,
            isAuthorized: true,
          },
          {
            roleId: 4, // Example role ID for SECOND_MAKER
            courseId,
            userId: roleAssignments[courseId].SECOND_MAKER,
            academicYearId: selectedAcademicYear,
            isAuthorized: true,
          },
        ]
          .filter((assignment) => assignment.userId) // Filter out empty userIds
          .map((assignment) => ({
            ...assignment,
          }));

        return assignments;
      })
      .flat();

    // Send the data to the backend using the bulk assignment API
    axios
      .post('http://localhost:8080/api/role-assignments/bulk', payload)
      .then((response) => {
        if (response.status === 201) {
          setSuccessMessage('Roles assigned successfully!');
        }
      })
      .catch((error) => {
        setErrorMessage('Error assigning roles');
        console.error('Error assigning roles:', error);
        if (error.response) {
          console.error('Response Error:', error.response.data);
        }
        if (error.request) {
          console.error('Request Error:', error.request);
        }
      });
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Assign Roles" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
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

            {/* First Section: Academic Year and Degree Program */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Academic Year
                </label>
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke  bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map((year) => (
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
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

            {/* Second Section: Role Assignments */}
            {courses.length > 0 && (
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
                              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            >
                              <option value="">Select User</option>
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.firstName} {user.lastName} (
                                  {user.username})
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
