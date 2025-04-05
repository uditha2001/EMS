import React, { useState, useEffect } from 'react';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useAuth from '../../hooks/useAuth';
import useApi from '../../api/api';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

interface Examination {
  id: number;
  year: string;
  level: string;
  semester: string;
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

const TimeTableRevision: React.FC = () => {
  const { auth } = useAuth();
  const userId = Number(auth.id);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<string>('');
  const [timeTables, setTimeTables] = useState<ExamTimeTable[]>([]);
  const [selectedTimeTable, setSelectedTimeTable] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newStartTime, setNewStartTime] = useState<string>('');
  const [newEndTime, setNewEndTime] = useState<string>('');
  const [revisionReason, setRevisionReason] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionPayload, setSubmissionPayload] = useState<any>(null);
  const [, setConflictMessages] = useState<string[]>([]);


  const { getExamTimeTableByExamination, reviseTimeTable } =
    useExamTimeTableApi();

  const { getExaminations } = useApi();

  // Fetch examinations
  useEffect(() => {
    getExaminations()
      .then((response) => setExaminations(response.data.data))
      .catch((error) => {
        console.error('Error fetching examinations:', error);
        setErrorMessage('Failed to fetch examinations.');
      });
  }, []);

  // Fetch timetables for selected examination
  useEffect(() => {
    if (selectedExamination) {
      getExamTimeTableByExamination(Number(selectedExamination))
        .then((response) => {
          const approvedTimeTables = response.data.data.filter(
            (table: ExamTimeTable) => table.approve,
          );
          setTimeTables(approvedTimeTables);
        })
        .catch((error) => {
          console.error('Error fetching timetables:', error);
          setErrorMessage('Failed to fetch timetables.');
        });
    } else {
      setTimeTables([]);
    }
  }, [selectedExamination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedExamination ||
      !selectedTimeTable ||
      !newDate ||
      !newStartTime ||
      !newEndTime ||
      !revisionReason
    ) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    const timeTable = timeTables.find(
      (table) => table.examTimeTableId === Number(selectedTimeTable),
    );

    if (!timeTable) {
      setErrorMessage('Selected timetable not found.');
      return;
    }

    try {
      // Fetch updated timetables to check for conflicts
      const response = await getExamTimeTableByExamination(
        Number(selectedExamination),
      );
      const allTimeTables = response.data.data;

      // Check for conflicts
      const conflicts = allTimeTables
        .filter(
          (table: ExamTimeTable) =>
            table.examTimeTableId !== timeTable.examTimeTableId && // Exclude the current timetable
            table.date === newDate &&
            ((newStartTime >= table.startTime &&
              newStartTime < table.endTime) || // Overlapping start time
              (newEndTime > table.startTime && newEndTime <= table.endTime) || // Overlapping end time
              (newStartTime <= table.startTime && newEndTime >= table.endTime)), // Enclosing another exam
        );

      const conflictMsgs = conflicts.map(
        (conflict: ExamTimeTable) =>
          `Conflict with ${conflict.courseCode} - ${conflict.courseName} (${conflict.examType}) from ${conflict.startTime} to ${conflict.endTime}.`,
      );

      if (conflictMsgs.length > 0) {
        setConflictMessages(conflictMsgs);
        setErrorMessage(conflictMsgs.join(' | '));
        setSuccessMessage('');
        return;
      }

      // Prepare payload for confirmation
      const payload = {
        examTimeTableId: timeTable.examTimeTableId,
        newDate,
        newStartTime,
        newEndTime,
        revisedById: userId,
        changeReason: revisionReason,
      };

      // Store the payload and show confirmation instead of submitting directly
      setSubmissionPayload(payload);
      setShowConfirmation(true);
    } catch (error) {
      setErrorMessage('Failed to check timetable conflicts. Please try again.');
      setSuccessMessage('');
      console.error('Error checking conflicts:', error);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      await reviseTimeTable(submissionPayload);
      resetForm(); 
      setSuccessMessage('Timetable revised successfully.');
      setErrorMessage('');
      setShowConfirmation(false);

      // Refresh the timetables after successful revision
      getExamTimeTableByExamination(Number(selectedExamination)).then(
        (response) => {
          const approvedTimeTables = response.data.data.filter(
            (table: ExamTimeTable) => table.approve,
          );
          setTimeTables(approvedTimeTables);
        },
      );
    } catch (error) {
      setErrorMessage('Failed to revise timetable. Please try again.');
      setSuccessMessage('');
      console.error('Error revising timetable:', error);
      setShowConfirmation(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
    setSubmissionPayload(null);
  };

  const resetForm = () => {
    setSelectedExamination('');
    setSelectedTimeTable('');
    setNewDate('');
    setNewStartTime('');
    setNewEndTime('');
    setRevisionReason('');
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Timetable Revision" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Revise Timetable Slots
          </h3>
        </div>

        <div className="p-6.5">
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Examination Selection */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Examination
                </label>
                <select
                  value={selectedExamination}
                  onChange={(e) => {
                    setSelectedExamination(e.target.value);
                    setSelectedTimeTable('');
                  }}
                  className="input-field"
                  required
                >
                  <option value="">Select Examination</option>
                  {examinations.map((exam) => (
                    <option key={exam.id} value={exam.id.toString()}>
                      {exam.year} - Level {exam.level} - Semester{' '}
                      {exam.semester} - {exam.degreeProgramName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timetable Selection */}
              {selectedExamination && (
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Timetable
                  </label>
                  <select
                    value={selectedTimeTable}
                    onChange={(e) => setSelectedTimeTable(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select Timetable</option>
                    {timeTables.map((table) => (
                      <option
                        key={table.examTimeTableId}
                        value={table.examTimeTableId.toString()}
                      >
                        {table.courseCode} - {table.courseName} (
                        {table.examType}) - {table.date} {table.startTime}-
                        {table.endTime}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Current Date/Time (readonly) */}
              {selectedTimeTable && (
                <>
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Current Date
                    </label>
                    <input
                      type="text"
                      value={
                        timeTables.find(
                          (t) =>
                            t.examTimeTableId === Number(selectedTimeTable),
                        )?.date || ''
                      }
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Current Time Slot
                    </label>
                    <input
                      type="text"
                      value={`${
                        timeTables.find(
                          (t) =>
                            t.examTimeTableId === Number(selectedTimeTable),
                        )?.startTime || ''
                      } - ${
                        timeTables.find(
                          (t) =>
                            t.examTimeTableId === Number(selectedTimeTable),
                        )?.endTime || ''
                      }`}
                      className="input-field"
                      disabled
                    />
                  </div>
                </>
              )}
            </div>

            {/* New Date/Time */}
            {selectedTimeTable && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="input-field"
                    required
                    min={new Date().toISOString().split('T')[0]} // Minimum date is today
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    New Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    New End Time
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}

            {/* Revision Reason */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Revision Reason
              </label>
              <textarea
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                className="input-field"
                required
                maxLength={100}
                placeholder="Maximum 100 characters"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary">
              Submit Revision
            </button>
          </form>
        </div>
      </div>
   {/* Confirmation Modal */}
   {showConfirmation && (
        <ConfirmationModal
        message="Are you sure you want to revise this timetable slot?"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />
      )}
    </div>
  );
};

export default TimeTableRevision;
