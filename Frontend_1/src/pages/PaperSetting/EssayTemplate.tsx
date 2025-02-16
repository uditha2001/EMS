import React from 'react';
import ReactQuill from 'react-quill';
import { FaPlus, FaMinus } from 'react-icons/fa'; // Importing Font Awesome icons

interface EssayTemplateProps {
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  quillModules: any;
}

const EssayTemplate: React.FC<EssayTemplateProps> = ({
  questions,
  setQuestions,
  quillModules,
}) => {
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', marks: 0, answer: '', subquestions: [] },
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
  };

  const addSubQuestion = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions.push({
      text: '',
      marks: 0,
      answer: '',
    });
    setQuestions(newQuestions);
  };

  const removeSubQuestion = (questionIndex: number, subIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].subquestions = newQuestions[
      questionIndex
    ].subquestions.filter((_: any, idx: number) => idx !== subIndex);
    setQuestions(newQuestions);
  };

  return (
    <div>
      {questions.map((question, idx) => (
        <div key={idx} className="mb-6">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <label className="text-black dark:text-white font-medium">
              Question {idx + 1}
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => addSubQuestion(idx)}
                className="flex items-center text-primary text-sm font-medium hover:underline"
              >
                <FaPlus className="mr-1" /> Add Subquestion
              </button>

              <button
                onClick={() => removeQuestion(idx)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <FaMinus />
              </button>
            </div>
          </div>

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

                <button
                  onClick={() => removeSubQuestion(idx, subIdx)}
                  className="text-red-500"
                >
                  <FaMinus />
                </button>
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
                      newQuestions[idx].subquestions[subIdx].answer =
                        e.target.value;
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
                      newQuestions[idx].subquestions[subIdx].marks = Number(
                        e.target.value,
                      );
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

      <button onClick={addQuestion} className="flex items-center text-primary text-sm font-medium hover:underline">
        <FaPlus className="mr-2" /> Add Question
      </button>
    </div>
  );
};

export default EssayTemplate;
