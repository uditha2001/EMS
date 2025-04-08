import React, { useState, useEffect } from 'react';
import useApi from '../../api/api';
import useExamCenterApi from '../../api/examCenterApi';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import Stepper from '../PaperTransfer/Stepper';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { faBuilding, faList, faUsers } from '@fortawesome/free-solid-svg-icons';

import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import AssignSupervisorsInvigilators from './AssignSupervisorsAndInvigilators';
import AllocateExamCenters from './AllocateExamCenters';
import GenerateTimetablePDF from './GenerateTimetablePDF';

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
}

const AllocateExamResources: React.FC = () => {
  const { getExaminationById } = useApi();
  const { getAllExamCenters } = useExamCenterApi();
  const {
    getExamTimeTableByExaminationWithResources,
    allocateExamCenters,
    removeExamCenter,
    getOnGoingExaminations,
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
      {
        centerId: string;
        numOfCandidates: string;
        isSaved: boolean;
        remarks: string;
      }[]
    >
  >({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examCenterToRemove, setExamCenterToRemove] = useState<any>(null);
  const [examination, setExamination] = useState<Examination | null>(null);

  const steps = [
    { id: 1, name: 'Select Examination', icon: faList },
    { id: 2, name: 'Allocate Exam Centers', icon: faBuilding },
    { id: 3, name: 'Assign Supervisors & Invigilators', icon: faUsers },
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
              remarks: center.remarks,
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

    if (!selectedExamination) return;
    getExaminationById(selectedExamination).then((response) => {
      setExamination(response);
    });

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
            remarks: centerData.remarks,
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
              remarks: string;
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
        { centerId: '', numOfCandidates: '', isSaved: false, remarks: '' },
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
    field: 'centerId' | 'numOfCandidates' | 'remarks',
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

            {currentStep === 2 && examTimetable.length > 0 && (
              <>
                <AllocateExamCenters
                  examTimetable={examTimetable}
                  allocations={allocations}
                  examCenters={examCenters}
                  handleChangeExamCenter={handleChangeExamCenter}
                  handleAddExamCenter={handleAddExamCenter}
                  handleRemoveExamCenter={handleRemoveExamCenter}
                  handleDeleteExamCenter={handleDeleteExamCenter}
                  calculateTotalCandidates={calculateTotalCandidates}
                  getAvailableCapacity={getAvailableCapacity}
                  handleSaveExamCenters={handleAllocateCenters} 
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAllocateCenters}
                    className="btn-primary"
                    disabled={!!errorMessage}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <AssignSupervisorsInvigilators
                  examTimetable={examTimetable}
                  allocations={allocations}
                  examCenters={examCenters}
                  setExamTimetable={setExamTimetable}
                  setAllocations={setAllocations}
                  selectedExamination={selectedExamination}
                />

                <GenerateTimetablePDF
                  examTimetable={examTimetable}
                  examination={examination}
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
