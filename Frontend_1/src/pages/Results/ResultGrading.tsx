import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useResultsApi from "../../api/ResultsApi";
import PasswordConfirm from "../../components/PasswordConfirm";
import UserApi from "../../api/UserApi";
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

type ExamType = Record<string, number>;
type failedStudents = Record<string, string[]>;
type GradeDetails = {
  studentName: string;
  studentNumber: string;
  examTypesName: ExamType;
  failedStudents: failedStudents;
  totalMarks: number;
  grade: string;
};

type publishedData = {
  courseCode: string;
  examinationId: number;
  grades: GradeDetails[];
};

type gradeCount = {
  [key: string]: number;
};

const ResultGrading = () => {
  const location = useLocation();
  const { confirmUser } = UserApi();
  const queryParams = new URLSearchParams(location.search);
  const examinationId = queryParams.get("examinationId");
  const courseCode = queryParams.get("courseCode");
  const examName = queryParams.get("examName");
  const { getGradingResults, saveFinalResults } = useResultsApi();
  const navigate = useNavigate();
  const [grades, setGrades] = useState<GradeDetails[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isConfirmToPublish, setIsConfirmToPublish] = useState(false);
  const [publishedData, setPublishData] = useState<publishedData>({
    courseCode: '',
    examinationId: 0,
    grades: []
  });
  const [gradeCount, setGradeCounts] = useState<gradeCount>({});

  // List of all possible grades
  const possibleGrades = [
    "A+", "A ", "A-", "B+", "B ", "B-", "C+", "C ", "C-", "D ", "D+", "E ", "ABSENT ", "MEDICAL "
  ];

  useEffect(() => {
    const fetchGradingResults = async () => {
      if (examinationId && courseCode) {
        try {
          const response = await getGradingResults(courseCode, examinationId);
          if (response.data.code === 200) {
            setGrades(response.data.data[0]);
            setGradeCounts(response.data.data[1]);
          } else if (response.data.code === 404) {
            setErrorMessage("Results not found");
            setGrades([]);
          }
        } catch (err: any) {
          if (err.response.data.code === 422) {
            setErrorMessage("Results have already been published for this course, or second marking has not been uploaded yet.");
          }
          else {
            setErrorMessage("An error occurred while fetching data.");
          }
          setGrades([]);
        }
      }
    };

    fetchGradingResults();
  }, []);

  useEffect(() => {
    if (grades.length > 0 && isConfirmToPublish) {
      saveFinalResults(publishedData)
        .then((response) => {
          if (response.data.code === 200) {
            setSuccessMessage("Results published successfully");
            setGrades([]);
            setIsConfirmToPublish(false);
          } else if (response.data.code === 404) {
            setErrorMessage("Results not found");
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setErrorMessage("An error occurred while publishing data.");
        });
    }
  }, [publishedData]);

  useEffect(() => {
    if (grades.length > 0) {
      setExamTypes(Object.keys(grades[0]?.examTypesName || {}));
    }
  }, [grades]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePublish = () => {
    setShowPasswordConfirm(true);
  };

  const handleConfirm = async (enteredPassword: string) => {
    try {
      const response = await confirmUser(enteredPassword);
      if (response?.data?.code === 200) {
        setPublishData({
          courseCode: courseCode || '',
          examinationId: Number(examinationId),
          grades: grades,
        });
        setIsConfirmToPublish(true);
      } else if (response?.error) {
        setSuccessMessage('');
        if (response.status === 500) {
          setErrorMessage("An error occurred while confirming the password.");
        } else if (response.status === 404) {
          setErrorMessage("User not found. Please check your input.");
        } else if (response.status === 400) {
          setErrorMessage("Password is incorrect.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } else if (error.request) {
        setSuccessMessage('');
        setErrorMessage("No response received from the server.");
      } else {
        setSuccessMessage('');
        setErrorMessage("An error occurred while confirming the password.");
      }
    } catch (error: any) {
      setSuccessMessage('');
      setErrorMessage("An error occurred while confirming the password.");
    }

    setShowPasswordConfirm(false);
  };

  const handleCancel = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setShowPasswordConfirm(false);
  };

  // Merge the possibleGrades with gradeCount and set missing grades to 0
  const gradeDistribution = possibleGrades.map((grade) => ({
    grade,
    count: gradeCount[grade] || 0,
  }));
  const totalCount = gradeDistribution.reduce((sum, item) => sum + item.count, 0);


  return (
    <div className="p-4 md:p-6">
      {showPasswordConfirm && (
        <PasswordConfirm
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {errorMessage && <ErrorMessage message={errorMessage} onClose={() => {
        setErrorMessage('');
      }} />}
      {successMessage && <SuccessMessage message={successMessage} onClose={() => {
        setSuccessMessage('');
      }} />}
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-lg font-semibold">
          <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            Examination: <span className="text-blue-600 dark:text-blue-400">{examName}</span>
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            Course: <span className="text-green-600 dark:text-green-400">{courseCode}</span>
          </span>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-row gap-3 w-full md:w-auto">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all 
                        transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg
                        flex items-center justify-center gap-2 whitespace-nowrap"
            onClick={handlePublish}>
            Publish
          </button>
          <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all
                        transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg
                        flex items-center justify-center gap-2 whitespace-nowrap"
            onClick={handleBack}>
            Back
          </button>
        </div>
      </div>

      {/* Grade Count Display */}
      {gradeDistribution.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Total Grade Count:{totalCount}</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {gradeDistribution.map((gradeData) => (
              <div key={gradeData.grade} className="bg-white dark:bg-gray-800 p-2 rounded-lg text-center">
                <span className="text-sm font-semibold">{gradeData.grade}:</span>
                <div className="text-lg font-bold text-blue-600">{gradeData.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* User Note Section */}
      <div className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-l-4 border-yellow-500 p-4 rounded-lg mb-6 shadow-sm">
        <p className="font-medium">
          ⚠️ Please note:
        </p>
        <ul className="list-disc list-inside text-sm mt-2">
          <li>Before publishing results, ensure that <strong>all exam types are visible</strong>.</li>
          <li>If any exam type are missing, please request the second marker to submit their evaluations first.</li>
        </ul>
      </div>


      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 
                          whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
                Student Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 
                          whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
                Student Number
              </th>
              {examTypes.map((examType) => (
                <th key={examType} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 
                            dark:text-gray-300 whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
                  {examType}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300
                          bg-blue-50 dark:bg-blue-900/30">
                Total Marks
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300
                          bg-green-50 dark:bg-green-900/30">
                Grade
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(grades) && grades.map((data, index) => (
              <tr key={index} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium 
                            whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
                  {data.studentName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 
                            whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
                  {data.studentNumber}
                </td>
                {examTypes.map((examType) => (
                  <td
                    key={examType}
                    className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-600"
                  >
                    {data.failedStudents[data.studentNumber]?.includes(examType) ? (
                      <span className="text-red-600 dark:text-red-400">FAILED</span>
                    ) : (
                      data.examTypesName[examType]
                    )}
                  </td>

                ))}

                <td className="px-4 py-3 text-center text-sm font-semibold text-blue-600 dark:text-blue-400
                            bg-blue-50/50 dark:bg-blue-900/20">
                  {data.totalMarks}
                </td>
                <td className="px-4 py-3 text-center text-sm font-semibold text-green-600 dark:text-green-400
                            bg-green-50/50 dark:bg-green-900/20">
                  {data.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!grades?.length && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-2xl mb-2">📭</div>
          No grades available yet
        </div>
      )}
    </div>
  );
};

export default ResultGrading;
