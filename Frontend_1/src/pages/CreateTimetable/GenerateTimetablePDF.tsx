import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface GenerateTimetablePDFProps {
  examTimetable: any[];
  examination: any;
}

const GenerateTimetablePDF: React.FC<GenerateTimetablePDFProps> = ({
  examTimetable,
  examination,
}) => {
  const [includeHallStaff, setIncludeHallStaff] = useState(true);

  const formatDateWithDay = (dateString: string) => {
    const date = new Date(dateString);
    return `${dateString} (${date.toLocaleDateString('en-US', {
      weekday: 'long',
    })})`;
  };

  const generatePDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape orientation
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 40;

    // Header on the first page
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('University of Ruhuna', pageWidth / 2, 15, { align: 'center' });
    doc.text('Department of Computer Science', pageWidth / 2, 21, {
      align: 'center',
    });
    doc.text('Examination Centers', pageWidth / 2, 27, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Examination: ${examination?.degreeProgramName} - Level ${examination?.level} - Semester ${examination?.semester} - ${examination?.year}`,
      margin,
      currentY,
    );

    const examStartDate = examTimetable.length > 0 ? examTimetable[0].date : '';
    const examEndDate =
      examTimetable.length > 0
        ? examTimetable[examTimetable.length - 1].date
        : '';

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
    const tableHeaders = [
      'Date',
      'Time',
      'Paper',
      'Exam Center',
      'No of Candidates',
      ...(includeHallStaff ? ['Supervisor', 'Invigilators'] : []),
      'Remarks',
    ];

    const tableData: (string | { content: string; rowSpan: number })[][] = [];

    examTimetable.forEach((entry) => {
      const examDate = formatDateWithDay(entry.date);
      const time = `${entry.startTime} - ${entry.endTime}`;
      const course = `${entry.courseCode} (${
        entry.examType === 'THEORY'
          ? 'T'
          : entry.examType === 'PRACTICAL'
          ? 'P'
          : entry.examType
      }) - ${entry.courseName}${
        entry.timetableGroup ? ' - (Group ' + entry.timetableGroup + ')' : ''
      }`;

      entry.examCenters.forEach((center: any, index: number) => {
        const examCenterName = center.examCenterName;
        const numOfCandidates = center.numOfCandidates;
        const supervisorName = center.supervisor
          ? center.supervisor.supervisorName
          : 'N/A';
        const invigilators = center.invigilators
          ? center.invigilators
              .map((inv: { invigilatorName: string }) => inv.invigilatorName)
              .join(', ')
          : 'N/A';
        const remarks = center.remarks || 'N/A';
        // Use rowspan on the first row for the exam entry
        if (index === 0) {
          tableData.push([
            { content: examDate, rowSpan: entry.examCenters.length },
            { content: time, rowSpan: entry.examCenters.length },
            { content: course, rowSpan: entry.examCenters.length },
            examCenterName,
            numOfCandidates,
            ...(includeHallStaff ? [supervisorName, invigilators] : []),
            remarks,
          ]);
        } else {
          tableData.push([
            examCenterName,
            numOfCandidates,
            ...(includeHallStaff ? [supervisorName, invigilators] : []),
            remarks,
          ]);
        }
      });
    });

    // Generate the table and add page numbers on each page
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      margin: { top: 10 },
      didDrawPage: function () {
        // Footer: add page number at the bottom right on every page
        doc.setFontSize(10);
        doc.text(
          `Page ${
            doc.getCurrentPageInfo().pageNumber
          } of ${doc.getNumberOfPages()}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' },
        );
      },
    });

    // Footer on the final page (additional info)
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      pageHeight - 10,
    );

    doc.save(`exam-centers-${examination?.year}.pdf`);
  };

  return (
    <div className="flex flex-col items-center my-4">
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={includeHallStaff}
            onChange={(e) => setIncludeHallStaff(e.target.checked)}
          />{' '}
          Include Hall Staff (Supervisor & Invigilators)
        </label>
      </div>
      <button
        onClick={generatePDF}
        className="btn-primary flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faDownload} /> Download Examination Centers PDF
      </button>
    </div>
  );
};

export default GenerateTimetablePDF;
