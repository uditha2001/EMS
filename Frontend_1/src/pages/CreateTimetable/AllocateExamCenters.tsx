import React from 'react';
import SearchableSelectBox from '../../components/SearchableSelectBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faPlus,
  faDeleteLeft,
} from '@fortawesome/free-solid-svg-icons';

interface AllocateExamCentersProps {
  examTimetable: any[];
  allocations: Record<
    number,
    { centerId: string; numOfCandidates: string; isSaved: boolean }[]
  >;
  examCenters: any[];
  handleChangeExamCenter: (
    examTimeTableId: number,
    newValue: string,
    index: number,
    field: 'centerId' | 'numOfCandidates',
  ) => void;
  handleAddExamCenter: (examTimeTableId: number) => void;
  handleRemoveExamCenter: (examTimeTableId: number, index: number) => void;
  handleDeleteExamCenter: (
    allocationId: number,
    examTimeTableId: number,
    index: number,
  ) => void;
  calculateTotalCandidates: (examTimeTableId: number) => number;
  getAvailableCapacity: (centerId: string, examTimeTableId: number) => number;
}

const AllocateExamCenters: React.FC<AllocateExamCentersProps> = ({
  examTimetable,
  allocations,
  examCenters,
  handleChangeExamCenter,
  handleAddExamCenter,
  handleRemoveExamCenter,
  handleDeleteExamCenter,
  calculateTotalCandidates,
  getAvailableCapacity,
}) => {
  return (
    <div>
      <h3 className="font-medium text-black dark:text-white mb-4">
        Allocate Exam Centers
      </h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
          <thead>
            <tr className="bg-gray-100 dark:bg-form-input">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Paper
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
                  {exam.examType === 'THEORY'
                    ? 'T'
                    : exam.examType === 'PRACTICAL'
                    ? 'P'
                    : exam.examType}
                  ) - {exam.courseName}
                  {exam.timetableGroup && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {' '}
                      - (Group {exam.timetableGroup})
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
                          disabled={centerData.isSaved}
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
                          disabled={centerData.isSaved}
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
                    onClick={() => handleAddExamCenter(exam.examTimeTableId)}
                    className="text-green-500 hover:text-green-700 mt-2"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add exam center
                  </button>
                  <div className="text-gray-500 text-xs mt-2">
                    {exam.examCenters.length === 0 ? (
                      <span>No centers allocated for this course</span>
                    ) : (
                      <span>
                        Exam centers are already allocated for this course
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
    </div>
  );
};

export default AllocateExamCenters;
