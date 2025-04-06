import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../api/api';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import useExamTimeTableApi from '../../api/examTimeTableApi';

interface TimetableRevision {
  id: number;
  previousDate: string;
  previousStartTime: string;
  previousEndTime: string;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  changeReason: string | null;
  changeTimestamp: string;
  changedBy: string;
  courseCode?: string;
  courseName?: string;
  paperType?: 'THEORY' | 'PRACTICAL';
}

interface Examination {
  id: string;
  year: string;
  level: string;
  semester: string;
  degreeProgramName: string;
}

const PreviewTimetableRevisions: React.FC = () => {
  const { examinationId } = useParams<{ examinationId: string }>();
  const [revisions, setRevisions] = useState<TimetableRevision[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [examination, setExamination] = useState<Examination | null>(null);
  const { getExaminationById } = useApi();
  const { getTimetableRevisions } = useExamTimeTableApi();

  useEffect(() => {
    if (!examinationId) return;
    setIsLoading(true);

    Promise.all([
      getExaminationById(Number(examinationId)),
      getTimetableRevisions(Number(examinationId)),
    ])
      .then(([exam, response]) => {
        setExamination(exam);
        if (response?.data && Array.isArray(response.data)) {
          setRevisions(response.data);
        } else {
          setErrorMessage('Failed to fetch timetable revisions.');
        }
      })
      .catch(() => setErrorMessage('Error fetching data.'))
      .finally(() => setIsLoading(false));
  }, [examinationId]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 40; // Track current Y position

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('University of Ruhuna', pageWidth / 2, 15, { align: 'center' });
    doc.text('Department of Computer Science', pageWidth / 2, 25, {
      align: 'center',
    });

    // Exam Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Examination: ${examination?.degreeProgramName} - Level ${examination?.level} - Semester ${examination?.semester} - ${examination?.year}`,
      margin,
      currentY,
    );

    doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5); // Separator line
    currentY += 15;

    doc.setFontSize(14);
    doc.text('Timetable Revisions', margin, currentY);
    currentY += 10;

    // Table Headers
    const tableHeaders = [
      'Course',
      'Paper Type',
      'Previous Date',
      'Previous Time',
      'New Date',
      'New Time',
      'Change Reason',
      'Changed By',
      'Change Date',
    ];

    // Data for the table
    const tableData = revisions.map((revision) => [
      revision.courseCode || 'N/A',
      revision.paperType || 'N/A',
      revision.previousDate,
      `${revision.previousStartTime} - ${revision.previousEndTime}`,
      revision.newDate,
      `${revision.newStartTime} - ${revision.newEndTime}`,
      revision.changeReason || 'N/A',
      revision.changedBy,
      new Date(revision.changeTimestamp).toLocaleString(),
    ]);

    // Generate Table
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Green header
      margin: { top: 10 },
    });

    // Footer Section with time
    currentY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      currentY + 10,
    );

    // Signatures
    const colWidth = (pageWidth - 3 * margin) / 2;
    doc.setFontSize(10);
    doc.text('Revised by:', margin, currentY + 20);
    doc.line(margin + 30, currentY + 22, margin + colWidth - 20, currentY + 22);

    doc.text('Authorized by:', margin + colWidth, currentY + 20);
    doc.line(
      margin + colWidth + 30,
      currentY + 22,
      margin + 2 * colWidth - 20,
      currentY + 22,
    );

    // Save PDF
    const fileName = `timetable-revisions-${examination?.degreeProgramName}-${examination?.year}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb
        items={[
          {
            label: 'Preview Timetable',
            path: `/scheduling/preview-timetable/${examinationId}`,
          },
          { label: 'Revisions' },
        ]}
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
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Timetable Revisions
            </h2>
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
          <div className="m-8">
            <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
              <thead>
                <tr className="bg-gray-100 dark:bg-form-input">
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Course
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Paper Type
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Previous Date
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Previous Time
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    New Date
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    New Time
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Change Reason
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Changed By
                  </th>
                  <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                    Change Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {revisions.map((revision) => (
                  <tr
                    key={revision.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.courseCode || 'N/A'}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.paperType || 'N/A'}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.previousDate}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.previousStartTime} - {revision.previousEndTime}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.newDate}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.newStartTime} - {revision.newEndTime}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.changeReason || 'N/A'}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {revision.changedBy}
                    </td>
                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                      {new Date(revision.changeTimestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      </div>
    </div>
  );
};

export default PreviewTimetableRevisions;
