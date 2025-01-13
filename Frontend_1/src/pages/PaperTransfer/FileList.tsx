import React, { useEffect, useState } from 'react';
import { EncryptedPaper } from '../../types/transferpaper';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useApi from './api';

const FileList: React.FC = () => {
  const { auth } = useAuth();
  const [files, setFiles] = useState<EncryptedPaper[]>([]);
  const [message] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const moderatorId = Number(auth.id);
  const { getAllFiles, downloadFile, deleteFile } = useApi();


  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await getAllFiles();
      setFiles(response);
    } catch (error: any) {
      setErrorMessage('Error fetching files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      // Trigger the file download
      await downloadFile(id, moderatorId);

      // Display success feedback to the user
      setSuccessMessage('File downloaded successfully.');
      console.log('File downloaded successfully.');
    } catch (error: any) {
      // Log the error and display error feedback
      console.error('Error in handleDownload:', error);

      // Extract error message or fallback to a default one
      const errorMessage = error?.message || 'Error downloading file.';
      setErrorMessage(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteFile(id);
      const successMessage = response?.message || 'File deleted successfully.';
      setSuccessMessage(successMessage);
      fetchFiles();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Error deleting file: ' + error.message;
      setErrorMessage(errorMessage);
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
        Uploaded Files
      </label>
      <div className="overflow-x-auto rounded border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">
                File Name
              </th>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">
                Size
              </th>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">
                Date Uploaded
              </th>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading files...
                </td>
              </tr>
            ) : message ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-6 text-center text-red-500 dark:text-red-400"
                >
                  {message}
                </td>
              </tr>
            ) : files.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No files uploaded yet.
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr
                  key={file.id}
                  className="border-t border-stroke dark:border-strokedark"
                >
                  <td className="py-4 px-6">{file.fileName}</td>
                  <td className="py-4 px-6">N/A</td>
                  <td className="py-4 px-6">
                    {file.sharedAt &&
                      new Date(file.sharedAt).toLocaleDateString('en-US', {
                        weekday: 'short', // Short day name (Mon, Tue, etc.)
                        year: 'numeric', // Full year (2025)
                        month: 'short', // Short month name (Jan, Feb, etc.)
                        day: 'numeric', // Day of the month (1, 2, 3, etc.)
                      })}
                  </td>

                  <td className="py-4 px-6">
                    <button
                      type="button"
                      className="text-primary hover:text-opacity-80"
                      onClick={() => handleDownload(file.id)}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="ml-4 text-red-600 hover:text-opacity-80"
                      onClick={() => handleDelete(file.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
