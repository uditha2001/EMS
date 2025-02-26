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
          }
          else if (response.code === 404) {
            setError("results not found");
            setGrades([]);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("An error occurred while fetching data.");
          setGrades([]);
        })
    }
  }, []);

  useEffect(() => {
    if (grades.length > 0) {
      setExamTypes(Object.keys(grades[0]?.examTypesName || {}));
    }
  }, [grades]);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Student Name</th>
            <th className="px-4 py-2 border">Student Number</th>
            {examTypes.map((examType) => (
              <th key={examType} className="px-4 py-2 border">{examType}</th>
            ))}
            <th className="px-4 py-2 border">Total Marks</th>
            <th className="px-4 py-2 border">Grade</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(grades) &&
            grades.map((data, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2 border">{data.studentName}</td>
                <td className="px-4 py-2 border">{data.studentNumber}</td>
                {examTypes.map((examType) => (
                  <td key={examType} className="px-4 py-2 border">
                    {data.examTypesName[examType] ?? "-"}
                  </td>
                ))}
                <td className="px-4 py-2 border">{data.totalMarks}</td>
                <td className="px-4 py-2 border">{data.grade}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultGrading;
