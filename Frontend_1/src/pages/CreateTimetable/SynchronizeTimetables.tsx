import React, { useState, useEffect } from 'react';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import Stepper from '../PaperTransfer/Stepper';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import {
  faList,
  faArrowRight,
  faArrowLeft,
  faExclamationTriangle,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import PreviewSynchronizedTimetable from './PreviewSynchronizedTimetable';

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: string;
  degreeProgramName: string;
}

const SynchronizeTimetables: React.FC = () => {
  const { checkConflicts,getOnGoingExaminations } = useExamTimeTableApi();
  const [examinations, setExaminations] = useState<any[]>([]);
  const [selectedExaminations, setSelectedExaminations] = useState<
    Examination[]
  >([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [conflicts, setConflicts] = useState<any[]>([]);

  const steps = [
    { id: 1, name: 'Select Examinations', icon: faList },
    { id: 2, name: 'Conflict Detection ', icon: faExclamationTriangle },
    { id: 3, name: 'Synchronize Timetable', icon: faSyncAlt },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examRes = await getOnGoingExaminations();
        setExaminations(examRes.data.data);
      } catch (error) {
        setErrorMessage('Failed to fetch examinations.');
      }
    };
    fetchData();
  }, []);

  const handleSelectExamination = (exam: Examination) => {
    setSelectedExaminations((prev) => [...prev, exam]);
    setExaminations((prev) => prev.filter((e) => e.id !== exam.id));
  };

  const handleRemoveExamination = (exam: Examination) => {
    setSelectedExaminations((prev) => prev.filter((e) => e.id !== exam.id));
    setExaminations((prev) => [...prev, exam]);
  };

  const handleConflictCheck = async () => {
    try {
      const examIds = selectedExaminations.map((exam) => exam.id);
      const conflictResponse = await checkConflicts(examIds);
      // Ensure conflicts is always an array
      const conflictsData = Array.isArray(conflictResponse.data.data)
        ? conflictResponse.data.data
        : [];
      setConflicts(conflictsData);
      if (conflictsData.length > 0) {
        setSuccessMessage('');
      } else {
        setSuccessMessage('No conflicts found.');
      }
    } catch (error) {
      setErrorMessage('Failed to check conflicts.');
      setConflicts([]);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Synchronize Timetables" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-auto mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Synchronize Timetables
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
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* First list box: Available examinations */}
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Available Examinations
                  </label>
                  <ul className="border p-4 rounded-sm mr-0 sm:mr-2 max-h-60 overflow-auto">
                    {examinations.map((exam) => (
                      <li
                        key={exam.id}
                        className="mb-2 flex justify-between items-center"
                      >
                        <span>
                          {exam.year} - Level {exam.level} - Semester{' '}
                          {exam.semester} - {exam.degreeProgramName}
                        </span>
                        <button
                          onClick={() => handleSelectExamination(exam)}
                          className="ml-2 text-blue-500"
                        >
                          <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Second list box: Selected examinations */}
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Selected Examinations
                  </label>
                  <ul className="border p-4 rounded-sm ml-0 sm:ml-2 max-h-60 overflow-auto">
                    {selectedExaminations.map((exam) => (
                      <li
                        key={exam.id}
                        className="mb-2 flex justify-between items-center"
                      >
                        <button
                          onClick={() => handleRemoveExamination(exam)}
                          className="text-red-500"
                        >
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <span>
                          {exam.year} - Level {exam.level} - Semester{' '}
                          {exam.semester} - {exam.degreeProgramName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConflictCheck}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 focus:ring-yellow-400 transition-all"
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Check Conflicts</span>
                  </button>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    This will check for timetable conflicts.
                  </span>
                </div>

                {/* Display conflicts in a table */}
                {conflicts.length > 0 && (
                  <div className="mt-6 overflow-x-auto">
                    <h4 className="font-medium text-black dark:text-white">
                      Conflicts Found:
                    </h4>
                    <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-form-input">
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Examination
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Paper
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Conflict Messages
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflicts.map((conflict, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="border px-4 py-2">
                              {conflict.degree} - L{conflict.level} - S
                              {conflict.semester} - {conflict.year}
                            </td>
                            <td className="border px-4 py-2">
                              {conflict.courseCode} (
                              {conflict.examType === 'THEORY'
                                ? 'T'
                                : conflict.examType === 'PRACTICAL'
                                ? 'P'
                                : conflict.examType}
                              ) - {conflict.courseName}
                              {conflict.timetableGroup && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {' - '}
                                  (Group {conflict.timetableGroup})
                                </span>
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              <ul className="list-disc pl-5">
                                {conflict.conflictMessages.map(
                                  (message: string, msgIndex: number) => (
                                    <li key={msgIndex} className="text-sm">
                                      {message}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <>
                <PreviewSynchronizedTimetable
                  selectedExaminations={selectedExaminations}
                  conflicts={conflicts}
                />
              </>
            )}
          </div>

          <div className="flex justify-between mt-8 text-sm">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              className="btn-secondary"
            >
              Previous
            </button>
            {currentStep < steps.length && (
              <button
                type="button"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length))
                }
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynchronizeTimetables;
