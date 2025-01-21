import React, { useEffect, useState } from "react";


const EditCourse: React.FC = () => {
  const [level, setLevel] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [courseCodePrefix, setCourseCodePrefix] = useState<string>("");
  const [courseCodeSuffix, setCourseCodeSuffix] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseType, setCourseType] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [searchCode, setSearchCode] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [verifyData, setVerifyData] = useState<boolean>(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);


  // Sample data for courses (Replace with actual data fetching)
  const [courses, setCourses] = useState<Record<string, any>>({
    "CSC1101": {
      level: "1",
      semester: "1",
      degree: "BCS",
      courseCodePrefix: "CSC11",
      courseCodeSuffix: "01",
      courseName: "Introduction to Computing",
      courseType: "Theory only",
      courseDescription: "This course covers basic computing principles.",
    },
  });

   useEffect(() => {
      const key = `${level}-${semester}-${degree}`;
      const courseCodeMapping: Record<string, string> = {
       "1-1-BCS": "CSC11",
        "1-2-BCS": "CSC12",
        "2-1-BCS": "CSC21",
        "2-2-BCS": "CSC22",
        "3-1-BCS": "CSC31",
        "3-2-BCS": "CSC32",
        "1-1-BSC": "COM11",
        "1-2-BSC": "COM12",
        "2-1-BSC": "COM21",
        "2-2-BSC": "COM22",
        "3-1-BSC": "COM31",
        "3-2-BSC": "COM32",
        "4-1-BCS.hons": "CSCS41",
        "4-2-BCS.hons": "CSCS42",
        "3-1-BSC.hons": "COMS31",
        "3-2-BSC.hons": "COMS32",
        "4-1-BSC.hons": "COMS41",
        "4-2-BSC.hons": "COMS42",
      };
      setCourseCodePrefix(courseCodeMapping[key] || "");
    }, [level, semester, degree]);
  

  // Function to handle search by course code
  const handleSearch = () => {
    const course = courses[searchCode];
    if (course) {
      setLevel(course.level);
      setSemester(course.semester);
      setDegree(course.degree);
      setCourseCodePrefix(course.courseCodePrefix);
      setCourseCodeSuffix(course.courseCodeSuffix);
      setCourseName(course.courseName);
      setCourseType(course.courseType);
      setCourseDescription(course.courseDescription);
      setShowNotFound(false); // Hide the pop-up if a course is found
    } else {
      setShowNotFound(true); // Show the pop-up for not found
      resetForm();
    }
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
    setSearchCode("");
  };

  // Handle course code suffix change
  const handleCourseCodeSuffixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setCourseCodeSuffix(value); // Allow up to 3 digits
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!level || !semester || !degree || !courseCodeSuffix || !courseName || !courseType || !courseDescription) {
      setVerifyData(true);
      return;
    }

    const fullCourseCode = `${courseCodePrefix}${courseCodeSuffix}`;

    // Update or add the course to the data
    setCourses((prev) => ({
      ...prev,
      [fullCourseCode]: {
        level,
        semester,
        degree,
        courseCodePrefix,
        courseCodeSuffix,
        courseName,
        courseType,
        courseDescription,
      },
    }));

    setShowSuccess(true); // Show success message
    resetForm();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Edit Course</h2>

      {/* Search by Course Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search by Course Code:</label>
        <div className="flex">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter Course Code"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            type="button"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level:</label>
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((lvl) => (
              <label key={lvl} className="flex items-center text-sm">
                <input
                  type="radio"
                  name="level"
                  value={lvl}
                  checked={level === lvl.toString()}
                  onChange={() => setLevel(lvl.toString())}
                  className="mr-2"
                />
                Level {lvl}
              </label>
            ))}
          </div>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">--Select Semester--</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        {/* Degree */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree:</label>
          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
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
              onChange={(e) => setCourseCodePrefix(e.target.value)} // Allow user input
              placeholder="Prefix"
              className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />

            <input
              type="text"
              value={courseCodeSuffix}
              placeholder="Suffix (2-3 digits)"
              onChange={handleCourseCodeSuffixChange}
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
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Course Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Type:</label>
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
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
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Save
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

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-600">Success</h3>
            <p className="mb-4">Course details have been saved successfully!</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}


      {/* Not Found Modal */}
{showNotFound && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-red-600">Course Not Found</h3>
      <p className="mb-4">The course code you entered does not exist in the database. Please check and try again.</p>
      <button
        onClick={() => setShowNotFound(false)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        OK
      </button>
    </div>
  </div>
)}

      {/* Verification Modal */}
      {verifyData && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-yellow-600">Verify Data</h3>
        <p className="mb-4">Some fields are unchanged or empty. Do you want to proceed?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setVerifyData(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setVerifyData(false); // Close the modal
              handleSubmit(); // Trigger the save logic
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
      )}
    </div>
  );
};

export default EditCourse;
