import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useApi from './api';

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
  const userId = Number(auth.id); // Current user ID
  const axiosPrivate = useAxiosPrivate();
  const { uploadFile } = useApi();

  useEffect(() => {
    const fetchModeratorsAndCourses = async () => {
      try {
        const [usersResponse, coursesResponse] = await Promise.all([
          axiosPrivate.get('/user'),
          axiosPrivate.get('/courses'),
        ]);

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
      } catch (error: any) {
        setErrorMessage('Failed to fetch data: ' + error.message);
      }
    };

    fetchModeratorsAndCourses();
  }, []);

  useEffect(() => {
    if (selectedCourses.length === 0 && courses.length > 0) {
      setErrorMessage('Please ensure at least one course is selected.');
    } else {
      setErrorMessage('');
    }
  }, [selectedCourses, courses]);

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

    setErrorMessage('');
    setIsUploading(true);

    try {
      const response = await uploadFile(
        file,
        userId,
        selectedCourses,
        remarks,
        selectedModerator,
      );

      console.log('Selected Courses:', selectedCourses);

      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('File uploaded successfully.');
        resetForm();
      }
    } catch (error: any) {
      setErrorMessage('Failed to upload the file: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedCourses([]); // Reset courses
    setRemarks('');
    setSelectedModerator(null); // Reset moderator
  };

  return (
    <div className="mb-6">
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Course Selection */}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Courses
          </label>
          {courses.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No courses available.
            </p>
          ) : (
            <select
              multiple
              value={selectedCourses.map(String)}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => Number(option.value),
                );
                setSelectedCourses(selected); // Update state regardless of selection
              }}
              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          )}
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
      </div>

      <button
        type="button"
        onClick={handleUpload}
        disabled={isUploading}
        className="mt-4 rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
};

export default FileUpload;
