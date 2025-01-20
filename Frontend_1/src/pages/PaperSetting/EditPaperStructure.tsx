import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

interface SubSubQuestion {
  subSubQuestionId: number;
  subSubQuestionNumber: number;
  questionType: string;
  marks: number;
  isNew?: boolean;
}

interface SubQuestion {
  subQuestionId: number;
  subQuestionNumber: number;
  questionType: string;
  marks: number;
  subSubQuestions: SubSubQuestion[];
  isNew?: boolean;
}

interface Question {
  isNew: any;
  questionId: number;
  questionNumber: number;
  questionType: string;
  totalMarks: number;
  subQuestions: SubQuestion[];
}

const EditPaperStructure: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const [, setTotalQuestions] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMarksBalanced, setIsMarksBalanced] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => () => {});

  useEffect(() => {
    const fetchPaperStructure = async () => {
      try {
        const response = await axiosPrivate.get(`structure/${paperId}`);
        const { data, code } = response.data; // Destructure the response

        // Validate the response code
        if (code !== 200) {
          throw new Error(`Unexpected response code: ${code}`);
        }

        if (!Array.isArray(data)) {
          throw new Error(
            'Invalid response format: "data" should be an array.',
          );
        }

        // Process the questions data
        setQuestions(
          data.map((question: any) => ({
            ...question,
            subQuestions: (question.subQuestions || []).map(
              (subQuestion: any) => ({
                ...subQuestion,
                subSubQuestions: subQuestion.subSubQuestions || [],
              }),
            ),
          })),
        );

        // Optional: Derive total marks and questions from the data if needed
        const totalQuestions = data.length;
        const totalMarks = data.reduce(
          (sum: number, question: any) => sum + question.totalMarks,
          0,
        );

        setTotalQuestions(totalQuestions);
        setTotalMarks(totalMarks);
      } catch (error) {
        console.error('Fetch Paper Structure Error:', error);
        setErrorMessage('Failed to fetch paper structure.');
      }
    };

    fetchPaperStructure();
  }, [paperId, axiosPrivate]);

  const deleteStructure = async () => {
    const action = async () => {
      try {
        await axiosPrivate.delete(`/structure/${paperId}`);
        setQuestions([]);
        setSuccessMessage('All structures deleted successfully!');
      } catch (error) {
        console.error('Delete Structure Error:', error);
        setErrorMessage('Failed to delete the structure.');
      }
    };
    showConfirmationModal(action);
  };

  const deleteSubQuestion = async (
    subQuestionId: number,
    questionIndex: number,
  ) => {
    const action = async () => {
      try {
        // Make the delete request
        const response = await axiosPrivate.delete(
          `/structure/subQuestion/${subQuestionId}`,
        );

        // Log the response
        console.log('Sub-question deleted successfully:', response.data);

        // Update the local state to reflect the deletion
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].subQuestions = updatedQuestions[
          questionIndex
        ].subQuestions.filter((sq) => sq.subQuestionId !== subQuestionId);

        setQuestions(updatedQuestions); // Update the questions state
        setSuccessMessage('Sub-question deleted successfully!');
      } catch (error) {
        console.error('Delete Sub-Question Error:', error);
        setErrorMessage('Failed to delete the sub-question.');
      }
    };

    // Show confirmation modal before executing the delete action
    showConfirmationModal(action);
  };

  const deleteSubSubQuestion = async (
    subSubQuestionId: number,
    questionIndex: number,
    subQuestionIndex: number,
  ) => {
    const action = async () => {
      try {
        await axiosPrivate.delete(
          `/structure/subSubQuestion/${subSubQuestionId}`,
        );
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].subQuestions[
          subQuestionIndex
        ].subSubQuestions = updatedQuestions[questionIndex].subQuestions[
          subQuestionIndex
        ].subSubQuestions.filter(
          (ssq) => ssq.subSubQuestionNumber !== subSubQuestionId,
        );
        setQuestions(updatedQuestions);
        setSuccessMessage('Sub-sub-question deleted successfully!');
      } catch (error) {
        console.error('Delete Sub-Sub-Question Error:', error);
        setErrorMessage('Failed to delete the sub-sub-question.');
      }
    };
    showConfirmationModal(action);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    questionIndex: number,
    subQuestionIndex?: number,
    subSubQuestionIndex?: number,
  ) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];

    if (subSubQuestionIndex !== undefined && subQuestionIndex !== undefined) {
      const subQuestion =
        updatedQuestions[questionIndex].subQuestions[subQuestionIndex];
      const subSubQuestion = subQuestion.subSubQuestions[subSubQuestionIndex];

      subQuestion.subSubQuestions[subSubQuestionIndex] = {
        ...subSubQuestion,
        [name]: name === 'marks' ? parseInt(value, 10) || 0 : value,
      };

      subQuestion.marks = calculateSubQuestionMarks(subQuestion);
    } else if (subQuestionIndex !== undefined) {
      const question = updatedQuestions[questionIndex];
      const subQuestion = question.subQuestions[subQuestionIndex];

      question.subQuestions[subQuestionIndex] = {
        ...subQuestion,
        [name]: name === 'marks' ? parseInt(value, 10) || 0 : value,
      };

      question.totalMarks = calculateQuestionMarks(question);
    } else {
      const question = updatedQuestions[questionIndex];
      updatedQuestions[questionIndex] = {
        ...question,
        [name]: name === 'totalMarks' ? parseInt(value, 10) || 0 : value,
      };
    }

    setQuestions(updatedQuestions);

    const allocatedMarks = updatedQuestions.reduce(
      (sum, question) => sum + question.totalMarks,
      0,
    );

    if (allocatedMarks !== totalMarks) {
      setErrorMessage(
        `Total marks allocated (${allocatedMarks}) do not match the paper total (${totalMarks}).`,
      );
      setIsMarksBalanced(false);
    } else {
      setErrorMessage('');
      setIsMarksBalanced(true);
    }
  };

  const addSubQuestion = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].subQuestions.push({
      subQuestionId: Date.now(), // or any unique identifier
      subQuestionNumber:
        updatedQuestions[questionIndex].subQuestions.length + 1,
      questionType: 'ESSAY',
      marks: 0,
      subSubQuestions: [],
      isNew: true,
    });
    setQuestions(updatedQuestions);
  };

  const addSubSubQuestion = (
    questionIndex: number,
    subQuestionIndex: number,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].subQuestions[
      subQuestionIndex
    ].subSubQuestions.push({
      subSubQuestionId: Date.now(), // or any unique identifier
      subSubQuestionNumber:
        updatedQuestions[questionIndex].subQuestions[subQuestionIndex]
          .subSubQuestions.length + 1,
      questionType: 'ESSAY',
      marks: 0,
      isNew: true,
    });
    setQuestions(updatedQuestions);
  };

  const removeSubQuestion = (
    questionIndex: number,
    subQuestionIndex: number,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].subQuestions.splice(subQuestionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const removeSubSubQuestion = (
    questionIndex: number,
    subQuestionIndex: number,
    subSubQuestionIndex: number,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].subQuestions[
      subQuestionIndex
    ].subSubQuestions.splice(subSubQuestionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const calculateSubQuestionMarks = (subQuestion: SubQuestion): number => {
    return subQuestion.subSubQuestions.reduce(
      (sum, subSub) => sum + subSub.marks,
      0,
    );
  };

  const calculateQuestionMarks = (question: Question): number => {
    return question.subQuestions.reduce((sum, sub) => sum + sub.marks, 0);
  };

  const calculateTotalMarks = (): number => {
    return questions.reduce((sum, question) => sum + question.totalMarks, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allocatedMarks = calculateTotalMarks();
    if (allocatedMarks !== totalMarks) {
      setErrorMessage(
        `Total marks allocated (${allocatedMarks}) do not match the paper total (${totalMarks}).`,
      );
      setIsMarksBalanced(false);
      return;
    } else {
      setIsMarksBalanced(true);
    }

    try {
      await axiosPrivate.put(`/structure/${paperId}`, questions, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccessMessage('Paper structure updated successfully!');
      setTimeout(() => navigate('/papers'), 2000); // Redirect to papers page after success
    } catch (error) {
      setErrorMessage('An error occurred while updating the paper structure.');
      console.error(error);
    }
  };

  const showConfirmationModal = (action: () => void) => {
    setDeleteAction(() => action);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    deleteAction();
    setShowModal(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Breadcrumb pageName="Edit Paper Structure" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Edit Paper Structure
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            {successMessage && (
              <SuccessMessage
                message={successMessage}
                onClose={() => setSuccessMessage('')}
              />
            )}
            {errorMessage && (
              <ErrorMessage
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            )}

            {/* Questions and Marks Section */}
            {questions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-stroke text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-form-input">
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        #
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Question Type
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Marks
                      </th>
                      <th className="border border-gray-300 dark:border-strokedark px-4 py-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question, questionIndex) => (
                      <React.Fragment key={questionIndex}>
                        <tr>
                          <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                            {question.questionNumber}
                          </td>
                          <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                            <select
                              name="questionType"
                              value={question.questionType}
                              onChange={(e) =>
                                handleInputChange(e, questionIndex)
                              }
                              className="w-full py-3 px-5 text-black bg-transparent outline-none transition focus:ring-0 dark:text-white dark:bg-transparent dark:focus:ring-0 appearance-none"
                            >
                              <option value="ESSAY">ESSAY</option>
                              <option value="MCQ">MCQ</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                            <input
                              type="number"
                              name="totalMarks"
                              value={question.totalMarks}
                              onChange={(e) =>
                                handleInputChange(e, questionIndex)
                              }
                              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                            />
                          </td>
                          <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                            <button
                              type="button"
                              onClick={() => addSubQuestion(questionIndex)}
                              className="text-primary hover:underline"
                            >
                              Add Sub-Question
                            </button>
                          </td>
                        </tr>

                        {/* Sub-Questions */}
                        {question.subQuestions.map(
                          (subQuestion, subQuestionIndex) => (
                            <React.Fragment key={subQuestionIndex}>
                              <tr>
                                <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                  {question.questionNumber}.
                                  {subQuestion.subQuestionNumber}
                                </td>
                                <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                  <select
                                    name="questionType"
                                    value={subQuestion.questionType}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        questionIndex,
                                        subQuestionIndex,
                                      )
                                    }
                                    className="w-full py-3 px-5 text-black bg-transparent outline-none transition focus:ring-0 dark:text-white dark:bg-transparent dark:focus:ring-0 appearance-none"
                                  >
                                    <option value="ESSAY">ESSAY</option>
                                    <option value="MCQ">MCQ</option>
                                  </select>
                                </td>
                                <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                  <input
                                    type="number"
                                    name="marks"
                                    value={subQuestion.marks}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        questionIndex,
                                        subQuestionIndex,
                                      )
                                    }
                                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                                  />
                                </td>
                                <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      addSubSubQuestion(
                                        questionIndex,
                                        subQuestionIndex,
                                      )
                                    }
                                    className="text-primary hover:underline mr-4"
                                  >
                                    Add
                                  </button>
                                  {subQuestion.isNew ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSubQuestion(
                                          questionIndex,
                                          subQuestionIndex,
                                        )
                                      }
                                      className="text-red-600 hover:underline"
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteSubQuestion(
                                          subQuestion.subQuestionId,
                                          questionIndex,
                                        )
                                      }
                                      className="text-red-600 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </td>
                              </tr>

                              {/* Sub-Sub-Questions */}
                              {subQuestion.subSubQuestions.map(
                                (subSubQuestion, subSubQuestionIndex) => (
                                  <tr key={subSubQuestionIndex}>
                                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                      {question.questionNumber}.
                                      {subQuestion.subQuestionNumber}.
                                      {subSubQuestion.subSubQuestionNumber}
                                    </td>
                                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                      <select
                                        name="questionType"
                                        value={subSubQuestion.questionType}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e,
                                            questionIndex,
                                            subQuestionIndex,
                                            subSubQuestionIndex,
                                          )
                                        }
                                        className="w-full py-3 px-5 text-black bg-transparent outline-none transition focus:ring-0 dark:text-white dark:bg-transparent dark:focus:ring-0 appearance-none"
                                      >
                                        <option value="ESSAY">ESSAY</option>
                                        <option value="MCQ">MCQ</option>
                                      </select>
                                    </td>
                                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                      <input
                                        type="number"
                                        name="marks"
                                        value={subSubQuestion.marks}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e,
                                            questionIndex,
                                            subQuestionIndex,
                                            subSubQuestionIndex,
                                          )
                                        }
                                        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                                      />
                                    </td>
                                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                      {subSubQuestion.isNew ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeSubSubQuestion(
                                              questionIndex,
                                              subQuestionIndex,
                                              subSubQuestionIndex,
                                            )
                                          }
                                          className="text-red-600 hover:underline"
                                        >
                                          Remove
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            deleteSubSubQuestion(
                                              subSubQuestion.subSubQuestionId,
                                              questionIndex,
                                              subQuestionIndex,
                                            )
                                          }
                                          className="text-red-600 hover:underline"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </React.Fragment>
                          ),
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 flex items-center space-x-4">
              <button
                type="submit"
                disabled={!isMarksBalanced}
                className={`rounded-md py-3 px-5 text-white shadow-md focus:outline-none ${
                  isMarksBalanced
                    ? 'bg-primary hover:bg-primary-dark'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Save Paper Structure
              </button>
              <button
                type="button"
                onClick={deleteStructure}
                className="rounded-md bg-red-600 py-3 px-5 text-white shadow-md hover:bg-red-700 focus:outline-none"
              >
                Delete All Structure
              </button>
            </div>
          </div>
        </form>
      </div>
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this item?"
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
};

export default EditPaperStructure;
