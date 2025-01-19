import { useEffect, useState } from 'react';

interface QuestionStructureProps {
  questionStructure: any;
  onMainQuestionChange: (
    questionId: number,
    newComment: string,
    newStatus: string,
  ) => void;
  onSubQuestionChange: (
    questionId: number,
    subQuestionId: number,
    comment: string,
    status: string,
  ) => void;
  onSubSubQuestionChange: (
    questionId: number,
    subQuestionId: number,
    subSubQuestionId: number,
    comment: string,
    status: string,
  ) => void;
  onSubmitModeration: (questionId: number) => void;
}

const QuestionStructure: React.FC<QuestionStructureProps> = ({
  questionStructure,
  onMainQuestionChange,
  onSubQuestionChange,
  onSubSubQuestionChange,
  onSubmitModeration,
}) => {
  const [editedQuestionStructure, setEditedQuestionStructure] =
    useState<any>(null);
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
  const [openSubQuestionIds, setOpenSubQuestionIds] = useState<Set<number>>(
    new Set(),
  );
  const [openSubSubQuestionIds, setOpenSubSubQuestionIds] = useState<
    Set<number>
  >(new Set());
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setEditedQuestionStructure(questionStructure);
  }, [questionStructure]);

  const areAllApproved = (items: any[]) => {
    return items.every((item) => item.status === 'APPROVED');
  };

  const updateParentStatus = (updatedStructure: any, questionId: number) => {
    const question = updatedStructure.data.find(
      (q: any) => q.questionId === questionId,
    );

    if (question) {
      const areSubQuestionsApproved = areAllApproved(question.subQuestions);
      question.status = areSubQuestionsApproved ? 'APPROVED' : 'REJECTED';

      if (question.status === 'REJECTED') {
        question.subQuestions.forEach((subQuestion: any) => {
          subQuestion.status = 'REJECTED';
          subQuestion.subSubQuestions.forEach((subSubQuestion: any) => {
            subSubQuestion.status = 'REJECTED';
          });
        });
      }

      question.subQuestions.forEach((subQuestion: any) => {
        const areSubSubQuestionsApproved = areAllApproved(
          subQuestion.subSubQuestions,
        );
        subQuestion.status = areSubSubQuestionsApproved
          ? 'APPROVED'
          : 'REJECTED';
      });
    }

    return updatedStructure;
  };

  const handleMainQuestionChange = (
    questionId: number,
    newComment: string,
    newStatus: string,
  ) => {
    const updatedStructure = { ...editedQuestionStructure };
    const question = updatedStructure.data.find(
      (q: any) => q.questionId === questionId,
    );
    if (question) {
      question.comment = newComment;
      question.status = newStatus;
    }

    const updatedStructureWithStatus = updateParentStatus(
      updatedStructure,
      questionId,
    );
    setEditedQuestionStructure(updatedStructureWithStatus);
    onMainQuestionChange(questionId, newComment, newStatus);
  };

  const handleSubQuestionChange = (
    questionId: number,
    subQuestionId: number,
    comment: string,
    status: string,
  ) => {
    const updatedStructure = { ...editedQuestionStructure };
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
      }

      const updatedStructureWithStatus = updateParentStatus(
        updatedStructure,
        questionId,
      );
      setEditedQuestionStructure(updatedStructureWithStatus);
    }
    onSubQuestionChange(questionId, subQuestionId, comment, status);
  };

  const handleSubSubQuestionChange = (
    questionId: number,
    subQuestionId: number,
    subSubQuestionId: number,
    comment: string,
    status: string,
  ) => {
    const updatedStructure = { ...editedQuestionStructure };
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

      const updatedStructureWithStatus = updateParentStatus(
        updatedStructure,
        questionId,
      );
      setEditedQuestionStructure(updatedStructureWithStatus);
    }
    onSubSubQuestionChange(
      questionId,
      subQuestionId,
      subSubQuestionId,
      comment,
      status,
    );
  };

  const toggleQuestionDetails = (questionId: number) => {
    setOpenQuestionId(openQuestionId === questionId ? null : questionId);
  };

  const toggleSubQuestionDetails = (subQuestionId: number) => {
    const updatedSubQuestions = new Set(openSubQuestionIds);
    if (updatedSubQuestions.has(subQuestionId)) {
      updatedSubQuestions.delete(subQuestionId);
    } else {
      updatedSubQuestions.add(subQuestionId);
    }
    setOpenSubQuestionIds(updatedSubQuestions);
  };

  const toggleSubSubQuestionDetails = (subSubQuestionId: number) => {
    const updatedSubSubQuestions = new Set(openSubSubQuestionIds);
    if (updatedSubSubQuestions.has(subSubQuestionId)) {
      updatedSubSubQuestions.delete(subSubQuestionId);
    } else {
      updatedSubSubQuestions.add(subSubQuestionId);
    }
    setOpenSubSubQuestionIds(updatedSubSubQuestions);
  };

  const handleModerationSubmit = (questionId: number) => {
    const question = editedQuestionStructure.data.find(
      (q: any) => q.questionId === questionId,
    );
    try {
      onSubmitModeration(questionId);
      setSuccessMessage(
        `Moderation submitted for Question ${question.questionNumber}`,
      );
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(
        `Failed to submit moderation for Question ${question.questionNumber}`,
      );
      setSuccessMessage('');
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white text-sm">
          Question Structure
        </h3>
      </div>

      {/* Display success or error message */}
      {successMessage && (
        <div className="p-4 text-sm text-green-600 bg-green-100 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 text-sm text-red-600 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
      )}

      {editedQuestionStructure?.data.map((question: any) => (
        <div key={question.questionId}>
          <div
            className="flex justify-between cursor-pointer p-6 border-b border-gray-200 dark:border-gray-600"
            onClick={() => toggleQuestionDetails(question.questionId)}
          >
            <h3 className="font-semibold text-gray-800 dark:text-gray-300 text-sm">
              Question {question.questionNumber} -{' '}
              <span
                className={`${
                  question.status === 'APPROVED'
                    ? 'text-green-500'
                    : question.status === 'REJECTED'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}
              >
                {question.status || 'PENDING'}
              </span>
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {question.questionType} | Total Marks: {question.totalMarks}
            </span>
          </div>

          {openQuestionId === question.questionId && (
            <div className="p-4">
              <textarea
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4 text-sm"
                value={question.comment || ''}
                onChange={(e) =>
                  handleMainQuestionChange(
                    question.questionId,
                    e.target.value,
                    question.status || 'PENDING',
                  )
                }
                placeholder="Add your comment"
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
                className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none mb-4 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              {question.subQuestions.map((subQuestion: any) => (
                <div key={subQuestion.subQuestionId} className="mt-4">
                  <div
                    className="flex justify-between cursor-pointer"
                    onClick={() =>
                      toggleSubQuestionDetails(subQuestion.subQuestionId)
                    }
                  >
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300 text-sm">
                      {question.questionNumber}.{subQuestion.subQuestionNumber}{' '}
                      - {subQuestion.questionType}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      <span
                        className={`${
                          subQuestion.status === 'APPROVED'
                            ? 'text-green-500'
                            : subQuestion.status === 'REJECTED'
                            ? 'text-red-500'
                            : 'text-yellow-500'
                        }`}
                      >
                        {subQuestion.status || 'Pending'}
                      </span>{' '}
                      | Marks: {subQuestion.marks}
                    </span>
                  </div>

                  {openSubQuestionIds.has(subQuestion.subQuestionId) && (
                    <div className="mt-2 bg-gray-100 p-4 rounded-md dark:bg-gray-700">
                      <textarea
                        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4 text-sm"
                        value={subQuestion.comment || ''}
                        onChange={(e) =>
                          handleSubQuestionChange(
                            question.questionId,
                            subQuestion.subQuestionId,
                            e.target.value,
                            subQuestion.status,
                          )
                        }
                        placeholder="Add comment"
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
                        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none mb-4 text-sm"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      {subQuestion.subSubQuestions.map(
                        (subSubQuestion: any) => (
                          <div
                            key={subSubQuestion.subSubQuestionId}
                            className="mt-4 bg-gray-200 p-4 rounded-md dark:bg-gray-800"
                          >
                            <div
                              className="flex justify-between cursor-pointer"
                              onClick={() =>
                                toggleSubSubQuestionDetails(
                                  subSubQuestion.subSubQuestionId,
                                )
                              }
                            >
                              <h5 className="font-semibold text-gray-800 dark:text-gray-300 text-sm">
                                {question.questionNumber}.
                                {subQuestion.subQuestionNumber}.
                                {subSubQuestion.subSubQuestionNumber} -{' '}
                                {subSubQuestion.questionType}
                              </h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Status:{' '}
                                <span
                                  className={`${
                                    subSubQuestion.status === 'APPROVED'
                                      ? 'text-green-500'
                                      : subSubQuestion.status === 'REJECTED'
                                      ? 'text-red-500'
                                      : 'text-yellow-500'
                                  }`}
                                >
                                  {subSubQuestion.status || 'Pending'}
                                </span>{' '}
                                | Marks: {subSubQuestion.marks}
                              </span>
                            </div>

                            {openSubSubQuestionIds.has(
                              subSubQuestion.subSubQuestionId,
                            ) && (
                              <div className="mt-2">
                                <textarea
                                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4 text-sm"
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
                                  placeholder="Add comment"
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
                                  className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none mb-4 text-sm"
                                >
                                  <option value="PENDING">Pending</option>
                                  <option value="APPROVED">Approved</option>
                                  <option value="REJECTED">Rejected</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => handleModerationSubmit(question.questionId)}
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 text-sm mt-6"
              >
                Submit Moderation
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionStructure;
