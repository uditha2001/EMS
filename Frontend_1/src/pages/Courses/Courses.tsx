import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import useCourseApi from '../../api/courseApi';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useDegreeApi from '../../api/degreeApi';
import Pagination from '../../components/Pagination'; // Import your Pagination component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

const Courses: React.FC = () => {
  const [filters, setFilters] = useState({
    level: '',
    semester: '',
    degree: '',
    active: '',
    searchQuery: '',
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { getAllCourses: fetchAllCourses, deleteCourse } = useCourseApi();
  const { getAllDegreePrograms } = useDegreeApi();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [degreePrograms, setDegreePrograms] = useState<
    { id: string; name: string }[]
  >([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchCourses = async () => {
    try {
      const response = await fetchAllCourses();
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchDegreePrograms() {
      try {
        const response = await getAllDegreePrograms();
        setDegreePrograms(response.data);
      } catch (err) {
        setErrorMessage('Failed to load degree programs.');
      }
    }
    fetchDegreePrograms();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDeleteClick = (courseId: number) => {
    setSelectedCourseId(courseId);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCourseId !== null) {
      try {
        await deleteCourse(selectedCourseId);
        await fetchCourses();
        setSuccessMessage('Course deleted successfully');
      } catch (error) {
        setErrorMessage('Error deleting course: ' + error);
      }
    }
    setModalOpen(false);
  };

  // Filter courses based on selected filters
  const filteredCourses = courses.filter((course) => {
    const matchesLevel = filters.level
      ? course.level.toString() === filters.level
      : true;
    const matchesSemester = filters.semester
      ? course.semester.toString() === filters.semester
      : true;
    const matchesActive = filters.active
      ? course.isActive.toString() === filters.active
      : true;
    const matchesDegree = filters.degree
      ? course.degreeName.toLowerCase() === filters.degree.toLowerCase()
      : true;
    const matchesSearch = filters.searchQuery
      ? course.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(filters.searchQuery.toLowerCase())
      : true;

    return (
      matchesLevel &&
      matchesSemester &&
      matchesActive &&
      matchesDegree &&
      matchesSearch
    );
  });

  // Calculate total number of pages
  const totalItems = filteredCourses.length;

  // Slice the filtered courses for the current page
  const paginatedCourses = filteredCourses.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  return (
    <div className="mx-auto max-w-270">
      {loading && <Loader />}
      <Breadcrumb pageName="Courses" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Courses</h3>
        </div>

        <form>
          <div className="p-6.5">
            <SuccessMessage
              message={successMessage}
              onClose={() => setSuccessMessage('')}
            />
            <ErrorMessage
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />

            <div className="flex justify-between items-center text-sm mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search by course name or code"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  className="input-field w-full" // Make input field take full width
                />
              </div>
              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => navigate('/courses/create')}
                  className="btn-primary"
                >
                  Create Course
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Level
                </label>
                <select
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                </select>
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Semester
                </label>
                <select
                  name="semester"
                  value={filters.semester}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="b">Both</option>
                </select>
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Degree Program
                </label>
                <select
                  name="degree"
                  value={filters.degree}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All</option>
                  {degreePrograms.map((program) => (
                    <option key={program.id} value={program.name}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Active
                </label>
                <select
                  name="active"
                  value={filters.active}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto mt-8">
              <table className="min-w-full bg-white dark:bg-gray-800 border-collapse border border-gray-200 dark:border-strokedark">
                <thead>
                  <tr className="bg-gray-100 dark:bg-form-input">
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Course Code
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Course Name
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Level
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Semester
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Degree
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Active
                    </th>
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.length > 0 ? (
                    paginatedCourses.map((course) => (
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
                        <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                          {course.level}
                        </td>
                        <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                          {course.semester}
                        </td>
                        <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                          {course.degreeName}
                        </td>
                        <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                          {course.isActive ? (
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> 
                          ) : (
                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                          )}
                        </td>
                        <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                          <Link
                            to={`/courses/edit/${course.id}`}
                            className="text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <span
                            className="text-red-500 hover:underline cursor-pointer ml-4"
                            onClick={() => handleDeleteClick(course.id)}
                          >
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center border p-2">
                        No courses available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </form>
        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {modalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this course?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Courses;
