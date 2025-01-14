import React, { useEffect, useState } from 'react';
import { Paper } from '../../types/transferpaper';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useApi from './api';

const FileList: React.FC = () => {
  const { auth } = useAuth();
  const [files, setFiles] = useState<Paper[]>([]);
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
      setErrorMessage('Error fetching files: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      await downloadFile(id, moderatorId);
      setSuccessMessage('File downloaded successfully.');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Error downloading file.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteFile(id);
      setSuccessMessage(response?.message || 'File deleted successfully.');
      fetchFiles();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Error deleting file.');
    }
  };

  return (
    <div className="mb-6">
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
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">File Name</th>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">Creator</th>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">Moderator</th>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">Date Uploaded</th>
              <th className="py-3 px-6 text-sm font-medium text-black dark:text-white">Actions</th>
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
                  <td className="py-4 px-6">{file.creator.firstName}</td>
                  <td className="py-4 px-6">{file.moderator.firstName}</td>
                  <td className="py-4 px-6">
                    {file.sharedAt &&
                      new Date(file.sharedAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
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
