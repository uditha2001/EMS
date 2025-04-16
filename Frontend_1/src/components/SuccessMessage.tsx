import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="p-4 mb-4 flex items-center justify-between rounded border-l-4 border-green-500 border transition-all 
      bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-green-600 dark:text-green-300" />
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-800 hover:text-green-900 focus:outline-none dark:text-green-300 dark:hover:text-green-100"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;