import React, { useState } from 'react';
import Question from './Question';
import { useQuestions } from '../../hooks/useQuestions';

type paperDetails={
  degreeName:string,
  degreeType:string,
  Level:string,
  semester:string,
  month:string,
  year:string,
  courseCode:string,
  courseName:string,
  duration:string,
  questions:{question:string,parts:string[]}[]
}
export default function CreatePaper() {
  const {
    questions,
    handleQuestionChange,
    handlePartChange,
    addPart,
    removePart,
    addQuestion,
    removeQuestion,
  } = useQuestions();
  const [paper,setPaper]=useState<paperDetails | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newPaper = {
      degreeName: formData.get('degreeName') as string,
      degreeType: formData.get('degreeType') as string,
      Level: formData.get('Level') as string,
      semester: formData.get('semester') as string,
      month: formData.get('month') as string,
      year: formData.get('year') as string,
      courseCode: formData.get('courseCode') as string,
      courseName: formData.get('courseName') as string,
      duration: formData.get('duration') as string,
      questions: questions,
    };
  
    console.log(newPaper);
    setPaper(newPaper);
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
            <Question
              key={qIndex}
              qIndex={qIndex}
              question={question}
              handleQuestionChange={handleQuestionChange}
              handlePartChange={handlePartChange}
              addPart={addPart}
              removePart={removePart}
            />
          ))}

          <div className="flex mt-4">
            <button
              type="button"
              onClick={addQuestion}
              className="text-blue-500 text-sm"
            >
              Add Question
            </button>
          {questions.length>0 ?    <button
              type="button"
              onClick={() => removeQuestion(questions.length - 1)}
              className="text-red-500 text-sm ml-4"
            >
              Remove Question
            </button> : null}
         
          </div>
        </div>

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