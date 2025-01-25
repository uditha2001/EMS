import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import './chartConfig';

import {
  faCheckCircle,
  faTimesCircle,
  faClock,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import useApi from '../../api/api';

interface SubSubQuestion {
  subSubQuestionId: number;
  subSubQuestionNumber: number;
  questionType: string;
  marks: number;
  moderatorComment: string | null;
  status: string;
}

interface SubQuestion {
  subQuestionId: number;
  subQuestionNumber: number;
  questionType: string;
  marks: number;
  subSubQuestions: SubSubQuestion[];
  moderatorComment: string | null;
  status: string;
}

interface Question {
  questionId: number;
  questionNumber: number;
  questionType: string;
  totalMarks: number;
  subQuestions: SubQuestion[];
  moderatorComment: string | null;
  status: string;
  paperId: number;
}

interface Paper {
  id: number;
  fileName: string;
  remarks: string;
  createdAt: string;
  creator: { id: number; firstName: string; lastName: string };
  moderator: { id: number; firstName: string; lastName: string };
  academicYear: number;
  courses: { id: number; name: string; code: string }[];
  status: string;
  shared: boolean;
}

const ModerationDashboard: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const { getPapers, getPaperStructure } = useApi();

  // Function to fetch paper data
  useEffect(() => {
    const fetchPapersData = async () => {
      try {
        const paperResponse = await getPapers();
        const paperData = paperResponse.data.data;
        setPapers(paperData);
        for (const paper of paperData) {
          fetchQuestionsData(paper.id);
        }
      } catch (error) {
        console.error('Error fetching paper data:', error);
      }
    };
    fetchPapersData();
  }, []);

  // Function to fetch question structure
  const fetchQuestionsData = async (paperId: number) => {
    try {
      const questionResponse = await getPaperStructure(paperId);
      const questionData = questionResponse.data;
      setQuestions((prevQuestions) => [...prevQuestions, ...questionData.data]);
    } catch (error) {
      console.error('Error fetching question data:', error);
    }
  };

  // Function to fetch question structure when a paper is selected
  useEffect(() => {
    if (selectedPaperId !== null) {
      const fetchQuestionsData = async () => {
        try {
          const questionResponse = await getPaperStructure(selectedPaperId);
          const questionData = questionResponse.data;
          setQuestion(questionData.data);
        } catch (error) {
          console.error('Error fetching question data:', error);
        }
      };
      fetchQuestionsData();
    }
  }, [selectedPaperId]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return '';
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center text-yellow-600">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            Pending
          </span>
        );
      case 'DRAFT':
        return (
          <span className="flex items-center text-blue-600">
            <FontAwesomeIcon icon={faPen} className="mr-2" />
            Draft
          </span>
        );
      case 'APPROVED':
        return (
          <span className="flex items-center text-green-600">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center text-red-600">
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
            Rejected
          </span>
        );
      default:
        return 'Unknown';
    }
  };

  const handleCardClick = (paperId: number) => {
    setSelectedPaperId(paperId);
  };

  const calculateCompletionPercentage = (questions: Question[]) => {
    const approvedQuestions = questions.filter(
      (question) => question.status === 'APPROVED',
    );
    const totalQuestions = questions.length;
    return totalQuestions === 0
      ? 0
      : Math.round((approvedQuestions.length / totalQuestions) * 100);
  };

  const prepareStatusData = () => {
    const statuses = ['APPROVED', 'DRAFT'];
    const statusCounts = statuses.map(
      (status) => papers.filter((paper) => paper.status === status).length,
    );

    return {
      labels: statuses,
      datasets: [
        {
          label: 'Paper Status Distribution',
          data: statusCounts,
          backgroundColor: ['#22c55e', '#facc15'],
          borderColor: ['#16a34a', '#ca8a04'],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareCompletionData = () => {
    const paperLabels = papers.map((paper) => paper.fileName);
    const completionData = papers.map((paper) => {
      const paperQuestions = questions.filter(
        (question) => question.paperId === paper.id,
      );
      return calculateCompletionPercentage(paperQuestions);
    });

    return {
      labels: paperLabels,
      datasets: [
        {
          label: 'Completion Percentage',
          data: completionData,
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareQuestionStatusData = () => {
    const statuses = ['APPROVED', 'PENDING', 'REJECTED'];
    const statusCounts = statuses.map(
      (status) =>
        questions.filter((question) => question.status === status).length,
    );

    return {
      labels: statuses,
      datasets: [
        {
          data: statusCounts,
          backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
          hoverBackgroundColor: ['#16a34a', '#ca8a04', '#b91c1c'],
        },
      ],
    };
  };

  const renderQuestionsTable = (questions: Question[]) => {
    return (
      <table className="table-auto w-full border-collapse border border-gray-200 dark:border-strokedark">
        <thead>
          <tr className="bg-gray-100 dark:bg-form-input">
            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
              Question Number
            </th>
            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
              Sub-Questions
            </th>
            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
              Moderation Status
            </th>
            <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr
              key={question.questionId}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {/* Main Question */}
              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                {question.questionNumber}
              </td>
              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                {question.subQuestions.length > 0
                  ? question.subQuestions.map((subQuestion) => (
                      <div key={subQuestion.subQuestionId}>
                        {/* Sub-Question */}
                        <strong>
                          {question.questionNumber}.
                          {subQuestion.subQuestionNumber}
                        </strong>{' '}
                        {subQuestion.moderatorComment && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            (Comment: {subQuestion.moderatorComment})
                          </span>
                        )}
                        <ul className="ml-4 mt-1">
                          {subQuestion.subSubQuestions.map((subSubQuestion) => (
                            <li
                              key={subSubQuestion.subSubQuestionId}
                              className="mb-1"
                            >
                              {/* Sub-Sub-Question */}
                              {question.questionNumber}.
                              {subQuestion.subQuestionNumber}.
                              {subSubQuestion.subSubQuestionNumber}{' '}
                              {getProgress(subSubQuestion.status)}
                              {subSubQuestion.moderatorComment && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {' '}
                                  (Comment: {subSubQuestion.moderatorComment})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  : 'No sub-questions'}
              </td>
              {/* Main Question Moderation Status */}
              <td
                className={`border px-4 py-2 ${getStatusColor(
                  question.status,
                )}`}
              >
                {getProgress(question.status)}
              </td>
              {/* Main Question Remarks */}
              <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                {question.moderatorComment || 'No comments'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Moderation Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers.map((paper) => {
          const paperQuestions = questions.filter(
            (question) => question.paperId === paper.id,
          );

          const paperCompletionPercentage =
            calculateCompletionPercentage(paperQuestions);

          return (
            <div
              key={paper.id}
              className="border p-4 rounded-sm cursor-pointer  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
              onClick={() => handleCardClick(paper.id)}
            >
              <h3 className="font-semibold">{paper.fileName}</h3>
              <p className="text-sm flex items-center">
                {getProgress(paper.status)}
                <span className={`ml-2 ${getStatusColor(paper.status)}`} />
              </p>
              <p>
                Created by: {paper.creator.firstName} {paper.creator.lastName}
              </p>
              <p>
                Moderator: {paper.moderator.firstName}{' '}
                {paper.moderator.lastName}
              </p>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Progress:
                </label>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase">
                      {paperCompletionPercentage}% Completed
                    </span>
                  </div>
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-300 rounded-full">
                      <div
                        className={`h-2 rounded-full bg-primary`}
                        style={{ width: `${paperCompletionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPaperId && question.length > 0 && (
        <div>
          <h3 className="font-medium text-black dark:text-white my-6">
            Questions Moderation Progress
          </h3>
          {renderQuestionsTable(question)}
        </div>
      )}
      {questions.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="text-md font-semibold mb-4">
              Paper Status Distribution
            </h4>
            <Doughnut data={prepareStatusData()} />
          </div>

          <div className="p-4 rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="text-md font-semibold mb-4">Completion Progress</h4>
            <Bar data={prepareCompletionData()} />
          </div>

          <div className="p-4 rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="text-md font-semibold mb-4">
              Question Status Breakdown
            </h4>
            <Pie data={prepareQuestionStatusData()} />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
          No moderation available for this paper
        </div>
      )}
    </div>
  );
};

export default ModerationDashboard;
