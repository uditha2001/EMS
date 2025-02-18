import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { FaPlus, FaMinus } from 'react-icons/fa';

type QuestionType =
  | 'ESSAY'
  | 'MCQ'
  | 'SHORT_ANSWER'
  | 'TRUE_FALSE'
  | 'STRUCTURE';

interface Question {
  questionText: string;
  type: QuestionType;
  marks: number;
  answer?: string;
  subquestions: SubQuestion[];
}

interface SubQuestion {
  text: string;
  type: QuestionType;
  marks: number;
  answer?: string;
  subquestions: SubSubQuestion[];
}

interface SubSubQuestion {
  text: string;
  type: QuestionType;
  marks: number;
  answer?: string;
}

interface StructureTemplateProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  quillModules: any;
}

const StructureTemplate: React.FC<StructureTemplateProps> = ({
  questions,
  setQuestions,
  quillModules,
}) => {
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', type: 'ESSAY', marks: 0, subquestions: [] },
    ]);
    setCollapsed([...collapsed, false]);
  };

  // Remove a question
  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
    const newCollapsed = collapsed.filter((_, idx) => idx !== index);
    setCollapsed(newCollapsed);
  };

  // Toggle collapse for a question
  const toggleCollapse = (index: number) => {
    const newCollapsed = [...collapsed];
    newCollapsed[index] = !newCollapsed[index];
    setCollapsed(newCollapsed);
  };

  // Add a subquestion
  const addSubQuestion = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions.push({
      text: '',
      type: 'ESSAY',
      marks: 0,
      subquestions: [],
    });
    setQuestions(newQuestions);
  };

  // Remove a subquestion
  const removeSubQuestion = (questionIndex: number, subIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions = newQuestions[
      questionIndex
    ].subquestions.filter((_, idx) => idx !== subIndex);
    setQuestions(newQuestions);
  };

  // Add a sub-subquestion
  const addSubSubQuestion = (questionIndex: number, subIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions[subIndex].subquestions.push({
      text: '',
      type: 'ESSAY',
      marks: 0,
    });
    setQuestions(newQuestions);
  };

  // Remove a sub-subquestion
  const removeSubSubQuestion = (
    questionIndex: number,
    subIndex: number,
    subSubIndex: number,
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions[subIndex].subquestions =
      newQuestions[questionIndex].subquestions[subIndex].subquestions.filter(
        (_, idx) => idx !== subSubIndex,
      );
    setQuestions(newQuestions);
  };

  // Update marks for a question
  const updateMarks = (questionIndex: number, marks: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].marks = marks;
    setQuestions(newQuestions);
  };

  // Update marks for a subquestion
  const updateSubQuestionMarks = (
    questionIndex: number,
    subIndex: number,
    marks: number,
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions[subIndex].marks = marks;
    setQuestions(newQuestions);
  };

  // Update marks for a sub-subquestion
  const updateSubSubQuestionMarks = (
    questionIndex: number,
    subIndex: number,
    subSubIndex: number,
    marks: number,
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions[subIndex].subquestions[
      subSubIndex
    ].marks = marks;
    setQuestions(newQuestions);
  };

  // Calculate total marks for validation
  const calculateTotalMarks = () => {
    return questions.reduce((total, question) => {
      const subTotal = question.subquestions.reduce(
        (subTotal, sub) =>
          subTotal +
          sub.marks +
          sub.subquestions.reduce(
            (subSubTotal, subSub) => subSubTotal + subSub.marks,
            0,
          ),
        question.marks,
      );
      return total + subTotal;
    }, 0);
  };

  // Search and filter questions
  const filteredQuestions = questions.filter((question) =>
    question.questionText.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle jump to a specific question
  const handleJumpToQuestion = (index: number) => {
    const questionElement = document.getElementById(`question-${index}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render input fields based on question type
  const renderInputFields = (
    question: Question | SubQuestion | SubSubQuestion,
    index: number,
    subIndex?: number,
    subSubIndex?: number,
  ) => {
    switch (question.type) {
      case 'ESSAY':
        return (
          <textarea
            value={question.answer || ''}
            onChange={(e) => {
              const newQuestions = [...questions];
              if (subSubIndex !== undefined && subIndex !== undefined) {
                newQuestions[index].subquestions[subIndex].subquestions[
                  subSubIndex
                ].answer = e.target.value;
              } else if (subIndex !== undefined) {
                newQuestions[index].subquestions[subIndex].answer =
                  e.target.value;
              } else {
                newQuestions[index].answer = e.target.value;
              }
              setQuestions(newQuestions);
            }}
            className="input-field w-full"
            placeholder="Enter suggested answer..."
          />
        );
      case 'MCQ':
        return (
          <div>
            <input
              type="text"
              value={question.answer || ''}
              onChange={(e) => {
                const newQuestions = [...questions];
                if (subSubIndex !== undefined && subIndex !== undefined) {
                  newQuestions[index].subquestions[subIndex].subquestions[
                    subSubIndex
                  ].answer = e.target.value;
                } else if (subIndex !== undefined) {
                  newQuestions[index].subquestions[subIndex].answer =
                    e.target.value;
                } else {
                  newQuestions[index].answer = e.target.value;
                }
                setQuestions(newQuestions);
              }}
              className="input-field w-full"
              placeholder="Enter correct option..."
            />
          </div>
        );
      case 'SHORT_ANSWER':
        return (
          <input
            type="text"
            value={question.answer || ''}
            onChange={(e) => {
              const newQuestions = [...questions];
              if (subSubIndex !== undefined && subIndex !== undefined) {
                newQuestions[index].subquestions[subIndex].subquestions[
                  subSubIndex
                ].answer = e.target.value;
              } else if (subIndex !== undefined) {
                newQuestions[index].subquestions[subIndex].answer =
                  e.target.value;
              } else {
                newQuestions[index].answer = e.target.value;
              }
              setQuestions(newQuestions);
            }}
            className="input-field w-full"
            placeholder="Enter short answer..."
          />
        );
      case 'TRUE_FALSE':
        return (
          <select
            value={question.answer || ''}
            onChange={(e) => {
              const newQuestions = [...questions];
              if (subSubIndex !== undefined && subIndex !== undefined) {
                newQuestions[index].subquestions[subIndex].subquestions[
                  subSubIndex
                ].answer = e.target.value;
              } else if (subIndex !== undefined) {
                newQuestions[index].subquestions[subIndex].answer =
                  e.target.value;
              } else {
                newQuestions[index].answer = e.target.value;
              }
              setQuestions(newQuestions);
            }}
            className="input-field w-full"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'STRUCTURE':
        return null; // No answer box for STRUCTURE type
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sticky top-0 p-4 bg-gray-200 dark:bg-gray-700 w-1/4">
        <h3 className="font-medium text-black dark:text-white mb-4">
          Questions
        </h3>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          className="input-field w-full mb-4"
        />
        <ul>
          {filteredQuestions.map((_, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleJumpToQuestion(idx)}
                className="block text-primary hover:underline"
              >
                Question {idx + 1}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={addQuestion}
          className="flex items-center text-primary text-sm font-medium hover:underline mt-4"
        >
          <FaPlus className="mr-2" /> Add Question
        </button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4">
        <div>
          <h3 className="font-medium text-black dark:text-white mb-4">
            Total Marks: {calculateTotalMarks()}
          </h3>
        </div>
        {filteredQuestions.map((question, idx) => (
          <div id={`question-${idx}`} key={idx} className="mb-6">
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <label className="block text-black dark:text-white font-semibold">
                Question {idx + 1}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCollapse(idx)}
                  className="text-primary text-sm font-medium hover:underline mr-2"
                >
                  {collapsed[idx] ? 'Show' : 'Hide'}
                </button>
                <button
                  onClick={() => addSubQuestion(idx)}
                  className="text-primary text-sm font-medium hover:underline mr-2"
                >
                  Add Subquestion
                </button>
                <button
                  onClick={() => removeQuestion(idx)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaMinus />
                </button>
              </div>
            </div>

            {!collapsed[idx] && (
              <div>
                <ReactQuill
                  value={question.questionText}
                  onChange={(value) => {
                    const newQuestions = [...questions];
                    newQuestions[idx].questionText = value;
                    setQuestions(newQuestions);
                  }}
                  modules={quillModules}
                  className="w-full mb-2"
                />
                <div className="flex gap-4 mb-4">
                  <div className="w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[idx].type = e.target.value as QuestionType;
                        setQuestions(newQuestions);
                      }}
                      className="input-field w-full"
                    >
                      <option value="ESSAY">Essay</option>
                      <option value="MCQ">MCQ</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                      <option value="TRUE_FALSE">True/False</option>
                      <option value="STRUCTURE">Structure</option>
                    </select>
                  </div>
                  <div className="w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={question.marks}
                      onChange={(e) => updateMarks(idx, Number(e.target.value))}
                      className="input-field w-full"
                    />
                  </div>
                </div>

                {question.subquestions.length === 0 && (
                  <div className="w-2/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Suggested Answer
                    </label>
                    {renderInputFields(question, idx)}
                  </div>
                )}

                {question.subquestions.map((sub, subIdx) => (
                  <div key={subIdx} className="ml-4 mb-4">
                    <div className="flex justify-between items-center">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Subquestion {subIdx + 1}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addSubSubQuestion(idx, subIdx)}
                          className="flex items-center text-primary text-sm font-medium hover:underline"
                        >
                          <FaPlus className="mr-1" /> Add Sub-Subquestion
                        </button>
                        <button
                          onClick={() => removeSubQuestion(idx, subIdx)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </div>
                    <ReactQuill
                      value={sub.text}
                      onChange={(value) => {
                        const newQuestions = [...questions];
                        newQuestions[idx].subquestions[subIdx].text = value;
                        setQuestions(newQuestions);
                      }}
                      modules={quillModules}
                      className="w-full"
                      placeholder="Enter subquestion text..."
                    />
                    <div className="flex gap-4 mb-4">
                      <div className="w-1/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Type
                        </label>
                        <select
                          value={sub.type}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[idx].subquestions[subIdx].type = e
                              .target.value as QuestionType;
                            setQuestions(newQuestions);
                          }}
                          className="input-field w-full"
                        >
                          <option value="ESSAY">Essay</option>
                          <option value="MCQ">MCQ</option>
                          <option value="SHORT_ANSWER">Short Answer</option>
                          <option value="TRUE_FALSE">True/False</option>
                          <option value="STRUCTURE">Structure</option>
                        </select>
                      </div>
                      <div className="w-1/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Marks
                        </label>
                        <input
                          type="number"
                          value={sub.marks}
                          onChange={(e) =>
                            updateSubQuestionMarks(
                              idx,
                              subIdx,
                              Number(e.target.value),
                            )
                          }
                          className="input-field w-full"
                        />
                      </div>
                    </div>

                    {sub.subquestions.length === 0 && (
                      <div className="w-2/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Suggested Answer
                        </label>
                        {renderInputFields(sub, idx, subIdx)}
                      </div>
                    )}

                    {sub.subquestions.map((subSub, subSubIdx) => (
                      <div key={subSubIdx} className="ml-8 mb-4">
                        <div className="flex justify-between items-center">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Sub-Subquestion {subSubIdx + 1}
                          </label>
                          <button
                            onClick={() =>
                              removeSubSubQuestion(idx, subIdx, subSubIdx)
                            }
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <FaMinus />
                          </button>
                        </div>
                        <ReactQuill
                          value={subSub.text}
                          onChange={(value) => {
                            const newQuestions = [...questions];
                            newQuestions[idx].subquestions[subIdx].subquestions[
                              subSubIdx
                            ].text = value;
                            setQuestions(newQuestions);
                          }}
                          modules={quillModules}
                          className="w-full"
                          placeholder="Enter sub-subquestion text..."
                        />
                        <div className="flex gap-4 mb-4">
                          <div className="w-1/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Type
                            </label>
                            <select
                              value={subSub.type}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[idx].subquestions[
                                  subIdx
                                ].subquestions[subSubIdx].type = e.target
                                  .value as QuestionType;
                                setQuestions(newQuestions);
                              }}
                              className="input-field w-full"
                            >
                              <option value="ESSAY">Essay</option>
                              <option value="MCQ">MCQ</option>
                              <option value="SHORT_ANSWER">Short Answer</option>
                              <option value="TRUE_FALSE">True/False</option>
                              <option value="STRUCTURE">Structure</option>
                            </select>
                          </div>
                          <div className="w-1/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Marks
                            </label>
                            <input
                              type="number"
                              value={subSub.marks}
                              onChange={(e) =>
                                updateSubSubQuestionMarks(
                                  idx,
                                  subIdx,
                                  subSubIdx,
                                  Number(e.target.value),
                                )
                              }
                              className="input-field w-full"
                            />
                          </div>
                        </div>
                        <div className="w-2/3">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Suggested Answer
                          </label>
                          {renderInputFields(subSub, idx, subIdx, subSubIdx)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StructureTemplate;
