import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useApi from './api';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

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

interface FileDetails {
  id: number;
  name: string;
  courses: number[];
  academicYear: number;
  remarks: string;
  moderator: number;
}

const FileUpdate: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  useAuth();
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
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<
    number | null
  >(null);
  const [existingFileDetails, setExistingFileDetails] =
    useState<FileDetails | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { updateFile } = useApi();

  useEffect(() => {
    const fetchModeratorsCoursesAndAcademicYears = async () => {
      try {
        const [
          usersResponse,
          coursesResponse,
          academicYearsResponse,
          fileDetailsResponse,
        ] = await Promise.all([
          axiosPrivate.get('/user'),
          axiosPrivate.get('/courses'),
          axiosPrivate.get('/academic-years'),
          axiosPrivate.get(`/papers/${fileId}`),
        ]);

        const allUsers = usersResponse.data;
        if (Array.isArray(allUsers)) {
          const filteredModerators = allUsers.filter(
            (user: any) =>
              user.roles?.includes('PAPER_MODERATOR') ||
              (user.roles?.includes('PAPER_CREATOR') && user.active),
          );
          setModerators(filteredModerators);
          if (filteredModerators.length > 0)
            setSelectedModerator(filteredModerators[0].id);
        } else {
          setErrorMessage('Users data is not an array.');
        }

        const coursesData = coursesResponse.data.data || [];
        setCourses(coursesData);

        if (Array.isArray(academicYearsResponse.data.data)) {
          setAcademicYears(academicYearsResponse.data.data);
        } else {
          setErrorMessage('Invalid data format for academic years.');
        }

        const fileDetails = fileDetailsResponse.data.data;
        setExistingFileDetails(fileDetails);
        setRemarks(fileDetails.remarks);
        setSelectedCourses(fileDetails.courses);
        setSelectedAcademicYear(fileDetails.academicYear);
        setSelectedModerator(fileDetails.moderator);
        setSelectedCourses(
          fileDetails.courses.map((course: Course) => course.id),
        );
      } catch (error: any) {
        setErrorMessage('Failed to fetch data: ' + error.message);
      }
    };

    fetchModeratorsCoursesAndAcademicYears();
  }, [fileId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleUpdate = async () => {
    if (!file && !remarks.trim()) {
      setErrorMessage('Please select a file or update remarks!');
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

    const selectedAcademicYearName = academicYears.find(
      (year) => year.id === selectedAcademicYear,
    )?.year;

    if (!selectedAcademicYearName) {
      setErrorMessage('Invalid academic year selected!');
      return;
    }

    const courseCodes = courses
      .filter((course) => selectedCourses.includes(course.id))
      .map((course) => course.code)
      .join('_');

    const renamedFileName = `${courseCodes}_${selectedAcademicYearName.replace(
      '/',
      '_',
    )}.pdf`;
    const renamedFile = file
      ? new File([file], renamedFileName, { type: file.type })
      : null;

    setErrorMessage('');
    setIsUploading(true);

    try {
      const response = await updateFile(
        Number(fileId),
        renamedFile ||
          new File([], existingFileDetails?.name || 'default.pdf', {
            type: 'application/pdf',
          }),
        remarks,
      );

      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('File updated successfully.');
        resetForm();
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || 'Failed to update the file: ' + error,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedCourses([]);
    setRemarks('');
    setSelectedModerator(null);
    setSelectedAcademicYear(null);
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Modify Paper" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update Paper Transactions
          </h3>
        </div>

        <div className="p-6.5 ">
          {/* File List Section */}
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
                  Academic Year
                </label>
                <select
                  value={selectedAcademicYear ?? ''}
                  disabled
                  onChange={(e) =>
                    setSelectedAcademicYear(Number(e.target.value))
                  }
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
                  Moderator
                </label>
                <select
                  value={selectedModerator || ''}
                  onChange={(e) => setSelectedModerator(Number(e.target.value))}
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
                  disabled
                >
                  {moderators.map((moderator) => (
                    <option key={moderator.id} value={moderator.id}>
                      {moderator.firstName} {moderator.lastName} (
                      {moderator.username})
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
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>File Selected: {file.name}</p>
                  </div>
                )}
                {existingFileDetails && !file && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>Current File: {existingFileDetails.name}</p>
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
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter remarks"
                  rows={3}
                ></textarea>
              </div>

              {/* Course Selection with Checkboxes */}
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Courses
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div key={course.id} className="text-black dark:text-white">
                      {course.code} - {course.name}
                    </div>
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
                onClick={handleUpdate}
                disabled={isUploading}
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
              >
                {isUploading ? 'Updating...' : 'Update File'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpdate;
