import React from 'react';
import { jsPDF } from 'jspdf';

interface PaperPreviewProps {
  university: string;
  degree: string;
  courseCode: string;
  examYear: string;
  semester: string;
  instructions: string;
  questions: any[];
  paperType: string;
  duration: string;
}

const PaperPreview: React.FC<PaperPreviewProps> = ({
  university,
  degree,
  courseCode,
  examYear,
  semester,
  instructions,
  questions,
  paperType,
  duration,
}) => {
  // Helper function to strip HTML tags from a string
  const stripHtml = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Function to convert numbers to Roman numerals
  const toRoman = (num: number): string => {
    const romanNumerals = [
      '',
      'i',
      'ii',
      'iii',
      'iv',
      'v',
      'vi',
      'vii',
      'viii',
      'ix',
      'x',
    ];
    return romanNumerals[num] || num.toString();
  };

  // Function to download the paper preview as a PDF
  const downloadPaperPDF = () => {
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

    doc.text(`${semester} Examination - ${examYear}`, pageWidth / 2, currentY, {
      align: 'center',
    });
    currentY += 10;

    // Course Code and Duration
    doc.setFontSize(10);
    doc.text(courseCode, margin, currentY);
    doc.text(`Duration: ${duration}`, pageWidth - margin, currentY, {
      align: 'right',
    });
    currentY += 5;

    // Draw a line
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;

    // Instructions Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Instructions:', margin, currentY);
    currentY += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const instructionsLines = doc.splitTextToSize(
      stripHtml(instructions) || 'No instructions provided.',
      maxWidth,
    );
    doc.text(instructionsLines, margin, currentY);
    currentY += instructionsLines.length * 5 + 5;

    // Questions Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Questions:', margin, currentY);
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

      // Handle subquestions
      if (q.subquestions && q.subquestions.length > 0) {
        q.subquestions.forEach((sub: any, subIdx: number) => {
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }

          const label = String.fromCharCode(97 + subIdx); // a, b, c, etc.
          const subQuestionText = stripHtml(sub.text);
          const subQuestionLines = doc.splitTextToSize(
            subQuestionText,
            maxWidth - 30,
          );

          doc.setFont('helvetica', 'normal');
          doc.text(`  ${label})`, margin + 10, currentY); // Print the sub-question label
          doc.text(subQuestionLines[0], margin + 20, currentY); // Print first line of sub-question
          currentY += 5;

          if (subQuestionLines.length > 1) {
            doc.text(subQuestionLines.slice(1), margin + 20, currentY);
            currentY += (subQuestionLines.length - 1) * 5;
          }

          // Display marks only if they are greater than 0
          if (sub.marks > 0) {
            doc.text(`(${sub.marks} marks)`, pageWidth - margin, currentY, {
              align: 'right',
            });
            currentY += 5;
          }

          // Handle sub-subquestions
          if (sub.subquestions && sub.subquestions.length > 0) {
            sub.subquestions.forEach((subSub: any, subSubIdx: number) => {
              if (currentY > pageHeight - 20) {
                doc.addPage();
                currentY = 20;
              }

              const subSubLabel = `(${toRoman(subSubIdx + 1)})`; // Roman numerals (i), (ii), etc.
              const subSubQuestionText = stripHtml(subSub.text);
              const subSubQuestionLines = doc.splitTextToSize(
                subSubQuestionText,
                maxWidth - 40,
              );

              doc.setFont('helvetica', 'normal');
              doc.text(`    ${subSubLabel}`, margin + 20, currentY); // Print the sub-subquestion label
              doc.text(subSubQuestionLines[0], margin + 30, currentY); // Print first line of sub-subquestion
              currentY += 5;

              if (subSubQuestionLines.length > 1) {
                doc.text(subSubQuestionLines.slice(1), margin + 30, currentY);
                currentY += (subSubQuestionLines.length - 1) * 5;
              }

              // Display marks only if they are greater than 0
              if (subSub.marks > 0) {
                doc.text(
                  `(${subSub.marks} marks)`,
                  pageWidth - margin,
                  currentY,
                  { align: 'right' },
                );
                currentY += 5;
              }

              // Answer box for Structure type questions
              if (
                paperType === 'Structure' &&
                subSub.answer &&
                subSub.answer.length > 0
              ) {
                const boxHeight = subSub.answer.length * 2; // Adjust height based on answer length
                doc.rect(margin + 20, currentY, 150, boxHeight); // Draw answer box
                currentY += boxHeight + 10;
              }
            });
          }
        });
      } else if (paperType === 'Structure' && q.answer && q.answer.length > 0) {
        // If no subquestions, provide an answer box for the main question
        const boxHeight = q.answer.length * 2; // Adjust height based on answer length
        doc.rect(margin + 10, currentY, 150, boxHeight); // Draw answer box
        currentY += boxHeight + 10;
      }
    });

    // Save the PDF document
    doc.save('exam_paper.pdf');
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded text-gray-900 dark:text-gray-200">
      <h2 className="text-xl font-bold text-center">{university}</h2>
      <h3 className="text-lg text-center">{degree}</h3>
      <h4 className="text-center font-semibold">
        {semester} Examination - {examYear}{' '}
      </h4>
      <div className="flex justify-between">
        <p className="text-left">{courseCode}</p>
        <p className="text-right">Duration: {duration}</p>
      </div>
      <button onClick={downloadPaperPDF} className="btn-primary text-sm mt-4">
        Download PDF
      </button>
      <hr className="my-4 border-gray-300 dark:border-gray-700" />

      <h3 className="font-semibold">Instructions:</h3>
      <div
        dangerouslySetInnerHTML={{ __html: instructions }}
        className="mb-4 text-gray-800 dark:text-gray-300"
      />

      <h3 className="font-semibold">Questions:</h3>
      {questions.map((q, idx) => (
        <div key={idx} className="mb-6">
          <div className="flex justify-between mb-2">
            <h4 className="font-bold">
              {idx + 1}.{' '}
              <span dangerouslySetInnerHTML={{ __html: q.questionText }} />
            </h4>
            {!q.subquestions || q.subquestions.length === 0
              ? q.marks > 0 && (
                  <p className="text-right font-semibold">{q.marks} marks</p>
                )
              : null}
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
                    {sub.marks > 0 && (
                      <p className="text-right font-semibold text-sm w-30">
                        ({sub.marks} marks)
                      </p>
                    )}
                  </div>

                  {/* Sub-subquestions */}
                  {sub.subquestions && sub.subquestions.length > 0 && (
                    <div className="ml-8">
                      {sub.subquestions.map(
                        (subSub: any, subSubIdx: number) => (
                          <div key={subSubIdx} className="mb-2">
                            <div className="flex justify-between">
                              <div className="flex">
                                <p className="w-6">
                                  ({toRoman(subSubIdx + 1)})
                                </p>
                                <p
                                  className="flex-1"
                                  dangerouslySetInnerHTML={{
                                    __html: subSub.text,
                                  }}
                                />
                              </div>
                              {subSub.marks > 0 && (
                                <p className="text-right font-semibold text-sm w-30">
                                  ({subSub.marks} marks)
                                </p>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* For questions without subquestions */}
              {paperType === 'Essay' && (
                <p className="text-gray-500 dark:text-gray-400">
                  No answer box for essay questions.
                </p>
              )}

              {paperType === 'Structure' && q.answer && q.answer.length > 0 && (
                <div>
                  <label>Answer:</label>
                  <textarea
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-md w-full h-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    placeholder="Write your answer here..."
                    disabled
                  />
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

export default PaperPreview;
