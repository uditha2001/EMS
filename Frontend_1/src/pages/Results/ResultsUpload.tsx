import { ChangeEvent, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import useApi from "../../api/api";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage";

type RowData = {
    [key: string]: any;
};
type examinationName = {
    key: number;
    name: string;
}
type courseData = {
    id: number,
    code: string,
    name: string,
    description: string,
    level: string,
    semester: string,
    isActive: boolean,
    courseType: string,
    degreeProgramId: string,
};

const ResultsUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [studentsData, setStudentsData] = useState<RowData[]>([]);
    const [totalData, setTotalData] = useState({});
    const [jsonInput, setJsonInput] = useState<string>("");
    const [createdExamNames, setCreatedExamNames] = useState<examinationName[]>([]);
    const [examName, setExamName] = useState<string>("");
    const [courseCode, setCourseCode] = useState<string>("");
    const [examType, setExamType] = useState<string>("THEORY");
    const { getAllExaminationDetailsWithDegreeName, getCoursesUsingExaminationId, saveFirstMarkingResults } = useApi();
    const [selectedExaminationKey, setSelectedExaminationKey] = useState<number>();
    const [examinationCourseCode, setExaminationCourseCode] = useState<courseData[]>([]);
    const [examOptionIdentifier, setExamOptionIdentifier] = useState<string>("");
    const [showTable, setShowTable] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false); // State for custom confirmation modal
    const [allowToSend, setAllowToSend] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const examTypes = ['THEORY', 'PRACTICAL', 'CA', 'PROJECT'];
    useEffect(() => {
        getAllExaminationDetailsWithDegreeName().then((response) => {
            let examData: examinationName[] = [];
            let i = 0;
            for (const obj of response) {
                let examName = `${obj["year"]}-${obj["degreeName"]}-Level ${obj["level"]}-Semester ${obj["semester"]}`;
                examData.push(({ key: obj["id"], name: examName }));
                i++;
            }
            setCreatedExamNames(examData);

        });



    }, []);

    useEffect(() => {
        if (examName != "" && examName != null) {
            getCoursesUsingExaminationId(selectedExaminationKey).then((data) => {
                setExaminationCourseCode(data);
            })
        }

    }, [examName])

    useEffect(() => {
        if (examinationCourseCode != null && examOptionIdentifier != "" && examinationCourseCode[0] != undefined) {
            setCourseCode(examinationCourseCode[0].code);
        }

    }, [examinationCourseCode])


    useEffect(() => {
        console.log(totalData);
        if (allowToSend) {
            saveFirstMarkingResults(totalData, {
                onUploadProgress: (progressEvent: any) => {
                    if (progressEvent.total != undefined) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                }
            }).then((data) => {

                console.log(data.code);

                if (data.code === 201) {
                    setAllowToSend(false);
                    setShowTable(false)
                    setSuccessMessage("result upload successfull")

                }
                else if (data.status === 500) {
                    setAllowToSend(false);
                    setShowTable(false)
                    setErrorMessage("result upload failed!")
                }

            })
        }

    }, [totalData])

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

                const jsonData: RowData[] = XLSX.utils.sheet_to_json(sheet);
                setStudentsData(jsonData);
                setSuccessMessage("");
                setErrorMessage("");
                setShowProgressBar(false);
                if (studentsData.length > 0 && courseCode && examName) {
                    setShowTable(true);
                }
            };

            reader.readAsArrayBuffer(file);
        }
        else {
            if (jsonInput !== "") {
                try {
                    const parsedData = JSON.parse(jsonInput);
                    const jsonData2: RowData[] = Array.isArray(parsedData) ? parsedData : [parsedData];
                    setStudentsData(jsonData2);
                    setSuccessMessage("");
                    setErrorMessage("");
                    setShowProgressBar(false);

                    if (jsonData2.length > 0 && courseCode && examName) {
                        setShowTable(true);
                    }

                } catch (error) {
                    setErrorMessage("invailid Jason Format");
                    setShowProgressBar(false);
                }
            }
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



    const sendDataToTheServer = () => {
        setTotalData(
            {
                studentsData,
                courseCode,
                examName,
                examType
            }
        )
        setShowProgressBar(true);
        setAllowToSend(true);
    }

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
            <div>
            <div className="self-start text-center mb-4 dark:bg-black">
                <h1 className="text-4xl font-bold text-gray-800 mb-1 dark:text-gray-200">
                    First Marking Results Upload
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Upload and manage examination results</p>
            </div>

            <SuccessMessage
                message={successMessage}
                onClose={() => setSuccessMessage('')}
            />
            <ErrorMessage
                message={errorMessage}
                onClose={() => setErrorMessage('')}
            />

            {
                !showTable ?
                    (<div>
                        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 w-full max-w-6xl dark:bg-gray-800 dark:shadow-gray-700/20">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-300">
                                <span className="bg-blue-100 p-2 rounded-lg mr-2 dark:bg-blue-900/30">⚙️</span>
                                Exam Configuration
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Exam Name</label>
                                    <select
                                        value={examOptionIdentifier}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black-2 dark:focus:ring-blue-500/50"
                                        onChange={(e) => {
                                            setExamOptionIdentifier(e.target.value);
                                            const selectedIndex = parseInt(e.target.value, 10);
                                            setExamName(createdExamNames[selectedIndex].name);
                                            setSelectedExaminationKey(createdExamNames[selectedIndex].key);
                                        }}
                                    >
                                        <option value="" disabled>
                                            -- Select the exam Name --
                                        </option>
                                        {createdExamNames &&
                                            createdExamNames.map((examName1, index) => (
                                                <option key={index} value={index}>
                                                    {examName1.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Course Code</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black-2 dark:focus:ring-blue-500/50"
                                        value={courseCode}
                                        onChange={(e) => setCourseCode(e.target.value)}
                                    >
                                        {examinationCourseCode &&
                                            examinationCourseCode.map((course, index) => (
                                                <option key={index} value={course.code}>
                                                    {course.code}
                                                </option>
                                            ))}                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Exam Type</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black-2 dark:focus:ring-blue-500/50"
                                        value={examType}
                                        onChange={(e) => setExamType(e.target.value)}
                                    >
                                        {
                                            examTypes.map((type, index) => (
                                                <option key={index} value={type}>
                                                    {type}
                                                </option>
                                            ))
                                        }                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-6xl dark:bg-gray-800 dark:shadow-gray-700/20">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-300">
                                <span className="bg-purple-100 p-2 rounded-lg mr-2 dark:bg-purple-900/30">📁</span>
                                Upload Results
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-xl mb-4 dark:bg-blue-900/20">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Download the template file:
                                        <button
                                            onClick={handleDownloadExcel}
                                            className="ml-2 px-3 py-1 bg-white border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-600"
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
                                        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:file:bg-gray-600 dark:file:text-gray-200"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-2 bg-white text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">OR</span>
                                    </div>
                                </div>

                                <textarea
                                    placeholder="📋 Paste JSON data here..."
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-xl text-sm text-gray-700 resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-blue-500/50"
                                />

                                <button
                                    onClick={handleFileUpload}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity dark:from-blue-600 dark:to-purple-700"
                                >
                                    submit
                                </button>
                            </div>
                        </div>
                    </div>
                    ) : (

                        studentsData.length > 0 && examName && courseCode && (
                            <div className="mt-8 w-full max-w-6xl bg-white p-6 shadow-xl rounded-2xl dark:bg-gray-800 dark:shadow-gray-700/20">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-300">
                                    <span className="bg-green-100 p-2 rounded-lg mr-2 dark:bg-green-900/30">🔍</span>
                                    Data Preview
                                </h3>
                                <div className="overflow-x-auto">
                                    <div className="mb-6">
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            <div className="bg-blue-50 px-4 py-2 rounded-lg dark:bg-blue-900/20">
                                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Examination:</span>
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{examName || "N/A"}</span>
                                            </div>
                                            <div className="bg-purple-50 px-4 py-2 rounded-lg dark:bg-purple-900/20">
                                                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Course Code:</span>
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{courseCode || "N/A"}</span>
                                            </div>
                                            <div className="bg-green-50 px-4 py-2 rounded-lg dark:bg-green-900/20">
                                                <span className="text-xs font-medium text-green-600 dark:text-green-400">Exam Type:</span>
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">THEORY</span>
                                            </div>
                                        </div>

                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-gray-700">
                                                    {Object.keys(studentsData[0]).map((key) => (
                                                        <th
                                                            key={key}
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 dark:text-gray-400"
                                                        >
                                                            {key}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {studentsData.map((row: any, rowIndex: any) => (
                                                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        {Object.values(row).map((value, colIndex) => (
                                                            <td
                                                                key={colIndex}
                                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200 dark:border-gray-600 dark:text-gray-300"
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
                                {showProgressBar &&
                                    <div>
                                        <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
                                            <div
                                                style={{
                                                    width: `${progress}%`,
                                                    backgroundColor: '#76c7c0',
                                                    height: '10px',
                                                    borderRadius: '5px',
                                                }}
                                            ></div>
                                        </div>
                                        <div>Upload Progress: {progress}%</div>
                                    </div>

                                }

                                <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
                                    <button
                                        onClick={sendDataToTheServer}
                                        className="w-4/5 md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity dark:from-blue-600 dark:to-purple-700"
                                    >
                                        Confirm And Upload
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowConfirmation(true);
                                        }}
                                        className="w-4/5 md:w-1/2 bg-gradient-to-r from-rose-500 to-orange-400 text-white py-2 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity border border-transparent hover:border-white dark:from-rose-600 dark:to-orange-500"
                                    >
                                        Resubmit
                                    </button>
                                </div>
                            </div>
                        )
                    )
            }
        </div >
    {
        showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-black/70">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80 dark:bg-gray-800">
                    <h2 className="text-lg font-bold text-black mb-4 dark:text-gray-200">
                        Cancel Result Upload
                    </h2>
                    <p className="text-sm text-gray-700 mb-6 dark:text-gray-400">
                        Are you sure you want to cancel?
                    </p>
                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                setShowTable(false);
                                setShowConfirmation(false);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => {
                                setShowConfirmation(false);
                                setStudentsData([]);
                            }}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }
        </div >
    );
};

export default ResultsUpload;