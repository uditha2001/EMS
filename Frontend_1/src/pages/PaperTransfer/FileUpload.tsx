import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useApi from '../../api/api';
import Stepper from './Stepper';
import {
  faFileUpload,
  faUser,
  faBook,
  faList,
} from '@fortawesome/free-solid-svg-icons';

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
  const {
    uploadFile,
    getRoleAssignmentByUserId,
    getExaminationById,
    getModerators,
  } = useApi();
  const userId = Number(auth.id);

  const [file, setFile] = useState<File | null>(null);
  const [markingFile, setMarkingFile] = useState<File | null>(null);
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isMarkingDragging, setIsMarkingDragging] = useState(false);

  const steps = [
    { id: 1, name: 'Examination', icon: faList },
    { id: 2, name: 'Course & Paper', icon: faBook },
    { id: 3, name: 'Moderator', icon: faUser },
    { id: 4, name: 'Upload', icon: faFileUpload },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleAssignmentsResponse = await getRoleAssignmentByUserId(
          Number(auth.id),
        );
        const roleAssignments = roleAssignmentsResponse.data.filter(
          (assignment: any) => assignment.isAuthorized,
        );

        const examinationIds: number[] = Array.from(
          new Set(
            roleAssignments.map((assignment: any) => assignment.examinationId),
          ),
        );

        const examData = await Promise.all(
          examinationIds.map((examId: number) => getExaminationById(examId)),
        );

        const ongoingExams = examData
          .flat()
          .filter((exam: Examination) => exam.status === 'ONGOING');
        setExaminations(ongoingExams);

        // If an examination is selected, filter courses for that examination only
        if (selectedExamination) {
          const filteredCourses = roleAssignments.filter(
            (assignment: any) =>
              Number(assignment.examinationId) === selectedExamination,
          );

          const uniqueCourses: Course[] = Array.from(
            new Map(
              filteredCourses.map((assignment: any) => [
                assignment.courseId,
                {
                  courseId: assignment.courseId,
                  courseCode: assignment.courseCode,
                  courseName: assignment.courseName,
                  paperType: assignment.paperType,
                  roleId: assignment.roleId,
                } as Course,
              ]),
            ).values(),
          ) as Course[];

          setCourses(uniqueCourses);
        } else {
          // If no examination is selected, show all courses (or none)
          setCourses([]);
        }

        if (selectedCourse !== null) {
          const courseAssignments = roleAssignments.filter(
            (assignment: any) => assignment.courseId === selectedCourse,
          );
          const paperTypes: string[] = Array.from(
            new Set(
              courseAssignments.map((assignment: any) => assignment.paperType),
            ),
          );
          setAvailablePaperTypes(paperTypes);
        }
      } catch (error) {
        setErrorMessage('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [auth.id, selectedExamination, selectedCourse]); // Add selectedExamination to dependencies

  useEffect(() => {
    const fetchModerators = async () => {
      if (!selectedCourse || !paperType) return;
      try {
        const response = await getModerators(selectedCourse, paperType);
        setModerators(response.data);
      } catch (error) {
        setModerators([]);
        setErrorMessage('Failed to fetch moderators.');
      }
    };
    fetchModerators();
  }, [selectedCourse, paperType]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMarkingFile = false,
  ) => {
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

    if (isMarkingFile) {
      setMarkingFile(selectedFile);
    } else {
      setFile(selectedFile);
    }
    setErrorMessage('');
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    isMarkingFile = false,
  ) => {
    e.preventDefault();
    if (isMarkingFile) {
      setIsMarkingDragging(true);
    } else {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (isMarkingFile = false) => {
    if (isMarkingFile) {
      setIsMarkingDragging(false);
    } else {
      setIsDragging(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    isMarkingFile = false,
  ) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
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

    if (isMarkingFile) {
      setMarkingFile(selectedFile);
      setIsMarkingDragging(false);
    } else {
      setFile(selectedFile);
      setIsDragging(false);
    }
    setErrorMessage('');
  };

  const handleUpload = async () => {
    if (
      !file ||
      !markingFile ||
      !selectedModerator ||
      !selectedCourse ||
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

    const renamedMarkingFile = new File(
      [markingFile],
      `MARKING_${selectedCourseCode}_${paperType}_${selectedExam.replace(
        '/',
        '_',
      )}.pdf`,
      { type: markingFile.type },
    );

    setIsUploading(true);

    try {
      const response = await uploadFile(
        renamedFile,
        renamedMarkingFile,
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
        setSuccessMessage('Files uploaded successfully.');
        resetForm();
      }
    } catch (error) {
      setErrorMessage('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setMarkingFile(null); // Reset marking file
    setRemarks('');
    setPaperType('');
    setSelectedModerator(null);
    setSelectedCourse(null);
    setSelectedExamination(null);
    setCurrentStep(1);
  };

  const handleExaminationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const examId = Number(e.target.value);
    setSelectedExamination(examId);
    setSelectedCourse(null); // Reset course selection
    setPaperType(''); // Reset paper type
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedExamination) {
      setErrorMessage('Please select an examination.');
      return;
    }
    if (currentStep === 2 && (!selectedCourse || !paperType)) {
      setErrorMessage('Please select a course and paper type.');
      return;
    }
    if (currentStep === 3 && !selectedModerator) {
      setErrorMessage('Please select a moderator.');
      return;
    }
    if (currentStep === 4 && (!file || !markingFile)) {
      // Ensure both files are provided
      setErrorMessage('Please upload both paper and marking files.');
      return;
    }
    setErrorMessage('');
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-4">
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />

      <Stepper currentStep={currentStep} steps={steps} />

      <div className="mt-6">
        {currentStep === 1 && (
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Select Examination
            </label>
            <select
              value={selectedExamination || 0}
              onChange={handleExaminationChange}
              className="input-field appearance-none cursor-pointer"
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
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Select Course
              </label>
              <select
                value={selectedCourse || ''}
                onChange={(e) => {
                  setSelectedCourse(Number(e.target.value));
                  setPaperType('');
                }}
                className="input-field appearance-none"
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
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Paper Type
              </label>
              <select
                value={paperType}
                onChange={(e) => setPaperType(e.target.value)}
                className="input-field appearance-none cursor-pointer"
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
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              Select Moderator
            </label>
            <select
              value={selectedModerator || ''}
              onChange={(e) => setSelectedModerator(Number(e.target.value))}
              className="input-field appearance-none cursor-pointer"
            >
              <option value={''}>Select Moderator</option>
              {moderators.map((moderator) => (
                <option key={moderator.userId} value={moderator.userId}>
                  {moderator.user}
                </option>
              ))}
            </select>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Paper File Upload */}
            <div
              onDragOver={(e) => handleDragOver(e, false)}
              onDragLeave={() => handleDragLeave(false)}
              onDrop={(e) => handleDrop(e, false)}
              className={`border-2 border-dashed rounded-lg p-6 ${
                isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
              }`}
            >
              <label className="mb-2.5 block text-black dark:text-white">
                Upload Paper
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, false)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block text-center"
              >
                <div className="text-gray-600 dark:text-gray-400">
                  Drag and drop a PDF file here, or{' '}
                  <span className="text-primary underline">
                    click to browse
                  </span>
                  .
                </div>
              </label>
              {file && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>File Selected: {file.name}</p>
                </div>
              )}
            </div>

            {/* Marking File Upload */}
            <div
              onDragOver={(e) => handleDragOver(e, true)}
              onDragLeave={() => handleDragLeave(true)}
              onDrop={(e) => handleDrop(e, true)}
              className={`border-2 border-dashed rounded-lg p-6 ${
                isMarkingDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300'
              }`}
            >
              <label className="mb-2.5 block text-black dark:text-white">
                Upload Marking
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, true)}
                className="hidden"
                id="marking-file-upload"
              />
              <label
                htmlFor="marking-file-upload"
                className="cursor-pointer block text-center"
              >
                <div className="text-gray-600 dark:text-gray-400">
                  Drag and drop a PDF file here, or{' '}
                  <span className="text-primary underline">
                    click to browse
                  </span>
                  .
                </div>
              </label>
              {markingFile && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>File Selected: {markingFile.name}</p>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="input-field"
                placeholder="Enter remarks"
                rows={3}
                maxLength={100}
              ></textarea>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 text-sm">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="btn-secondary"
        >
          Previous
        </button>

        {currentStep < steps.length ? (
          <button type="button" onClick={nextStep} className="btn-primary">
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="btn-primary"
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
