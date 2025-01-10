import React, { useState } from 'react';
import FileInput from './FileInput';
import UploadedPapersTable from './UploadedPapersTable';
import PdfViewer from './PdfViewer';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export default function TransferPaper() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [uploadedPapers, setUploadedPapers] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const axiosPrivate = useAxiosPrivate();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileUrl(URL.createObjectURL(selectedFile)); // Generate file URL for PDF rendering
        setMessage('');
      } else {
        setMessage('Please upload a valid PDF file.');
      }
    }
  };

  // Handle file upload to backend
  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadApiEndpoint = '/upload'; // Adjust the endpoint as needed

      // Use axiosPrivate for the upload request
      const response = await axiosPrivate.post(uploadApiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const uploadedFileUrl = URL.createObjectURL(file); // Replace with actual URL from your backend
        const newUploadedPaper = { name: file.name, url: uploadedFileUrl };
        setUploadedPapers([...uploadedPapers, newUploadedPaper]);
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Failed to upload file. Please try again.');
      }
    } catch (error) {
      setMessage('Error during file upload.');
    }
  };

  return (
    <div className="mx-auto max-w-270 p-6 font-sans">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Upload and View Exam Paper
      </h2>

      <FileInput
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
      />

      {message && (
        <p
          className={`font-semibold text-center ${
            message.includes('Error') || message.includes('Failed')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}

      {/* Always display the uploaded papers table */}
      <UploadedPapersTable uploadedPapers={uploadedPapers} />

      {/* Display PDF viewer if fileUrl is set */}
      {fileUrl && <PdfViewer fileUrl={fileUrl} />}
    </div>
  );
}
