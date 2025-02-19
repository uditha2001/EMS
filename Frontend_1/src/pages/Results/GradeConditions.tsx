import { useState, useEffect } from "react";
import useApi from "../../api/api";
import SearchIcon from "../../images/search/search.svg"; // Import SVG file
import { FiEdit,FiAlertCircle } from "react-icons/fi";

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
  const { getAllExaminationDetailsWithDegreeName, getCoursesUsingExaminationId, getGradesConditionsValues} = useApi();
  const [createdExamNames, setCreatedExamNames] = useState<ExaminationName[]>([]);
  const [examName, setExamName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [examinationCourseCode, setExaminationCourseCode] = useState<CourseData[]>([]);
  const [selectedExaminationKey, setSelectedExaminationKey] = useState<number | undefined>(undefined);
  const [showGradeConditions, setShowGradeConditions] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [marksConditions, setMarksConditions] = useState({});

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
    if (selectedExaminationKey !== undefined) {
      getCoursesUsingExaminationId(selectedExaminationKey).then((data) => {
        setExaminationCourseCode(data);
      });
    }
  }, [selectedExaminationKey]);


  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) setIsAccepted(false);
  };

  const saveChanges = () => {
    
    setIsEditing(false);
    console.log("Saving changes:", marksConditions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMarksConditions(prev => ({ ...prev, [name]: value }));
  };

  const acceptConditions = () => {
    setIsAccepted(true);
  };

  const handleSearch = () => {
    if (examName && courseCode) {
      setShowGradeConditions(true);
      if(courseCode!=null){
        getGradesConditionsValues(courseCode).then((data) => {
           console.log(data.data);
        });
      }
    } else {
      alert("Please select both exam and course.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-gray-900 dark:to-gray-800 pt-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl dark:bg-gray-800 dark:shadow-gray-700/30">
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-6 text-center">Result Grading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">Exam Name</label>
            <select
              value={examName}
              onChange={(e) => {
                setExamName(e.target.value);
                const selected = createdExamNames.find(exam => exam.name === e.target.value);
                setSelectedExaminationKey(selected?.key);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">-- Select the exam Name --</option>
              {createdExamNames.map((exam) => (
                <option key={exam.key} value={exam.name}>
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
              <option value="">-- Select the Course Code --</option>
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
            onClick={handleSearch}
          >
            <img src={SearchIcon} alt="Search" className="w-5 h-5" /> View Grades Conditions
          </button>
        </div>

        {showGradeConditions && (
          <>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-6 text-center flex items-center justify-center gap-2 mt-6">
              <FiEdit className="text-blue-500" /> Mark Conditions
            </h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
              <FiAlertCircle className="text-yellow-500" /> Please check each mark percentage for each paper type and ensure it meets the minimum marks required to pass the exam.
            </p>
            <form className="grid gap-4">
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultGrading;