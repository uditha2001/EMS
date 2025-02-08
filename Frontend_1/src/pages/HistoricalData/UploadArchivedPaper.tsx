import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useApi from '../../api/api';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface Examination {
  id: string;
  year: string;
  level: string;
  semester: string;
  degreeProgramName: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  courseType: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

const UploadArchivedPaper: React.FC = () => {
  const { auth } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [paperType, setPaperType] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moderators, setModerators] = useState<User[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<number | null>(
    null,
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<number | null>(
    null,
  );
  const userId = Number(auth.id);

  const {
    uploadArchivedPaper,
    fetchUsers,
    getExaminations,
    getExaminationsAllCourses,
  } = useApi();
  const [creators, setCreators] = useState<User[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<number | null>(null);

  useEffect(() => {
    const fetchModeratorsCoursesAndExaminations = async () => {
      try {
        const [usersResponse, examinationsResponse] = await Promise.all([
          fetchUsers(),
          getExaminations(),
        ]);

        const allUsers = usersResponse || [];
        setModerators(allUsers);
        setCreators(allUsers);

        if (Array.isArray(examinationsResponse?.data?.data)) {
          setExaminations(examinationsResponse.data.data);
        } else {
          setErrorMessage('Invalid data format for examinations.');
        }

        // Fetch courses only if an examination is selected
        if (selectedExamination) {
          Promise.all([
            getExaminationsAllCourses(Number(selectedExamination)),
          ]).then(([courseResponse]) => {
            const coursesData = courseResponse.data?.activeCourses || [];
            setCourses(coursesData);
          });
        } else {
          setCourses([]);
        }
      } catch (error: any) {
        setErrorMessage(`Failed to fetch data: ${error.message}`);
      }
    };
  
    fetchModeratorsCoursesAndExaminations();
  }, [selectedExamination]); // Added selectedExamination as a dependency

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

    if (!selectedCreator) {
      setErrorMessage('Please select a creator!');
      return;
    }

    if (!selectedCourse) {
      setErrorMessage('Please select a course!');
      return;
    }

    if (!remarks.trim()) {
      setErrorMessage('Remarks are required!');
      return;
    }

    if (!paperType) {
      setErrorMessage('Paper Type are required!');
      return;
    }

    if (!selectedExamination) {
      setErrorMessage('Please select an academic year!');
      return;
    }

    const selectedExaminationName = examinations.find(
      (year) => Number(year.id) === selectedExamination,
    )?.year;

    if (!selectedExaminationName) {
      setErrorMessage('Invalid academic year selected!');
      return;
    }

    const selectedCourseCode = courses.find(
      (course) => Number(course.id) === selectedCourse,
    )?.code;
    if (!selectedCourseCode) {
      setErrorMessage('Invalid course selected!');
      return;
    }

    const renamedFileName = `${selectedCourseCode}_${paperType}_${selectedExaminationName.replace(
      '/',
      '_',
    )}.pdf`;
    const renamedFile = new File([file], renamedFileName, { type: file.type });

    setErrorMessage('');
    setIsUploading(true);

    try {
      const uploadRequest = {
        fileName: renamedFileName,
        remarks,
        creatorId: selectedCreator ?? userId, // Use selected creator or fallback to logged-in user
        moderatorId: selectedModerator,
        examinationId: selectedExamination,
        courseId: selectedCourse,
        paperType,
      };

      const response = await uploadArchivedPaper(renamedFile, uploadRequest);

      if (response.code !== 200) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('Archived paper uploaded successfully.');
        resetForm();
      }
    } catch (error) {
      setErrorMessage(String(error));
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedCourse(null);
    setRemarks('');
    setSelectedModerator(null);
    setSelectedExamination(null);
    setPaperType('');
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Archived Paper" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Upload Archived Paper
          </h3>
        </div>
        <div className="p-6.5">
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
                Select Examination
              </label>
              <select
                value={selectedExamination || 0} // Default value is 0
                onChange={(e) => setSelectedExamination(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
              >
                <option value={0}>Select Examination</option>
                {examinations.map((examination) => (
                  <option key={examination.id} value={examination.id}>
                    {examination.year} - Level {examination.level} - Semester{' '}
                    {examination.semester} - {examination.degreeProgramName}
                  </option>
                ))}
              </select>
            </div>

            {/* Creator Selection */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Select Creator
              </label>
              <select
                value={selectedCreator || ''}
                onChange={(e) => setSelectedCreator(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
                required
              >
                <option value={''}>Select Creator</option>
                {creators.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    {creator.firstName} {creator.lastName}
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
                    {moderator.firstName} {moderator.lastName}
                  </option>
                ))}
              </select>
            </div>
            {/* Course Selection */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Select Course
              </label>
              <select
                value={selectedCourse || ''}
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
                required
              >
                <option value={''}>Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Paper Type */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Paper Type
              </label>
              <select
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
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
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter remarks"
                rows={3}
              ></textarea>
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
          </div>
          <div className="flex justify-between mt-4">
            <Link
              to={'/history/archived'}
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
              {isUploading ? 'Uploading...' : 'Upload Archived Paper'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArchivedPaper;
