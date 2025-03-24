import React, { useEffect, useState } from 'react';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import Loader from '../../common/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import useApi from '../../api/api';
import { useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import useHasPermission from '../../hooks/useHasPermission';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

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

  const { getExamTimeTableByExamination, approveTimetable } =
    useExamTimeTableApi();
  const { getExaminationById } = useApi();
  const hasApprovePermission = useHasPermission('APPROVE_TIMETABLE');

  useEffect(() => {
    if (!examinationId) return;
    setIsLoading(true);

    Promise.all([
      getExaminationById(Number(examinationId)),
      getExamTimeTableByExamination(Number(examinationId)),
    ])
      .then(([exam, response]) => {
        setExamination(exam);
        if (response && Array.isArray(response.data.data)) {
          const sortedData = response.data.data.sort(
            (a: ExamTimeTable, b: ExamTimeTable) =>
              new Date(a.date + ' ' + a.startTime).getTime() -
              new Date(b.date + ' ' + b.startTime).getTime(),
          );
          setTimetable(sortedData);
          setIsTimetableApproved(response.data.data[0].approve);
        } else {
          setErrorMessage('Failed to fetch timetable.');
        }
      })
      .catch(() => setErrorMessage('Error fetching timetable.'))
      .finally(() => setIsLoading(false));
  }, [examinationId]);

  const confirmAction = (action: () => void) => {
    setActionToConfirm(() => action);
    setIsConfirmationModalOpen(true);
  };

  const handleApproveTimetable = () => {
    approveTimetable(Number(examinationId))
      .then(() => {
        setIsTimetableApproved(true);
        setSuccessMessage('Timetable approved successfully.');
      })
      .catch(() => setErrorMessage('Failed to approve timetable.'));
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
    const tableData = timetable.map((entry) => [
      { content: formatDateWithDay(entry.date) },
      `${entry.startTime} - ${entry.endTime}`,
      `${entry.courseCode} (${
        entry.examType === 'THEORY'
          ? 'T'
          : entry.examType === 'PRACTICAL'
          ? 'P'
          : entry.examType
      }) - ${entry.courseName}${
        entry.timetableGroup ? ' - (Group ' + entry.timetableGroup + ')' : ''
      }`,
    ]);

    // Create the table and add page numbers on every page
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      margin: { top: 10 },
      didDrawPage: function () {
        // Add page number at the bottom right on every page
        const pageCurrent = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCurrent}`, pageWidth - margin, pageHeight - 10, {
          align: 'right',
        });
      },
    });

    // Footer on final page
    doc.setFontSize(10);
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

            {!isTimetableApproved && hasApprovePermission && (
              <button
                className="bg-primary hover:bg-blue-700 text-white font-medium px-5 py-2 rounded transition duration-200 whitespace-nowrap"
                onClick={() => confirmAction(handleApproveTimetable)}
              >
                Approve Timetable
              </button>
            )}
            <button className="btn-primary" onClick={generatePDF}>
              Download PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto m-4 ">
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
                </tr>
              </thead>
              <tbody>
                {timetable.map((entry) => (
                  <tr
                    key={entry.examTimeTableId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2 italic">
                      {formatDateWithDay(entry.date)}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">{`${entry.startTime} - ${entry.endTime}`}</td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Render the ConfirmationModal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to approve this timetable? Once approved, you won't be able to edit it."
          onConfirm={() => {
            actionToConfirm();
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PreviewTimetable;
