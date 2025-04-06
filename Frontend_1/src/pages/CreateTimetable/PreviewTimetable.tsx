import React, { useEffect, useState } from 'react';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import Loader from '../../common/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import { jsPDF } from 'jspdf';
import autoTable, { FontStyle } from 'jspdf-autotable';
import useApi from '../../api/api';
import { Link, useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import useHasPermission from '../../hooks/useHasPermission';
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
}

interface ExamTimeTable {
  examTimeTableId: number;
  courseCode: string;
  courseName: string;
  examType: string;
  date: string;
  startTime: string;
  endTime: string;
  timetableGroup: string;
  approve: boolean;
  courseId: number;
  hasPaper: boolean;
}

interface TimeTableRevision {
  id: number;
  examTimeTableId: number;
  previousDate: string;
  previousStartTime: string;
  previousEndTime: string;
  revisedById: number;
  revisedBy: string;
  changeReason: string;
  revisedAt: string;
}

interface PreviewTimetableProps {
  examinationId: number | null;
}

const PreviewTimetable: React.FC<PreviewTimetableProps> = ({
  examinationId: propExaminationId,
}) => {
  const { examinationId: paramExaminationId } = useParams<{
    examinationId: string;
  }>();

  // Use prop if available, otherwise fallback to URL param
  const examinationId = propExaminationId ?? paramExaminationId;
  const [timetable, setTimetable] = useState<ExamTimeTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [examination, setExamination] = useState<Examination | null>(null);
  const [isTimetableApproved, setIsTimetableApproved] =
    useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<() => void>(() => {});
  const [approvingSlotId, setApprovingSlotId] = useState<number | null>(null);
  const [missingPapers, setMissingPapers] = useState<
    { courseCode: string; courseName: string; examType: string }[]
  >([]);

  const {
    getExamTimeTableByExamination,
    approveTimetable,
    approveTimeSlot,
    checkPaperExists,
  } = useExamTimeTableApi();
  const { getExaminationById } = useApi();
  const hasApprovePermission = useHasPermission('APPROVE_TIMETABLE');

  const [revisions, setRevisions] = useState<TimeTableRevision[]>([]);
  const { getTimetableRevisions } = useExamTimeTableApi();

  useEffect(() => {
    if (!examinationId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const [exam, timetableResponse, revisionsResponse] = await Promise.all([
          getExaminationById(Number(examinationId)),
          getExamTimeTableByExamination(Number(examinationId)),
          getTimetableRevisions(Number(examinationId)),
        ]);

        setExamination(exam);
        setRevisions(revisionsResponse.data || []);
      

        if (
          !timetableResponse?.data?.data ||
          !Array.isArray(timetableResponse.data.data)
        ) {
          setErrorMessage('Failed to fetch timetable data');
          return;
        }

        // First, get all Theory/Practical entries that need paper checks
        const entriesNeedingCheck = timetableResponse.data.data.filter(
          (entry: ExamTimeTable) =>
            entry.examType === 'THEORY' || entry.examType === 'PRACTICAL',
        );

        // Batch check papers for these entries
        const paperChecks = await Promise.all(
          entriesNeedingCheck.map((entry: ExamTimeTable) =>
            checkPaperExists(
              entry.courseId,
              Number(examinationId),
              entry.examType as 'THEORY' | 'PRACTICAL',
            ).then((exists) => ({
              courseId: entry.courseId,
              examType: entry.examType,
              exists,
            })),
          ),
        );

        // Create a map of courseId+examType to paper existence
        const paperExistsMap = new Map<string, boolean>();
        paperChecks.forEach((check) => {
          paperExistsMap.set(
            `${check.courseId}-${check.examType}`,
            check.exists,
          );
        });

        // Process all timetable entries
        const processedTimetable = timetableResponse.data.data.map(
          (entry: ExamTimeTable) => {
            const needsPaper =
              entry.examType === 'THEORY' || entry.examType === 'PRACTICAL';
            const hasPaper = needsPaper
              ? paperExistsMap.get(`${entry.courseId}-${entry.examType}`) ??
                false
              : true;

            return {
              ...entry,
              hasPaper,
            };
          },
        );

        // Sort by date and time
        const sortedData = processedTimetable.sort(
          (a: ExamTimeTable, b: ExamTimeTable) =>
            new Date(a.date + ' ' + a.startTime).getTime() -
            new Date(b.date + ' ' + b.startTime).getTime(),
        );

        setTimetable(sortedData);
        setIsTimetableApproved(
          sortedData.every((entry: ExamTimeTable) => entry.approve),
        );

        // Find missing papers for display
        const missing = sortedData
          .filter(
            (entry: ExamTimeTable) =>
              (entry.examType === 'THEORY' || entry.examType === 'PRACTICAL') &&
              !entry.hasPaper,
          )
          .map((entry: ExamTimeTable) => ({
            courseCode: entry.courseCode,
            courseName: entry.courseName,
            examType: entry.examType,
          }));
        setMissingPapers(missing);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setErrorMessage('Error fetching timetable data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [examinationId]);

  const hasRevisions = (examTimeTableId: number) => {
    return revisions.some((rev) => rev.examTimeTableId === examTimeTableId);
  };

  const confirmAction = (action: () => void, slotId: number | null = null) => {
    setActionToConfirm(() => action);
    setApprovingSlotId(slotId);
    setIsConfirmationModalOpen(true);
  };

  const handleApproveTimetable = async () => {
    try {
      // Check if there are any missing papers for Theory/Practical exams
      const hasMissingPapers = timetable.some(
        (entry) =>
          (entry.examType === 'THEORY' || entry.examType === 'PRACTICAL') &&
          !entry.hasPaper,
      );

      if (hasMissingPapers) {
        setErrorMessage('Cannot approve timetable. Some papers are missing.');
        return;
      }

      await approveTimetable(Number(examinationId));
      setIsTimetableApproved(true);
      setSuccessMessage('Timetable approved successfully.');
    } catch (error) {
      setErrorMessage('Failed to approve timetable.');
    }
  };

  const handleApproveTimeSlot = async (slotId: number) => {
    try {
      const slot = timetable.find((entry) => entry.examTimeTableId === slotId);
      if (!slot) return;

      // Check paper existence for Theory/Practical exams
      if (
        (slot.examType === 'THEORY' || slot.examType === 'PRACTICAL') &&
        !slot.hasPaper
      ) {
        setErrorMessage(
          `Cannot approve time slot. Paper not found for ${slot.courseCode} - ${slot.courseName} (${slot.examType})`,
        );
        return;
      }

      await approveTimeSlot(slotId);

      // Update local state
      setTimetable((prev) =>
        prev.map((entry) =>
          entry.examTimeTableId === slotId
            ? { ...entry, approve: true }
            : entry,
        ),
      );

      setSuccessMessage(
        `Time slot for ${slot.courseCode} approved successfully.`,
      );
    } catch (error) {
      setErrorMessage('Failed to approve time slot.');
    }
  };

  // Extract Examination Start and End Date
  const examStartDate = timetable.length > 0 ? timetable[0].date : '';
  const examEndDate =
    timetable.length > 0 ? timetable[timetable.length - 1].date : '';

  const formatDateWithDay = (dateString: string) => {
    const date = new Date(dateString);
    return `${dateString} (${date.toLocaleDateString('en-US', {
      weekday: 'long',
    })})`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 40;

    // Header on the first page
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('University of Ruhuna', pageWidth / 2, 15, { align: 'center' });
    doc.text('Department of Computer Science', pageWidth / 2, 21, {
      align: 'center',
    });
    doc.text('Examination Timetable', pageWidth / 2, 27, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Examination: ${examination?.degreeProgramName} - Level ${examination?.level} - Semester ${examination?.semester} - ${examination?.year}`,
      margin,
      currentY,
    );

    if (examStartDate && examEndDate) {
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Examination Period: ${examStartDate} to ${examEndDate}`,
        margin,
        currentY + 10,
      );
      doc.setFont('helvetica', 'normal');
    }

    doc.line(margin, currentY + 15, pageWidth - margin, currentY + 15);
    currentY += 25;

    // Table Headers and Data
    const tableHeaders = ['Date', 'Time', 'Paper'];
    const tableData = timetable.map((entry) => {
      const isRevised = hasRevisions(entry.examTimeTableId);
      const textColor = isRevised ? [0, 0, 255] as [number, number, number] : undefined;
      const fontStyle = isRevised ? ('bolditalic' as FontStyle) : undefined;
      
      return [
        { 
          content: formatDateWithDay(entry.date) + (isRevised ? ' (Revised)' : ''),
          styles: { 
            fontStyle: fontStyle,
            textColor
          }
        },
        { 
          content: `${entry.startTime} - ${entry.endTime}`,
          styles: { 
            textColor
          }
        },
        { 
          content: `${entry.courseCode} (${
            entry.examType === 'THEORY'
              ? 'T'
              : entry.examType === 'PRACTICAL'
              ? 'P'
              : entry.examType
          }) - ${entry.courseName}${
            entry.timetableGroup ? ' - (Group ' + entry.timetableGroup + ')' : ''
          }`,
          styles: { 
            textColor
          }
        }
      ];
    });

    // Create the table with conditional styling
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 10, 
        cellPadding: 3,
      },
      headStyles: { 
        fillColor: [22, 160, 133], 
        textColor: [255, 255, 255] 
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
        // Add left border for revised entries
        if (data.column.index === 0 && hasRevisions(timetable[data.row.index].examTimeTableId)) {
          doc.setDrawColor(0, 0, 255); // Blue border
          doc.setLineWidth(0.5);
          doc.line(
            data.cell.x,
            data.cell.y,
            data.cell.x,
            data.cell.y + data.cell.height
          );
        }
      },
      didDrawPage: function () {
        // Add page number at the bottom right on every page
        const pageCurrent = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCurrent}`, pageWidth - margin, pageHeight - 10, {
          align: 'right',
        });
      },
    });

    // Add legend for revised entries
    currentY = (doc as any).lastAutoTable?.finalY + 10 || currentY;
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 255); // Blue
    doc.text('* Revised entries are shown in blue', margin, currentY);

    // Footer on final page
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      doc.internal.pageSize.height - 10,
    );

    doc.save(`exam-timetable-${examination?.year}.pdf`);
  };

  return (
    <div className="mx-auto max-w-270">
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
      <SuccessMessage
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />

      {/* Missing Papers Warning */}
      {missingPapers.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-400 mr-2" />
            <h3 className="text-yellow-800 font-medium">Missing Papers</h3>
          </div>
          <p className="text-yellow-700 mt-1">
            The following courses are missing papers (required for
            Theory/Practical exams):
          </p>
          <ul className="list-disc pl-5 text-yellow-700 mt-1">
            {missingPapers.map((paper, index) => (
              <li key={index}>
                {paper.courseCode} - {paper.courseName} ({paper.examType})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke dark:border-strokedark py-6 px-8">
          <header className="text-center mb-6">
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">
              University of Ruhuna
            </h4>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Department of Computer Science
            </h3>
            <h2
              className={`text-xl font-bold flex justify-center items-center gap-2 ${
                isTimetableApproved ? 'text-green-500' : 'text-yellow-500'
              }`}
            >
              {isTimetableApproved ? (
                <>
                  <FaCheckCircle className="text-green-500" />
                  Examination Timetable (Approved)
                </>
              ) : (
                <>
                  <FaClock className="text-yellow-500" />
                  Examination Timetable (Pending Approval)
                </>
              )}
            </h2>
            {examStartDate && examEndDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Examination Period: {examStartDate} to {examEndDate}
              </p>
            )}
          </header>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
              Examination: {examination?.degreeProgramName} - Level{' '}
              {examination?.level} - Semester {examination?.semester} -{' '}
              {examination?.year}
            </h3>

            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              {!isTimetableApproved && hasApprovePermission && (
                <button
                  className="bg-primary hover:bg-blue-700 text-white font-medium px-5 py-2 rounded transition duration-200 whitespace-nowrap w-full sm:w-auto"
                  onClick={() => confirmAction(handleApproveTimetable)}
                  disabled={missingPapers.length > 0}
                >
                  Approve Entire Timetable
                </button>
              )}
              <button
                className="btn-primary w-full sm:w-auto"
                onClick={generatePDF}
              >
                Download PDF
              </button>
              <Link
                className="btn-primary w-full sm:w-auto"
                to={'/scheduling/revisions/' + examinationId}
              >
                Revisions
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto m-4">
            <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
              <thead>
                <tr className="bg-gray-100 dark:bg-form-input">
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Time
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Paper
                  </th>
                  {hasApprovePermission && !isTimetableApproved && (
                    <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {timetable.map((entry) => (
                  <tr
                    key={entry.examTimeTableId}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      entry.approve ? 'bg-green-50 dark:bg-gray-800' : ''
                    } ${
                      (entry.examType === 'THEORY' ||
                        entry.examType === 'PRACTICAL') &&
                      !entry.hasPaper
                        ? 'bg-yellow-50 dark:bg-yellow-900'
                        : ''
                    } ${
                      hasRevisions(entry.examTimeTableId)
                        ? 'border-l-4 border-blue-500 dark:border-blue-400'
                        : ''
                    }`}
                  >
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2 italic">
                      {formatDateWithDay(entry.date)}
                      {hasRevisions(entry.examTimeTableId) && (
                        <span
                          className="ml-2 text-blue-600 dark:text-blue-300 text-xs"
                          title="This slot has been revised"
                        >
                          (Revised)
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {entry.startTime} - {entry.endTime}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      <div className="flex items-center">
                        {entry.courseCode} (
                        {entry.examType === 'THEORY'
                          ? 'T'
                          : entry.examType === 'PRACTICAL'
                          ? 'P'
                          : entry.examType}
                        ) - {entry.courseName}
                        {entry.timetableGroup && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {' - '}
                            (Group {entry.timetableGroup})
                          </span>
                        )}
                        {(entry.examType === 'THEORY' ||
                          entry.examType === 'PRACTICAL') &&
                          !entry.hasPaper && (
                            <span
                              className="ml-2 text-yellow-600 dark:text-yellow-300"
                              title="Paper not found"
                            >
                              <FaExclamationTriangle />
                            </span>
                          )}
                        {entry.approve && (
                          <span
                            className="ml-2 text-green-600 dark:text-green-300"
                            title="Approved"
                          >
                            <FaCheckCircle />
                          </span>
                        )}
                      </div>
                    </td>
                    {hasApprovePermission && !isTimetableApproved && (
                      <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                        {!entry.approve && (
                          <button
                            onClick={() =>
                              confirmAction(
                                () =>
                                  handleApproveTimeSlot(entry.examTimeTableId),
                                entry.examTimeTableId,
                              )
                            }
                            className={`px-3 py-1 rounded ${
                              (entry.examType === 'THEORY' ||
                                entry.examType === 'PRACTICAL') &&
                              !entry.hasPaper
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            disabled={
                              (entry.examType === 'THEORY' ||
                                entry.examType === 'PRACTICAL') &&
                              !entry.hasPaper
                            }
                            title={
                              (entry.examType === 'THEORY' ||
                                entry.examType === 'PRACTICAL') &&
                              !entry.hasPaper
                                ? `Paper not found for ${entry.courseCode} (${entry.examType})`
                                : 'Approve this time slot'
                            }
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          message={
            approvingSlotId
              ? 'Are you sure you want to approve this time slot?'
              : "Are you sure you want to approve the entire timetable? Once approved, you won't be able to edit it."
          }
          onConfirm={() => {
            actionToConfirm();
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => {
            setIsConfirmationModalOpen(false);
            setApprovingSlotId(null);
          }}
        />
      )}
    </div>
  );
};

export default PreviewTimetable;
