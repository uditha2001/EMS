import { ChangeEvent, useEffect, useState } from "react";
import * as XLSX from "xlsx";

type UploadStatus = "idle" | "uploading" | "success" | "error" | "extracting Data";
type RowData = {
  [key: string]: any;
};

const ResultsUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [data, setData] = useState<RowData[]>([]);
  const [jsonInput, setJsonInput] = useState<string>("");

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleFileChanges = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) {
          console.error("Error: File reading failed.");
          return;
        }
        const binaryData = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(binaryData, { type: "array" });

        // Extract first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Results</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload a valid JSON or Excel file containing the required fields.
        </p>

        <div className="mb-4">
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileChanges}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2"
          />
        </div>

        <div className="mb-4">
          <textarea
            placeholder="Paste JSON array of results here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 resize-none h-32 focus:outline-none"
          />
        </div>

        <button
          onClick={handleFileUpload}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition"
        >
          Upload Results
        </button>
      </div>

      {data.length > 0 && (
        <div className="mt-6 w-full max-w-4xl overflow-auto bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Extracted Data</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100">
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 px-4 py-2">
                      {value as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsUpload;
