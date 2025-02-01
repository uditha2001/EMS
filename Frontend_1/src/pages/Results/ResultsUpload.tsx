import { ChangeEvent, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import useApi from "../../api/api";

type UploadStatus = "idle" | "uploading" | "success" | "error" | "extracting Data";
type RowData = {
    [key: string]: any;
};

const ResultsUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [data, setData] = useState<RowData[]>([]);
    const [jsonInput, setJsonInput] = useState<string>("");
    const [createdExamNames, setCreatedExamNames] = useState<string[]>([]);
    const [examName, setExamName] = useState<string>("");
    const [courseCode, setCourseCode] = useState<string>("");
    const [examType, setExamType] = useState<string>("");
    const { getAllExaminationDetailsWithDegreeName } = useApi();


    useEffect(() => {
        getAllExaminationDetailsWithDegreeName().then((response) => {
            let name = [];
            let i = 0;
            for (const obj of response) {
                name[i] = obj["year"] + "-" + obj["degreeProgramName"] + "-" + "Level " + obj['level'] + "-Semester " + obj['semester'];
                i++;
            }
            setCreatedExamNames(name);

        });
    }, []);


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

    const handleDownloadExcel = () => {
        const csvContent =
            "studentNumber,studentName,firstMarking\n" +
            "SC/2021/12345,John Doe,85\n";
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "results_template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            {/* Main Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Result Upload
                </h1>
                <p className="text-gray-600">Upload and manage examination results</p>
            </div>

            {/* Configuration Card */}
            <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-100 p-2 rounded-lg mr-2">⚙️</span>
                    Exam Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Exam Name</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                        >
                            {
                                createdExamNames &&
                                createdExamNames.map((exam, index) => (
                                    <option key={index} value={exam}>
                                        {exam}
                                    </option>
                                )

                                )
                            }
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Course Code</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                        >

                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Exam Type</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >

                        </select>
                    </div>
                </div>
            </div>

            {/* Upload Card */}
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-2">📁</span>
                    Upload Results
                </h3>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl mb-4">
                        <p className="text-sm text-gray-600">
                            Download the template file:
                            <button
                                onClick={handleDownloadExcel}
                                className="ml-2 px-3 py-1 bg-white border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                📥 Download Template
                            </button>
                        </p>
                    </div>

                    <div className="mb-4">
                        <input
                            type="file"
                            accept=".csv, .xls, .xlsx"
                            onChange={handleFileChanges}
                            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
                        </div>
                    </div>

                    <textarea
                        placeholder="📋 Paste JSON data here..."
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl text-sm text-gray-700 resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />

                    <button
                        onClick={handleFileUpload}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity"
                    >
                        Upload Results
                    </button>
                </div>
            </div>

            {/* Data Preview Section */}
            {
                data.length > 0 && (
                    <div className="mt-8 w-full max-w-4xl bg-white p-6 shadow-xl rounded-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="bg-green-100 p-2 rounded-lg mr-2">🔍</span>
                            Data Preview
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        {Object.keys(data[0]).map((key) => (
                                            <th
                                                key={key}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200"
                                            >
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((row: any, rowIndex: any) => (
                                        <tr key={rowIndex} className="hover:bg-gray-50">
                                            {Object.values(row).map((value, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200"
                                                >
                                                    {value as string}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ResultsUpload;