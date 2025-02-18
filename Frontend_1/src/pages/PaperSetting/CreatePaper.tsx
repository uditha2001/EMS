import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import {
  faInfoCircle,
  faBook,
  faEye,
  faClipboardCheck,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import Stepper from '../PaperTransfer/Stepper';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import StructureTemplate from './StructureTemplate';
import MarkingPreview from './MarkingPreview';
import PaperPreview from './PaperPreview';
import useApi from '../../api/api';
import jsPDF from 'jspdf';
import useAuth from '../../hooks/useAuth';
import PaperInfoForm from './PaperInfoForm';
import FinalPaperTransfer from './FinalPaperTransfer';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

interface Moderator {
  userId: number;
  user: string;
}

interface Course {
  courseId: number;
  courseCode: string;
  courseName: string;
  paperType: string;
  roleId: number;
}

interface Examination {
  id: number;
  year: string;
  level: number;
  semester: number;
  degreeProgramName: string;
  status: string;
}

interface SubSubQuestion {
  subSubQuestionId?: number;
  subSubQuestionNumber: number;
  questionType: string;
  marks: number;
}

interface SubQuestion {
  subQuestionId?: number;
  subQuestionNumber: number;
  questionType: string;
  marks: number;
  subSubQuestions: SubSubQuestion[];
}

interface Question {
  questionId?: number;
  questionNumber: number;
  questionType: string;
  totalMarks: number;
  subQuestions: SubQuestion[];
}

const initialPaperInfo = {
  university: 'UNIVERSITY OF RUHUNA',
  degree: 'BACHELOR OF COMPUTER SCIENCE (GENERAL) DEGREE',
  courseCode: 'CSC2222 – Computer Systems II',
  examYear: 'September/October 2020',
  semester: 'LEVEL II (SEMESTER II)',
  duration: '2 Hours',
  instructions: '',
};

const PaperSettings: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paperType, setPaperType] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [paperInfo, setPaperInfo] = useState(initialPaperInfo);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [questions_, setQuestions_] = useState<Question[]>([]);

  const { auth } = useAuth();
  const {
    uploadFile,
    getRoleAssignmentByUserId,
    getExaminationById,
    getModerators,
    createPaperStructure,
  } = useApi();
  const userId = Number(auth.id);
  const [remarks, setRemarks] = useState('');
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<number | null>(
    null,
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<number | null>(
    null,
  );
  const [availablePaperTypes, setAvailablePaperTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleAssignmentsResponse = await getRoleAssignmentByUserId(
          Number(auth.id),
        );
        const roleAssignments = roleAssignmentsResponse.data.filter(
          (assignment: any) => assignment.isAuthorized,
        );
        const examinationIds: number[] = Array.from(
          new Set(
            roleAssignments.map((assignment: any) => assignment.examinationId),
          ),
        );
        const examData = await Promise.all(
          examinationIds.map((examId: number) => getExaminationById(examId)),
        );
        const ongoingExams = examData
          .flat()
          .filter((exam: Examination) => exam.status === 'ONGOING');
        setExaminations(ongoingExams);

        const filteredCourses = roleAssignments.filter((assignment: any) =>
          examinationIds.includes(Number(assignment.examinationId)),
        );
        const uniqueCourses: Course[] = Array.from(
          new Map<number, Course>(
            filteredCourses.map((assignment: any) => [
              assignment.courseId,
              {
                courseId: assignment.courseId,
                courseCode: assignment.courseCode,
                courseName: assignment.courseName,
                paperType: assignment.paperType,
                roleId: assignment.roleId,
              },
            ]),
          ).values(),
        );

        setCourses(uniqueCourses);

        if (selectedCourse !== null) {
          const courseAssignments = roleAssignments.filter(
            (assignment: any) => assignment.courseId === selectedCourse,
          );
          const paperTypes: string[] = Array.from(
            new Set(
              courseAssignments.map((assignment: any) => assignment.paperType),
            ),
          );
          setAvailablePaperTypes(paperTypes);
        }
      } catch (error) {
        setErrorMessage('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [auth.id, selectedCourse]);

  useEffect(() => {
    const fetchModerators = async () => {
      if (!selectedCourse || !paperType) return;
      try {
        const response = await getModerators(selectedCourse, paperType);
        setModerators(response.data);
      } catch (error) {
        setModerators([]);
        setErrorMessage('Failed to fetch moderators.');
      }
    };
    fetchModerators();
  }, [selectedCourse, paperType]);

  // Synchronize questions and questions_
  useEffect(() => {
    const updatedQuestions_ = questions.map((question, index) => ({
      questionNumber: index + 1,
      questionType: question.type,
      totalMarks: question.marks,
      subQuestions: question.subquestions.map((sub: any, subIndex: number) => ({
        subQuestionNumber: subIndex + 1,
        questionType: question.type,
        marks: sub.marks,
        subSubQuestions: sub.subquestions.map(
          (subSub: any, subSubIndex: number) => ({
            subSubQuestionNumber: subSubIndex + 1,
            questionType: question.type,
            marks: subSub.marks,
          }),
        ),
      })),
    }));

    setQuestions_(updatedQuestions_);
  }, [questions]);

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
    ],
  };

  const steps = [
    { id: 1, name: 'Exam Info', icon: faInfoCircle },
    { id: 2, name: 'Questions', icon: faBook },
    { id: 3, name: 'Preview Paper', icon: faEye },
    { id: 4, name: 'Preview Marking', icon: faClipboardCheck },
    { id: 5, name: 'Transfer Paper & Marking', icon: faPaperPlane },
  ];

  const renderQuestionTemplate = () => {
    return (
      <StructureTemplate
        questions={questions}
        setQuestions={setQuestions}
        quillModules={quillModules}
      />
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setPaperInfo((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

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

  const handleTransfer = async () => {
    if (!paperType || questions.length === 0) {
      setErrorMessage('Please complete all steps before transferring.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Generate PDFs for paper and marking scheme
      const paperPdf = new jsPDF();
      const margin = 20;
      const pageWidth = paperPdf.internal.pageSize.width;
      const maxWidth = pageWidth - 2 * margin;
      const pageHeight = paperPdf.internal.pageSize.height;
      let currentY = 20;

      // Title and Heading
      paperPdf.setFontSize(12);
      paperPdf.setFont('helvetica', 'bold');
      paperPdf.text(paperInfo.university, pageWidth / 2, currentY, {
        align: 'center',
      });
      currentY += 6;

      paperPdf.text(paperInfo.degree, pageWidth / 2, currentY, {
        align: 'center',
      });
      currentY += 6;

      paperPdf.text(
        `${paperInfo.semester} Examination - ${paperInfo.examYear}`,
        pageWidth / 2,
        currentY,
        {
          align: 'center',
        },
      );
      currentY += 10;

      // Course Code and Duration
      paperPdf.setFontSize(10);
      paperPdf.text(paperInfo.courseCode, margin, currentY);
      paperPdf.text(
        `Duration: ${paperInfo.duration}`,
        pageWidth - margin,
        currentY,
        {
          align: 'right',
        },
      );
      currentY += 5;

      // Draw a line
      paperPdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5;

      // Instructions Section
      paperPdf.setFontSize(10);
      paperPdf.setFont('helvetica', 'bold');
      paperPdf.text('Instructions:', margin, currentY);
      currentY += 5;

      paperPdf.setFontSize(10);
      paperPdf.setFont('helvetica', 'normal');
      const instructionsLines = paperPdf.splitTextToSize(
        stripHtml(paperInfo.instructions) || 'No instructions provided.',
        maxWidth,
      );
      paperPdf.text(instructionsLines, margin, currentY);
      currentY += instructionsLines.length * 5 + 5;

      // Questions Section
      paperPdf.setFontSize(10);
      paperPdf.setFont('helvetica', 'bold');
      paperPdf.text('Questions:', margin, currentY);
      currentY += 10;

      questions.forEach((q, idx) => {
        // Check if we need a new page
        if (currentY > pageHeight - 20) {
          paperPdf.addPage();
          currentY = 20;
        }

        // Main Question Text with proper alignment
        paperPdf.setFont('helvetica', 'bold');
        const questionNumber = `${idx + 1}.`;
        const questionText = stripHtml(q.questionText);
        const questionLines = paperPdf.splitTextToSize(
          questionText,
          maxWidth - 20,
        );

        paperPdf.text(questionNumber, margin, currentY); // Print the question number
        paperPdf.text(questionLines[0], margin + 10, currentY); // First line after question number
        currentY += 5;

        if (questionLines.length > 1) {
          paperPdf.text(questionLines.slice(1), margin + 10, currentY);
          currentY += (questionLines.length - 1) * 5;
        }

        // Handle subquestions
        if (q.subquestions && q.subquestions.length > 0) {
          q.subquestions.forEach((sub: any, subIdx: number) => {
            if (currentY > pageHeight - 20) {
              paperPdf.addPage();
              currentY = 20;
            }

            const label = String.fromCharCode(97 + subIdx); // a, b, c, etc.
            const subQuestionText = stripHtml(sub.text);
            const subQuestionLines = paperPdf.splitTextToSize(
              subQuestionText,
              maxWidth - 30,
            );

            paperPdf.setFont('helvetica', 'normal');
            paperPdf.text(`  ${label})`, margin + 10, currentY); // Print the sub-question label
            paperPdf.text(subQuestionLines[0], margin + 20, currentY); // Print first line of sub-question
            currentY += 5;

            if (subQuestionLines.length > 1) {
              paperPdf.text(subQuestionLines.slice(1), margin + 20, currentY);
              currentY += (subQuestionLines.length - 1) * 5;
            }

            // Display marks only if they are greater than 0
            if (sub.marks > 0) {
              paperPdf.text(
                `(${sub.marks} marks)`,
                pageWidth - margin,
                currentY,
                {
                  align: 'right',
                },
              );
              currentY += 5;
            }

            // Handle sub-subquestions
            if (sub.subquestions && sub.subquestions.length > 0) {
              sub.subquestions.forEach((subSub: any, subSubIdx: number) => {
                if (currentY > pageHeight - 20) {
                  paperPdf.addPage();
                  currentY = 20;
                }

                const subSubLabel = `(${toRoman(subSubIdx + 1)})`; // Roman numerals (i), (ii), etc.
                const subSubQuestionText = stripHtml(subSub.text);
                const subSubQuestionLines = paperPdf.splitTextToSize(
                  subSubQuestionText,
                  maxWidth - 40,
                );

                paperPdf.setFont('helvetica', 'normal');
                paperPdf.text(`    ${subSubLabel}`, margin + 20, currentY); // Print the sub-subquestion label
                paperPdf.text(subSubQuestionLines[0], margin + 30, currentY); // Print first line of sub-subquestion
                currentY += 5;

                if (subSubQuestionLines.length > 1) {
                  paperPdf.text(
                    subSubQuestionLines.slice(1),
                    margin + 30,
                    currentY,
                  );
                  currentY += (subSubQuestionLines.length - 1) * 5;
                }

                // Display marks only if they are greater than 0
                if (subSub.marks > 0) {
                  paperPdf.text(
                    `(${subSub.marks} marks)`,
                    pageWidth - margin,
                    currentY,
                    { align: 'right' },
                  );
                  currentY += 5;
                }
              });
            }
          });
        }
      });

      const markingPdf = new jsPDF();
      const marking_margin = 20;
      const marking_pageWidth = markingPdf.internal.pageSize.width;
      const marking_maxWidth = marking_pageWidth - 2 * marking_margin;
      const marking_pageHeight = markingPdf.internal.pageSize.height;
      let marking_currentY = 20;

      // Title and Heading
      markingPdf.setFontSize(12);
      markingPdf.setFont('helvetica', 'bold');
      markingPdf.text(
        paperInfo.university,
        marking_pageWidth / 2,
        marking_currentY,
        {
          align: 'center',
        },
      );
      marking_currentY += 6;

      markingPdf.text(
        paperInfo.degree,
        marking_pageWidth / 2,
        marking_currentY,
        {
          align: 'center',
        },
      );
      marking_currentY += 6;

      markingPdf.text(
        `${paperInfo.semester} Marking Scheme - ${paperInfo.examYear}`,
        marking_pageWidth / 2,
        marking_currentY,
        { align: 'center' },
      );
      marking_currentY += 10;

      // Course Code and Duration
      markingPdf.setFontSize(10);
      markingPdf.text(paperInfo.courseCode, margin, marking_currentY);
      markingPdf.text(
        `Duration: ${paperInfo.duration}`,
        marking_pageWidth - margin,
        marking_currentY,
        {
          align: 'right',
        },
      );
      marking_currentY += 5;

      // Draw a line
      markingPdf.line(
        margin,
        marking_currentY,
        marking_pageWidth - margin,
        marking_currentY,
      );
      marking_currentY += 5;

      // Marking Guide Section
      markingPdf.setFontSize(10);
      markingPdf.setFont('helvetica', 'bold');
      markingPdf.text('Marking Guide:', margin, marking_currentY);
      marking_currentY += 10;

      questions.forEach((q, idx) => {
        // Check if we need a new page
        if (marking_currentY > marking_pageHeight - 20) {
          markingPdf.addPage();
          marking_currentY = 20;
        }

        // Main Question Text with proper alignment
        markingPdf.setFont('helvetica', 'bold');
        const questionNumber = `${idx + 1}.`;
        const questionText = stripHtml(q.questionText);
        const questionLines = markingPdf.splitTextToSize(
          questionText,
          marking_maxWidth - 20,
        );

        markingPdf.text(questionNumber, margin, marking_currentY); // Print the question number
        markingPdf.text(questionLines[0], margin + 10, marking_currentY); // First line after question number
        marking_currentY += 5;

        if (questionLines.length > 1) {
          markingPdf.text(
            questionLines.slice(1),
            margin + 10,
            marking_currentY,
          );
          marking_currentY += (questionLines.length - 1) * 5;
        }

        marking_currentY += 5;

        // Handle subquestions
        if (q.subquestions && q.subquestions.length > 0) {
          q.subquestions.forEach((sub: any, subIdx: number) => {
            if (marking_currentY > marking_pageHeight - 20) {
              markingPdf.addPage();
              marking_currentY = 20;
            }

            const label = String.fromCharCode(97 + subIdx); // a, b, c, etc.
            const subQuestionText = stripHtml(sub.text);
            const subQuestionLines = markingPdf.splitTextToSize(
              subQuestionText,
              marking_maxWidth - 30,
            );

            markingPdf.setFont('helvetica', 'normal');
            markingPdf.text(`  ${label})`, margin + 10, marking_currentY); // Print the sub-question label
            markingPdf.text(subQuestionLines[0], margin + 20, marking_currentY); // Print first line of sub-question
            marking_currentY += 5;

            if (subQuestionLines.length > 1) {
              markingPdf.text(
                subQuestionLines.slice(1),
                margin + 20,
                marking_currentY,
              );
              marking_currentY += (subQuestionLines.length - 1) * 5;
            }

            // Display marks only if they are greater than 0
            if (sub.marks > 0) {
              markingPdf.text(
                `(${sub.marks} marks)`,
                marking_pageWidth - margin,
                marking_currentY,
                {
                  align: 'right',
                },
              );
              marking_currentY += 5;
            }

            // Answer section
            markingPdf.setFont('helvetica', 'italic');
            markingPdf.text(
              `    Answer: ${sub.answer || 'No answer available'}`,
              margin + 20,
              marking_currentY,
            );
            marking_currentY += 10;

            // Handle sub-subquestions
            if (sub.subquestions && sub.subquestions.length > 0) {
              sub.subquestions.forEach((subSub: any, subSubIdx: number) => {
                if (marking_currentY > marking_pageHeight - 20) {
                  markingPdf.addPage();
                  marking_currentY = 20;
                }

                const subSubLabel = `(${toRoman(subSubIdx + 1)})`; // Roman numerals (i), (ii), etc.
                const subSubQuestionText = stripHtml(subSub.text);
                const subSubQuestionLines = markingPdf.splitTextToSize(
                  subSubQuestionText,
                  marking_maxWidth - 40,
                );

                markingPdf.setFont('helvetica', 'normal');
                markingPdf.text(
                  `      ${subSubLabel}`,
                  margin + 20,
                  marking_currentY,
                ); // Print the sub-subquestion label
                markingPdf.text(
                  subSubQuestionLines[0],
                  margin + 30,
                  marking_currentY,
                ); // Print first line of sub-subquestion
                marking_currentY += 5;

                if (subSubQuestionLines.length > 1) {
                  markingPdf.text(
                    subSubQuestionLines.slice(1),
                    margin + 30,
                    marking_currentY,
                  );
                  marking_currentY += (subSubQuestionLines.length - 1) * 5;
                }

                // Display marks only if they are greater than 0
                if (subSub.marks > 0) {
                  markingPdf.text(
                    `(${subSub.marks} marks)`,
                    marking_pageWidth - margin,
                    marking_currentY,
                    { align: 'right' },
                  );
                  marking_currentY += 5;
                }

                // Answer section
                markingPdf.setFont('helvetica', 'italic');
                markingPdf.text(
                  `        Answer: ${subSub.answer || 'No answer available'}`,
                  margin + 30,
                  marking_currentY,
                );
                marking_currentY += 10;
              });
            }
          });
        }
      });

      // Convert PDFs to Blobs
      const paperBlob = paperPdf.output('blob');
      const markingBlob = markingPdf.output('blob');

      const selectedExam = examinations.find(
        (exam) => exam.id === selectedExamination,
      )?.year;
      const selectedCourseCode = courses.find(
        (course) => course.courseId === selectedCourse,
      )?.courseCode;
      if (!selectedExam || !selectedCourseCode) {
        setErrorMessage('Invalid selection!');
        return;
      }

      // Create File objects
      const paperFile = new File(
        [paperBlob],
        `${selectedCourseCode}_${paperType}_${selectedExam.replace(
          '/',
          '_',
        )}.pdf`,
        {
          type: 'application/pdf',
        },
      );
      const markingFile = new File(
        [markingBlob],
        `MARKING_${selectedCourseCode}_${paperType}_${selectedExam.replace(
          '/',
          '_',
        )}.pdf`,
        {
          type: 'application/pdf',
        },
      );

      // Upload files using the API
      const response = await uploadFile(
        paperFile,
        markingFile,
        userId,
        selectedCourse!,
        remarks,
        paperType,
        selectedModerator!,
        selectedExamination!,
      );

      console.log('Response:', response);
      console.log('Questions:', questions_);
      await createPaperStructure(response, questions_);

      if (response?.message) {
        setErrorMessage(response.message);
      } else {
        setSuccessMessage('Paper and marking scheme transferred successfully!');
        setCurrentStep(1);
      }
    } catch (error) {
      setErrorMessage(
        'An error occurred during the transfer. Please try again.',
      );
      console.error('Transfer error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Paper Setting" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-300 mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Paper Setting
          </h3>
        </div>

        <div className="p-8">
          <Stepper currentStep={currentStep} steps={steps} />

          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />

          {currentStep === 1 && (
            <PaperInfoForm
              paperInfo={paperInfo}
              handleInputChange={handleInputChange}
              setPaperInfo={setPaperInfo}
            />
          )}

          {currentStep === 2 && renderQuestionTemplate()}

          {currentStep === 3 && (
            <PaperPreview
              university={paperInfo.university}
              degree={paperInfo.degree}
              courseCode={paperInfo.courseCode}
              examYear={paperInfo.examYear}
              semester={paperInfo.semester}
              instructions={paperInfo.instructions}
              questions={questions}
              duration={paperInfo.duration}
            />
          )}

          {currentStep === 4 && (
            <MarkingPreview
              university={paperInfo.university}
              degree={paperInfo.degree}
              courseCode={paperInfo.courseCode}
              examYear={paperInfo.examYear}
              semester={paperInfo.semester}
              questions={questions}
              duration={paperInfo.duration}
            />
          )}

          {currentStep === 5 && (
            <FinalPaperTransfer
              isUploading={isUploading}
              handleTransfer={handleTransfer}
              selectedExamination={selectedExamination}
              examinations={examinations}
              selectedCourse={selectedCourse}
              courses={courses}
              paperType={paperType}
              availablePaperTypes={availablePaperTypes}
              moderators={moderators}
              selectedModerator={selectedModerator}
              remarks={remarks}
              setRemarks={setRemarks}
              setSelectedExamination={setSelectedExamination}
              setSelectedCourse={setSelectedCourse}
              setSelectedModerator={setSelectedModerator}
              setPaperType={setPaperType}
            />
          )}

          <div className="flex justify-between mt-8 text-sm">
            <button
              className="btn-secondary"
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === steps.length || isUploading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperSettings;
