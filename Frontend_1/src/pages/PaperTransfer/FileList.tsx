import React, { useEffect, useState } from 'react';
import { Paper } from '../../types/transferpaper';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useApi from './api';
import { Link } from 'react-router-dom'; // Import Link for routing

const FileList: React.FC = () => {
  const { auth } = useAuth();
  const [files, setFiles] = useState<Paper[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [viewType, setViewType] = useState<'sender' | 'receiver'>('sender'); // Sender or Receiver view toggle
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
      setErrorMessage(
        'Error fetching files: ' + (error.message || 'Unknown error'),
      );
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

  const filteredFiles =
    viewType === 'sender'
      ? files.filter((file) => file.creator.id === moderatorId)
      : files.filter((file) => file.moderator.id === moderatorId);

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

      <div className="mb-4 flex justify-between">
        <div>
          {/* <h2 className="text-lg font-semibold text-black dark:text-white">
            {viewType === 'sender' ? 'Sent Files' : 'Received Files'}
          </h2> */}
          <Link
            to="/paper/transfer/new"
            className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80"
          >
            New Transaction
          </Link>
        </div>
        <div>
          <button
            className={`mr-2 px-4 py-2 ${
              viewType === 'sender' ? 'bg-primary text-white' : 'bg-gray-200'
            } rounded`}
            onClick={() => setViewType('sender')}
          >
            Sent
          </button>
          <button
            className={`px-4 py-2 ${
              viewType === 'receiver' ? 'bg-primary text-white' : 'bg-gray-200'
            } rounded`}
            onClick={() => setViewType('receiver')}
          >
            Received
          </button>
        </div>
      </div>

      {filteredFiles.length > 0 ? (
        <div className="overflow-x-auto my-8">
          <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
            <thead>
              <tr className="bg-gray-100 dark:bg-form-input">
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  File Name
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  {viewType === 'sender' ? 'Receiver' : 'Sender'}
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Date Uploaded
                </th>
                <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {file.fileName}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {viewType === 'sender'
                      ? file.moderator.firstName
                      : file.creator.firstName}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {file.createdAt &&
                      new Date(file.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    <button
                      type="button"
                      className="text-primary hover:text-opacity-80"
                      onClick={() => handleDownload(file.id)}
                    >
                      Download
                    </button>
                    {viewType === 'sender' && (
                      <>
                        <button
                          type="button"
                          className="ml-4 text-red-600 hover:text-opacity-80"
                          onClick={() => handleDelete(file.id)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/paper/create/structure/${file.id}`}
                          className="ml-4 text-green-600 hover:text-opacity-80"
                        >
                          Set Structure
                        </Link>
                      </>
                    )}
                    {viewType === 'receiver' && (
                      <Link
                        to={`/paper/moderate/${file.id}/${moderatorId}`}
                        className="ml-4 text-green-600 hover:text-opacity-80"
                      >
                        Modarate
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No files found for {viewType === 'sender' ? 'Sender' : 'Receiver'}.
        </div>
      )}
    </div>
  );
};

export default FileList;
