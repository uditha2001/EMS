import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useApi from './api';
import Checkbox from '../../components/Checkbox';
import { Link } from 'react-router-dom';

interface Moderator {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

interface Course {
  id: number;
  code: string;
  name: string;
}

interface AcademicYear {
  id: number;
  year: string;
}

const FileUpload: React.FC = () => {
  const { auth } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<number | null>(
    null,
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]); // State for academic years
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<
    number | null
  >(null); // State for selected academic year
  const userId = Number(auth.id); // Current user ID
  const axiosPrivate = useAxiosPrivate();
  const { uploadFile } = useApi();

  useEffect(() => {
    const fetchModeratorsCoursesAndAcademicYears = async () => {
      try {
        const [usersResponse, coursesResponse, academicYearsResponse] =
          await Promise.all([
            axiosPrivate.get('/user'),
            axiosPrivate.get('/courses'),
            axiosPrivate.get('/academic-years'),
          ]);

        //console.log('Academic Years Response:', academicYearsResponse.data); // Log the response data

        const allUsers = usersResponse.data;
        const filteredModerators = allUsers.filter(
          (user: any) =>
            user.roles.includes('PAPER_MODERATOR') ||
            (user.roles.includes('PAPER_CREATOR') && user.active),
        );

        setModerators(filteredModerators);

        if (filteredModerators.length > 0) {
          setSelectedModerator(filteredModerators[0].id);
        }

        setCourses(coursesResponse.data.data);

        if (Array.isArray(academicYearsResponse.data.data)) {
          setAcademicYears(academicYearsResponse.data.data); // Set academic years if it's an array
        } else {
          setErrorMessage('Invalid data format for academic years.');
        }
      } catch (error: any) {
        setErrorMessage('Failed to fetch data: ' + error.message);
      }
    };

    fetchModeratorsCoursesAndAcademicYears();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setErrorMessage('Invalid file type. Only PDF files are allowed.');
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage(
          'File size exceeds limit. Maximum allowed size is 10 MB.',
        );
        return;
      }

      setFile(selectedFile);
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file first!');
      return;
    }

    if (!selectedModerator) {
      setErrorMessage('Please select a moderator!');
      return;
    }

    if (selectedCourses.length === 0) {
      setErrorMessage('Please select at least one course!');
      return;
    }

    if (!remarks.trim()) {
      setErrorMessage('Remarks are required!');
      return;
    }

    if (!selectedAcademicYear) {
      setErrorMessage('Please select an academic year!');
      return;
    }

    // Get the selected academic year's name
    const selectedAcademicYearName = academicYears.find(
      (year) => year.id === selectedAcademicYear,
    )?.year;

    if (!selectedAcademicYearName) {
      setErrorMessage('Invalid academic year selected!');
      return;
    }

    // Concatenate selected course codes and academic year name
    const courseCodes = courses
      .filter((course) => selectedCourses.includes(course.id))
      .map((course) => course.code)
      .join('_'); // Concatenate selected course codes with underscores

    // Rename the file to include the academic year name and course codes
    const renamedFileName = `${courseCodes}_${selectedAcademicYearName.replace(
      '/',
      '_',
    )}.pdf`;

    const renamedFile = new File([file], renamedFileName, { type: file.type });

    console.log('Renamed File Name:', renamedFileName); // For debugging

    setErrorMessage('');
    setIsUploading(true);

    try {
      const response = await uploadFile(
        renamedFile,
        userId,
        selectedCourses,
        remarks,
        selectedModerator,
        selectedAcademicYear, // Include academic year in the request
      );

      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('File uploaded successfully.');
        resetForm();
      }
    } catch (error) {
      setErrorMessage('Failed to upload the file: ' + error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedCourses([]);
    setRemarks('');
    setSelectedModerator(null);
    setSelectedAcademicYear(null); // Reset academic year
  };

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId],
    );
  };

  return (
    <div>
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Academic Year Selection */}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Academic Year
          </label>
          <select
            value={selectedAcademicYear || 0} // Default value is 0
            onChange={(e) => setSelectedAcademicYear(Number(e.target.value))}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
          >
            <option value={0}>Select Academic Year</option>
            {academicYears.map((academicYear) => (
              <option key={academicYear.id} value={academicYear.id}>
                {academicYear.year}
              </option>
            ))}
          </select>
        </div>
        {/* Moderator Selection */}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Moderator
          </label>
          <select
            value={selectedModerator || ''}
            onChange={(e) => setSelectedModerator(Number(e.target.value))}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
          >
            {moderators.map((moderator) => (
              <option key={moderator.id} value={moderator.id}>
                {moderator.firstName} {moderator.lastName} ({moderator.username}
                )
              </option>
            ))}
          </select>
        </div>
        {/* File Upload */}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Upload Paper
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {file && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>File Selected: {file.name}</p>
            </div>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            placeholder="Enter remarks"
            rows={3}
          ></textarea>
        </div>

        {/* Course Selection with Checkboxes */}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Courses
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Checkbox
                key={course.id}
                label={`${course.code} - ${course.name}`}
                checked={selectedCourses.includes(course.id)}
                onChange={() => toggleCourseSelection(course.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Link
          to={'/paper/transfer'}
          className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
        >
          Back
        </Link>

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
