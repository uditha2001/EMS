import React, { useState, useEffect } from 'react';
import api from './api';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import axios from 'axios';

interface Moderator {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<number | null>(
    null,
  );
  const userId = 1; // Current user ID

  // Fetch moderators on component mount
  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/user');
        const allUsers = response.data;

        // Filter users with the role "PAPER_MODERATOR" and active=true
        const filteredModerators = allUsers.filter(
          (user: any) => user.roles.includes('PAPER_MODERATOR') && user.active,
        );

        setModerators(filteredModerators);

        if (filteredModerators.length > 0) {
          setSelectedModerator(filteredModerators[0].id); // Default to the first moderator
        }
      } catch (error: any) {
        setErrorMessage('Failed to fetch moderators: ' + error.message);
      }
    };

    fetchModerators();
  }, []);

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
    if (!selectedModerator) {
      setErrorMessage('Please select a moderator!');
      return;
    }

    setIsUploading(true);
    setErrorMessage(''); // Clear any previous error

    try {
      const response = await api.uploadFile(file, userId, selectedModerator);
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

      <label className="mt-4 block text-black dark:text-white">
        Select Moderator
      </label>
      <select
        value={selectedModerator || ''}
        onChange={(e) => setSelectedModerator(Number(e.target.value))}
        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
      >
        {moderators.map((moderator) => (
          <option key={moderator.id} value={moderator.id}>
            {moderator.firstName} {moderator.lastName} ({moderator.username})
          </option>
        ))}
      </select>

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
