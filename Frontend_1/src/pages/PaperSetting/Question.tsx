import React from 'react';
import Part from './Part';

interface QuestionProps {
  qIndex: number;
  question: { question: string; parts: string[] };
  handleQuestionChange: (index: number, value: string) => void;
  handlePartChange: (qIndex: number, pIndex: number, value: string) => void;
  addPart: (index: number) => void;
  removePart: (qIndex: number, pIndex: number) => void;
}

const Question: React.FC<QuestionProps> = ({
  qIndex,
  question,
  handleQuestionChange,
  handlePartChange,
  addPart,
  removePart,
}) => {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <label
          htmlFor={`question-${qIndex}`}
          className="block text-sm font-medium text-black dark:text-white"
        >
          Question {qIndex + 1}
        </label>
        <input
          id={`question-${qIndex}`}
          name={`question-${qIndex}`}
          type="text"
          value={question.question}
          onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          required
          placeholder="Enter Question"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
        />
      </div>

      {question.parts.map((part, pIndex) => (
        <Part
          key={pIndex}
          qIndex={qIndex}
          pIndex={pIndex}
          part={part}
          handlePartChange={handlePartChange}
          addPart={addPart}
          removePart={removePart}
        />
      ))}

      <button
        type="button"
        onClick={() => addPart(qIndex)}
        className="text-blue-500 text-sm mt-2"
      >
        Add Part
      </button>
    </div>
  );
};

export default Question;