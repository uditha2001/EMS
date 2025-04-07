import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useApi from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileUpload,
  faUser,
  faBook,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../../common/Loader';

interface ExaminationDetails {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
}

interface UserDetails {
  userId: number;
  user: string;
}

interface CourseDetails {
  id: number;
  code: string;
  name: string;
}

interface RoleAssignmentDetails {
  examination: ExaminationDetails;
  course: CourseDetails;
  paperType: string;
  moderator: UserDetails;
  grantAt: string;
  completed: boolean;
  completeDate: string;
}

const FileUpload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const {
    uploadFile,
    getRoleAssignmentById,
    getExaminationById,
    getModerators,
  } = useApi();

  const [file, setFile] = useState<File | null>(null);
  const [markingFile, setMarkingFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [roleAssignment, setRoleAssignment] =
    useState<RoleAssignmentDetails | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMarkingDragging, setIsMarkingDragging] = useState(false);
  const userId = Number(auth.id);

  useEffect(() => {
    const fetchRoleAssignmentDetails = async () => {
      try {
        // Fetch role assignment details
        const roleResponse = await getRoleAssignmentById(Number(id));
        const roleData = roleResponse.data;

        // Fetch examination details
        const examResponse = await getExaminationById(roleData.examinationId);

        // Fetch moderators
        const moderatorResponse = await getModerators(
          roleData.courseId,
          roleData.paperType,
        );

        const moderator = moderatorResponse.data.find(
          (m: any) => m.userId !== Number(auth.id),
        ); // Exclude current user

        setRoleAssignment({
          examination: {
            id: examResponse.id,
            year: examResponse.year,
            level: examResponse.level,
            semester: examResponse.semester,
            degreeProgramName: examResponse.degreeProgramName,
          },
          course: {
            id: roleData.courseId,
            code: roleData.courseCode,
            name: roleData.courseName,
          },
          paperType: roleData.paperType,
          moderator: moderator || {
            userId: 0,
            user: 'Not Assigned',
          },
          grantAt: roleData.grantAt,
          completed: roleData.completed,
          completeDate: roleData.completeDate,
        });
      } catch (error) {
        setErrorMessage('Failed to fetch role assignment details');
        navigate('/paper/transfer');
      }
    };

    fetchRoleAssignmentDetails();
  }, [id, navigate, auth.id]);

  const getStatusInfo = () => {
    if (!roleAssignment) return { text: '', color: '', icon: null };

    if (roleAssignment.completed) {
      return {
        text: `Completed on ${new Date(
          roleAssignment.completeDate,
        ).toLocaleDateString()}`,
        color: 'text-success',
        icon: faCheckCircle,
      };
    }

    const dueDate = new Date(roleAssignment.grantAt);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining < 0) {
      return {
        text: `Past due since ${Math.abs(daysRemaining)} days`,
        color: 'text-danger',
        icon: faExclamationTriangle,
      };
    } else if (daysRemaining === 0) {
      return {
        text: 'Due today',
        color: 'text-warning',
        icon: faClock,
      };
    } else {
      return {
        text: `Due in ${daysRemaining} days (${dueDate.toLocaleDateString()})`,
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
    if (!file || !markingFile || !roleAssignment) {
      setErrorMessage('Both paper and marking files are required!');
      return;
    }

    const examinationYear = roleAssignment.examination.year.replace('/', '_');
    const paperFileName = `${roleAssignment.course.code}_${roleAssignment.paperType}_${examinationYear}.pdf`;
    const markingFileName = `MARKING_${roleAssignment.course.code}_${roleAssignment.paperType}_${examinationYear}.pdf`;

    const renamedFile = new File([file], paperFileName, { type: file.type });
    const renamedMarkingFile = new File([markingFile], markingFileName, {
      type: markingFile.type,
    });

    setIsUploading(true);

    try {
      const response = await uploadFile(
        renamedFile,
        renamedMarkingFile,
        userId,
        roleAssignment.course.id,
        remarks,
        roleAssignment.paperType,
        roleAssignment.moderator.userId,
        roleAssignment.examination.id,
      );

      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('Files uploaded successfully!');
        // Reset form after successful upload
        setFile(null);
        setMarkingFile(null);
        setRemarks('');
        // Refresh assignment data to show completed status
        const updatedResponse = await getRoleAssignmentById(Number(id));
        setRoleAssignment({
          ...roleAssignment,
          completed: updatedResponse.data.completed,
          completeDate: updatedResponse.data.completeDate,
        });
      }
    } catch (error) {
      setErrorMessage('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!roleAssignment) {
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  }

  return (
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
              {roleAssignment.examination.year} - Level{' '}
              {roleAssignment.examination.level} - Semester{' '}
              {roleAssignment.examination.semester} -{' '}
              {roleAssignment.examination.degreeProgramName}
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
            <p className="text-gray-900 dark:text-gray-100">
              {roleAssignment.moderator.user}
            </p>
          </div>
        </div>

        {/* Course */}
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon icon={faBook} className="text-primary text-xl" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {roleAssignment.course.code} - {roleAssignment.course.name}
            </p>
          </div>
        </div>

        {/* Paper Type */}
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon
            icon={faFileUpload}
            className="text-primary text-xl"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paper Type
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {roleAssignment.paperType}
            </p>
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

      {!roleAssignment.completed ? (
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
                isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
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
              placeholder="Add any remarks about this upload (max 200 characters)"
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
              onClick={handleUpload}
              disabled={isUploading || !file || !markingFile}
              className="btn btn-primary"
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
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
            {new Date(roleAssignment.completeDate).toLocaleDateString()}
          </p>
          <button
            onClick={() => navigate('/paper/transfer')}
            className="btn btn-primary mx-auto block"
          >
            Back to Papers
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
