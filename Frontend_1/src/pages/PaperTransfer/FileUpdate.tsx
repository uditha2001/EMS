import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useApi from '../../api/api';
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

interface Examination {
  id: number;
  year: string;
}

interface FileDetails {
  id: number;
  name: string;
  courses: number[];
  examination: number;
  remarks: string;
  moderator: number;
  paperType: string;
}

const FileUpdate: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [paperType] = useState<string>('');
  const [selectedPaperType, setSelectedPaperType] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<number | null>(
    null,
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<number | null>(
    null,
  );
  const [existingFileDetails, setExistingFileDetails] =
    useState<FileDetails | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const { updateFile } = useApi();

  useEffect(() => {
    const fetchModeratorsCoursesAndExaminations = async () => {
      try {
        const [
          usersResponse,
          coursesResponse,
          examinationsResponse,
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

        if (Array.isArray(examinationsResponse.data.data)) {
          setExaminations(examinationsResponse.data.data);
        } else {
          setErrorMessage('Invalid data format for academic years.');
        }

        const fileDetails = fileDetailsResponse.data.data;
        setExistingFileDetails(fileDetails);
        setRemarks(fileDetails.remarks);
        setSelectedCourses(fileDetails.courses);
        setSelectedExamination(fileDetails.examination);
        setSelectedModerator(fileDetails.moderator);
        setSelectedCourses(
          fileDetails.courses.map((course: Course) => course.id),
        );
        setSelectedPaperType(fileDetails.paperType);
      } catch (error: any) {
        setErrorMessage('Failed to fetch data: ' + error.message);
      }
    };

    fetchModeratorsCoursesAndExaminations();
  }, [fileId]);

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

  const handleUpdate = async () => {
    if (!file && !remarks.trim()) {
      setErrorMessage('Please select a file or update remarks!');
      return;
    }

    if (!selectedModerator) {
      setErrorMessage('Please select a moderator!');
      return;
    }

    if (!paperType) {
      setErrorMessage('Paper Type are required!');
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

    if (!selectedExamination) {
      setErrorMessage('Please select an academic year!');
      return;
    }

    const selectedExaminationName = examinations.find(
      (year) => year.id === selectedExamination,
    )?.year;

    if (!selectedExaminationName) {
      setErrorMessage('Invalid academic year selected!');
      return;
    }

    const courseCodes = courses
      .filter((course) => selectedCourses.includes(course.id))
      .map((course) => course.code)
      .join('_');

    const renamedFileName = `${courseCodes}_${paperType}_${selectedExaminationName.replace(
      '/',
      '_',
    )}.pdf`;

    if (!file) {
      setErrorMessage('No file selected.');
      return;
    }
    const renamedFile = new File([file], renamedFileName, { type: file.type });
    console.log('Renamed File Name:', renamedFileName);
    setErrorMessage('');
    setIsUploading(true);

    try {
      const response = await updateFile(
        Number(fileId),
        renamedFile,
        renamedFileName,
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
    setSelectedExamination(null);
    setSelectedPaperType('');
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
              {/* Examination Selection */}
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Examination
                </label>
                <select
                  value={selectedExamination ?? ''}
                  //disabled
                  onChange={(e) =>
                    setSelectedExamination(Number(e.target.value))
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
                >
                  <option value={0}>Select Examination</option>
                  {examinations.map((examination) => (
                    <option key={examination.id} value={examination.id}>
                      {examination.year}
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

              {/* Paper Type */}

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Paper Type
                </label>
                <select
                  value={selectedPaperType}
                  onChange={(e) => setSelectedPaperType(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
                  required
                >
                  <option value="">Select Paper Type</option>
                  <option value="THEORY">THEORY</option>
                  <option value="PRACTICAL">PRACTICAL</option>
                </select>
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
