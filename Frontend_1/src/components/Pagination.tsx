import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="m-8 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded text-sm disabled:opacity-90"
        >
          <FaChevronLeft />
         
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded text-sm disabled:opacity-90"
        >
         
          <FaChevronRight />
        </button>
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center">
        <label htmlFor="pageSize" className="mr-2 text-sm font-medium">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="p-2 border rounded text-sm  border-stroke bg-gray  text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white appearance-none"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
