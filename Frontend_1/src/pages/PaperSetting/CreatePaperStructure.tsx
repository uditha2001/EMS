import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApi from '../../api/api';
import SearchableSelectBox from '../../components/SearchableSelectBox';

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
  templateId?: number;
}

interface Template {
  templateId: number;
  templateName: string;
}

const CreatePaperStructure: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMarksBalanced, setIsMarksBalanced] = useState(true);
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [isSaveTemplate, setIsSaveTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { createPaperStructure, saveTemplate, getTemplateById, getTemplates } =
    useApi();

  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getTemplates();
        const data = response.data;
        if (data.code === 200) {
          setTemplates(data.data);
        } else {
          setErrorMessage('Failed to load templates.');
        }
      } catch {
        setErrorMessage('Error fetching templates.');
      }
    };

    fetchTemplates();
  }, []);

  // Fetch questions based on the selected template
  useEffect(() => {
    if (selectedTemplate) {
      getTemplateById(Number(selectedTemplate))
        .then((response) => {
          const data = response.data;
          if (data.code === 200) {
            setQuestions(data.data.questionStructures);
            setTotalQuestions(data.data.questionStructures.length);
            setTotalMarks(
              data.data.questionStructures.reduce(
                (acc: number, question: Question) => acc + question.totalMarks,
                0,
              ),
            );
          } else {
            setErrorMessage(
              'Failed to load questions for the selected template.',
            );
          }
        })
        .catch(() => setErrorMessage('Error fetching questions.'));
    }
  }, [selectedTemplate]);

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
        [name]:
          name === 'marks'
            ? parseFloat(parseFloat(value).toFixed(1)) || 0
            : value,
      };

      // Recalculate sub-question marks
      subQuestion.marks = calculateSubQuestionMarks(subQuestion);

      // Recalculate main question marks
      const question = updatedQuestions[questionIndex];
      question.totalMarks = calculateQuestionMarks(question);
    } else if (subQuestionIndex !== undefined) {
      // Sub-Question update
      const question = updatedQuestions[questionIndex];
      const subQuestion = question.subQuestions[subQuestionIndex];

      question.subQuestions[subQuestionIndex] = {
        ...subQuestion,
        [name]:
          name === 'marks'
            ? parseFloat(parseFloat(value).toFixed(1)) || 0
            : value,
      };

      // Recalculate main question marks
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
      if (isSaveTemplate) {
        const templateData = {
          template: {
            templateId: 0, // Use 0 for new templates, or a specific ID if updating
            templateName,
          },
          questionStructures: questions.map((question) => ({
            ...question,
            subQuestions: question.subQuestions.map((sub) => ({
              ...sub,
              subSubQuestions: sub.subSubQuestions.map((subSub) => ({
                ...subSub,
              })),
            })),
            templateId: 0, // Associate questions with the new template
          })),
        };
        console.log('Request Payload:', templateData);

        await saveTemplate(templateData);
        await createPaperStructure(paperId, questions);
        setSuccessMessage(
          'Paper structure created and Template saved successfully!',
        );
        setTimeout(() => navigate('/paper/transfer'), 500);
      } else {
        await createPaperStructure(paperId, questions);
        setSuccessMessage('Paper structure created successfully!');
        setTimeout(() => navigate('/paper/transfer'), 500);
      }
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

            {/* Template Selection */}
            <div className="mb-4 w-full">
              {/* Container for Select Box and Link */}
              <div className="flex flex-col sm:flex-row justify-between items-center w-full">
                {/* Searchable Select Box on the Left, Full Width */}
                <div className="w-full mb-4 sm:mb-0">
                  <SearchableSelectBox
                    label="Select Template"
                    value={selectedTemplate}
                    onChange={setSelectedTemplate}
                    placeholder="Search for a template"
                    options={templates.map((template) => ({
                      id: template.templateId.toString(),
                      name: template.templateName,
                    }))}
                  />
                </div>

                {/* Link to View All Templates on the Right */}
                <div className="w-full sm:w-auto sm:ml-4">
                  <Link
                    to="/paper/template"
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 text-center"
                  >
                    View All Templates
                  </Link>
                </div>
              </div>
            </div>

            {/* Create New Template Section */}
            {questions.length === 0 && (
              <>
                {/* OR */}
                <div className="flex justify-center items-center text-black dark:text-white my-4">
                  <span className="mx-4">OR</span>
                </div>
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
                      className="input-field"
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
                      className="input-field"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="button"
                      onClick={initializeQuestions}
                      className="w-full sm:w-auto py-2 px-6 bg-primary text-white rounded hover:bg-opacity-90"
                    >
                      Generate New
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Ask to Save as Template */}
            {questions.length > 0 && !selectedTemplate && (
              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">
                  Save this as a template?
                </label>
                <input
                  type="checkbox"
                  checked={isSaveTemplate}
                  onChange={(e) => setIsSaveTemplate(e.target.checked)}
                  className="mr-2"
                />
                Yes, I want to save it as a template
                {isSaveTemplate && (
                  <div className="mt-4">
                    <label className="mb-2 block text-black dark:text-white">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                )}
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
                              className="input-field"
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
                                    className="input-field"
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
                                        className="input-field"
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
                  disabled={!isMarksBalanced}
                >
                  Create Paper Structure
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
