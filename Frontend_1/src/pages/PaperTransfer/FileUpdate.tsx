import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useApi from '../../api/api';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faBook,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';

const FileUpdate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [markingFile, setMarkingFile] = useState<File | null>(null); // New state for marking file
  const [remarks, setRemarks] = useState<string>('');
  const [paperType, setPaperType] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moderator, setModerator] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [examination, setExamination] = useState<string>('');
  const [examinationName, setExaminationName] = useState<string>('');
  const [, setExistingFileDetails] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false); // Drag-and-drop state for paper file
  const [isMarkingDragging, setIsMarkingDragging] = useState<boolean>(false); // Drag-and-drop state for marking file
  const { updateFile, getExaminationById, getPaperById } = useApi();
  const location = useLocation();
  const { fileId } = location.state || {};

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const fileDetailsResponse = await getPaperById(fileId);

        const fileDetails = fileDetailsResponse;
        setExistingFileDetails(fileDetails);
        const examinationResponse = await getExaminationById(
          fileDetails.examination,
        );
        setRemarks(fileDetails.remarks);
        setModerator(
          fileDetails.moderator.firstName +
            ' ' +
            fileDetails.moderator.lastName,
        );
        setCourse(fileDetails.course.code + ' - ' + fileDetails.course.name);
        setCourseCode(fileDetails.course.code);
        setExamination(examinationResponse.year);
        setPaperType(fileDetails.paperType);
        setExaminationName(
          examinationResponse.year +
            ' - ' +
            'Level' +
            ' ' +
            examinationResponse.level +
            ' - ' +
            'Semester' +
            ' ' +
            examinationResponse.semester +
            ' - ' +
            examinationResponse.degreeProgramName,
        );
      } catch (error: any) {
        setErrorMessage('Failed to fetch data: ' + error.message);
      }
    };

    fetchFileDetails();
  }, [fileId]);

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

    if (!file && !markingFile) {
      setErrorMessage('No files selected.');
      return;
    }

    const renamedFileName = `${courseCode}_${paperType}_${examination.replace(
      '/',
      '_',
    )}.pdf`;
    const renamedMarkingFileName = `MARKING_${courseCode}_${paperType}_${examination.replace(
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
        setSuccessMessage('Files updated successfully.');
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

          {/* Examination */}
          <div className="flex items-center space-x-4 mb-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
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

            {/* Course */}
            <div className="flex items-center space-x-4 ">
              <FontAwesomeIcon icon={faBook} className="text-primary text-xl" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course
                </label>
                <p className="text-gray-900 dark:text-gray-100">{course}</p>
              </div>
            </div>
          </div>

          {/* Upload Paper */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white mt-4">
              Upload Paper
            </label>
            <div
              onDragOver={(e) => handleDragOver(e, false)}
              onDragLeave={() => handleDragLeave(false)}
              onDrop={(e) => handleDrop(e, false)}
              className={`border-2 border-dashed rounded-lg p-6 ${
                isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
              }`}
            >
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
          </div>

          {/* Upload Marking */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white mt-4">
              Upload Marking
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
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-2.5 block text-black dark:text-white mt-4">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="input-field"
              rows={2}
              maxLength={100}
              placeholder="Enter remarks here...(Max 100 characters)"
            ></textarea>
          </div>

          <div className="flex justify-between mt-4">
            <Link to={'/paper/transfer'} className="btn-secondary">
              Back
            </Link>
            <button
              onClick={handleUpdate}
              disabled={isUploading}
              className="btn-primary"
            >
              {isUploading ? 'Updating...' : 'Update Files'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpdate;
