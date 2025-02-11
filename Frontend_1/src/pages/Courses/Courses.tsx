import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';


const Courses: React.FC = () => {
  const [filters, setFilters] = useState({
    level: "",
    semester: "",
    degree: "",
    active: "",
    courseName: "",
    courseCode: "",
  });

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Debounced function to fetch courses
  const fetchCourses = useCallback(
    debounce(async (updatedFilters) => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get("http://localhost:8080/api/courses/filter", {
          params: {
            level: updatedFilters.level || null,
            semester: updatedFilters.semester || null,
            degree: updatedFilters.degree || null,
            active: updatedFilters.active ? updatedFilters.active === "true" : null,
            courseName: updatedFilters.courseName || null,
            courseCode: updatedFilters.courseCode || null,
          },
        });

        if (response.data.length === 0) {
          setErrorMessage("No courses found with the selected filters.");
        }

        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setErrorMessage("Failed to fetch courses. Please try again.");
      }

      setLoading(false);
    }, 500), // Wait 500ms before making API calls
    []
  );

  

  // Handle filter changes and trigger search
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    fetchCourses(updatedFilters); // Call API dynamically
  };

  // Load initial data
  useEffect(() => {
    fetchCourses(filters);
  }, []);

  return (

    <div className="mx-auto max-w-270">
          {loadingStatus ? <Loader /> : null}
       <Breadcrumb pageName="Course" />


    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Courses</h3>
          </div>

          <form >
          <div className="p-6.5">

      {/* Filter Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Level:</label>
          <select 
                name="level" 
                value={filters.level} 
                onChange={handleFilterChange} 
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >

            <option value="">All</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Semester:</label>
          <select 
                  name="semester" 
                  value={filters.semester} 
                  onChange={handleFilterChange} 
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >

            <option value="">All</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        {/* Degree */}
        <div>
          <label className="block text-sm font-medium text-gray-700  dark:text-white">Degree:</label>
          <select 
                name="degree" 
                value={filters.degree} 
                onChange={handleFilterChange} 
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >

            <option value="">All</option>
            <option value="BCS">BCS</option>
            <option value="BSC">BSC</option>
            <option value="BCS.hons">BCS Hons</option>
            <option value="BSC.hons">BSC Hons</option>
          </select>
        </div>

        {/* Active Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Active:</label>
          <select 
                name="active" 
                value={filters.active} 
                onChange={handleFilterChange} 
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >

            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Course Name:</label>
          <input 
                  type="text" 
                  name="courseName" 
                  value={filters.courseName} 
                  onChange={handleFilterChange} 
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  placeholder="Type course name..." />
        </div>

        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Course Code:</label>
          <input 
                    type="text" 
                    name="courseCode" 
                    value={filters.courseCode} 
                    onChange={handleFilterChange} 
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    placeholder="Type course code..." />
        </div>
      </div>

      {/* Create Course Button */}
      <div className="flex justify-end mb-4">
        <button 
              onClick={() => navigate("/courses/create")} 
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                Create Course
        </button>
      </div>

      {/* Table */}
      {errorMessage ? (
        <p className="text-red-500 text-center">{errorMessage}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Course Code</th>
              <th className="border p-2">Course Name</th>
              <th className="border p-2">Level</th>
              <th className="border p-2">Semester</th>
              <th className="border p-2">Degree</th>
              <th className="border p-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-center border">
                <td className="border p-2">{course.courseCode}</td>
                <td className="border p-2">{course.courseName}</td>
                <td className="border p-2">{course.level}</td>
                <td className="border p-2">{course.semester}</td>
                <td className="border p-2">{course.degree}</td>
                <td className="border p-2">{course.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
      )}
      </div>
      </form>
      </div>
    </div>
   
  );
};

export default Courses; 