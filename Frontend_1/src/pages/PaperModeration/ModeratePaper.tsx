import { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Loader from '../../common/Loader';
import { useParams } from 'react-router-dom';
import QuestionStructure from './QuestionStructure';

export default function ModeratePaper() {
  const { paperId, moderatorId } = useParams<{
    paperId: string;
    moderatorId: string;
  }>();
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [questionStructure, setQuestionStructure] = useState<any>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const axiosPrivate = useAxiosPrivate();

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

  const fetchQuestionStructure = async () => {
    try {
      const response = await axiosPrivate.get(`structure/${paperId}`);
      setQuestionStructure(response.data);
    } catch (error) {
      console.error('Error fetching question structure:', error);
    }
  };

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
          fetchQuestionStructure(); // Fetch updated structure after submission
        }
      } catch (error) {
        console.error('Error updating moderation for main question:', error);
      }
    }
  };

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

      question.subQuestions.forEach((subQuestion: any) => {
        subQuestion.status = newStatus;
        subQuestion.subSubQuestions.forEach((subSubQuestion: any) => {
          subSubQuestion.status = newStatus;
        });
      });
    }

    setQuestionStructure(updatedStructure);
  };

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

        subQuestion.subSubQuestions.forEach((subSubQuestion: any) => {
          subSubQuestion.status = status;
        });
      }
    }

    setQuestionStructure(updatedStructure);
  };

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

    setQuestionStructure(updatedStructure);
  };

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
    <div className="flex h-screen p-6">
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

      <div className="w-full lg:w-1/3 lg:ml-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {questionStructure ? (
          <QuestionStructure
            questionStructure={questionStructure}
            onMainQuestionChange={handleMainQuestionChange}
            onSubQuestionChange={handleSubQuestionChange}
            onSubSubQuestionChange={handleSubSubQuestionChange}
            onSubmitModeration={updateModerationForMainQuestion}
          />
        ) : (
          <div className="flex justify-center items-center text-xl text-gray-500 dark:text-gray-300">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
