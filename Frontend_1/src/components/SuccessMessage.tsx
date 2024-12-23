import React from 'react';

interface SuccessMessageProps {
  message: string;
  onClose: () => void; // Optional close handler
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div className="p-4 mb-4 text-green-700 bg-green-100 rounded border border-green-200">
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-700 hover:text-green-900 focus:outline-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
