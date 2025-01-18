import { useState, useEffect } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Loader from '../../common/Loader';
import { useParams } from 'react-router-dom';

export default function ModeratePaper() {
  const { paperId, moderatorId } = useParams<{
    paperId: string;
    moderatorId: string;
  }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [questionStructure, setQuestionStructure] = useState<any>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const axiosPrivate = useAxiosPrivate();

  // Fetch PDF function
  const fetchPdf = async () => {
    try {
      const response = await axiosPrivate.get(
        `papers/view/${paperId}?moderatorId=${moderatorId}`,
        { responseType: 'blob' },
      );
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  // Fetch question structure function
  const fetchQuestionStructure = async () => {
    try {
      const response = await axiosPrivate.get(
        `http://localhost:8080/api/v1/structure/${paperId}`,
      );
      setQuestionStructure(response.data);
    } catch (error) {
      console.error('Error fetching question structure:', error);
    }
  };

  // Update moderation for a single main question and its sub-questions/sub-sub-questions
  const updateModerationForMainQuestion = async (questionId: number) => {
    const updatedStructure = { ...questionStructure };
    const question = updatedStructure.data.find(
      (q: any) => q.questionId === questionId,
    );

    if (question) {
      try {
        const response = await axiosPrivate.post(
          '/moderation/question-with-hierarchy',
          {
            questionId: question.questionId,
            comment: question.comment || '',
            status: question.status || 'PENDING',
            subQuestions: question.subQuestions.map((subQuestion: any) => ({
              subQuestionId: subQuestion.subQuestionId,
              comment: subQuestion.comment || '',
              status: subQuestion.status || 'PENDING',
              subSubQuestions: subQuestion.subSubQuestions.map(
                (subSubQuestion: any) => ({
                  subSubQuestionId: subSubQuestion.subSubQuestionId,
                  comment: subSubQuestion.comment || '',
                  status: subSubQuestion.status || 'PENDING',
                }),
              ),
            })),
          },
        );

        if (response.data.code === 200) {
          console.log('Main question moderated successfully');
          fetchQuestionStructure();
        }
      } catch (error) {
        console.error('Error updating moderation for main question:', error);
      }
    }
  };

  // Handle comment and status changes for sub-sub-questions
  // Handle comment and status changes for main questions
  const handleMainQuestionChange = (
    questionId: number,
    newComment: string,
    newStatus: string,
  ) => {
    const updatedStructure = { ...questionStructure };
    const question = updatedStructure.data.find(
      (q: any) => q.questionId === questionId,
    );

    if (question) {
      question.comment = newComment;
      question.status = newStatus;

      // Update status for all sub-questions and sub-sub-questions based on main question's status
      question.subQuestions.forEach((subQuestion: any) => {
        subQuestion.status = newStatus;
        subQuestion.subSubQuestions.forEach((subSubQuestion: any) => {
          subSubQuestion.status = newStatus;
        });
      });
    }

    setQuestionStructure(updatedStructure); // Update state

    // Call to update the moderation for main question and its hierarchy
    updateModerationForMainQuestion(questionId);
  };

  // Handle comment and status changes for sub-questions
  const handleSubQuestionChange = (
    questionId: number,
    subQuestionId: number,
    comment: string,
    status: string,
  ) => {
    const updatedStructure = { ...questionStructure };
    const question = updatedStructure.data.find(
      (q: any) => q.questionId === questionId,
    );

    if (question) {
      const subQuestion = question.subQuestions.find(
        (sq: any) => sq.subQuestionId === subQuestionId,
      );

      if (subQuestion) {
        subQuestion.comment = comment;
        subQuestion.status = status;

        // Update status for all sub-sub-questions based on sub-question's status
        subQuestion.subSubQuestions.forEach((subSubQuestion: any) => {
          subSubQuestion.status = status;
        });
      }
    }

    setQuestionStructure(updatedStructure); // Update state
  };

  // Handle comment and status changes for sub-sub-questions
  const handleSubSubQuestionChange = (
    questionId: number,
    subQuestionId: number,
    subSubQuestionId: number,
    comment: string,
    status: string,
  ) => {
    const updatedStructure = { ...questionStructure };
    const question = updatedStructure.data.find(
      (q: any) => q.questionId === questionId,
    );

    if (question) {
      const subQuestion = question.subQuestions.find(
        (sq: any) => sq.subQuestionId === subQuestionId,
      );

      if (subQuestion) {
        const subSubQuestion = subQuestion.subSubQuestions.find(
          (ssq: any) => ssq.subSubQuestionId === subSubQuestionId,
        );

        if (subSubQuestion) {
          subSubQuestion.comment = comment;
          subSubQuestion.status = status;
        }
      }
    }

    setQuestionStructure(updatedStructure); // Update state
  };

  // Effect hook to fetch PDF and question structure
  useEffect(() => {
    fetchPdf();
    fetchQuestionStructure();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [axiosPrivate, paperId, moderatorId]);

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {/* PDF Viewer */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
        {pdfUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        ) : (
          <div className="flex justify-center items-center h-full text-xl text-gray-500">
            <Loader />
          </div>
        )}
      </div>

      {/* Question Structure */}
      <div className="w-1/3 ml-6 bg-white rounded-lg shadow-lg p-6 overflow-auto">
        {questionStructure ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Question Structure</h2>
            {questionStructure.data.map((question: any) => (
              <div key={question.questionId} className="mb-6">
                <h3 className="text-lg font-semibold">
                  Question {question.questionNumber}
                </h3>
                <p className="text-gray-600">Type: {question.questionType}</p>
                <p className="text-gray-600">
                  Total Marks: {question.totalMarks}
                </p>
                {/* Main Question Comment */}
                <div className="ml-4">
                  <textarea
                    className="border p-2 w-full"
                    value={question.comment || ''}
                    onChange={(e) =>
                      handleMainQuestionChange(
                        question.questionId,
                        e.target.value,
                        question.status || 'PENDING',
                      )
                    }
                  />
                  <select
                    value={question.status || 'PENDING'}
                    onChange={(e) =>
                      handleMainQuestionChange(
                        question.questionId,
                        question.comment || '',
                        e.target.value,
                      )
                    }
                    className="border p-2 mt-2 w-full"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {question.subQuestions.map((subQuestion: any) => (
                  <div key={subQuestion.subQuestionId} className="ml-4 mt-2">
                    <h4 className="font-semibold">
                      Sub-Question {subQuestion.subQuestionNumber}
                    </h4>
                    <p>Marks: {subQuestion.marks}</p>
                    {/* Sub-Question Comment */}
                    <textarea
                      className="border p-2 w-full"
                      value={subQuestion.comment || ''}
                      onChange={(e) =>
                        handleSubQuestionChange(
                          question.questionId,
                          subQuestion.subQuestionId,
                          e.target.value,
                          subQuestion.status,
                        )
                      }
                    />
                    <select
                      value={subQuestion.status || 'PENDING'}
                      onChange={(e) =>
                        handleSubQuestionChange(
                          question.questionId,
                          subQuestion.subQuestionId,
                          subQuestion.comment || '',
                          e.target.value,
                        )
                      }
                      className="border p-2 mt-2 w-full"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>

                    {subQuestion.subSubQuestions.map((subSubQuestion: any) => (
                      <div
                        key={subSubQuestion.subSubQuestionId}
                        className="ml-4 mt-2"
                      >
                        <h5 className="font-semibold">
                          Sub-Sub-Question {subSubQuestion.subSubQuestionNumber}
                        </h5>
                        <p>Marks: {subSubQuestion.marks}</p>
                        {/* Sub-Sub-Question Comment */}
                        <textarea
                          className="border p-2 w-full"
                          value={subSubQuestion.comment || ''}
                          onChange={(e) =>
                            handleSubSubQuestionChange(
                              question.questionId,
                              subQuestion.subQuestionId,
                              subSubQuestion.subSubQuestionId,
                              e.target.value,
                              subSubQuestion.status,
                            )
                          }
                        />
                        <select
                          value={subSubQuestion.status || 'PENDING'}
                          onChange={(e) =>
                            handleSubSubQuestionChange(
                              question.questionId,
                              subQuestion.subQuestionId,
                              subSubQuestion.subSubQuestionId,
                              subSubQuestion.comment || '',
                              e.target.value,
                            )
                          }
                          className="border p-2 mt-2 w-full"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Submit Button for this Question */}
                <button
                  onClick={() =>
                    updateModerationForMainQuestion(question.questionId)
                  }
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Submit Moderation for Question {question.questionNumber}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center text-xl text-gray-500">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
