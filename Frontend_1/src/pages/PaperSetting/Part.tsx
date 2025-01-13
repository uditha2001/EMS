import React from 'react';

interface PartProps {
  qIndex: number;
  pIndex: number;
  part: string;
  handlePartChange: (qIndex: number, pIndex: number, value: string) => void;
  addPart: (index: number) => void;
  removePart: (qIndex: number, pIndex: number) => void;
}

const Part: React.FC<PartProps> = ({ qIndex, pIndex, part, handlePartChange, addPart, removePart }) => {
  return (
    <div className="mb-4">
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
        onChange={(e) => handlePartChange(qIndex, pIndex, e.target.value)}
        required
        placeholder="Enter Part"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white ml-5"
      />
      <button
        type="button"
        onClick={() => removePart(qIndex, pIndex)}
        className="text-red-500 text-sm mt-2 ml-5"
      >
        Remove Part
      </button>
    </div>
  );
};

export default Part;