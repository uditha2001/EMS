import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useApi from '../../api/api';
import {
  faList,
  faCalendarAlt,
  faCheckCircle,
  faPlus,
  faDeleteLeft,
  faSave,
  faMinus,
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
  approve: boolean;
}

interface TimeSlot {
  examDate: string;
  examTime: string;
  duration: string;
  timetableGroup: string;
  examTimeTableId?: number;
  isNew?: boolean;
  isSaved?: boolean;
  approve?: boolean;
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
  const [, setExamTimeTables] = useState<ExamTimeTable[]>([]);
  const [, setIsTimetableApproved] = useState<boolean>(false);
  const [courseDetails, setCourseDetails] = useState<{
    [key: string]: TimeSlot[];
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

  // Fetch examinations on component mount
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

  // Fetch courses when examination is selected
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

  // Fetch exam timetables when examination is selected
  const fetchExamTimeTables = async () => {
    if (!selectedExamination) return;
    try {
      const response = await getExamTimeTableByExamination(selectedExamination);
      setExamTimeTables(response.data.data);

      // Check if all time slots are approved
      const allApproved = response.data.data.every(
        (timetable: ExamTimeTable) => timetable.approve,
      );
      setIsTimetableApproved(allApproved);

      // Map existing time slots to courseDetails
      const details = response.data.data.reduce(
        (acc: any, timetable: ExamTimeTable) => {
          const duration = calculateDuration(
            timetable.startTime,
            timetable.endTime,
          );
          const key = `${timetable.courseId}-${timetable.examType}`;

          if (!acc[key]) acc[key] = [];
          acc[key].push({
            examDate: timetable.date,
            examTime: timetable.startTime,
            duration: duration.toString(),
            timetableGroup: timetable.timetableGroup,
            isNew: false,
            isSaved: true,
            examTimeTableId: timetable.examTimeTableId,
            approve: timetable.approve,
          });
          return acc;
        },
        {},
      );
      setCourseDetails(details);
    } catch (error) {
      setErrorMessage('Failed to fetch exam timetables.');
      console.error('Error fetching exam timetables:', error);
    }
  };

  useEffect(() => {
    fetchExamTimeTables();
  }, [selectedExamination]);

  // Helper functions
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let durationHours = endHour - startHour;
    let durationMinutes = endMinute - startMinute;

    if (durationMinutes < 0) {
      durationHours -= 1;
      durationMinutes += 60;
    }

    return durationHours + durationMinutes / 60;
  };

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

    return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(
      2,
      '0',
    )}`;
  };

  // Add a new time slot
  const addTimeSlot = (courseId: number, evaluationType: string) => {
    const key = `${courseId}-${evaluationType}`;
    setCourseDetails((prevState) => ({
      ...prevState,
      [key]: [
        ...(prevState[key] || []),
        {
          examDate: '',
          examTime: '',
          duration: '',
          timetableGroup: '',
          isNew: true,
          isSaved: false,
        },
      ],
    }));
  };

  // Save or update a single time slot
  const handleSaveTimeSlot = async (
    courseId: number,
    evaluationType: string,
    evaluationTypeId: number,
    index: number,
  ) => {
    if (!selectedExamination) {
      setErrorMessage('Please select an examination.');
      return;
    }

    const key = `${courseId}-${evaluationType}`;
    const slot = courseDetails[key][index];

    if (!slot.examDate || !slot.examTime || !slot.duration) {
      setErrorMessage(
        'Please fill all required fields (Date, Time, Duration).',
      );
      return;
    }

    // Check for conflicts across all time slots
    const conflicts = checkForConflicts(courseId, evaluationType, index);
    if (conflicts.length > 0) {
      setErrorMessage(`Time slot conflicts with: ${conflicts.join(', ')}`);
      return;
    }

    const endTime = calculateEndTime(slot.examTime, slot.duration);

    const timeSlotData = {
      examTimeTableId: slot.examTimeTableId || 0,
      examinationId: selectedExamination,
      courseId: courseId,
      examTypeId: evaluationTypeId,
      date: slot.examDate,
      startTime: slot.examTime,
      endTime: endTime,
      timetableGroup: slot.timetableGroup || '',
    };

    try {
      const response = await saveExamTimeTable([timeSlotData]);
      if (response.data) {
        setSuccessMessage('Time slot saved successfully!');

        // Update the slot status
        setCourseDetails((prev) => {
          const updatedDetails = { ...prev };
          updatedDetails[key] = updatedDetails[key].map((item, i) =>
            i === index
              ? {
                  ...item,
                  isNew: false,
                  isSaved: true,
                  examTimeTableId: response.data.data[0]?.examTimeTableId,
                }
              : item,
          );
          return updatedDetails;
        });

        // Refresh the timetable data
        fetchExamTimeTables();
      } else {
        setErrorMessage('Failed to save time slot.');
      }
    } catch (error: any) {
      console.error('Error saving time slot:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to save time slot.',
      );
    }
  };

  // Delete a time slot
  const handleDeleteTimetableSlot = async (examTimeTableId?: number) => {
    if (!examTimeTableId) return;

    try {
      const response = await deleteExamTimeTable(examTimeTableId);
      if (response.data) {
        setSuccessMessage('Timetable slot deleted successfully!');
        fetchExamTimeTables();
      } else {
        setErrorMessage('Failed to delete timetable slot.');
      }
    } catch (error) {
      setErrorMessage('Failed to delete timetable slot.');
      console.error('Error deleting timetable slot:', error);
    }
  };

  const handleRemoveTimetableSlot = (
    courseId: number,
    evaluationType: string,
    _evaluationTypeId: number,
    index: number,
  ) => {
    const key = `${courseId}-${evaluationType}`;
    setCourseDetails((prevState) => ({
      ...prevState,
      [key]: prevState[key].filter((_, i) => i !== index),
    }));
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedTimetableSlot(null);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (selectedTimetableSlot) {
      const { courseId, evaluationType, index, examTimeTableId } =
        selectedTimetableSlot;
      const key = `${courseId}-${evaluationType}`;

      if (examTimeTableId) {
        handleDeleteTimetableSlot(examTimeTableId);
      } else {
        // Remove unsaved slot from the UI
        setCourseDetails((prev) => {
          const updatedDetails = { ...prev };
          if (updatedDetails[key]) {
            updatedDetails[key] = updatedDetails[key].filter(
              (_, i) => i !== index,
            );
            if (updatedDetails[key].length === 0) {
              delete updatedDetails[key];
            }
          }
          return updatedDetails;
        });
      }
      setIsDeleteModalOpen(false);
      setSelectedTimetableSlot(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (
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

  // Check for time slot conflicts across all time slots
  const checkForConflicts = (
    courseId: number,
    evaluationType: string,
    index: number,
  ) => {
    const key = `${courseId}-${evaluationType}`;
    const currentSlot = courseDetails[key][index];
    if (
      !currentSlot.examDate ||
      !currentSlot.examTime ||
      !currentSlot.duration
    ) {
      return [];
    }

    const currentStart = currentSlot.examTime;
    const currentEnd = calculateEndTime(
      currentSlot.examTime,
      currentSlot.duration,
    );
    const currentDate = currentSlot.examDate;

    const conflicts: string[] = [];

    // Check against all time slots in the timetable
    Object.entries(courseDetails).forEach(([slotKey, slots]) => {
      slots.forEach((slot, slotIndex) => {
        // Skip the current slot and slots without complete data
        if (
          (slotKey === key && slotIndex === index) ||
          !slot.examDate ||
          !slot.examTime ||
          !slot.duration
        ) {
          return;
        }

        if (slot.examDate === currentDate) {
          const slotStart = slot.examTime;
          const slotEnd = calculateEndTime(slot.examTime, slot.duration);

          if (isTimeOverlapping(currentStart, currentEnd, slotStart, slotEnd)) {
            const [conflictCourseId] = slotKey.split('-');
            const conflictCourse = courses.find(
              (c) => c.id === parseInt(conflictCourseId),
            );
            conflicts.push(
              `${conflictCourse?.code} (${slot.examTime}-${slotEnd})`,
            );
          }
        }
      });
    });

    return conflicts;
  };

  const isTimeOverlapping = (
    startTime1: string,
    endTime1: string,
    startTime2: string,
    endTime2: string,
  ) => {
    return startTime1 < endTime2 && endTime1 > startTime2;
  };

  // Navigation functions
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

  // Handle changes to time slot fields
  const handleCourseDetailsChange = (
    courseId: number,
    evaluationType: string,
    field: keyof TimeSlot,
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
                  className="input-field appearance-none cursor-pointer"
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
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Paper
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Date
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Time
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Duration (hrs)
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Group
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => {
                      const key = `${course.id}-${course.evaluationType}`;
                      const timeSlots = courseDetails[key] || [];

                      return (
                        <React.Fragment key={key}>
                          {timeSlots.map((slot, index) => {
                            const isApproved = slot.approve;
                            const isNew = slot.isNew;
                            const hasConflict =
                              checkForConflicts(
                                course.id,
                                course.evaluationType,
                                index,
                              ).length > 0;

                            return (
                              <React.Fragment key={`${key}-${index}`}>
                                <tr
                                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                    hasConflict
                                      ? 'bg-red-50 dark:bg-red-900/10'
                                      : ''
                                  }`}
                                >
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    {index === 0 && (
                                      <>
                                        {course.code} (
                                        {course.evaluationType === 'THEORY'
                                          ? 'T'
                                          : course.evaluationType ===
                                            'PRACTICAL'
                                          ? 'P'
                                          : course.evaluationType}
                                        ) - {course.name}
                                      </>
                                    )}
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
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
                                      className={`input-field ${
                                        isApproved
                                          ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                                          : ''
                                      }`}
                                      disabled={isApproved}
                                    />
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
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
                                      className={`input-field ${
                                        isApproved
                                          ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                                          : ''
                                      }`}
                                      disabled={isApproved}
                                    />
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
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
                                      className={`input-field ${
                                        isApproved
                                          ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                                          : ''
                                      }`}
                                      placeholder="Duration (hrs)"
                                      disabled={isApproved}
                                      min="0.5"
                                      step="0.5"
                                    />
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
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
                                      className={`input-field ${
                                        isApproved
                                          ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                                          : ''
                                      }`}
                                      placeholder="Group (optional)"
                                      disabled={isApproved}
                                    />
                                  </td>
                                  <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                      {isApproved ? (
                                        <span className="text-green-500 flex items-center">
                                          <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className="mr-1"
                                          />
                                          Approved
                                        </span>
                                      ) : (
                                        <>
                                          {/* Show save button for unsaved or modified slots */}

                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleSaveTimeSlot(
                                                course.id,
                                                course.evaluationType,
                                                course.evaluationTypeId,
                                                index,
                                              )
                                            }
                                            className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                                            disabled={
                                              !slot.examDate ||
                                              !slot.examTime ||
                                              !slot.duration ||
                                              hasConflict
                                            }
                                            title="Save this time slot"
                                          >
                                            <FontAwesomeIcon icon={faSave} />
                                          </button>

                                          {!isNew ? (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                openDeleteModal(
                                                  course.id,
                                                  course.evaluationType,
                                                  index,
                                                  slot.examTimeTableId,
                                                )
                                              }
                                              className="text-red-500 hover:text-red-700"
                                              title="Delete this time slot"
                                            >
                                              <FontAwesomeIcon
                                                icon={faDeleteLeft}
                                              />
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveTimetableSlot(
                                                  course.id,
                                                  course.evaluationType,
                                                  course.evaluationTypeId,
                                                  index,
                                                )
                                              }
                                              className="text-red-500 hover:text-red-700"
                                              title="Delete this time slot"
                                            >
                                              <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                                {hasConflict && (
                                  <tr className="bg-red-50 dark:bg-red-900/20">
                                    <td
                                      colSpan={6}
                                      className="border px-4 py-1 text-red-500 text-sm"
                                    >
                                      Conflict detected with other time slots
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}

                          <tr>
                            <td
                              colSpan={6}
                              className="border border-gray-300 dark:border-strokedark px-4 py-2"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  addTimeSlot(course.id, course.evaluationType)
                                }
                                className="text-green-500 hover:text-green-700 flex items-center"
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  className="mr-1"
                                />
                                Add time slot for {course.code} (
                                {course.evaluationType === 'THEORY'
                                  ? 'T'
                                  : course.evaluationType === 'PRACTICAL'
                                  ? 'P'
                                  : course.evaluationType}
                                )
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
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
