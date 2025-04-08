import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useApi from '../../api/api';
import {  useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faBook,
  faFileAlt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../../common/Loader';

interface FileDetails {
  id: number;
  remarks: string;
  paperType: string;
  moderator: {
    firstName: string;
    lastName: string;
  };
  course: {
    code: string;
    name: string;
  };
  examination: number;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  completeDate: string;
}

interface ExaminationDetails {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
}

const FileUpdate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [markingFile, setMarkingFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState<string>('');
  const [paperType, setPaperType] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moderator, setModerator] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [examinationYear, setExaminationYear] = useState<string>('');
  const [examinationName, setExaminationName] = useState<string>('');
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [examinationDetails, setExaminationDetails] =
    useState<ExaminationDetails | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMarkingDragging, setIsMarkingDragging] = useState<boolean>(false);
  const { updateFile, getExaminationById, getPaperById } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const { fileId } = location.state || {};

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const fileDetailsResponse = await getPaperById(fileId);
        setFileDetails(fileDetailsResponse);

        const examinationResponse = await getExaminationById(
          fileDetailsResponse.examination,
        );
        setExaminationDetails(examinationResponse);

        setRemarks(fileDetailsResponse.remarks);
        setModerator(
          `${fileDetailsResponse.moderator.firstName} ${fileDetailsResponse.moderator.lastName}`,
        );
        setCourse(
          `${fileDetailsResponse.course.code} - ${fileDetailsResponse.course.name}`,
        );
        setCourseCode(fileDetailsResponse.course.code);
        setExaminationYear(examinationResponse.year);
        setPaperType(fileDetailsResponse.paperType);
        setExaminationName(
          `${examinationResponse.year} - Level ${examinationResponse.level} - Semester ${examinationResponse.semester} - ${examinationResponse.degreeProgramName}`,
        );
      } catch (error: any) {
        setErrorMessage('Failed to fetch data: ' + error.message);
        navigate('/paper/transfer');
      }
    };

    if (fileId) {
      fetchFileDetails();
    } else {
      navigate('/paper/transfer');
    }
  }, [fileId, navigate]);

  const getStatusInfo = () => {
    if (!fileDetails) return { text: '', color: '', icon: null };

    if (fileDetails.completed) {
      return {
        text: `Completed on ${new Date(
          fileDetails.completeDate,
        ).toLocaleDateString()}`,
        color: 'text-success',
        icon: faCheckCircle,
      };
    }

    const createdAt = new Date(fileDetails.createdAt);
    const today = new Date();
    const timeDiff = today.getTime() - createdAt.getTime();
    const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysPassed > 14) {
      // Assuming 14 days is the deadline
      return {
        text: `Past due by ${daysPassed - 14} days`,
        color: 'text-danger',
        icon: faExclamationTriangle,
      };
    } else if (daysPassed === 14) {
      return {
        text: 'Due today',
        color: 'text-warning',
        icon: faClock,
      };
    } else {
      return {
        text: `Due in ${14 - daysPassed} days`,
        color: 'text-primary',
        icon: faCalendarCheck,
      };
    }
  };

  const statusInfo = getStatusInfo();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMarkingFile = false,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile, isMarkingFile);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      validateAndSetFile(selectedFile, isMarkingFile);
    }
    if (isMarkingFile) {
      setIsMarkingDragging(false);
    } else {
      setIsDragging(false);
    }
  };

  const validateAndSetFile = (selectedFile: File, isMarkingFile: boolean) => {
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

  const handleUpdate = async () => {
    if (!file && !markingFile && !remarks.trim()) {
      setErrorMessage('Please select a file or update remarks!');
      return;
    }

    const renamedFileName = `${courseCode}_${paperType}_${examinationYear.replace(
      '/',
      '_',
    )}.pdf`;
    const renamedMarkingFileName = `MARKING_${courseCode}_${paperType}_${examinationYear.replace(
      '/',
      '_',
    )}.pdf`;

    const renamedFile = file
      ? new File([file], renamedFileName, { type: file.type })
      : null;
    const renamedMarkingFile = markingFile
      ? new File([markingFile], renamedMarkingFileName, {
          type: markingFile.type,
        })
      : null;

    setErrorMessage('');
    setIsUploading(true);

    try {
      const response = await updateFile(
        Number(fileId),
        renamedFile as File,
        renamedFileName,
        renamedMarkingFile as File,
        renamedMarkingFileName,
        remarks,
      );
      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('Files updated successfully!');
        // Refresh file details after successful update
        const updatedResponse = await getPaperById(fileId);
        setFileDetails(updatedResponse);
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          'Failed to update the files: ' + error,
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!fileDetails || !examinationDetails) {
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Modify Paper" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update Paper Transactions
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

          {/* Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Examination */}
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-primary text-xl"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Examination
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {examinationName}
                </p>
              </div>
            </div>

            {/* Moderator */}
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faUser} className="text-primary text-xl" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moderator
                </label>
                <p className="text-gray-900 dark:text-gray-100">{moderator}</p>
              </div>
            </div>

            {/* Course */}
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faBook} className="text-primary text-xl" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course
                </label>
                <p className="text-gray-900 dark:text-gray-100">{course}</p>
              </div>
            </div>

            {/* Paper Type */}
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon
                icon={faFileAlt}
                className="text-primary text-xl"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paper Type
                </label>
                <p className="text-gray-900 dark:text-gray-100">{paperType}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-4">
              {statusInfo.icon && (
                <FontAwesomeIcon
                  icon={statusInfo.icon}
                  className={`${statusInfo.color} text-xl`}
                />
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <p className={`${statusInfo.color} dark:text-gray-100`}>
                  {statusInfo.text}
                </p>
              </div>
            </div>
          </div>

          {!fileDetails.completed ? (
            <>
              {/* Upload Paper */}
              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Upload Paper (PDF only, max 10MB)
                </label>
                <div
                  onDragOver={(e) => handleDragOver(e, false)}
                  onDragLeave={() => handleDragLeave(false)}
                  onDrop={(e) => handleDrop(e, false)}
                  className={`border-2 border-dashed rounded-lg p-6 ${
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, false)}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer block text-center"
                  >
                    <div className="text-gray-600 dark:text-gray-400">
                      Drag and drop your paper PDF here, or{' '}
                      <span className="text-primary underline">
                        click to browse
                      </span>
                    </div>
                  </label>
                  {file && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>Selected: {file.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Marking */}
              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Upload Marking Scheme (PDF only, max 10MB)
                </label>
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
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, true)}
                    className="hidden"
                    id="marking-file-upload"
                    accept=".pdf"
                  />
                  <label
                    htmlFor="marking-file-upload"
                    className="cursor-pointer block text-center"
                  >
                    <div className="text-gray-600 dark:text-gray-400">
                      Drag and drop your marking scheme PDF here, or{' '}
                      <span className="text-primary underline">
                        click to browse
                      </span>
                    </div>
                  </label>
                  {markingFile && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>Selected: {markingFile.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  rows={3}
                  maxLength={200}
                  placeholder="Add any remarks about this update (max 200 characters)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => navigate('/paper/transfer')}
                  className="btn btn-secondary"
                >
                  Back to Papers
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={
                    isUploading || (!file && !markingFile && !remarks.trim())
                  }
                  className="btn btn-primary"
                >
                  {isUploading ? 'Updating...' : 'Update Files'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-8 bg-success/10 rounded-lg">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-success text-4xl mb-4"
              />
              <h3 className="text-xl font-semibold text-success mb-2">
                Submission Completed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your files were successfully submitted on{' '}
                {new Date(fileDetails.completeDate).toLocaleDateString()}
              </p>
              <button
                onClick={() => navigate('/paper/transfer')}
                className="btn btn-primary"
              >
                Back to Papers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpdate;
