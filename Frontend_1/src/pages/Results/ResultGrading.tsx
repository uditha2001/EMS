import { useState, useEffect } from "react";
import useApi from "../../api/api";
import SearchIcon from "../../images/search/search.svg"; // Import SVG file

type ExaminationName = {
  key: number;
  name: string;
};
type CourseData = {
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

const ResultGrading = () => {
  const { getAllExaminationDetailsWithDegreeName, getCoursesUsingExaminationId } = useApi();
  const [createdExamNames, setCreatedExamNames] = useState<ExaminationName[]>([]);
  const [examName, setExamName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [examinationCourseCode, setExaminationCourseCode] = useState<CourseData[]>([]);
  const [selectedExaminationKey, setSelectedExaminationKey] = useState<number>();
  const [examOptionIdentifier, setExamOptionIdentifier] = useState<string>("");

  useEffect(() => {
    getAllExaminationDetailsWithDegreeName().then((response) => {
      let examData: ExaminationName[] = response.map((obj: any) => ({
        key: obj.id,
        name: `${obj.year}-${obj.degreeProgramName}-Level ${obj.level}-Semester ${obj.semester}`,
      }));
      setCreatedExamNames(examData);
    });
  }, []);

  useEffect(() => {
    if (examName) {
      getCoursesUsingExaminationId(selectedExaminationKey).then((data) => {
        setExaminationCourseCode(data);
      });
    }
  }, [examName]);

  useEffect(() => {
    if (examinationCourseCode.length > 0 && examOptionIdentifier) {
      setCourseCode(examinationCourseCode[0].code);
    }
  }, [examinationCourseCode]);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl dark:bg-gray-800 dark:shadow-gray-700/30">
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-6 text-center">Result Grading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">Exam Name</label>
            <select
              value={examOptionIdentifier}
              onChange={(e) => {
                setExamOptionIdentifier(e.target.value);
                const selectedIndex = parseInt(e.target.value, 10);
                setExamName(createdExamNames[selectedIndex]?.name || "");
                setSelectedExaminationKey(createdExamNames[selectedIndex]?.key);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>
                -- Select the exam Name --
              </option>
              {createdExamNames.map((exam, index) => (
                <option key={exam.key} value={index}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">Course Code</label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {examinationCourseCode.map((course) => (
                <option key={course.id} value={course.code}>
                  {course.code}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 transition-all dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={() => alert(`Fetching grading for ${examName} - ${courseCode}`)}
          >
            <img src={SearchIcon} alt="Search" className="w-5 h-5" /> View Grades Conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultGrading;
