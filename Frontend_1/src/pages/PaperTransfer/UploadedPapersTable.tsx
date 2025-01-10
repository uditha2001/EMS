import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import React from 'react';
import DOMPurify from 'dompurify';

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
    const sanitizedUrl = DOMPurify.sanitize(url);
    if (sanitizedUrl.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = sanitizedUrl;
      a.download = fileName;
      a.click();
    } else {
      console.error('Invalid URL');
    }
  };

  return (
    <div className="mx-auto max-w-270 mt-8">
      {uploadedPapers.length > 0 && (
        <>
          <h3 className="font-medium text-black dark:text-white mb-6">
            Uploaded Papers:
          </h3>
          <div className="overflow-x-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
            <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
              <thead>
                <tr className="bg-gray-100 dark:bg-form-input">
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    File Name
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Preview
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {uploadedPapers.map((paper, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {paper.name}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <div className="w-32 h-20">
                        <Worker
                          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                        >
                          <Viewer fileUrl={paper.url} />
                        </Worker>
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <button
                        onClick={() => handleDownload(paper.url, paper.name)}
                        className="text-primary hover:underline"
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
