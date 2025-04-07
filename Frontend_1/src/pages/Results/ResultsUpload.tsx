import { ChangeEvent, useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import useApi from '../../api/api';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faDownload,
  faTable,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import useResultsApi from '../../api/ResultsApi';
import useExaminationApi from '../../api/examinationApi';

type RowData = {
  [key: string]: any;
};
type examinationName = {
  key: number;
  name: string;
};
type courseData = {
  id: number;
  code: string;
  name: string;
  description: string;
  level: string;
  semester: string;
  isActive: boolean;
  courseType: string;
  degreeProgramId: string;
};
type examTypeData = {
  name: string;
};

const ResultsUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [studentsData, setStudentsData] = useState<RowData[]>([]);
  const [totalData, setTotalData] = useState({});
  const [jsonInput, setJsonInput] = useState<string>('');
  const [createdExamNames, setCreatedExamNames] = useState<examinationName[]>(
    [],
  );
  const isFirstRender = useRef(true);
  const [examName, setExamName] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [examType, setExamType] = useState<string>('');
  const {
    getFirstMarkerCoursesUsingExaminationId,
    firstMarkerExamTypes
  } = useApi();
  const { getFirstMarkerAssignedExaminations} = useExaminationApi();
  const {saveMarkingResults}=useResultsApi();

  const [selectedExaminationKey, setSelectedExaminationKey] =
    useState<number>();
  const [examinationCourseCode, setExaminationCourseCode] = useState<
    courseData[]
  >([]);
  const [examOptionIdentifier, setExamOptionIdentifier] = useState<string>('');
  const [showTable, setShowTable] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for custom confirmation modal
  const [allowToSend, setAllowToSend] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [examTypes, setExamTypes] = useState<examTypeData[]>([]);
  useEffect(() => {
    getFirstMarkerAssignedExaminations().then((response) => {
      let examData: examinationName[] = [];
      let i = 0;
      for (const obj of response) {
        let examName = `${obj['year']}-${obj['degreeProgramName']}-Level ${obj['level']}-Semester ${obj['semester']}`;
        examData.push({ key: obj['id'], name: examName });
        i++;
      }
      setCreatedExamNames(examData);
    });

   
  }, []);

 
  useEffect(() => {
    if (examName != '' && examName != null) {
      getFirstMarkerCoursesUsingExaminationId(selectedExaminationKey).then((data) => {
        setExaminationCourseCode(data);
      });
    }
  }, [examName]);

  useEffect(() => {
    if (
      examinationCourseCode != null &&
      examOptionIdentifier != '' &&
      examinationCourseCode[0] != undefined
    ) {
      setCourseCode(examinationCourseCode[0].code);
    }
    
  }, [examinationCourseCode]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }
    firstMarkerExamTypes(courseCode,selectedExaminationKey).then((response) => {
      setExamTypes(response.data);
    });
  },[courseCode]);

  useEffect(() => {
    setExamType(examTypes[0]?.name);
},[examTypes]);


  useEffect(() => {
    if (allowToSend) {
      saveMarkingResults(totalData, {
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total != undefined) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          }
        },
      }).then((data) => {

        if (data.code === 201) {
          setAllowToSend(false);
          setShowTable(false);
          setSuccessMessage('result upload successfull');
          setFile(null);
        } else if (data.status === 500) {
          setAllowToSend(false);
          setShowTable(false);
          setErrorMessage('result upload failed!');
          setFile(null);
        }
      });
    }
  }, [totalData]);

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
          console.error('Error: File reading failed.');
          return;
        }
        const binaryData = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(binaryData, { type: 'array' });

        // Extract first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData: RowData[] = XLSX.utils.sheet_to_json(sheet);
        setStudentsData(jsonData);
        setSuccessMessage('');
        setErrorMessage('');
        setShowProgressBar(false);
        if (studentsData.length > 0 && courseCode && examName) {
          setShowTable(true);
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      if (jsonInput !== '') {
        try {
          const parsedData = JSON.parse(jsonInput);
          const jsonData2: RowData[] = Array.isArray(parsedData)
            ? parsedData
            : [parsedData];
          setStudentsData(jsonData2);
          setSuccessMessage('');
          setErrorMessage('');
          setShowProgressBar(false);

          if (jsonData2.length > 0 && courseCode && examName) {
            setShowTable(true);
          }
        } catch (error) {
          setErrorMessage('invailid Jason Format');
          setShowProgressBar(false);
        }
      }
    }
  };

  const handleDownloadExcel = () => {
    const csvContent =
      'studentNumber,studentName,firstMarking\n' +
      'SC/2021/12345,John Doe,85\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'results_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sendDataToTheServer = () => {
    setTotalData({
      id: selectedExaminationKey,
      studentsData,
      courseCode,
      examName,
      examType,
    });
    setShowProgressBar(true);
    setAllowToSend(true);
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="First Marking" />
      <div className="flex flex-col items-center justify-start ">
        <div>
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />

          {!showTable ? (
            <div>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto mb-6 pb-4">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="mr-2 text-primary"
                    />
                    Examination Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                  <div className="space-y-1">
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Exam Name
                    </label>
                    <select
                      value={examOptionIdentifier}
                      className="input-field"
                      onChange={(e) => {
                        setExamOptionIdentifier(e.target.value);
                        const selectedIndex = parseInt(e.target.value, 10);
                        setExamName(createdExamNames[selectedIndex].name);
                        setSelectedExaminationKey(
                          createdExamNames[selectedIndex].key,
                        );
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
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Course Code
                    </label>
                    <select
                      className="input-field"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                    >
                      {examinationCourseCode &&
                        examinationCourseCode.map((course, index) => (
                          <option key={index} value={course.code}>
                            {course.code}
                          </option>
                        ))}{' '}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Exam Type
                    </label>
                    <select
                      className="input-field"
                      value={examTypes[0]?.name}
                      onChange={(e) => setExamType(e.target.value)}
                    >
                      {examTypes && examTypes.map((type, index) => (
                        <option key={index}>{type.name}</option>
                      ))}{' '}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto mb-6">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="mr-2 text-primary"
                    />
                    Upload Results
                  </h3>
                </div>

                <div className="space-y-4 p-6">
                  <button
                    onClick={handleDownloadExcel}
                    className="ml-2 px-3 py-1 bg-white border border-blue-200 rounded- text-primary hover:bg-blue-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download Template
                  </button>

                  <div className="mb-4">
                    <input
                      type="file"
                      accept=".csv, .xls, .xlsx"
                      onChange={handleFileChanges}
                      className="input-field"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500 dark:bg-boxdark dark:text-gray-400">
                        OR
                      </span>
                    </div>
                  </div>

                  <textarea
                    placeholder="Paste JSON data here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="input-field"
                    rows={6}
                  />
                  <div className="flex justify-center">
                    <button onClick={handleFileUpload} className="btn-primary">
                      submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            studentsData.length > 0 &&
            examName &&
            courseCode && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    <FontAwesomeIcon
                      icon={faTable}
                      className="mr-2 text-primary"
                    />
                    Data Preview
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="mb-6 p-6">
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="bg-blue-50 px-4 py-2 rounded dark:bg-blue-900/20">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          Examination:
                        </span>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {examName || 'N/A'}
                        </span>
                      </div>
                      <div className="bg-purple-50 px-4 py-2 rounded dark:bg-purple-900/20">
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          Course Code:
                        </span>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {courseCode || 'N/A'}
                        </span>
                      </div>
                      <div className="bg-green-50 px-4 py-2 rounded dark:bg-green-900/20">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          Exam Type:
                        </span>
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {examType || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <table className="min-w-full border-collapse table-auto">
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
                          <tr
                            key={rowIndex}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
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
                {showProgressBar && (
                  <div>
                    <div
                      style={{
                        width: '100%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '5px',
                      }}
                    >
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
                )}

                <div className="flex flex-col md:flex-row gap-4 w-full  justify-end p-6 ">
                  {/* Confirm and Upload Button */}
                  <button
                    onClick={sendDataToTheServer}
                    className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 transition w-full md:w-auto"
                    aria-label="Confirm and Upload"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Confirm & Upload
                  </button>

                  {/* Cancel Button */}
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2 hover:bg-red-700 transition w-full md:w-auto"
                    aria-label="Cancel"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                    Cancel
                  </button>
                </div>
              </div>
            )
          )}
        </div>
        {showConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to cancel?"
            onConfirm={() => {
              setShowTable(false);
              setShowConfirmation(false);
              setFile(null);
            }}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsUpload;
