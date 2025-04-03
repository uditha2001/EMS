import React, { useState, useEffect } from 'react';
import SearchableSelectBox from '../../components/SearchableSelectBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDeleteLeft,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useApi from '../../api/api';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

const AssignSupervisorsInvigilators: React.FC<{
  examTimetable: any[];
  allocations: {
    [key: number]: { centerId: string; numOfCandidates: string }[];
  };
  examCenters: any[];
  setExamTimetable: any;
  setAllocations: any;
  selectedExamination: number | null;
}> = ({
  examTimetable,
  allocations,
  examCenters,
  setExamTimetable,
  setAllocations,
  selectedExamination,
}) => {
  const { fetchUsers } = useApi();
  const {
    assignSupervisors,
    assignInvigilators,
    removeInvigilator,
    getExamTimeTableByExaminationWithResources,
  } = useExamTimeTableApi();

  const [users, setUsers] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<{ [key: string]: string }>({});
  const [invigilators, setInvigilators] = useState<{
    [key: string]: string[];
  }>({});
  const [savedInvigilators, setSavedInvigilators] = useState<{
    [key: string]: boolean[];
  }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [invigilatorToRemove, setInvigilatorToRemove] = useState<{
    assignedId: number;
    examTimeTableId: number;
    centerId: string;
    invigilatorId: string;
  } | null>(null);

  const fetchTimetable = async () => {
    try {
      const response = await getExamTimeTableByExaminationWithResources(
        selectedExamination as number,
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

  useEffect(() => {
    if (!selectedExamination) return;
    fetchTimetable();
  }, [selectedExamination]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response);
      } catch (error) {
        setErrorMessage('Failed to fetch users.');
      }
    };
    fetchUsersData();
  }, []);

  useEffect(() => {
    const initialSupervisors: { [key: string]: string } = {};
    const initialInvigilators: { [key: string]: string[] } = {};
    const initialSavedInvigilators: { [key: string]: boolean[] } = {};

    examTimetable.forEach((exam) => {
      exam.examCenters.forEach((center: any) => {
        const key = `${exam.examTimeTableId}-${center.examCenterId}`;

        if (center.supervisor) {
          initialSupervisors[key] = center.supervisor.supervisorId.toString();
        }

        if (center.invigilators && center.invigilators.length > 0) {
          initialInvigilators[key] = center.invigilators.map(
            (invigilator: any) => invigilator.invigilatorId.toString(),
          );
          initialSavedInvigilators[key] = center.invigilators.map(() => true);
        }
      });
    });

    setSupervisors(initialSupervisors);
    setInvigilators(initialInvigilators);
    setSavedInvigilators(initialSavedInvigilators);
  }, [examTimetable]);

  const handleAssignAll = async (examTimeTableId: number, centerId: string) => {
    const selectedSupervisor =
      supervisors[`${examTimeTableId}-${centerId}`] || '';
    const selectedInvigilatorsList =
      invigilators[`${examTimeTableId}-${centerId}`] || [];

    try {
      // Assign supervisor
      if (selectedSupervisor) {
        await assignSupervisors({
          assignments: [
            {
              examTimeTableId,
              examCenterId: parseInt(centerId),
              supervisorId: parseInt(selectedSupervisor),
            },
          ],
        });
      }

      // Assign invigilators
      const invigilatorAssignments = selectedInvigilatorsList.map((userId) => ({
        examTimeTableId,
        examCenterId: parseInt(centerId),
        invigilatorId: parseInt(userId),
      }));

      if (invigilatorAssignments.length > 0) {
        await assignInvigilators({ assignments: invigilatorAssignments });
      }

      // Update saved status of invigilators
      setSavedInvigilators((prev) => ({
        ...prev,
        [`${examTimeTableId}-${centerId}`]: selectedInvigilatorsList.map(
          () => true,
        ),
      }));

      setSuccessMessage('Supervisor and Invigilators assigned successfully!');
    } catch (error) {
      setErrorMessage('Failed to assign Supervisor or Invigilators.');
    }
  };

  const handleRemoveInvigilator = async (
    assignedId: number,
    examTimeTableId: number,
    centerId: string,
    invigilatorId: string,
  ) => {
    try {
      await removeInvigilator(assignedId);

      // Update the local state to remove the invigilator
      setInvigilators((prev) => {
        const key = `${examTimeTableId}-${centerId}`;
        const updatedInvigilators = (prev[key] || []).filter(
          (id) => id !== invigilatorId,
        );
        return { ...prev, [key]: updatedInvigilators };
      });

      setSuccessMessage('Invigilator removed successfully!');
      fetchTimetable();
    } catch (error) {
      setErrorMessage('Failed to remove Invigilator.');
    }
  };

  const isSupervisorAssigned = (examTimeTableId: number, centerId: string) => {
    return !!supervisors[`${examTimeTableId}-${centerId}`];
  };

  const isInvigilatorsAssigned = (
    examTimeTableId: number,
    centerId: string,
  ) => {
    return (invigilators[`${examTimeTableId}-${centerId}`] || []).length > 0;
  };

  const handleDeleteClick = (
    assignedId: number,
    examTimeTableId: number,
    centerId: string,
    invigilatorId: string,
  ) => {
    setInvigilatorToRemove({
      assignedId,
      examTimeTableId,
      centerId,
      invigilatorId,
    });
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    if (invigilatorToRemove) {
      handleRemoveInvigilator(
        invigilatorToRemove.assignedId,
        invigilatorToRemove.examTimeTableId,
        invigilatorToRemove.centerId,
        invigilatorToRemove.invigilatorId,
      );
      setShowConfirmationModal(false);
    }
  };

  return (
    <div>
      <h3 className="font-medium text-black dark:text-white mb-4">
        Assign Supervisors & Invigilators
      </h3>
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
          <thead>
            <tr className="bg-gray-100 dark:bg-form-input">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Paper
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Exam Center
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                No of Candidates
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Supervisor
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Invigilators
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                No of Invigilators
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {examTimetable.map((exam) =>
              (allocations[exam.examTimeTableId] || []).map(
                (centerData, index) => {
                  const center = examCenters.find(
                    (c) => c.id.toString() === centerData.centerId,
                  );
                  const key = `${exam.examTimeTableId}-${centerData.centerId}`;
                  const selectedSupervisor = supervisors[key] || '';
                  const selectedInvigilators = invigilators[key] || [];

                  return (
                    <tr
                      key={`${exam.examTimeTableId}-${index}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="border px-4 py-2">
                        {exam.courseCode} (
                        {exam.examType === 'THEORY'
                          ? 'T'
                          : exam.examType === 'PRACTICAL'
                          ? 'P'
                          : exam.examType}
                        ) - {exam.courseName}
                        {exam.timetableGroup && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {' - '}
                            (Group {exam.timetableGroup})
                          </span>
                        )}
                      </td>
                      <td className="border px-4 py-2">{center?.name}</td>
                      <td className="border px-4 py-2">
                        {centerData.numOfCandidates}
                      </td>
                      <td className="border px-4 py-2">
                        <SearchableSelectBox
                          options={users.map((user) => ({
                            id: user.id.toString(),
                            name: `${user.firstName} ${user.lastName}`,
                          }))}
                          value={selectedSupervisor}
                          onChange={(newValue) =>
                            setSupervisors((prev) => ({
                              ...prev,
                              [`${exam.examTimeTableId}-${centerData.centerId}`]:
                                newValue,
                            }))
                          }
                          placeholder="Search and select a supervisor"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex flex-col gap-2">
                          {selectedInvigilators.map((invigilatorId, idx) => {
                            const isSaved =
                              savedInvigilators[
                                `${exam.examTimeTableId}-${centerData.centerId}`
                              ]?.[idx] || false;

                            const handleRemoveClick = () => {
                              setInvigilators((prev) => {
                                const key = `${exam.examTimeTableId}-${centerData.centerId}`;
                                const updatedInvigilators = (
                                  prev[key] || []
                                ).filter((_, i) => i !== idx);
                                return { ...prev, [key]: updatedInvigilators };
                              });
                            };

                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                {/* Only allow invigilator selection if the supervisor is assigned */}
                                {supervisors[
                                  `${exam.examTimeTableId}-${centerData.centerId}`
                                ] ? (
                                  <SearchableSelectBox
                                    options={users.map((user) => ({
                                      id: user.id.toString(),
                                      name: `${user.firstName} ${user.lastName}`,
                                    }))}
                                    value={invigilatorId}
                                    onChange={(newValue) => {
                                      setInvigilators((prev) => {
                                        const key = `${exam.examTimeTableId}-${centerData.centerId}`;
                                        const currentInvigilators =
                                          prev[key] || [];
                                        const updatedInvigilators = [
                                          ...currentInvigilators,
                                        ];
                                        updatedInvigilators[idx] = newValue;
                                        return {
                                          ...prev,
                                          [key]: updatedInvigilators,
                                        };
                                      });
                                    }}
                                    placeholder="Search and select invigilators"
                                  />
                                ) : (
                                  <span>No supervisor assigned</span>
                                )}
                                {isSaved ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteClick(
                                        exam.examCenters[index].invigilators[
                                          idx
                                        ].assignedId,
                                        exam.examTimeTableId,
                                        centerData.centerId,
                                        exam.examCenters[index].invigilators[
                                          idx
                                        ].invigilatorId.toString(),
                                      )
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FontAwesomeIcon icon={faDeleteLeft} />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveClick()}
                                  >
                                    <FontAwesomeIcon icon={faMinus} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                supervisors[
                                  `${exam.examTimeTableId}-${centerData.centerId}`
                                ]
                              ) {
                                setInvigilators((prev) => {
                                  const key = `${exam.examTimeTableId}-${centerData.centerId}`;
                                  const currentInvigilators = prev[key] || [];
                                  return {
                                    ...prev,
                                    [key]: [...currentInvigilators, ''],
                                  };
                                });
                              }
                            }}
                            className={`${
                              !supervisors[
                                `${exam.examTimeTableId}-${centerData.centerId}`
                              ]
                                ? 'disabled:opacity-50 cursor-not-allowed'
                                : 'text-green-500 hover:underline'
                            }`}
                            disabled={
                              !supervisors[
                                `${exam.examTimeTableId}-${centerData.centerId}`
                              ]
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} /> Add
                          </button>
                        </div>
                      </td>

                      <td className="border px-4 py-2">
                        {selectedInvigilators.length}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleAssignAll(
                              exam.examTimeTableId,
                              centerData.centerId,
                            )
                          }
                          className={`${
                            isSupervisorAssigned(
                              exam.examTimeTableId,
                              centerData.centerId,
                            ) ||
                            isInvigilatorsAssigned(
                              exam.examTimeTableId,
                              centerData.centerId,
                            )
                              ? 'text-primary hover:underline'
                              : 'disabled:opacity-50 cursor-not-allowed'
                          }`}
                          disabled={
                            !supervisors[
                              `${exam.examTimeTableId}-${centerData.centerId}`
                            ]
                          }
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  );
                },
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to remove this invigilator?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default AssignSupervisorsInvigilators;
