import { useState } from 'react';

interface Question {
  question: string;
  parts: string[];
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([{ question: '', parts: [''] }]);

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

  const addQuestion = () => {
    setQuestions([...questions, { question: '', parts: [''] }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  return {
    questions,
    handleQuestionChange,
    handlePartChange,
    addPart,
    removePart,
    addQuestion,
    removeQuestion,
  };
};