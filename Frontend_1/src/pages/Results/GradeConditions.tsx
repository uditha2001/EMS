import { useState, useEffect } from "react";
import useApi from "../../api/api";
import SearchIcon from "../../images/search/search.svg"; // Import SVG file
import { FiEdit, FiAlertCircle, FiCheck, FiArrowRight, FiSave, FiX } from "react-icons/fi";

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
  const { getAllExaminationDetailsWithDegreeName, getCoursesUsingExaminationId, getGradesConditionsValues } = useApi();
  const [createdExamNames, setCreatedExamNames] = useState<ExaminationName[]>([]);
  const [examName, setExamName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [examinationCourseCode, setExaminationCourseCode] = useState<CourseData[]>([]);
  const [selectedExaminationKey, setSelectedExaminationKey] = useState<number | undefined>(undefined);
  const [showGradeConditions, setShowGradeConditions] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [marksConditions, setMarksConditions] = useState<any[]>([]);

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

  const handleInputChange = (e: any) => {
    console.log(e.target.name, e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsAccepted(false);
  };

  const handleConfirm = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAccept = () => {
    setIsAccepted(true);
    setIsEditing(false);
  };

  const handleNext = () => {
    if (isAccepted) {
      console.log("Proceeding to next step");
    }
  };

  const handleSearch = () => {
    if (examName && courseCode) {
      setShowGradeConditions(true);
      if (courseCode != null) {
        getGradesConditionsValues(courseCode).then((data) => {
          setMarksConditions(data.data);
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
        <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">Result Grading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">Exam Name</label>
            <select
              value={examName}
              onChange={(e) => {
                setExamName(e.target.value);
                const selected = createdExamNames.find((exam) => exam.name === e.target.value);
                setSelectedExaminationKey(selected?.key);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">-- Select the Exam Name --</option>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        <div className="mt-8 flex justify-center">
          <button
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 hover:scale-105 transition-all duration-150 dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={handleSearch}
          >
            <img src={SearchIcon} alt="Search" className="w-5 h-5" /> View Grades Conditions
          </button>
        </div>

        {showGradeConditions && (
          <>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-6 text-center flex items-center justify-center gap-2 mt-8">
              <FiEdit className="text-blue-500" /> Mark Conditions
            </h2>

            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-6 flex items-center gap-2">
              <FiAlertCircle className="text-yellow-500" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Please check each mark percentage for each paper type and ensure it meets the minimum marks required to pass the exam.
              </p>
            </div>

            <form className="grid gap-6 p-6 bg-gray-100 dark:bg-gray-900 rounded-2xl">
              {marksConditions &&
                marksConditions.map((mark, index) => (
                  <div
                    key={`mark-${mark.id}-${index}`}
                    className="grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr] gap-6 mb-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col">
                      <div className="w-full px-4 py-3 text-lg font-semibold text-gray-800 dark:text-gray-100 mt-6 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        {mark.examType}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Percentage
                      </label>
                      <input
                        type="number"
                        name={mark.weightage}
                        value={mark.weightage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        disabled={!isEditing}
                        placeholder="Enter percentage"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Minimum Marks to Pass
                      </label>
                      <input
                        type="number"
                        name={mark.passMark}
                        value={mark.passMark}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        disabled={!isEditing}
                        placeholder="Enter min marks"
                      />
                    </div>
                  </div>
                ))}

              <div className="flex justify-end gap-4 mt-6">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 hover:scale-105 transition-all duration-150 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:scale-105 transition-all duration-150 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                      <FiCheck /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isAccepted}
                      className={`px-6 py-3 rounded-lg shadow transition-all duration-150 focus:ring-2 focus:ring-offset-2 flex items-center gap-2 ${isAccepted
                          ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 focus:ring-blue-500"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <FiArrowRight /> Next
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 hover:scale-105 transition-all duration-150 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                      <FiSave /> Confirm
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 hover:scale-105 transition-all duration-150 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                      <FiX /> Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultGrading;