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
}

const SearchableSelectBox = ({
  options,
  value,
  label,
  onChange,
  placeholder,
}: SearchableSelectBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected option
  const selectedOption = options.find((option) => option.id === value);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleChange = (option: Option) => {
    onChange(option.id); // Send the selected option's id
    setSearchQuery(option.name); // Display the selected option's name in the input field
    setIsOpen(false); // Close the dropdown after selection
  };

  // Function to clear selection
  const clearSelection = () => {
    onChange(''); // Reset the selected value
    setSearchQuery(''); // Clear the input field
  };

  return (
    <div className="relative mb-4">
      <label className="mb-2 block text-black dark:text-white">{label}</label>

      {/* Search Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery || selectedOption?.name || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)} // Open dropdown when focused
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay closing dropdown
          placeholder={placeholder}
          className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />

        {/* Clear Button (FontAwesome) */}
        {value && (
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
      {isOpen && (
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
