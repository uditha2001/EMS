import React from 'react';
import SearchableSelectBox from '../../components/SearchableSelectBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faPlus,
  faDeleteLeft,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

interface AllocateExamCentersProps {
  examTimetable: any[];
  allocations: Record<
    number,
    {
      centerId: string;
      numOfCandidates: string;
      isSaved: boolean;
      remarks: string;
    }[]
  >;
  examCenters: any[];
  handleChangeExamCenter: (
    examTimeTableId: number,
    newValue: string,
    index: number,
    field: 'centerId' | 'numOfCandidates' | 'remarks',
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
  handleSaveExamCenters: (examTimeTableId: number) => void; // New prop for saving
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
  handleSaveExamCenters, // New prop
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
              <th className="border border-gray-300 px-3 md:px-4 py-2 text-left">
                Action
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
                        className="relative mb-2 flex flex-col gap-2 w-300"
                      >
                        {/* First row: Center capacity and max */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
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
                            className="input-field px-2 py-1 md:w-28"
                            placeholder="No of Candidates"
                            disabled={centerData.isSaved}
                            min={0}
                            max={getAvailableCapacity(
                              centerData.centerId,
                              exam.examTimeTableId,
                            )}
                          />
                          <span className="text-xs text-gray-500">
                            Available:{' '}
                            {getAvailableCapacity(
                              centerData.centerId,
                              exam.examTimeTableId,
                            )}
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

                        {/* Second row: Remarks */}
                        <div className="w-full">
                          <textarea
                            value={centerData.remarks}
                            onChange={(e) =>
                              handleChangeExamCenter(
                                exam.examTimeTableId,
                                e.target.value,
                                index,
                                'remarks',
                              )
                            }
                            className="input-field "
                            placeholder="Remarks (optional) max 100 characters"
                            disabled={centerData.isSaved}
                            maxLength={100}
                          />
                        </div>

                        {/* Delete or Remove Button */}
                      </div>
                    ),
                  )}

                  {/* Add Exam Center Button */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="button"
                      onClick={() => handleAddExamCenter(exam.examTimeTableId)}
                      className="text-green-500 hover:text-green-700 mt-2"
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add exam center
                    </button>
                    <span className="text-sm text-gray-500">
                      {exam.examCenters.length === 0
                        ? 'No centers allocated'
                        : `${exam.examCenters.length} center(s) allocated`}
                    </span>
                  </div>
                </td>

                <td className="border px-4 py-2">
                  {calculateTotalCandidates(exam.examTimeTableId)}
                </td>
                <td className="border px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleSaveExamCenters(exam.examTimeTableId)}
                    className="text-primary hover:underline disabled:opacity-50 flex items-center gap-2"
                    disabled={
                      (allocations[exam.examTimeTableId] || []).every(
                        (center) => center.isSaved,
                      ) ||
                      (allocations[exam.examTimeTableId] || []).length === 0
                    }
                  >
                    <FontAwesomeIcon icon={faSave} />
                    Save
                  </button>
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
