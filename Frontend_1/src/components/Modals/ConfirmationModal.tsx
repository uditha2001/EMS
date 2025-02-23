import React, { useEffect } from 'react';
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      {/* Modal Box */}
      <div className="bg-white dark:bg-gray-800 rounded p-6 w-full max-w-md shadow-lg animate-fadeIn">
        {/* Header with Warning Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500 text-xl" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Confirmation
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Message */}
        <p className="mt-3 text-gray-700 dark:text-gray-300">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end mt-5 space-x-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={onCancel}
          >
            <FaTimes /> Cancel
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            onClick={onConfirm}
          >
            <FaCheck /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
