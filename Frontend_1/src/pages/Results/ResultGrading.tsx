import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useResultsApi from "../../api/ResultsApi";

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
  const queryParams = new URLSearchParams(location.search);
  const examinationId = queryParams.get("examinationId");
  const courseCode = queryParams.get("courseCode");
  const { getGradingResults } = useResultsApi();

  const [grades, setGrades] = useState<GradeDetails[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (examinationId && courseCode) {
      getGradingResults(courseCode, examinationId)
        .then((response) => {
          if (response.code === 200) {
            setGrades(response.data);
          } else if (response.code === 404) {
            setError("Results not found");
            setGrades([]);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("An error occurred while fetching data.");
          setGrades([]);
        });
    }
  }, []);

  useEffect(() => {
    if (grades.length > 0) {
      setExamTypes(Object.keys(grades[0]?.examTypesName || {}));
    }
  }, [grades]);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
            <th className="px-4 py-2 border dark:border-gray-600">Student Name</th>
            <th className="px-4 py-2 border dark:border-gray-600">Student Number</th>
            {examTypes.map((examType) => (
              <th key={examType} className="px-4 py-2 border dark:border-gray-600">
                {examType}
              </th>
            ))}
            <th className="px-4 py-2 border dark:border-gray-600">Total Marks</th>
            <th className="px-4 py-2 border dark:border-gray-600">Grade</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(grades) &&
            grades.map((data, index) => (
              <tr
                key={index}
                className="text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 border dark:border-gray-600">{data.studentName}</td>
                <td className="px-4 py-2 border dark:border-gray-600">{data.studentNumber}</td>
                {examTypes.map((examType) => (
                  <td key={examType} className="px-4 py-2 border dark:border-gray-600">
                    {data.examTypesName[examType] ?? "-"}
                  </td>
                ))}
                <td className="px-4 py-2 border dark:border-gray-600">{data.totalMarks}</td>
                <td className="px-4 py-2 border dark:border-gray-600">{data.grade}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultGrading;
