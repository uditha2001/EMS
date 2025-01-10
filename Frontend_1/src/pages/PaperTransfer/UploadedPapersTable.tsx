import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import React from 'react';

interface UploadedPaper {
  name: string;
  url: string;
}

interface UploadedPapersTableProps {
  uploadedPapers: UploadedPaper[];
}

const UploadedPapersTable: React.FC<UploadedPapersTableProps> = ({
  uploadedPapers,
}) => {
  const handleDownload = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="mx-auto max-w-270 mt-8">
      {uploadedPapers.length > 0 && (
        <>
          <h3 className="font-medium text-black dark:text-white mb-6">
            Uploaded Papers:
          </h3>
          <div className="overflow-x-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 dark:bg-form-input text-left text-sm font-semibold text-gray-600">
                  <th className="px-4 py-2">File Name</th>
                  <th className="px-4 py-2">Preview</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {uploadedPapers.map((paper, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {paper.name}
                    </td>
                    <td className="px-4 py-2">
                      <div className="w-32 h-20">
                        <Worker
                          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                        >
                          <Viewer fileUrl={paper.url} />
                        </Worker>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDownload(paper.url, paper.name)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadedPapersTable;
