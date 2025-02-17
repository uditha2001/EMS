import React from 'react';
import { jsPDF } from 'jspdf';

interface MarkingPreviewProps {
  university: string;
  degree: string;
  courseCode: string;
  examYear: string;
  semester: string;
  questions: any[];
  paperType: string;
  duration: string;
}

const stripHtml = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const MarkingPreview: React.FC<MarkingPreviewProps> = ({
  university,
  degree,
  courseCode,
  examYear,
  semester,
  questions,
  paperType,
  duration,
}) => {
  const calculateTotalMarksForMainQuestion = (question: any) => {
    if (question.subquestions && question.subquestions.length > 0) {
      return question.subquestions.reduce(
        (acc: number, sub: any) => acc + sub.marks,
        0,
      );
    }
    return question.totalMarks;
  };

  const downloadMarkingGuidePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const maxWidth = pageWidth - 2 * margin;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 20;

    // Title and Heading
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(university, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;

    doc.text(degree, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;

    doc.text(`${semester} Marking Scheme - ${examYear}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Course Code and Duration
    doc.setFontSize(10);
    doc.text(courseCode, margin, currentY);
    doc.text(`Duration: ${duration}`, pageWidth - margin, currentY, { align: 'right' });
    currentY += 5;

    // Draw a line
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;

    // Marking Guide Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Marking Guide:', margin, currentY);
    currentY += 10;

    questions.forEach((q, idx) => {
        // Check if we need a new page
        if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
        }

        // Main Question Text with proper alignment
        doc.setFont('helvetica', 'bold');
        const questionNumber = `${idx + 1}.`;
        const questionText = stripHtml(q.questionText);
        const questionLines = doc.splitTextToSize(questionText, maxWidth - 20);

        doc.text(questionNumber, margin, currentY); // Print the question number
        doc.text(questionLines[0], margin + 10, currentY); // First line after question number
        currentY += 5;

        if (questionLines.length > 1) {
            doc.text(questionLines.slice(1), margin + 10, currentY);
            currentY += (questionLines.length - 1) * 5;
        }

        // Total Marks aligned to the right
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Marks: ${calculateTotalMarksForMainQuestion(q)}`, pageWidth - margin, currentY, { align: 'right' });
        currentY += 5;

        // Handle subquestions
        if (q.subquestions && q.subquestions.length > 0) {
            q.subquestions.forEach((sub: any, subIdx: number) => {
                if (currentY > pageHeight - 20) {
                    doc.addPage();
                    currentY = 20;
                }

                const label = String.fromCharCode(97 + subIdx); // a, b, c, etc.
                const subQuestionText = stripHtml(sub.text);
                const subQuestionLines = doc.splitTextToSize(subQuestionText, maxWidth - 30);

                doc.setFont('helvetica', 'normal');
                doc.text(`  ${label})`, margin + 10, currentY); // Print the sub-question label
                doc.text(subQuestionLines[0], margin + 20, currentY); // Print first line of sub-question
                currentY += 5;

                if (subQuestionLines.length > 1) {
                    doc.text(subQuestionLines.slice(1), margin + 20, currentY);
                    currentY += (subQuestionLines.length - 1) * 5;
                }

                // Marks aligned to the right
                doc.text(`(${sub.marks} marks)`, pageWidth - margin, currentY, { align: 'right' });
                currentY += 5;

                // Answer section
                doc.setFont('helvetica', 'italic');
                doc.text(`    Answer: ${sub.answer || 'No answer available'}`, margin + 20, currentY);
                currentY += 10;

                // Answer box for Structure type questions
            });
        } else {
            // If no subquestions, display the main question answer
            doc.setFont('helvetica', 'italic');
            doc.text(`Answer: ${q.answer || 'No marking guide available'}`, margin + 10, currentY);
            currentY += 10;

            // Answer box for Structure type questions
            if (paperType === 'Structure') {
                if (currentY > pageHeight - 30) {
                    doc.addPage();
                    currentY = 20;
                }
                doc.rect(margin + 10, currentY, 150, 20);
                currentY += 25;
            }
        }
    });

    // Save the PDF document
    doc.save('marking_scheme.pdf');
};

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded text-gray-900 dark:text-gray-200">
      <h2 className="text-xl font-bold text-center">{university}</h2>
      <h3 className="text-lg text-center">{degree}</h3>
      <h4 className="text-center font-semibold">
        {semester} Marking Scheme - {examYear}{' '}
      </h4>
      <div className="flex justify-between">
        <p className="text-left">{courseCode}</p>
        <p className="text-right">Duration: {duration}</p>
      </div>
      <button
        onClick={downloadMarkingGuidePDF}
        className="btn-primary text-sm mt-4"
      >
        Download Marking Scheme as PDF
      </button>
      <hr className="my-4 border-gray-300 dark:border-gray-700" />

      <h3 className="font-semibold">Marking Guide:</h3>
      {questions.map((q, idx) => (
        <div key={idx} className="mb-6">
          <div className="flex justify-between mb-2">
            <h4 className="font-bold">
              {idx + 1}.{' '}
              <span dangerouslySetInnerHTML={{ __html: q.questionText }} />
            </h4>
            <p className="text-right font-semibold">{`Total Marks: ${calculateTotalMarksForMainQuestion(
              q,
            )}`}</p>
          </div>

          {/* Main Question with Subquestions */}
          {q.subquestions && q.subquestions.length > 0 ? (
            <div>
              {q.subquestions.map((sub: any, subIdx: number) => (
                <div key={subIdx} className="ml-4 mb-2">
                  <div className="flex justify-between">
                    <div className="flex">
                      <p className="w-6">{String.fromCharCode(97 + subIdx)})</p>
                      <p
                        className="flex-1"
                        dangerouslySetInnerHTML={{ __html: sub.text }}
                      />
                    </div>
                    <p className="text-right font-semibold text-sm w-30">
                      ({sub.marks} marks)
                    </p>
                  </div>
                  <div className="ml-8">
                    <p className="italic">
                      <strong>Answer:</strong>{' '}
                      {sub.answer || 'No answer available'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* For questions without subquestions */}
              {paperType === 'Essay' && (
                <p className="text-gray-500 dark:text-gray-400">
                  No marking guide available for essay questions.
                </p>
              )}

              {paperType === 'Structure' && (
                <div>
                  <p className="italic">
                    <strong>Answer:</strong>{' '}
                    {q.answer || 'No marking guide available'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <hr className="my-4 border-gray-300 dark:border-gray-700" />
      <p className="text-center">--- END ---</p>
    </div>
  );
};

export default MarkingPreview;
