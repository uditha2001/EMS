import React, { useState, ChangeEvent, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faDownload,
  faTable,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import useResultsApi from '../../api/ResultsApi';
import useExamTimeTableApi from '../../api/examTimeTableApi';


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
type examinationName = {
  key: number;
  name: string;
};
type recorrectionData = {
  studentNumber: string;
  oldMarks: number;
  newMarks: number;
  newGrade: string;
  reason: string;
};

const RecorrectionUpload: React.FC = () => {
  const [data, setData] = useState<recorrectionData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [showTable, setShowTable] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [examOptionIdentifier, setExamOptionIdentifier] = useState<string>('');
  const [examName, setExamName] = useState<string | null>('');
  const { getCourses } = useExamTimeTableApi();
  const [createdExamNames, setCreatedExamNames] = useState<examinationName[]>(
    [],
  );
  const [recorrectionResults, setRecorrectionResults] = useState<recorrectionData[]>([]);
  const [selectedExaminationKey, setSelectedExaminationKey] =
    useState<number | undefined>();

  const [examinationCourseCode, setExaminationCourseCode] = useState<
    courseData[]
  >([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const { getAllPublishedExams, uploadRecorrectionResults } = useResultsApi();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getAllPublishedExams();
        if (response.data.code === 200) {
          const exams: examinationName[] = response.data.data.map((exam: any) => {
            const key = exam.id;
            return {
              key,
              name: `${exam.year}-${exam.degreeProgramName}-Level ${exam.level}-Semester ${exam.semester}`,
            };
          });

          setCreatedExamNames(exams);
        }
      } catch (error) {
        setErrorMessage('Failed to fetch exams');
        setSuccessMessage('');
        console.error('Failed to fetch exams:', error);
      }
    };

    fetchExams();
  }, []);
  useEffect(() => {
    const fetchCourses = async () => {
      setExaminationCourseCode([]);
      if (selectedExaminationKey !== undefined) {
        try {
          const data = await getCourses(selectedExaminationKey);
          // Remove duplicates based on course code
          const uniqueCourses = data.data.filter(
            (course: any, index: number, self: any[]) =>
              index === self.findIndex((c) => c.code === course.code)
          );

          setExaminationCourseCode(uniqueCourses);
        } catch (error) {
          setErrorMessage('Failed to fetch courses');
          console.error('Error fetching courses:', error);
        }
      }
    };

    fetchCourses();
  }, [selectedExaminationKey]);
  useEffect(() => {
    if (isSubmit && recorrectionResults.length > 0 && courseCode && selectedExaminationKey) {
      const uploadResults = async () => {
        try {
          const response = await uploadRecorrectionResults(
            recorrectionResults,
            courseCode,
            selectedExaminationKey
          );
          console.log('Upload response:', response);
          if (response.data.code === 200) {
            setSuccessMessage('Re-correction results uploaded successfully!');
            setErrorMessage('');
            setShowTable(false);
            setData([]);
            setFile(null);
            
          } else {
            setErrorMessage('Failed to upload re-correction results. Please try again.');
          }
        } catch (error) {
          setErrorMessage('An error occurred while uploading re-correction results.');
          console.error('Upload error:', error);
        } finally {
          setIsSubmit(false);
        }
      };

      uploadResults();
    }
  }, [isSubmit, recorrectionResults, courseCode, selectedExaminationKey]);

  const handleFileChanges = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };
  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        if (typeof binaryStr === 'string') {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const parsedData = XLSX.utils.sheet_to_json<any>(sheet);

          // Validate the header keys
          const requiredHeaders = ["studentNumber", "oldMarks", "newMarks", "newGrade", "reason"];
          const actualHeaders = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

          const isValidFormat = requiredHeaders.every(header => actualHeaders.includes(header));

          if (!isValidFormat) {
            setErrorMessage('Please select the correct file format with required headers: studentNumber, oldMarks, newMarks, newGrade, reason');
            setShowTable(false);
            return;
          }

          setData(parsedData);
          if (examOptionIdentifier !== '' && courseCode !== '') {
            setShowTable(true);
            setErrorMessage('');
          } else {
            setErrorMessage('Please select exam name and course code');
          }
        }
      };
      reader.readAsBinaryString(file);
    } else if (jsonInput) {
      try {
        const parsedData = JSON.parse(jsonInput);
        setData(Array.isArray(parsedData) ? parsedData : [parsedData]);
        setShowTable(true);
      } catch (error) {
        setErrorMessage('Invalid JSON format');
      }
    }
  };


  const handleDownloadExcel = () => {
    const csvContent = 'studentNumber,oldMarks,newMarks,newGrade,reason\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorrection_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = async () => {
    setIsSubmit(true);
    if (data !== null) {
      setRecorrectionResults(
        data.map((row) => ({
          studentNumber: row.studentNumber,
          oldMarks: row.oldMarks as number,
          newMarks: row.newMarks as number,
          newGrade: row.newGrade as string,
          reason: row.reason as string,
        }))
      );
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Re-correction Upload" />
      <div className="flex flex-col items-center justify-start">
        <div>
          <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
          <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />

          {!showTable ? (
            <div>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto mb-6 pb-4">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-primary" />
                    Re-correction Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pt-6">
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
                      <option value="" disabled>
                        -- Select the courseCode --
                      </option>
                      {examinationCourseCode &&
                        examinationCourseCode.map((course, index) => (
                          <option key={index} value={course.code}>
                            {course.code}
                          </option>
                        ))}{' '}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto mb-6">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    <FontAwesomeIcon icon={faUpload} className="mr-2 text-primary" />
                    Upload Re-corrections
                  </h3>
                </div>

                <div className="space-y-4 p-6">
                  <button
                    onClick={handleDownloadExcel}
                    className="ml-2 px-3 py-1 bg-white border border-blue-200 rounded text-primary hover:bg-blue-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download Template
                  </button>
                  <p className="text-sm bg-blue-100 text-gray-800 border border-blue-300 rounded-md p-4 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 leading-relaxed">
                    Please use the <strong>downloaded template</strong> for uploading re-corrections.<br />
                    Ensure all required fields are filled properly before submission.
                  </p>

                  <div className="mb-4">
                    <input
                      type="file"
                      accept=".csv, .xls, .xlsx"
                      onChange={handleFileChanges}
                      className="input-field"
                    />
                  </div>


                  <div className="flex justify-center">
                    <button onClick={() => {
                      handleFileUpload();
                      setSuccessMessage('');
                      setErrorMessage('')

                    }} className="btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  <FontAwesomeIcon icon={faTable} className="mr-2 text-primary" />
                  Data Preview
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Total Records: <span className="font-semibold text-black dark:text-white">{data.length}</span>
                </p>
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

                  </div>

                  <table className="min-w-full border-collapse table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        {data[0] && Object.keys(data[0]).map((key) => (
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
                      {data.map((row, rowIndex) => (
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
                <div className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Uploading... {progress}%
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 w-full justify-end p-6">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 transition w-full md:w-auto"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Confirm & Upload
                </button>
                <button
                  onClick={() => setShowCancelConfirmation(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2 hover:bg-red-700 transition w-full md:w-auto"
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {showCancelConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to cancel?"
            onConfirm={() => {
              setShowTable(false);
              setShowCancelConfirmation(false);
              setFile(null);
              setData([]);
            }}
            onCancel={() => setShowCancelConfirmation(false)}
          />
        )}
        {showConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to upload?"
            onConfirm={() => {
              setShowConfirmation(false);
              handleSubmit();
            }}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RecorrectionUpload;