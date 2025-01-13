import React, { useState } from 'react';
import api from './api';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const userId = 1;
  const moderator = 2;

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
      setErrorMessage(''); // Clear any previous error
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file first!');
      return;
    }

    setIsUploading(true);
    setErrorMessage(''); // Clear any previous error

    try {
      const response = await api.uploadFile(file, userId, moderator);
      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('File uploaded successfully.');
      }
      setFile(null); // Clear the selected file after upload
    } catch (error: any) {
      setErrorMessage('Failed to upload the file: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Success and Error Messages */}
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
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
