import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useApi from '../../api/api';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const FileUpdate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
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
  const axiosPrivate = useAxiosPrivate();
  const { updateFile, getExaminationById } = useApi();
  const location = useLocation();
  const { fileId } = location.state || {};

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const fileDetailsResponse = await axiosPrivate.get(`/papers/${fileId}`);

        const fileDetails = fileDetailsResponse.data.data;
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
    const renamedFileName = `${courseCode}_${paperType}_${examination.replace(
      '/',
      '_',
    )}.pdf`;
    if (!file) {
      setErrorMessage('No file selected.');
      return;
    }
    const renamedFile = new File([file], renamedFileName, { type: file.type });
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
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || 'Failed to update the file: ' + error,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Examination
              </label>
              <input disabled value={examinationName} className="input-field" />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Moderator
              </label>
              <input disabled value={moderator} className="input-field" />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Upload Paper
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Paper Type
              </label>
              <input disabled value={paperType} className="input-field" />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Course
              </label>
              <input disabled value={course} className="input-field" />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                rows={3}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Link
              to={'/paper/transfer'}
              className="rounded border border-stroke py-2 px-6 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Back
            </Link>
            <button
              onClick={handleUpdate}
              disabled={isUploading}
              className="rounded bg-primary py-2 px-6 text-gray hover:bg-opacity-90"
            >
              {isUploading ? 'Updating...' : 'Update File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpdate;
