import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Option {
  id: string;
  name: string;
}

interface SearchableMultiSelectBoxProps {
  options: Option[];
  label?: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

const SearchableMultiSelectBox = ({
  options,
  selectedValues,
  label,
  onChange,
  placeholder,
}: SearchableMultiSelectBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounce the search input to improve performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Debounce delay in milliseconds

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  // Handle selection of an option
  const handleSelect = (option: Option) => {
    if (!selectedValues.includes(option.id)) {
      onChange([...selectedValues, option.id]);
    }
    setSearchQuery(''); // Clear search input after selection
    setIsOpen(false); // Close dropdown after selection
  };

  // Remove selected option
  const removeSelection = (id: string) => {
    onChange(selectedValues.filter((val) => val !== id));
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mb-4">
      <label className="mb-2 block text-black dark:text-white">{label}</label>

      {/* Selected Values & Search Input */}
      <div
        className="flex flex-wrap items-center gap-2 border-[1.5px] border-stroke bg-gray py-2 px-3 rounded text-black dark:border-form-strokedark dark:bg-form-input dark:text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {selectedValues.map((val) => {
          const selectedOption = options.find((opt) => opt.id === val);
          return (
            selectedOption && (
              <div
                key={val}
                className="flex items-center gap-2 bg-primary text-white px-2 py-1 rounded"
              >
                {selectedOption.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dropdown from opening when removing item
                    removeSelection(val);
                  }}
                  className="text-white hover:text-red-400"
                >
                  <FontAwesomeIcon icon={faTimes} size="sm" />
                </button>
              </div>
            )
          );
        })}

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedValues.length > 0 ? '' : placeholder}
          className="flex-1 bg-transparent outline-none"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-500 z-10 rounded shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing immediately
                onClick={() => handleSelect(option)}
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

export default SearchableMultiSelectBox;
