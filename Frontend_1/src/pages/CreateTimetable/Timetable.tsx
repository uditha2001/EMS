import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useApi from '../../api/api';
import {
  faList,
  faCalendarAlt,
  faCheckCircle,
  faMinus,
  faPlus,
  faDeleteLeft,
} from '@fortawesome/free-solid-svg-icons';
import Stepper from '../PaperTransfer/Stepper';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import PreviewTimetable from './PreviewTimetable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

interface Course {
  id: number;
  name: string;
  code: string;
  evaluationType: string;
  evaluationTypeId: number;
}

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
}

interface ExamTimeTable {
  examTimeTableId: number;
  examinationId: number;
  courseId: number;
  examTypeId: number;
  date: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  examType: string;
  timetableGroup: string;
}

const CreateTimetable: React.FC = () => {
  const { getExaminations } = useApi();
  const {
    getCourses,
    saveExamTimeTable,
    getExamTimeTableByExamination,
    deleteExamTimeTable,
  } = useExamTimeTableApi();

  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<number | null>(
    null,
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [examTimeTables, setExamTimeTables] = useState<ExamTimeTable[]>([]);
  const [courseDetails, setCourseDetails] = useState<{
    [key: string]: {
      examDate: string;
      examTime: string;
      duration: string;
      timetableGroup: string;
    }[];
  }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTimetableSlot, setSelectedTimetableSlot] = useState<{
    courseId: number;
    evaluationType: string;
    index: number;
    examTimeTableId?: number;
  } | null>(null);

  const steps = [
    { id: 1, name: 'Examination', icon: faList },
    { id: 2, name: 'Create/Update Exam Timetable', icon: faCalendarAlt },
    { id: 3, name: 'Preview Timetable', icon: faCheckCircle },
  ];

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const response = await getExaminations();
        setExaminations(response.data.data);
      } catch (error) {
        setErrorMessage('Failed to fetch examinations.');
        console.error('Error fetching examinations:', error);
      }
    };
    fetchExaminations();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedExamination) return;
      try {
        const response = await getCourses(selectedExamination);
        setCourses(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch courses.');
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [selectedExamination]);

  const fetchExamTimeTables = async () => {
    if (!selectedExamination) return;
    try {
      const response = await getExamTimeTableByExamination(selectedExamination);
      setExamTimeTables(response.data.data);

      // Ensure existing time slots are pre-filled correctly
      if (response.data.data.length > 0) {
        const details: {
          [key: string]: {
            examDate: string;
            examTime: string;
            duration: string;
            timetableGroup: string;
          }[];
        } = response.data.data.reduce(
          (
            acc: {
              [key: string]: {
                examDate: string;
                examTime: string;
                duration: string;
                timetableGroup: string;
              }[];
            },
            timetable: ExamTimeTable,
          ) => {
            const examType = timetable.examType;
            const duration = calculateDuration(
              timetable.startTime,
              timetable.endTime,
            );

            const key = `${timetable.courseId}-${examType}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push({
              examDate: timetable.date,
              examTime: timetable.startTime,
              duration: duration.toString(),
              timetableGroup: timetable.timetableGroup,
            });
            return acc;
          },
          {} as {
            [key: string]: {
              examDate: string;
              examTime: string;
              duration: string;
              timetableGroup: string;
            }[];
          },
        );
        setCourseDetails(details);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch exam timetables.');
      console.error('Error fetching exam timetables:', error);
    }
  };

  useEffect(() => {
    fetchExamTimeTables();
  }, [selectedExamination]);

  // Calculate duration from start and end time
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let durationHours = endHour - startHour;
    let durationMinutes = endMinute - startMinute;

    if (durationMinutes < 0) {
      durationHours -= 1;
      durationMinutes += 60;
    }

    return durationHours + durationMinutes / 60; // Return duration in hours
  };

  // Convert start time and duration to end time
  const calculateEndTime = (startTime: string, duration: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const durationHours = Math.floor(parseFloat(duration));
    const durationMinutes = Math.round((parseFloat(duration) % 1) * 60);

    let endHour = startHour + durationHours;
    let endMinute = startMinute + durationMinutes;

    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    // Ensure the end time is formatted properly
    const formattedEndHour = String(endHour).padStart(2, '0');
    const formattedEndMinute = String(endMinute).padStart(2, '0');

    return `${formattedEndHour}:${formattedEndMinute}`;
  };

  const addTimeSlot = (courseId: number, evaluationType: string) => {
    const key = `${courseId}-${evaluationType}`;
    setCourseDetails((prevState) => ({
      ...prevState,
      [key]: [
        ...(prevState[key] || []),
        { examDate: '', examTime: '', duration: '', timetableGroup: '' },
      ],
    }));
  };

  // Function to handle deletion of a timetable slot
  const handleDeleteTimetableSlot = async (examTimeTableId: number) => {
    try {
      const response = await deleteExamTimeTable(examTimeTableId);
      if (response.data) {
        setSuccessMessage('Timetable slot deleted successfully!');
        setExamTimeTables((prev) =>
          prev.filter((t) => t.examTimeTableId !== examTimeTableId),
        );
        fetchExamTimeTables();
      } else {
        setErrorMessage('Failed to delete timetable slot.');
      }
    } catch (error) {
      setErrorMessage('Failed to delete timetable slot.');
      console.error('Error deleting timetable slot:', error);
    }
  };

  // Function to handle confirmation of deletion
  const handleConfirmDelete = () => {
    if (selectedTimetableSlot) {
      const { courseId, evaluationType, index, examTimeTableId } =
        selectedTimetableSlot;
      if (examTimeTableId) {
        handleDeleteTimetableSlot(examTimeTableId);
      } else {
        const key = `${courseId}-${evaluationType}`;
        setCourseDetails((prevState) => ({
          ...prevState,
          [key]: prevState[key].filter((_, i) => i !== index),
        }));
      }
      setIsDeleteModalOpen(false);
      setSelectedTimetableSlot(null);
    }
  };

  // Function to open the confirmation modal
  const deleteTimeSlot = (
    courseId: number,
    evaluationType: string,
    index: number,
    examTimeTableId?: number,
  ) => {
    setSelectedTimetableSlot({
      courseId,
      evaluationType,
      index,
      examTimeTableId,
    });
    setIsDeleteModalOpen(true);
  };

  // Function to cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedTimetableSlot(null);
  };

  const removeTimeSlot = (
    courseId: number,
    evaluationType: string,
    index: number,
  ) => {
    const key = `${courseId}-${evaluationType}`;
    setCourseDetails((prevState) => ({
      ...prevState,
      [key]: prevState[key].filter((_, i) => i !== index),
    }));
  };

  const handleSubmitTimetable = async () => {
    if (!selectedExamination) {
      setErrorMessage('Please select an examination.');
      return;
    }

    // Prepare request body
    const examTimeTableDataList = courses
      .flatMap((course) => {
        const key = `${course.id}-${course.evaluationType}`;
        return (courseDetails[key] || []).map((slot) => {
          const { examDate, examTime, duration, timetableGroup } = slot;
          const formattedStartTime =
            examTime.length === 5 ? `${examTime}` : examTime;
          const endTime = calculateEndTime(examTime, duration);

          return {
            examTimeTableId:
              examTimeTables.find(
                (t) =>
                  t.courseId === course.id &&
                  t.examTypeId === course.evaluationTypeId &&
                  t.timetableGroup === timetableGroup,
              )?.examTimeTableId || 0,
            examinationId: selectedExamination,
            courseId: course.id,
            examTypeId: course.evaluationTypeId,
            date: examDate,
            startTime: formattedStartTime,
            endTime: endTime,
            timetableGroup: timetableGroup || '',
          };
        });
      })
      .filter((data) => data !== null);

    console.log('Submitting Timetable Data:', examTimeTableDataList);

    try {
      const response = await saveExamTimeTable(examTimeTableDataList);
      console.log('API Response:', response.data);

      if (response.data) {
        setSuccessMessage(
          examTimeTables.length > 0
            ? 'Timetable updated successfully!'
            : 'Timetable created successfully!',
        );
        fetchExamTimeTables();
      } else {
        setErrorMessage('Failed to save timetable.');
      }
    } catch (error: any) {
      console.error('Error saving timetable:', error.response?.data || error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to save timetable.',
      );
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedExamination) {
      setErrorMessage('Please select an examination.');
      return;
    }
    setErrorMessage('');
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCourseDetailsChange = (
    courseId: number,
    evaluationType: string,
    field: keyof {
      examDate: string;
      examTime: string;
      duration: string;
      timetableGroup: string;
    },
    value: string,
    index: number,
  ) => {
    const key = `${courseId}-${evaluationType}`;
    setCourseDetails((prevState) => ({
      ...prevState,
      [key]: prevState[key].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Create Timetable" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Create/Update Timetable
          </h3>
        </div>
        <div className="p-8">
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
          <Stepper currentStep={currentStep} steps={steps} />
          <div className="mt-6">
            {currentStep === 1 && (
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Select Examination
                </label>
                <select
                  value={selectedExamination || ''}
                  onChange={(e) =>
                    setSelectedExamination(Number(e.target.value))
                  }
                  className="input-field appearance-none"
                >
                  <option value="">Select Examination</option>
                  {examinations.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.year} - Level {exam.level} - Semester{' '}
                      {exam.semester} - {exam.degreeProgramName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="font-medium text-black dark:text-white mb-4">
                  Assign Time Slots and Dates
                </h3>
                <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-form-input">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Course
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Date
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Time
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Duration (hrs)
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Group
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => {
                      const key = `${course.id}-${course.evaluationType}`;
                      const timeSlots = courseDetails[key] || [];

                      return (
                        <>
                          {timeSlots.map((slot, index) => {
                            const isSaved = examTimeTables.some(
                              (t) =>
                                t.courseId === course.id &&
                                t.examTypeId === course.evaluationTypeId &&
                                t.timetableGroup === slot.timetableGroup,
                            );
                            const examTimeTableId = examTimeTables.find(
                              (t) =>
                                t.courseId === course.id &&
                                t.examTypeId === course.evaluationTypeId &&
                                t.timetableGroup === slot.timetableGroup,
                            )?.examTimeTableId;

                            return (
                              <tr
                                key={`${course.id}-${course.evaluationType}-${index}`}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <td className="border px-4 py-2">
                                  {index === 0 && (
                                    <>
                                      {course.code} (
                                      {course.evaluationType === 'THEORY'
                                        ? 'T'
                                        : course.evaluationType === 'PRACTICAL'
                                        ? 'P'
                                        : course.evaluationType}
                                      ) - {course.name}
                                    </>
                                  )}
                                </td>
                                <td className="border px-4 py-2">
                                  <input
                                    type="date"
                                    value={slot.examDate}
                                    onChange={(e) =>
                                      handleCourseDetailsChange(
                                        course.id,
                                        course.evaluationType,
                                        'examDate',
                                        e.target.value,
                                        index,
                                      )
                                    }
                                    className="input-field"
                                  />
                                </td>
                                <td className="border px-4 py-2">
                                  <input
                                    type="time"
                                    value={slot.examTime}
                                    onChange={(e) =>
                                      handleCourseDetailsChange(
                                        course.id,
                                        course.evaluationType,
                                        'examTime',
                                        e.target.value,
                                        index,
                                      )
                                    }
                                    className="input-field"
                                  />
                                </td>
                                <td className="border px-4 py-2">
                                  <input
                                    type="number"
                                    value={slot.duration}
                                    onChange={(e) =>
                                      handleCourseDetailsChange(
                                        course.id,
                                        course.evaluationType,
                                        'duration',
                                        e.target.value,
                                        index,
                                      )
                                    }
                                    className="input-field"
                                    placeholder="Duration (hrs)"
                                  />
                                </td>
                                <td className="border px-4 py-2">
                                  <input
                                    type="text"
                                    value={slot.timetableGroup}
                                    onChange={(e) =>
                                      handleCourseDetailsChange(
                                        course.id,
                                        course.evaluationType,
                                        'timetableGroup',
                                        e.target.value,
                                        index,
                                      )
                                    }
                                    className="input-field"
                                    placeholder="Group (optional)"
                                  />
                                </td>
                                <td className="border px-4 py-2">
                                  {isSaved ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteTimeSlot(
                                          course.id,
                                          course.evaluationType,
                                          index,
                                          examTimeTableId,
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FontAwesomeIcon icon={faDeleteLeft} />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeTimeSlot(
                                          course.id,
                                          course.evaluationType,
                                          index,
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td colSpan={6} className="border px-4 py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  addTimeSlot(course.id, course.evaluationType)
                                }
                                className="text-green-500 hover:text-green-700"
                              >
                                <FontAwesomeIcon icon={faPlus} /> {course.code}{' '}
                                (
                                {course.evaluationType === 'THEORY'
                                  ? 'T'
                                  : course.evaluationType === 'PRACTICAL'
                                  ? 'P'
                                  : course.evaluationType}
                                ) - {course.name}
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleSubmitTimetable}
                    className="btn-primary"
                  >
                    {examTimeTables.length > 0
                      ? 'Update Timetable'
                      : 'Create Timetable'}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <PreviewTimetable examinationId={selectedExamination} />
            )}
          </div>

          <div className="flex justify-between mt-8 text-sm">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary"
            >
              Previous
            </button>

            {currentStep < steps.length && (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
                disabled={!selectedExamination}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this timetable slot? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CreateTimetable;
