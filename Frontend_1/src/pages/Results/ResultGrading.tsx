import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useResultsApi from '../../api/ResultsApi';
import PasswordConfirm from '../../components/PasswordConfirm';
import UserApi from '../../api/UserApi';
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
  const examinationId = queryParams.get('examinationId');
  const courseCode = queryParams.get('courseCode');
  const examName = queryParams.get('examName');
  const { getGradingResults, saveFinalResults } = useResultsApi();
  const navigate = useNavigate();
  const [grades, setGrades] = useState<GradeDetails[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [publishedData, setPublishData] = useState<publishedData>({
    courseCode: '',
    examinationId: 0,
    grades: [],
  });
  const [gradeCount, setGradeCounts] = useState<gradeCount>({});

  // List of all possible grades
  const possibleGrades = [
    'A+',
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D',
    'E ',
    'F',
  ];

  useEffect(() => {
    if (examinationId && courseCode) {
      getGradingResults(courseCode, examinationId)
        .then((response) => {
          if (response.code === 200) {
            console.log('Grading results:', response.data);
            setGrades(response.data[0]);
            setGradeCounts(response.data[1]);
          } else if (response.code === 404) {
            setErrorMessage('Results not found');
            setGrades([]);
          }
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setErrorMessage('An error occurred while fetching data.');
          setGrades([]);
        });
    }
  }, []);

  useEffect(() => {
    if (grades.length > 0) {
      saveFinalResults(publishedData)
        .then((response) => {
          if (response.code === 200) {
            setSuccessMessage('Results published successfully');
            setGrades([]);
          } else if (response.code === 404) {
            setErrorMessage('Results not found');
          }
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setErrorMessage('An error occurred while publishing data.');
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
      } else if (response?.error) {
        setSuccessMessage('');
        if (response.status === 500) {
          setErrorMessage('An error occurred while confirming the password.');
        } else if (response.status === 404) {
          setErrorMessage('User not found. Please check your input.');
        } else if (response.status === 400) {
          setErrorMessage('Password is incorrect.');
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      } else if (error.request) {
        setSuccessMessage('');
        setErrorMessage('No response received from the server.');
      } else {
        setSuccessMessage('');
        setErrorMessage('An error occurred while confirming the password.');
      }
    } catch (error: any) {
      setSuccessMessage('');
      setErrorMessage('An error occurred while confirming the password.');
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

  return (
    <div className="p-4 md:p-6">
      {showPasswordConfirm && (
        <PasswordConfirm onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => {
            setErrorMessage('');
          }}
        />
      )}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => {
            setSuccessMessage('');
          }}
        />
      )}
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-lg font-semibold">
          <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded">
            Examination:{' '}
            <span className="text-primary dark:text-blue-400">{examName}</span>
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded">
            Course:{' '}
            <span className="text-green-600 dark:text-green-400">
              {courseCode}
            </span>
          </span>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-row gap-3 w-full md:w-auto">
          <button className="btn-primary" onClick={handlePublish}>
            Publish
          </button>
          <button className="btn-secondary" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>

      {/* Grade Count Display */}
      {gradeDistribution.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-sm mb-6 shadow">
          <h3 className="font-semibold text-lg mb-4 text-black dark:text-white">
            Grade Count
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center text-gray-700 dark:text-gray-200">
              <thead className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
                <tr>
                  {gradeDistribution.map((gradeData) => (
                    <th key={gradeData.grade} className="px-4 py-2 font-medium">
                      {gradeData.grade}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {gradeDistribution.map((gradeData) => (
                    <td
                      key={gradeData.grade}
                      className="px-4 py-2 font-bold text-primary"
                    >
                      {gradeData.count}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
          <thead>
            <tr className="bg-gray-100 dark:bg-form-input">
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                Student Name
              </th>
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                Student Number
              </th>
              {examTypes.map((examType) => (
                <th
                  key={examType}
                  className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center"
                >
                  {examType}
                </th>
              ))}
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                Total Marks
              </th>
              <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center">
                Grade
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(grades) &&
              grades.map((data, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {data.studentName}
                  </td>
                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                    {data.studentNumber}
                  </td>
                  {examTypes.map((examType) => (
                    <td
                      key={examType}
                      className="border border-gray-300 dark:border-strokedark px-4 py-2 text-center"
                    >
                      {data.examTypesName[examType] || (
                        <span className="text-red dark:text-red">failed</span>
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-300 font-semibold dark:border-strokedark px-4 py-2 text-center text-blue-600 dark:text-blue-400">
                    {data.totalMarks}
                  </td>
                  <td className="border border-gray-300 font-semibold dark:border-strokedark px-4 py-2 text-center text-green-600 dark:text-green-400">
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
