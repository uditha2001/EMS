import React, { useState, useEffect } from "react";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import courseCreateApi from '../../api/api';

const CreateCourse: React.FC = () => {
  const [level, setLevel] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [courseCodePrefix, setCourseCodePrefix] = useState<string>("");
  const [courseCodeSuffix, setCourseCodeSuffix] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseType, setCourseType] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state

  const [courseCodeSearch, setCourseCodeSearch] = useState<string>("");
  const [courseNameSearch, setCourseNameSearch] = useState<string>("");
  const [filteredCourseCodes, setFilteredCourseCodes] = useState<string[]>([]);
  const [filteredCourseNames, setFilteredCourseNames] = useState<string[]>([]);

  // Debounce function
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedCourseCodeSearch = useDebounce(courseCodeSearch, 300);
  const debouncedCourseNameSearch = useDebounce(courseNameSearch, 300);

  // Fetch course codes based on search input
  useEffect(() => {
    const fetchCourseCodes = async () => {
      if (debouncedCourseCodeSearch.length > 0) {
        setLoadingStatus(true);
        setError(null); // Reset error state
        try {
          const courses = await courseCreateApi.fetchCourses(debouncedCourseCodeSearch);
          setFilteredCourseCodes(courses.map(course => course.code)); // Assuming course object has a 'code' property
        } catch (error) {
          console.error('Error fetching course codes:', error);
          setError('Failed to fetch course codes. Please try again.'); // Set error message
        } finally {
          setLoadingStatus(false);
        }
      } else {
        setFilteredCourseCodes([]);
      }
    };

    fetchCourseCodes();
  }, [debouncedCourseCodeSearch]);

  // Fetch course names based on search input
  useEffect(() => {
    const fetchCourseNames = async () => {
      if (debouncedCourseNameSearch.length > 0) {
        setLoadingStatus(true);
        setError(null); // Reset error state
        try {
          const courses = await courseCreateApi.fetchCourses(debouncedCourseNameSearch);
          setFilteredCourseNames(courses.map(course => course.name)); // Assuming course object has a 'name' property
        } catch (error) {
          console.error('Error fetching course names:', error);
          setError('Failed to fetch course names. Please try again.'); // Set error message
        } finally {
          setLoadingStatus(false);
        }
      } else {
        setFilteredCourseNames([]);
      }
    };

    fetchCourseNames();
  }, [debouncedCourseNameSearch]);

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
    setCourseCodeSearch("");
    setCourseNameSearch("");
    setFilteredCourseCodes([]);
    setFilteredCourseNames([]);
    setError(null); // Reset error state
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

    // Validate required fields
    if (
      !level ||
      !semester ||
      !degree ||
      !courseCodeSuffix ||
      !courseName ||
      !courseType ||
      !courseDescription
    ) {
      setShowModal(true);
      return;
    }

    alert(`Form submitted successfully! Course Code: ${courseCodePrefix}${courseCodeSuffix}`);
  };

  return (
    <div className="mx-auto max-w-270">
      {loadingStatus && <Loader />}
      <Breadcrumb pageName="Create Course" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Create Course</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6.5">
            {/* Level Selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Level:</label>
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

              {/* Semester and Degree Selection */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">Semester:</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="">--Select Semester--</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Degree:</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="">--Select Degree--</option>
                    <option value="BCS">BCS</option>
                    <option value="BSC">BSC</option>
                    <option value="BCS.hons">BCS.hons</option>
                    <option value="BSC.hons">BSC.hons</option>
                  </select>
                </div>
              </div>

              {/* Course Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Course Code:</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={courseCodeSearch}
                    onChange={(e) => setCourseCodeSearch(e.target.value)} // Update search query
                    placeholder="Search Course Code"
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  />
                  <input
                    type="text"
                    value={courseCodeSuffix}
                    placeholder="Suffix (2-3 digits)"
                    onChange={handleCourseCodeSuffixChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
                {/* Display filtered course codes */}
                {filteredCourseCodes.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10">
                    {filteredCourseCodes.map((code, index) => (
                      <li key={index} onClick={() => { setCourseCodePrefix(code); setCourseCodeSearch(code); setFilteredCourseCodes([]); }} className="cursor-pointer hover:bg-gray-200 p-2">
                        {code}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Course Name:</label>
                <input
                  type="text"
                  value={courseNameSearch}
                  onChange={(e) => setCourseNameSearch(e.target.value)} // Update search query
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                />
                {/* Display filtered course names */}
                {filteredCourseNames.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10">
                    {filteredCourseNames.map((name, index) => (
                      <li key={index} onClick={() => { setCourseName(name); setCourseNameSearch(name); setFilteredCourseNames([]); }} className="cursor-pointer hover:bg-gray-200 p-2">
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Course Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Course Type:</label>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">--Select Course Type--</option>
                  <option value="Practical only">Practical only</option>
                  <option value="Theory only">Theory only</option>
                  <option value="Practical with Theory">Practical with Theory</option>
                </select>
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Course Description:</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Create 
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-red-600">Incomplete Fields</h3>
              <p className="mb-4 text-gray-700">Please complete all fields before submitting the form.</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-red-600">Error</h3>
              <p className="mb-4 text-gray-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;