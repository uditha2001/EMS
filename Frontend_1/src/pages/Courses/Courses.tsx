
import React, { useState, useEffect } from "react";
import axios from "axios";

const Courses = () => {
  const [filters, setFilters] = useState({
    degreeType: "",
    level: "",
    semester: "",
    year: "",
  });

  const [courses, setCourses] = useState([]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/courses/filter", {
        params: filters,
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Filter Courses</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="degreeType"
          placeholder="Degree Type"
          value={filters.degreeType}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="level"
          placeholder="Year Level"
          value={filters.level}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="semester"
          placeholder="Semester"
          value={filters.semester}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={filters.year}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSearch}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>

      <div className="mt-6">
        {courses.length > 0 ? (
          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-blue-200">
                <th className="p-2">Course Code</th>
                <th className="p-2">Course Name</th>
                <th className="p-2">Degree Type</th>
                <th className="p-2">Level</th>
                <th className="p-2">Semester</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{course.courseCode}</td>
                  <td className="p-2">{course.courseName}</td>
                  <td className="p-2">{course.degreeType}</td>
                  <td className="p-2">{course.level}</td>
                  <td className="p-2">{course.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 mt-4">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
