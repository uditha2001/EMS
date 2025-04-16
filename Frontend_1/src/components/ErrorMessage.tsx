import React from 'react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className="p-4 mb-4 flex items-center justify-between rounded border-l-4 border-red-500 border transition-all 
      bg-red-100 text-red-800  dark:bg-red-900 dark:text-red-200 dark:border-red-700"
    >
      <div className="flex items-center gap-2">
        <FaExclamationCircle className="text-red-600 dark:text-red-300" />
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-800 hover:text-red-900 focus:outline-none dark:text-red-300 dark:hover:text-red-100"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
