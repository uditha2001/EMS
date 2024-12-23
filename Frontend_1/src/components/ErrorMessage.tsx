import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void; // Optional close handler
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="p-4 mb-4 text-red-700 bg-red-100 rounded border border-red-200">
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-700 hover:text-red-900 focus:outline-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
