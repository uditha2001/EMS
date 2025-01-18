import React, { useState } from "react";

const CreateCourse: React.FC = () => {
  const [level, setLevel] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [courseCodePrefix, setCourseCodePrefix] = useState<string>(""); // First part of course code
  const [courseCodeSuffix, setCourseCodeSuffix] = useState<string>(""); // Second part of course code
  const [courseName, setCourseName] = useState<string>("");
  const [courseType, setCourseType] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");

  // Update course code prefix based on level, semester, and degree
  const updateCourseCodePrefix = () => {
    const key = `${level}-${semester}-${degree}`;
    const courseCodeMapping: Record<string, string> = {
      "1-1-BCS": "CSC11",
      "1-2-BCS": "CSC12",
      "2-1-BCS": "CSC21",
      "2-2-BCS": "CSC22",
      "3-1-BCS": "CSC31",
      "3-2-BCS": "CSC32",
    };
    setCourseCodePrefix(courseCodeMapping[key] || "");
  };

  // Reset the form
  const resetForm = () => {
    setLevel("");
    setSemester("");
    setDegree("");
    setCourseCodePrefix("");
    setCourseCodeSuffix("");
    setCourseName("");
    setCourseType("");
    setCourseDescription("");
  };

  // Validate and update the course code suffix
  const handleCourseCodeSuffixChange = (value: string) => {
    if (/^\d{2,3}$/.test(value) || value === "") {
      setCourseCodeSuffix(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseCodeSuffix) {
      alert("Please enter a valid course code suffix (2 or 3 digits).");
      return;
    }
    alert("Form submitted successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Course Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level:</label>
          <div className="flex space-x-4">
            {[1, 2, 3].map((lvl) => (
              <label key={lvl} className="flex items-center text-sm">
                <input
                  type="radio"
                  name="level"
                  value={lvl}
                  checked={level === lvl.toString()}
                  onChange={() => {
                    setLevel(lvl.toString());
                    updateCourseCodePrefix();
                  }}
                  className="mr-2"
                />
                Level {lvl}
              </label>
            ))}
          </div>
        </div>

        {/* Semester Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester:</label>
          <select
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              updateCourseCodePrefix();
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">--Select Semester--</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        {/* Degree Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree:</label>
          <select
            value={degree}
            onChange={(e) => {
              setDegree(e.target.value);
              updateCourseCodePrefix();
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">--Select Degree--</option>
            <option value="BCS">BCS</option>
            <option value="BSC">BSC</option>
            <option value="BCS.hons">BCS.hons</option>
            <option value="BSC.hons">BSC.hons</option>
          </select>
        </div>

        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={courseCodePrefix}
              readOnly
              placeholder="Prefix"
              className="w-1/3 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:outline-none"
            />
            <input
              type="text"
              value={courseCodeSuffix}
              placeholder="Suffix (2-3 digits)"
              onChange={(e) => handleCourseCodeSuffixChange(e.target.value)}
              className="w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Course Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Type:</label>
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">--Select Course Type--</option>
            <option value="Practical only">Practical only</option>
            <option value="Theory only">Theory only</option>
            <option value="Practical with Theory">Practical with Theory</option>
          </select>
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Description:</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
