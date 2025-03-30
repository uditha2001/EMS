import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useResultsApi from "../../api/ResultsApi";
import PasswordConfirm from "../../components/PasswordConfirm";
import UserApi from "../../api/UserApi";
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
type ExamType = Record<string, number>;
type GradeDetails = {
  studentName: string;
  studentNumber: string;
  examTypesName: ExamType;
  totalMarks: number;
  grade: string;
};

const ResultGrading = () => {
  const location = useLocation();
  const { confirmUser } = UserApi()
  const queryParams = new URLSearchParams(location.search);
  const examinationId = queryParams.get("examinationId");
  const courseCode = queryParams.get("courseCode");
  const examName = queryParams.get("examName");
  const { getGradingResults } = useResultsApi();
  const navigate = useNavigate();
  const [grades, setGrades] = useState<GradeDetails[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  useEffect(() => {
    if (examinationId && courseCode) {
      getGradingResults(courseCode, examinationId)
        .then((response) => {
          if (response.code === 200) {
            setGrades(response.data);
          } else if (response.code === 404) {
            setErrorMessage("Results not found");
            setGrades([]);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setErrorMessage("An error occurred while fetching data.");
          setGrades([]);
        });
    }
  }, []);

  useEffect(() => {
    if (grades.length > 0) {
      setExamTypes(Object.keys(grades[0]?.examTypesName || {}));
    }
  }, [grades]);


  const handleBack = () => {
    navigate(-1);
  }
  const handlePublish = () => {
    setShowPasswordConfirm(true);
  }
  const handleConfirm = async (enteredPassword: string) => {
    try {
      const response = await confirmUser(enteredPassword);
      if (response?.data?.code === 200) {
        
        setSuccessMessage("Results published successfully");
        setErrorMessage('');
      }
      else if (response?.error) {
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

        {/* Buttons Container - Changed to horizontal alignment */}
        <div className="flex flex-row gap-3 w-full md:w-auto">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all 
                        transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg
                        flex items-center justify-center gap-2 whitespace-nowrap"
            onClick={handlePublish}         >
            Publish
          </button>
          <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all
                        transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg
                        flex items-center justify-center gap-2 whitespace-nowrap"

            onClick={handleBack}         >
            Back
          </button>
        </div>
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
                  <td key={examType} className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400
                              whitespace-nowrap border-r border-gray-200 dark:border-gray-600">
                    {data.examTypesName[examType] || (
                      <span className="text-red dark:text-red">failed</span>
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
