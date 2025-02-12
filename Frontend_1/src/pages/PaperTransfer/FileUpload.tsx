import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useApi from '../../api/api';
import { Link } from 'react-router-dom';

interface Moderator {
  userId: number;
  user: string;
}

interface Course {
  courseId: number;
  courseCode: string;
  courseName: string;
  paperType: string;
  roleId: number;
}

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
  status: string;
}

const FileUpload: React.FC = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { uploadFile, getRoleAssignmentByUserId, getExaminationById } =
    useApi();
  const userId = Number(auth.id);

  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState('');
  const [paperType, setPaperType] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<number | null>(
    null,
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<number | null>(
    null,
  );
  const [availablePaperTypes, setAvailablePaperTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch role assignments
        const roleAssignmentsResponse = await getRoleAssignmentByUserId(
          Number(auth.id),
        ); // Fetch role assignments for the user

        const roleAssignments = roleAssignmentsResponse.data.filter(
          (assignment: any) => assignment.isAuthorized, // Filter only authorized assignments
        );

        // Extract examination IDs from the role assignments
        const examinationIds: number[] = Array.from(
          new Set(
            roleAssignments.map((assignment: any) => assignment.examinationId),
          ),
        );

        // Fetch exams based on the examination IDs found in the role assignments
        const examData = await Promise.all(
          examinationIds.map((examId: number) => getExaminationById(examId)), // Fetch each exam by ID
        );

        // Flatten the exam data array if needed
        const ongoingExams = examData.flat().filter(
          (exam: Examination) => exam.status === 'ONGOING', // Filter ongoing exams
        );

        setExaminations(ongoingExams);

        // Filter courses based on the role assignments and selected examination
        const filteredCourses = roleAssignments.filter(
          (assignment: any) =>
            examinationIds.includes(Number(assignment.examinationId)), // Filter courses for the selected exams
        );

        const uniqueCourses: Course[] = Array.from(
          new Map(
            filteredCourses.map((assignment: any) => [
              assignment.courseId,
              {
                courseId: assignment.courseId,
                courseCode: assignment.courseCode,
                courseName: assignment.courseName,
                paperType: assignment.paperType, // Single paper type per course for now
                roleId: assignment.roleId,
              } as Course,
            ]),
          ).values(),
        ) as Course[];

        setCourses(uniqueCourses);

        // If a course is selected, update the paper types available for that course
        if (selectedCourse !== null) {
          // Filter out paper types from all assignments for the selected course
          const courseAssignments = roleAssignments.filter(
            (assignment: any) => assignment.courseId === selectedCourse,
          );

          // Collect unique paper types for the course
          const paperTypes: string[] = Array.from(
            new Set(
              courseAssignments.map((assignment: any) => assignment.paperType),
            ),
          );

          setAvailablePaperTypes(paperTypes); // Set available paper types based on role assignments
        }
      } catch (error) {
        setErrorMessage('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [
    auth.id,
    getRoleAssignmentByUserId,
    getExaminationById,
    selectedExamination,
    selectedCourse,
  ]);

  useEffect(() => {
    const fetchModerators = async () => {
      if (!selectedCourse || !paperType) return;
      try {
        const response = await axiosPrivate.get(
          `/role-assignments/moderators?courseId=${selectedCourse}&paperType=${paperType}`,
        );
        setModerators(response.data.data);
      } catch (error) {
        setModerators([]);
        setErrorMessage('Failed to fetch moderators.');
      }
    };
    fetchModerators();
  }, [selectedCourse, paperType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

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
  };

  const handleUpload = async () => {
    if (
      !file ||
      !selectedModerator ||
      !selectedCourse ||
      !remarks.trim() ||
      !paperType ||
      !selectedExamination
    ) {
      setErrorMessage('All fields are required!');
      return;
    }

    const selectedExam = examinations.find(
      (exam) => exam.id === selectedExamination,
    )?.year;
    const selectedCourseCode = courses.find(
      (course) => course.courseId === selectedCourse,
    )?.courseCode;
    if (!selectedExam || !selectedCourseCode) {
      setErrorMessage('Invalid selection!');
      return;
    }

    const renamedFile = new File(
      [file],
      `${selectedCourseCode}_${paperType}_${selectedExam.replace(
        '/',
        '_',
      )}.pdf`,
      { type: file.type },
    );
    setIsUploading(true);

    try {
      const response = await uploadFile(
        renamedFile,
        userId,
        selectedCourse,
        remarks,
        paperType,
        selectedModerator,
        selectedExamination,
      );
      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('File uploaded successfully.');
        resetForm();
      }
    } catch (error) {
      setErrorMessage('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setRemarks('');
    setPaperType('');
    setSelectedModerator(null);
    setSelectedCourse(null);
    setSelectedExamination(null);
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

        {/* Course Selection */}
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Select Course
          </label>
          <select
            value={selectedCourse || ''}
            onChange={(e) => {
              setSelectedCourse(Number(e.target.value)); // Update selected course
              setPaperType(''); // Reset paper type when course changes
            }}
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
            required
          >
            <option value={''}>Select Course</option>

            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseCode} - {course.courseName}
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
            value={paperType} // The selected paper type will be dynamically set
            onChange={(e) => setPaperType(e.target.value)} // Update paper type on change
            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
            required
          >
            <option value="">Select Paper Type</option>
            {availablePaperTypes.length > 0 ? (
              availablePaperTypes.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))
            ) : (
              <option disabled>No paper types available</option>
            )}
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
            <option value={''}>Select Moderator</option>
            {moderators.map((moderator) => (
              <option key={moderator.userId} value={moderator.userId}>
                {moderator.user}
              </option>
            ))}
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
