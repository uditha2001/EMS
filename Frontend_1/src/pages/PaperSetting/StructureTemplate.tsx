import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface StructureTemplateProps {
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
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
      { questionText: '', marks: 0, answer: '', subquestions: [] },
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

  // Toggle collapse for a question or subquestion
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
      marks: 0,
      answer: '',
      subquestions: [],
    });
    setQuestions(newQuestions);
  };

  // Remove a subquestion
  const removeSubQuestion = (questionIndex: number, subIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions = newQuestions[questionIndex].subquestions.filter(
      (_: any, idx: number) => idx !== subIndex
    );
    setQuestions(newQuestions);
  };

  // Add a sub-subquestion
  const addSubSubQuestion = (questionIndex: number, subIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions[subIndex].subquestions.push({
      text: '',
      marks: 0,
      answer: '',
    });
    setQuestions(newQuestions);
  };

  // Remove a sub-subquestion
  const removeSubSubQuestion = (
    questionIndex: number,
    subIndex: number,
    subSubIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions[subIndex].subquestions = newQuestions[
      questionIndex
    ].subquestions[subIndex].subquestions.filter(
      (_: any, idx: number) => idx !== subSubIndex
    );
    setQuestions(newQuestions);
  };

  // Search and filter questions
  const filteredQuestions = questions.filter((question) =>
    question.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle jump to a specific question
  const handleJumpToQuestion = (index: number) => {
    const questionElement = document.getElementById(`question-${index}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sticky top-0 p-4 bg-gray-200 dark:bg-gray-700 w-1/4">
        <h2 className="font-medium text-lg">Questions</h2>
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
        {filteredQuestions.map((question, idx) => (
          <div id={`question-${idx}`} key={idx} className="mb-6">
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <label className="text-black dark:text-white font-medium">
                Question {idx + 1}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCollapse(idx)}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  {collapsed[idx] ? <FaPlus /> : <FaMinus />} Toggle
                </button>
                <button
                  onClick={() => addSubQuestion(idx)}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  <FaPlus />  Add Subquestion
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
                  <div className="w-2/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Suggested Answer
                    </label>
                    <textarea
                      value={question.answer}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[idx].answer = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      className="input-field w-full"
                      placeholder="Enter suggested answer..."
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={question.marks}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[idx].marks = Number(e.target.value);
                        setQuestions(newQuestions);
                      }}
                      className="input-field w-full"
                    />
                  </div>
                </div>

                {question.subquestions.map((sub: any, subIdx: number) => (
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
                      <div className="w-2/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Suggested Answer
                        </label>
                        <textarea
                          value={sub.answer}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[idx].subquestions[subIdx].answer = e.target.value;
                            setQuestions(newQuestions);
                          }}
                          className="input-field w-full"
                          placeholder="Enter suggested answer..."
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Marks
                        </label>
                        <input
                          type="number"
                          value={sub.marks}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[idx].subquestions[subIdx].marks = Number(e.target.value);
                            setQuestions(newQuestions);
                          }}
                          className="input-field w-full"
                        />
                      </div>
                    </div>

                    {sub.subquestions.map((subSub: any, subSubIdx: number) => (
                      <div key={subSubIdx} className="ml-8 mb-4">
                        <div className="flex justify-between items-center">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Sub-Subquestion {subSubIdx + 1}
                          </label>
                          <button
                            onClick={() => removeSubSubQuestion(idx, subIdx, subSubIdx)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <FaMinus />
                          </button>
                        </div>
                        <ReactQuill
                          value={subSub.text}
                          onChange={(value) => {
                            const newQuestions = [...questions];
                            newQuestions[idx].subquestions[subIdx].subquestions[subSubIdx].text = value;
                            setQuestions(newQuestions);
                          }}
                          modules={quillModules}
                          className="w-full"
                          placeholder="Enter sub-subquestion text..."
                        />
                        <div className="flex gap-4 mb-4">
                          <div className="w-2/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Suggested Answer
                            </label>
                            <textarea
                              value={subSub.answer}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[idx].subquestions[subIdx].subquestions[subSubIdx].answer = e.target.value;
                                setQuestions(newQuestions);
                              }}
                              className="input-field w-full"
                              placeholder="Enter suggested answer..."
                            />
                          </div>
                          <div className="w-1/3">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Marks
                            </label>
                            <input
                              type="number"
                              value={subSub.marks}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[idx].subquestions[subIdx].subquestions[subSubIdx].marks = Number(e.target.value);
                                setQuestions(newQuestions);
                              }}
                              className="input-field w-full"
                            />
                          </div>
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
