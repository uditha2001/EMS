import { useState, useEffect } from 'react';
import useApi from '../../api/api';
import {
  FiEdit,
  FiAlertCircle,
  FiCheck,
  FiArrowRight,
  FiSave,
  FiX,
} from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

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
  const {
    getAllExaminationDetailsWithDegreeName,
    getCoursesUsingExaminationId,
    getGradesConditionsValues,
  } = useApi();
  const [createdExamNames, setCreatedExamNames] = useState<ExaminationName[]>(
    [],
  );
  const [examName, setExamName] = useState<string>('');
  const [courseCode, setCourseCode] = useState<string>('');
  const [examinationCourseCode, setExaminationCourseCode] = useState<
    CourseData[]
  >([]);
  const [selectedExaminationKey, setSelectedExaminationKey] = useState<
    number | undefined
  >(undefined);
  const [showGradeConditions, setShowGradeConditions] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [marksConditions, setMarksConditions] = useState<any[]>([]);
  const [isAcceptEnable, setIsAcceptEnable] = useState(true);

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
    setIsAcceptEnable(true);
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
    setIsAcceptEnable(false);
  };

  const handleNext = () => {
    if (isAccepted) {
      console.log('Proceeding to next step');
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
      alert('Please select both exam and course.');
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Result Grading" />
      <div className="flex flex-col items-center justify-start">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Results Grading
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pt-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                Exam Name
              </label>
              <select
                value={examName}
                onChange={(e) => {
                  setExamName(e.target.value);
                  const selected = createdExamNames.find(
                    (exam) => exam.name === e.target.value,
                  );
                  setSelectedExaminationKey(selected?.key);
                }}
                className="input-field"
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
              <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                Course Code
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="input-field"
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
          <div className="mt-8 flex justify-center mb-6">
            <button className="btn-primary" onClick={handleSearch}>
              View Grades Conditions
            </button>
          </div>

          {showGradeConditions && (
            <>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-6 text-center flex items-center justify-center gap-2 mt-8 ">
                <FiEdit className="text-primary" /> Mark Conditions
              </h2>

              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded mb-6 flex items-center gap-2 mx-6">
                <FiAlertCircle className="text-yellow-500" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Please check each mark percentage for each paper type and
                  ensure it meets the minimum marks required to pass the exam.
                </p>
              </div>

              <form className="grid gap-6 p-6 bg-gray-100 dark:bg-gray-900 rounded-sm">
                {marksConditions &&
                  marksConditions.map((mark, index) => (
                    <div
                      key={`mark-${mark.id}-${index}`}
                      className="grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr] gap-6 mb-6 bg-gray-50 dark:bg-gray-800 p-6 rounded shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Exam Type
                        </label>
                        <div className="input-field">{mark.examType}</div>
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
                          className="input-field"
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
                          className="input-field"
                          disabled={!isEditing}
                          placeholder="Enter min marks"
                        />
                      </div>
                    </div>
                  ))}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                  {!isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded shadow hover:bg-indigo-700 hover:scale-105 transition-all duration-150  flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleAccept}
                        disabled={!isAcceptEnable}
                        className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-white rounded shadow hover:scale-105 transition-all duration-150  flex items-center justify-center gap-2 text-sm sm:text-base ${
                          isAcceptEnable
                            ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 '
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FiCheck /> Accept
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isAccepted}
                        className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded shadow transition-all duration-150  flex items-center justify-center gap-2 text-sm sm:text-base ${
                          isAccepted
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 '
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                        className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded shadow hover:bg-green-700 hover:scale-105 transition-all duration-150  flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <FiSave /> Confirm
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-red-600 text-white rounded shadow hover:bg-red-700 hover:scale-105 transition-all duration-150  flex items-center justify-center gap-2 text-sm sm:text-base"
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
    </div>
  );
};

export default ResultGrading;
