import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import * as XLSX from 'xlsx'; // Importing XLSX library

const CreateBulkUsers: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [bulkUsers, setBulkUsers] = useState<string>(''); // Users data in JSON format
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [, setUploadType] = useState<'json' | 'excel'>('json'); // Track upload type

  // Handle file selection and process Excel or JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/json') {
        // If file is JSON, read as text
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setBulkUsers(event.target.result.toString());
          }
        };
        reader.readAsText(file);
        setUploadType('json');
      } else if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        // If file is Excel
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const data = new Uint8Array(event.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            // Process the roles field in each row (parse into an array or empty array if not present)
            const processedData = jsonData.map((user: any) => ({
              ...user,
              roles: user.roles ? JSON.parse(user.roles) : [], // Default to empty array if roles are empty or invalid
            }));
            setBulkUsers(JSON.stringify(processedData)); // Convert to JSON format
            setUploadType('excel');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrorMessage('Please upload a valid JSON or Excel file.');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);
      setProgress(0);
      setSuccessCount(0);
      setErrorCount(0);
      setErrorMessage('');
      setSuccessMessage('');

      const usersArray = JSON.parse(bulkUsers);
      if (!Array.isArray(usersArray)) {
        setErrorMessage('Invalid file format. Ensure it is a JSON array.');
        return;
      }

      const totalUsers = usersArray.length;
      const errorMessages: string[] = []; // To collect all error messages

      for (let i = 0; i < totalUsers; i++) {
        try {
          // Sending users in bulk, one by one
          await axiosPrivate.post('/user/addBulkUsers', [usersArray[i]]);
          setSuccessCount((prev) => prev + 1);
        } catch (error: any) {
          setErrorCount((prev) => prev + 1);

          // Capture specific error message if available
          const errorResponse =
            error.response?.data?.message || `Error adding user ${i + 1}`;
          errorMessages.push(errorResponse);
        }
        setProgress(Math.round(((i + 1) / totalUsers) * 100)); // Update progress
      }

      if (errorMessages.length > 0) {
        setErrorMessage(
          `Failed to upload some users:\n${errorMessages.join('\n')}`,
        );
      } else {
        setSuccessMessage('Bulk users upload completed successfully!');
      }

      setBulkUsers('');
    } catch (error) {
      setErrorMessage(
        'Failed to create bulk users. Please check the file format and try again.',
      );
      console.error('Error during bulk creation:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Function to download Excel template
  const downloadExcelTemplate = () => {
    const templateData = [
      {
        username: 'example.username',
        email: 'example@example.com',
        firstName: 'First Name',
        lastName: 'Last Name',
        password: 'password123',
        roles: '["PAPER_CREATOR"]', // Example roles as a string (to be parsed into array in the backend)
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'User_Bulk_Upload_Template.xlsx');
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Bulk User Creation" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Create Bulk Users
          </h3>
        </div>
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {/* Instructions for the user */}
          <p className="mt-2 text-sm text-black dark:text-white">
            To upload bulk users, you can either upload a valid{' '}
            <strong>JSON</strong> or <strong>Excel</strong> file. Each file
            should contain a list of users with the following fields:
          </p>
          <ul className="ml-5 mt-2 text-sm text-black dark:text-white">
            <li>username: Unique username</li>
            <li>email: Valid email address</li>
            <li>firstName: First name of the user</li>
            <li>lastName: Last name of the user</li>
            <li>password: Password for the user</li>
            <li>
              roles: A JSON array of roles (e.g., ["PAPER_CREATOR",
              "FIRST_MAKER"]) - can be empty
            </li>
          </ul>
          <span className="mt-3 inline-block text-sm text-black dark:text-white">
            If you're unsure about the format, you can download the Excel
            template below:
          </span>
          <button
            type="button"
            onClick={downloadExcelTemplate}
            className="text-primary hover:underline"
          >
            Download Excel Template
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <SuccessMessage
              message={successMessage}
              onClose={() => setSuccessMessage('')}
            />
            <ErrorMessage
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Upload JSON or Excel File
              </label>
              <input
                type="file"
                accept=".json, .xlsx"
                onChange={handleFileChange}
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                OR Paste JSON Here
              </label>
              <textarea
                placeholder="Paste JSON array of users here..."
                value={bulkUsers}
                onChange={(e) => setBulkUsers(e.target.value)}
                rows={6}
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              ></textarea>
            </div>

            {isUploading && (
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Upload Progress
                </label>
                <div className="w-full bg-gray rounded h-4 dark:bg-form-strokedark">
                  <div
                    className="bg-primary h-4 rounded"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-black dark:text-white">
                  {progress}% complete
                </p>
                <p className="mt-2 text-sm text-black dark:text-white">
                  Success: {successCount}, Errors: {errorCount}
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
              >
                {isUploading ? 'Uploading...' : 'Create Bulk Users'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBulkUsers;
