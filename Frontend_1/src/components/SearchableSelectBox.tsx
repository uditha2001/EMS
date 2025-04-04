import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectBoxProps {
  options: Option[];
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const SearchableSelectBox = ({
  options,
  value,
  label,
  onChange,
  placeholder,
  disabled = false,
}: SearchableSelectBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.id === value);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleChange = (option: Option) => {
    if (disabled) return;
    onChange(option.id);
    setSearchQuery(option.name);
    setIsOpen(false);
  };

  const clearSelection = () => {
    if (disabled) return;
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className="relative mb-4">
      {label && (
        <label className="mb-2 block text-black dark:text-white">{label}</label>
      )}

      {/* Search Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery || selectedOption?.name || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white ${
            disabled ? 'bg-gray-200 cursor-not-allowed dark:bg-gray-700' : ''
          }`}
        />

        {/* Clear Button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-500 z-10 rounded shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleChange(option)}
                className="px-5 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="px-5 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelectBox;
