import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Courses: React.FC = () => {
  const [level, setLevel] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [active, setActive] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  // Fetch courses based on filters
  const fetchCourses = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get("http://localhost:8080/api/courses/filter", {
        params: {
          level: level || null,
          semester: semester || null,
          degree: degree || null,
          active: active ? active === "true" : null,
          courseName: courseName || null,
          courseCode: courseCode || null,
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Filter Courses</h2>

      {/* Filter Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Level:</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 border rounded-md">
            <option value="">All</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Semester:</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full p-2 border rounded-md">
            <option value="">All</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        {/* Degree */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Degree:</label>
          <select value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full p-2 border rounded-md">
            <option value="">All</option>
            <option value="BCS">BCS</option>
            <option value="BSC">BSC</option>
            <option value="BCS.hons">BCS Hons</option>
            <option value="BSC.hons">BSC Hons</option>
          </select>
        </div>

        {/* Active Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Active:</label>
          <select value={active} onChange={(e) => setActive(e.target.value)} className="w-full p-2 border rounded-md">
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Name:</label>
          <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>

        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Code:</label>
          <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} className="w-full p-2 border rounded-md" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mb-4">
        <button onClick={fetchCourses} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Search</button>
        <button onClick={() => navigate("/create-course")} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">Create Course</button>
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
  );
};

export default Courses;
