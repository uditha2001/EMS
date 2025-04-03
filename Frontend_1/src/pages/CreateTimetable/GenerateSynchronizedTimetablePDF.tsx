import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface GenerateSynchronizedTimetablePDFProps {
  examTimetable: any[];
  conflicts: any[];
  revisions: any[];
  examination: {
    year: string;
    level: number;
    semester: string;
    degreeProgramName: string;
  }[];
  examinationPeriod: string;
}

const GenerateSynchronizedTimetablePDF: React.FC<
  GenerateSynchronizedTimetablePDFProps
> = ({
  examTimetable,
  conflicts,
  revisions,
  examination,
  examinationPeriod,
}) => {
  const hasRevision = (examTimeTableId: number) => {
    return revisions.some((rev) => rev.examTimeTableId === examTimeTableId);
  };

  const generatePDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 40;

    // Function to add a new page and reset currentY
    const addNewPage = () => {
      doc.addPage();
      currentY = 20; // Reset Y position for the new page
    };

    // Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('University of Ruhuna', pageWidth / 2, 15, { align: 'center' });
    doc.text('Department of Computer Science', pageWidth / 2, 21, {
      align: 'center',
    });
    doc.text('Synchronized Examination Timetable', pageWidth / 2, 27, {
      align: 'center',
    });

    // Examination info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Examination Information:', margin, currentY);
    currentY += 10;

    // Create a string that contains all exam info separated by '|'
    const examInfoString = examination
      .map((exam) => {
        return `${exam.degreeProgramName} - Level ${exam.level} - Semester ${exam.semester} - ${exam.year}`;
      })
      .join(' | '); // Join all the examination info with ' | '

    // Print the combined string
    doc.text(examInfoString, margin, currentY);

    if (examinationPeriod) {
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Examination Period: ${examinationPeriod}`,
        margin,
        currentY + 10,
      );
      doc.setFont('helvetica', 'normal');
    }

    doc.line(margin, currentY + 15, pageWidth - margin, currentY + 15);
    currentY += 25;

    // Group the timetable by degree, level, semester, and time slot
    const groupByDegreeLevelSemester = (timetable: any[]) => {
      const grouped: {
        [degree: string]: {
          [level: string]: {
            [semester: string]: {
              [date: string]: {
                [time: string]: any[];
              };
            };
          };
        };
      } = {};

      timetable.forEach((item) => {
        const degree = item.degree;
        const level = item.level.toString();
        const semester = item.semester;
        const date = item.date;
        const time = item.startTime + ' - ' + item.endTime;

        if (!grouped[degree]) grouped[degree] = {};
        if (!grouped[degree][level]) grouped[degree][level] = {};
        if (!grouped[degree][level][semester])
          grouped[degree][level][semester] = {};
        if (!grouped[degree][level][semester][date])
          grouped[degree][level][semester][date] = {};
        if (!grouped[degree][level][semester][date][time])
          grouped[degree][level][semester][date][time] = [];

        grouped[degree][level][semester][date][time].push(item);
      });

      return grouped;
    };

    const groupedTimetable = groupByDegreeLevelSemester(examTimetable);

    // Table Headers with colSpan and rowSpan
    const tableHeaders = [
      [
        { content: 'Date', rowSpan: 3, styles: { halign: 'center' as const } },
        { content: 'Time', rowSpan: 3, styles: { halign: 'center' as const } },
        ...Object.keys(groupedTimetable).map((degree) => ({
          content: degree,
          colSpan: Object.keys(groupedTimetable[degree]).length,
          styles: { halign: 'center' as const },
        })),
      ],
      [
        ...Object.keys(groupedTimetable).flatMap((degree) =>
          Object.keys(groupedTimetable[degree]).map((level) => ({
            content: `Level ${level}`,
            colSpan: Object.keys(groupedTimetable[degree][level]).length,
            styles: { halign: 'center' as const },
          })),
        ),
      ],
      [
        ...Object.keys(groupedTimetable).flatMap((degree) =>
          Object.keys(groupedTimetable[degree]).flatMap((level) =>
            Object.keys(groupedTimetable[degree][level]).map((semester) => ({
              content: `Semester ${semester}`,
              styles: { halign: 'center' as const },
            })),
          ),
        ),
      ],
    ];

    // Table Data
    const tableData: any[] = [];
    const sortedDates = Array.from(
      new Set(examTimetable.map((item) => item.date)),
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    sortedDates.forEach((date) => {
      const timeSlots = examTimetable
        .filter((item) => item.date === date)
        .map((item) => ({
          time: item.startTime + ' - ' + item.endTime,
          item,
        }))
        .sort((a, b) => {
          const [startA] = a.time.split(' - ');
          const [startB] = b.time.split(' - ');
          return (
            new Date(`1970-01-01T${startA}`).getTime() -
            new Date(`1970-01-01T${startB}`).getTime()
          );
        });

      timeSlots.forEach((timeSlot, timeIndex) => {
        if (currentY > pageHeight - 20) {
          addNewPage();
        }

        const row: any[] = [];

        if (timeIndex === 0) {
          row.push({
            content: date,
            rowSpan: timeSlots.length,
            styles: { halign: 'center' },
          });
        }

        row.push({
          content: timeSlot.time,
          rowSpan: 1,
          styles: { halign: 'center' },
        });

        Object.keys(groupedTimetable).forEach((degree) =>
          Object.keys(groupedTimetable[degree]).forEach((level) =>
            Object.keys(groupedTimetable[degree][level]).forEach((semester) => {
              const matchingExams = examTimetable.filter(
                (exam) =>
                  exam.date === date &&
                  exam.startTime + ' - ' + exam.endTime === timeSlot.time &&
                  exam.degree === degree &&
                  exam.level.toString() === level &&
                  exam.semester === semester,
              );

              const isConflict = conflicts.some(
                (conflict) =>
                  conflict.degree === degree &&
                  conflict.level === level &&
                  conflict.semester === semester &&
                  conflict.date === date &&
                  conflict.startTime + ' - ' + conflict.endTime ===
                    timeSlot.time,
              );

              const isRevised = matchingExams.some((exam) =>
                hasRevision(exam.examTimeTableId),
              );

              row.push({
                content: matchingExams
                  .map((exam) => {
                    const revisedText = hasRevision(exam.examTimeTableId)
                      ? ' (Revised)'
                      : '';
                    return `${exam.courseCode} (${
                      exam.examType === 'THEORY'
                        ? 'T'
                        : exam.examType === 'PRACTICAL'
                        ? 'P'
                        : exam.examType
                    }) - ${exam.courseName}${revisedText}${
                      exam.timetableGroup
                        ? ` (Group ${exam.timetableGroup})`
                        : ''
                    }`;
                  })
                  .join('\n'),
                styles: {
                  fillColor: isConflict
                    ? [255, 182, 193] // Light red for conflicts
                    : isRevised
                    ? [230, 230, 255] // Light purple for revisions
                    : undefined,
                  textColor: isConflict
                    ? [0, 0, 0] // Black text for conflicts
                    : isRevised
                    ? [128, 0, 128] // Purple text for revisions
                    : undefined,
                  fontStyle: isRevised ? 'bolditalic' : undefined,
                },
              });
            }),
          ),
        );

        tableData.push(row);
      });
    });

    // Generate the table
    let finalY = currentY;

    autoTable(doc, {
      startY: currentY,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      margin: { top: 10 },
      didDrawCell: (data) => {
        // Add left border for revised entries
        if (data.column.index > 1) {
          // Skip date and time columns
          const exam = examTimetable.find(
            (e) =>
              e.date === sortedDates[data.row.index] &&
              e.startTime + ' - ' + e.endTime === data.cell.raw,
          );
          if (exam && hasRevision(exam.examTimeTableId)) {
            doc.setDrawColor(128, 0, 128); // Purple border
            doc.setLineWidth(0.5);
            doc.line(
              data.cell.x,
              data.cell.y,
              data.cell.x,
              data.cell.y + data.cell.height,
            );
          }
        }
      },
      didDrawPage: (data) => {
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageWidth - margin,
          doc.internal.pageSize.height - 10,
          { align: 'right' },
        );

        // Track the final Y position
        if (data.cursor) {
          finalY = data.cursor.y;
        }
      },
    });

    // Add legend
    currentY = finalY + 10;
    doc.setFontSize(8);
    doc.setTextColor(255, 0, 0);
    doc.text('* Conflicts are shown in red', margin, currentY);
    doc.setTextColor(128, 0, 128);
    doc.text('* Revised slots are shown in purple', margin, currentY + 5);
    doc.setTextColor(0, 0, 0);

    // Footer
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      margin,
      doc.internal.pageSize.height - 10,
    );

    const year = examination.length > 0 ? examination[0].year : 'unknown';
    doc.save(`synchronized-timetable-${year}.pdf`);
  };

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={generatePDF}
        className="btn-primary flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faDownload} /> Download Synchronized Timetable
        PDF
      </button>
    </div>
  );
};

export default GenerateSynchronizedTimetablePDF;
