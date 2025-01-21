import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

interface SubSubQuestion {
  subSubQuestionNumber: number;
  questionType: string;
  marks: number;
}

interface SubQuestion {
  subQuestionNumber: number;
  questionType: string;
  marks: number;
  subSubQuestions: SubSubQuestion[];
}

interface Question {
  questionNumber: number;
  questionType: string;
  totalMarks: number;
  subQuestions: SubQuestion[];
}

const CreatePaperStructure: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMarksBalanced, setIsMarksBalanced] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const initializeQuestions = () => {
    const initialQuestions = Array.from(
      { length: totalQuestions },
      (_, index) => ({
        questionNumber: index + 1,
        questionType: 'ESSAY',
        totalMarks: 0,
        subQuestions: [],
      }),
    );
    setQuestions(initialQuestions);
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
      // Sub-Sub-Question update
      const subQuestion =
        updatedQuestions[questionIndex].subQuestions[subQuestionIndex];
      const subSubQuestion = subQuestion.subSubQuestions[subSubQuestionIndex];

      subQuestion.subSubQuestions[subSubQuestionIndex] = {
        ...subSubQuestion,
        [name]: name === 'marks' ? parseInt(value, 10) || 0 : value,
      };

      // Recalculate sub-question marks
      subQuestion.marks = calculateSubQuestionMarks(subQuestion);
    } else if (subQuestionIndex !== undefined) {
      // Sub-Question update
      const question = updatedQuestions[questionIndex];
      const subQuestion = question.subQuestions[subQuestionIndex];

      question.subQuestions[subQuestionIndex] = {
        ...subQuestion,
        [name]: name === 'marks' ? parseInt(value, 10) || 0 : value,
      };

      // Recalculate question marks
      question.totalMarks = calculateQuestionMarks(question);
    } else {
      // Question update
      const question = updatedQuestions[questionIndex];
      updatedQuestions[questionIndex] = {
        ...question,
        [name]: name === 'totalMarks' ? parseInt(value, 10) || 0 : value,
      };
    }

    setQuestions(updatedQuestions);

    // Perform real-time mark balancing using updatedQuestions
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
      subQuestionNumber:
        updatedQuestions[questionIndex].subQuestions.length + 1,
      questionType: 'ESSAY',
      marks: 0,
      subSubQuestions: [],
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
      subSubQuestionNumber:
        updatedQuestions[questionIndex].subQuestions[subQuestionIndex]
          .subSubQuestions.length + 1,
      questionType: 'ESSAY',
      marks: 0,
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
      await axiosPrivate.post(`/structure/${paperId}`, questions, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccessMessage('Paper structure created successfully!');
      setTimeout(() => navigate('/paper/transfer'), 500);
    } catch (error) {
      setErrorMessage('An error occurred while creating the paper structure.');
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Breadcrumb pageName="Create Paper Structure" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Create Paper Structure
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

            {/* First Section: Total Questions and Marks */}
            {questions.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Total Questions
                  </label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) =>
                      setTotalQuestions(parseInt(e.target.value, 10))
                    }
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) =>
                      setTotalMarks(parseInt(e.target.value, 10))
                    }
                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={initializeQuestions}
                  className="w-full sm:w-auto mt-4 py-2 px-6 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                  Generate Form
                </button>
              </div>
            )}

            {/* Step 2: Display Questions in a Table */}
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
                              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
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
                                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                  />
                                </td>
                                <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeSubQuestion(
                                        questionIndex,
                                        subQuestionIndex,
                                      )
                                    }
                                    className="text-red-600 hover:underline pr-4"
                                  >
                                    Remove
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      addSubSubQuestion(
                                        questionIndex,
                                        subQuestionIndex,
                                      )
                                    }
                                    className="text-green-600 hover:underline"
                                  >
                                    Add Sub-Sub Question
                                  </button>
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
                                        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                      />
                                    </td>
                                    <td className="border border-gray-300 dark:border-strokedark px-4 py-2">
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

                {/* Marks Check */}
                <p
                  className={`mt-4 ${
                    isMarksBalanced ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isMarksBalanced
                    ? `Marks are balanced! Total allocated marks: ${totalMarks} / ${totalMarks}.`
                    : `Marks do not match. Total allocated marks: ${calculateTotalMarks()} / ${totalMarks}.`}
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 mt-4"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaperStructure;
