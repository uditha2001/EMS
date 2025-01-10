import React from 'react';

interface FileInputProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}

const FileInput: React.FC<FileInputProps> = ({ handleFileChange, handleUpload }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div className="mb-4.5">
        {/* <label className="mb-2.5 block text-black dark:text-white">
          Upload PDF
        </label> */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>
      <div className="mb-4.5">
        <button
          onClick={handleUpload}
          className="w-full sm:w-auto rounded border bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90 focus:outline-none"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileInput;
