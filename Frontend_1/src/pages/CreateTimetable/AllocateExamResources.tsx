import React, { useState, useEffect } from 'react';
import useApi from '../../api/api';
import useExamCenterApi from '../../api/examCenterApi';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import Stepper from '../PaperTransfer/Stepper';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import {
  faBuilding,
  faList,
  faUsers,
  faMinus,
  faPlus,
  faDeleteLeft,
} from '@fortawesome/free-solid-svg-icons';
import SearchableSelectBox from '../../components/SearchableSelectBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import AssignSupervisorsInvigilators from './AssignSupervisorsAndInvigilators';

const AllocateExamResources: React.FC = () => {
  const { getExaminations } = useApi();
  const { getAllExamCenters } = useExamCenterApi();
  const {
    getExamTimeTableByExaminationWithResources,
    allocateExamCenters,
    removeExamCenter,
  } = useExamTimeTableApi();

  const [examinations, setExaminations] = useState<any[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<number | null>(
    null,
  );
  const [examTimetable, setExamTimetable] = useState<any[]>([]);
  const [examCenters, setExamCenters] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<
    Record<
      number,
      { centerId: string; numOfCandidates: string; isSaved: boolean }[]
    >
  >({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examCenterToRemove, setExamCenterToRemove] = useState<any>(null);

  const steps = [
    { id: 1, name: 'Select Examination', icon: faList },
    { id: 2, name: 'Allocate Exam Centers', icon: faBuilding },
    { id: 3, name: 'Assign Supervisors & Invigilators', icon: faUsers },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examRes = await getExaminations();
        setExaminations(examRes.data.data);
      } catch (error) {
        setErrorMessage('Failed to fetch examinations.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedExamination) return;

    const fetchTimetable = async () => {
      try {
        const response = await getExamTimeTableByExaminationWithResources(
          selectedExamination,
        );
        setExamTimetable(response.data.data);
        // Prepopulate allocations for each exam timetable
        const initialAllocations = response.data.data.reduce(
          (acc: any, exam: any) => {
            acc[exam.examTimeTableId] = exam.examCenters.map((center: any) => ({
              centerId: center.examCenterId.toString(),
              numOfCandidates: center.numOfCandidates.toString(),
              isSaved: true, // Mark as saved initially
            }));
            return acc;
          },
          {},
        );
        setAllocations(initialAllocations);
      } catch (error) {
        setErrorMessage('Failed to fetch timetable.');
      }
    };

    fetchTimetable();
  }, [selectedExamination]);

  useEffect(() => {
    const fetchExamCenters = async () => {
      try {
        const response = await getAllExamCenters();
        setExamCenters(response.data.data);
      } catch (error) {
        setErrorMessage('Failed to fetch exam centers.');
      }
    };

    fetchExamCenters();
  }, []);

  const handleAllocateCenters = async () => {
    try {
      const allocationList = Object.entries(allocations).flatMap(
        ([examTimeTableId, examCentersData]) =>
          examCentersData.map((centerData) => ({
            examTimeTableId: Number(examTimeTableId),
            examCenterId: centerData.centerId,
            numOfCandidates: centerData.numOfCandidates,
          })),
      );

      await allocateExamCenters({ allocations: allocationList });

      // Mark all allocations as saved
      setAllocations((prev) => {
        const newAllocations = { ...prev };
        Object.keys(newAllocations).forEach((key) => {
          newAllocations[Number(key as unknown as number)] = newAllocations[
            key as unknown as keyof typeof newAllocations
          ].map(
            (center: {
              centerId: string;
              numOfCandidates: string;
              isSaved: boolean;
            }) => ({
              ...center,
              isSaved: true,
            }),
          );
        });
        return newAllocations;
      });

      setSuccessMessage('Exam centers allocated successfully.');
    } catch (error) {
      setErrorMessage('Failed to allocate exam centers.');
    }
  };

  const handleAddExamCenter = (examTimeTableId: number) => {
    setAllocations((prev) => ({
      ...prev,
      [examTimeTableId]: [
        ...(prev[examTimeTableId] || []),
        { centerId: '', numOfCandidates: '', isSaved: false },
      ],
    }));
  };

  const handleRemoveExamCenter = (examTimeTableId: number, index: number) => {
    setAllocations((prev) => {
      const newAllocations = [...(prev[examTimeTableId] || [])];
      newAllocations.splice(index, 1);
      return { ...prev, [examTimeTableId]: newAllocations };
    });
  };

  const handleChangeExamCenter = (
    examTimeTableId: number,
    newValue: string,
    index: number,
    field: 'centerId' | 'numOfCandidates',
  ) => {
    setAllocations((prev) => {
      const newAllocations = [...(prev[examTimeTableId] || [])];
      newAllocations[index] = { ...newAllocations[index], [field]: newValue };
      return { ...prev, [examTimeTableId]: newAllocations };
    });
  };

  const calculateTotalCandidates = (examTimeTableId: number) => {
    const centers = allocations[examTimeTableId] || [];
    return centers.reduce(
      (total, center) => total + (parseInt(center.numOfCandidates) || 0),
      0,
    );
  };

  const getAvailableCapacity = (centerId: string, examTimeTableId: number) => {
    const center = examCenters.find((c) => c.id.toString() === centerId);
    if (!center) return 0;

    // Calculate total candidates allocated for this center in the same time slot
    const totalAllocatedForCenter = Object.entries(allocations).reduce(
      (total, [timeTableId, examCentersData]) => {
        if (timeTableId === examTimeTableId.toString()) {
          return (
            total +
            examCentersData.reduce((sum, centerData) => {
              return centerData.centerId === centerId
                ? sum + parseInt(centerData.numOfCandidates || '0')
                : sum;
            }, 0)
          );
        }
        return total;
      },
      0,
    );

    return center.capacity - totalAllocatedForCenter;
  };

  const handleDeleteExamCenter = (
    allocationId: number,
    examTimeTableId: number,
    index: number,
  ) => {
    if (!allocationId) return; // Avoid deleting an already existing allocation
    setExamCenterToRemove({ allocationId, examTimeTableId, index });
    setIsModalOpen(true);
  };

  const handleRemoveCenter = async (
    allocationId: number,
    examTimeTableId: number,
    index: number,
  ) => {
    try {
      // Remove the exam center by allocationId
      await removeExamCenter(allocationId);

      // Update allocations to remove the deleted exam center
      setAllocations((prev) => {
        const newAllocations = { ...prev };
        newAllocations[examTimeTableId] = newAllocations[
          examTimeTableId
        ].filter((_center, i) => i !== index);
        return newAllocations;
      });

      setSuccessMessage('Exam center removed successfully!');
    } catch (error) {
      setErrorMessage('Failed to remove exam center.');
    }
  };

  const handleConfirmRemove = () => {
    if (examCenterToRemove) {
      const { allocationId, examTimeTableId, index } = examCenterToRemove;
      handleRemoveCenter(allocationId, examTimeTableId, index);
    }
    setIsModalOpen(false);
  };

  const handleCancelRemove = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-auto">
      <Breadcrumb pageName="Allocate Exam Resources" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-auto mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Allocate Exam Resources
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
              <div className="w-1/3">
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

            {currentStep === 2 && examTimetable.length > 0 && (
              <div>
                <h3 className="font-medium text-black dark:text-white mb-4">
                  Allocate Exam Centers
                </h3>

                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-form-input">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Course
                        </th>
                        <th className="border border-gray-300 px-3 md:px-4 py-2 text-left">
                          Date
                        </th>
                        <th className="border border-gray-300 px-3 md:px-4 py-2 text-left">
                          Time
                        </th>
                        <th className="border border-gray-300 px-3 md:px-4 py-2 text-left">
                          Exam Centers
                        </th>
                        <th className="border border-gray-300 px-3 md:px-4 py-2 text-left">
                          Total Candidates
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {examTimetable.map((exam) => (
                        <tr
                          key={exam.examTimeTableId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="border px-4 py-2">
                            {exam.courseCode} (
                            {exam.examType === 'THEORY' ? 'T' : 'P'}) -{' '}
                            {exam.courseName}
                            {exam.timetableGroup && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {' - '}
                                (Group {exam.timetableGroup})
                              </span>
                            )}
                          </td>
                          <td className="border px-4 py-2">{exam.date}</td>
                          <td className="border px-4 py-2">
                            {exam.startTime} - {exam.endTime}
                          </td>
                          <td className="border px-4 py-2">
                            {(allocations[exam.examTimeTableId] || []).map(
                              (centerData, index) => (
                                <div
                                  key={index}
                                  className="relative mb-2 flex flex-col md:flex-row md:items-center gap-2"
                                >
                                  <SearchableSelectBox
                                    options={examCenters.map((center) => ({
                                      id: center.id.toString(),
                                      name: center.name,
                                    }))}
                                    value={centerData.centerId}
                                    onChange={(newValue) =>
                                      handleChangeExamCenter(
                                        exam.examTimeTableId,
                                        newValue,
                                        index,
                                        'centerId',
                                      )
                                    }
                                    label={`Select Exam Center ${index + 1}`}
                                    placeholder="Search and select an exam center"
                                  />

                                  <input
                                    type="number"
                                    value={centerData.numOfCandidates}
                                    onChange={(e) =>
                                      handleChangeExamCenter(
                                        exam.examTimeTableId,
                                        e.target.value,
                                        index,
                                        'numOfCandidates',
                                      )
                                    }
                                    className="input-field mt-2 md:mt-0 px-2 py-1 md:w-28"
                                    placeholder="No of Candidates"
                                    min={0}
                                    max={getAvailableCapacity(
                                      centerData.centerId,
                                      exam.examTimeTableId,
                                    )}
                                  />
                                  <span className="text-xs md:text-sm text-gray-500">
                                    Available:{' '}
                                    {getAvailableCapacity(
                                      centerData.centerId,
                                      exam.examTimeTableId,
                                    )}{' '}
                                    candidates
                                  </span>

                                  {centerData.isSaved ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteExamCenter(
                                          exam.examCenters[index].allocationId,
                                          exam.examTimeTableId,
                                          index,
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700 md:ml-2"
                                    >
                                      <FontAwesomeIcon icon={faDeleteLeft} />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveExamCenter(
                                          exam.examTimeTableId,
                                          index,
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700 md:ml-2"
                                    >
                                      <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                  )}
                                </div>
                              ),
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleAddExamCenter(exam.examTimeTableId)
                              }
                              className="text-green-500 hover:text-green-700 mt-2"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add exam center
                            </button>
                            <div className="text-gray-500 text-xs mt-2">
                              {exam.examCenters.length === 0 ? (
                                <span>
                                  No centers allocated for this course
                                </span>
                              ) : (
                                <span>
                                  Exam centers are already allocated for this
                                  course
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="border px-4 py-2">
                            {calculateTotalCandidates(exam.examTimeTableId)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAllocateCenters}
                    className="btn-primary"
                    disabled={!!errorMessage}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <AssignSupervisorsInvigilators
                examTimetable={examTimetable}
                allocations={allocations}
                examCenters={examCenters}
              />
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
      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to remove this exam center?"
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}
    </div>
  );
};

export default AllocateExamResources;
