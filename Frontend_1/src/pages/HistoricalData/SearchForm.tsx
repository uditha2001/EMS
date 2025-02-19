import React from 'react';

interface SearchFormProps {
  searchParams: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleClear: () => void; // Function to clear search fields
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  handleInputChange,
  handleSearch,
  handleClear,
}) => {
  return (
    <form onSubmit={handleSearch} className="mb-4 p-4 sm:p-6 lg:p-8">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="fileName"
          placeholder="File Name"
          value={searchParams.fileName}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="creatorName"
          placeholder="Creator Name"
          value={searchParams.creatorName}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="moderatorName"
          placeholder="Moderator Name"
          value={searchParams.moderatorName}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="courseCode"
          placeholder="Course Code"
          value={searchParams.courseCode}
          onChange={handleInputChange}
          className="input-field"
        />

        {/* Paper Type Dropdown */}
        <select name="paperType" value={searchParams.paperType} onChange={handleInputChange} className="input-field">
          <option value="">Select Paper Type</option>
          <option value="THEORY">Theory</option>
          <option value="PRACTICAL">Practical</option>
        </select>

        <input
          type="text"
          name="degreeName"
          placeholder="Degree Name"
          value={searchParams.degreeName}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="year"
          placeholder="Year"
          value={searchParams.year}
          onChange={handleInputChange}
          className="input-field"
        />

        {/* Level Dropdown */}
        <select name="level" value={searchParams.level} onChange={handleInputChange} className="input-field">
          <option value="">Select Level</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4</option>
        </select>

        {/* Semester Dropdown */}
        <select name="semester" value={searchParams.semester} onChange={handleInputChange} className="input-field">
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>

        <input
          type="datetime-local"
          name="startDate"
          value={searchParams.startDate}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="datetime-local"
          name="endDate"
          value={searchParams.endDate}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>

      {/* Responsive Button Layout */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-start">
        <button type="submit" className="btn-primary">
          Search
        </button>
        <button type="button" className="btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Responsive Search Instructions */}
      <div className="mt-4 text-gray-500 text-sm">
        <p className="font-semibold">**How to Search?**</p>
        <ul className="list-disc list-inside">
          <li>Enter keywords for **File Name**, **Creator**, or **Moderator**.</li>
          <li>Select **Paper Type**, **Level**, and **Semester** from the dropdowns.</li>
          <li>Use **Course Code** (e.g., CSC2233) for subject-specific searches.</li>
          <li>Specify a **Date Range** to filter by paper publish date.</li>
        </ul>
      </div>
    </form>
  );
};

export default SearchForm;
