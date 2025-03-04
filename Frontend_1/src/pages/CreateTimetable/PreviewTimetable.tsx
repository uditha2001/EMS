import React, { useEffect, useState } from 'react';
import useExamTimeTableApi from '../../api/examTimeTableApi';
import Loader from '../../common/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import useApi from '../../api/api';

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
}

interface PreviewTimetableProps {
  examinationId: number | null;
}

const PreviewTimetable: React.FC<PreviewTimetableProps> = ({
  examinationId,
}) => {
  const [timetable, setTimetable] = useState<ExamTimeTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [examination, setExamination] = useState<Examination | null>(null);
  const { getExamTimeTableByExamination } = useExamTimeTableApi();
  const { getExaminationById } = useApi();

  useEffect(() => {
    if (!examinationId) return;
    setIsLoading(true);

    Promise.all([
      getExaminationById(examinationId),
      getExamTimeTableByExamination(examinationId),
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
        } else {
          setErrorMessage('Failed to fetch timetable.');
        }
      })
      .catch(() => setErrorMessage('Error fetching timetable.'))
      .finally(() => setIsLoading(false));
  }, [examinationId]);

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
    let currentY = 40;

    // Header
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

    // Table Headers
    const tableHeaders = ['Date', 'Time', 'Course'];
    const tableData = timetable.map((entry) => [
      { content: formatDateWithDay(entry.date) },
      `${entry.startTime} - ${entry.endTime}`,
      `${entry.courseCode} (${entry.examType === 'THEORY' ? 'T' : 'P'}) - ${entry.courseName}${entry.timetableGroup ? ' - (Group ' + entry.timetableGroup + ')' : ''}`,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      margin: { top: 10 },
    });

    // Footer
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      doc.internal.pageSize.height - 15,
    );

    doc.save(`exam-timetable-${examination?.year}.pdf`);
  };

  return (
    <div className="mx-auto max-w-270">
      <ErrorMessage
        message={errorMessage}
        onClose={() => setErrorMessage('')}
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
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
              Examination Timetable
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
                    Course
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
                      {entry.examType === 'THEORY' ? 'T' : 'P'}) -{' '}
                      {entry.courseName}
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
    </div>
  );
};

export default PreviewTimetable;
