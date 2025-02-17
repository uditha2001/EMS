import React from 'react';

interface SelectPaperTypeProps {
  paperType_: string;
  setPaperType_: React.Dispatch<React.SetStateAction<string>>;
}

const SelectPaperType: React.FC<SelectPaperTypeProps> = ({
  paperType_,
  setPaperType_,
}) => {
  return (
    <div>
      <label className="mb-2.5 block text-black dark:text-white">
        Paper Type
      </label>
      <select
        className="input-field w-1/3"
        value={paperType_}
        onChange={(e) => setPaperType_(e.target.value)}
      >
        <option value="">Select Paper Type</option>
        <option value="ESSAY">Essay</option>
        <option value="Structure">Structure</option>
      </select>
    </div>
  );
};

export default SelectPaperType;
