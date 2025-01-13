import React, { useState } from 'react';

export default function CreatePaper() {
  const [questions, setQuestions] = useState([
    { question: '', parts: [''] }
  ]);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handlePartChange = (qIndex: number, pIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].parts[pIndex] = value;
    setQuestions(newQuestions);
  };

  const addPart = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].parts.push('');
    setQuestions(newQuestions);
  };

  const removePart = (qIndex: number, pIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].parts.splice(pIndex, 1);
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", questions);
  };

  return (
    <div className="bg-white dark:bg-gray-900 w-full p-6">
      <h1 className="text-center text-black dark:text-white font-bold text-4xl mb-6">
        Paper Creation
      </h1>
      <form
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md mx-[10px]"
        method="post"
        onSubmit={handleSubmit}
      >
        {/* Degree Name Field */}
        <div className="mb-4">
          <label
            htmlFor="degreeName"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Degree Name
          </label>
          <input
            id="degreeName"
            name="degreeName"
            type="text"
            required
            placeholder="BACHELOR OF COMPUTER SCIENCE"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Degree Type, Level, and Semester in Horizontal Line */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="degreeType"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Degree Type
            </label>
            <select
              id="degreeType"
              name="degreeType"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="General">GENERAL</option>
              <option value="Special">SPECIAL</option>
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="Level"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Year Level
            </label>
            <select
              id="Level"
              name="Level"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="Semester"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Semester
            </label>
            <select
              id="Semester"
              name="semester"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="I">I</option>
              <option value="II">II</option>
            </select>
          </div>
        </div>

        {/* Month and Year Fields */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="month"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Month
            </label>
            <input
              id="month"
              name="month"
              type="text"
              required
              placeholder="ex: MARCH OR MARCH/APRIL"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="year"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Year
            </label>
            <input
              id="year"
              name="year"
              type="text"
              required
              placeholder="Enter Year"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
        </div>

        {/* Course Code, Name, and Duration */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="courseCode"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Course Code
            </label>
            <input
              id="courseCode"
              name="courseCode"
              type="text"
              required
              placeholder="Enter Course Code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="courseName"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Course Name
            </label>
            <input
              id="courseName"
              name="courseName"
              type="text"
              required
              placeholder="Enter Course Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Duration
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              required
              placeholder="Enter Duration"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">
            Questions
          </h2>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6">
              {/* Question Input */}
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

              {/* Parts Section */}
              {question.parts.map((part, pIndex) => (
                <div key={pIndex} className="mb-4">
                  <label
                    htmlFor={`part-${qIndex}-${pIndex}`}
                    className="block text-sm font-medium text-black dark:text-white"
                  >
                    Part {pIndex + 1}
                  </label>
                  <textarea
                    id={`part-${qIndex}-${pIndex}`}
                    name={`part-${qIndex}-${pIndex}`}
                    rows={4}
                    value={part}
                    onChange={(e) =>
                      handlePartChange(qIndex, pIndex, e.target.value)
                    }
                    required
                    placeholder="Enter Part"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removePart(qIndex, pIndex)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Remove Part
                  </button>
                </div>
              ))}

              {/* Add Part Button */}
              <button
                type="button"
                onClick={() => addPart(qIndex)}
                className="text-blue-500 text-sm mt-2"
              >
                Add Part
              </button>

              {/* Remove Question Button */}
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 text-sm mt-2"
              >
                Remove Question
              </button>
            </div>
          ))}

          {/* Add Question Button */}
          <button
            type="button"
            onClick={() => setQuestions([...questions, { question: '', parts: [''] }])}
            className="text-blue-500 text-sm mt-4"
          >
            Add Question
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Create Paper
        </button>
      </form>
    </div>
  );
}
