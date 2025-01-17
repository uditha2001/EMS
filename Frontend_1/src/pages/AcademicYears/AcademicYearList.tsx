interface AcademicYear {
  id: number;
  year: string;
}

interface AcademicYearListProps {
  academicYears: AcademicYear[] | null | undefined; // Allow null or undefined
  loading: boolean;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

export default function AcademicYearList({
  academicYears,
  loading,
  handleEdit,
  handleDelete,
}: AcademicYearListProps) {
  // Ensure academicYears is always treated as an array
  const safeAcademicYears = Array.isArray(academicYears) ? academicYears : [];

  // Sort the academic years in descending order by the year
  const sortedAcademicYears = safeAcademicYears
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => {
      const yearA = a.year.split('/')[0]; // Get the first part (e.g., "2023")
      const yearB = b.year.split('/')[0]; // Get the first part (e.g., "2024")

      return parseInt(yearB) - parseInt(yearA); // Compare in descending order
    });

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Academic Years List
        </h3>
      </div>
      <div className="p-6.5">
        {loading ? (
          <p>Loading...</p>
        ) : sortedAcademicYears.length === 0 ? (
          <p>No academic years found.</p>
        ) : (
          <ul className="space-y-2">
            {sortedAcademicYears.map((year) => (
              <li
                key={year.id}
                className="flex justify-between items-center rounded bg-gray-100 p-4 dark:bg-gray-800"
              >
                <span>{year.year}</span>
                <div>
                  <button
                    onClick={() => handleEdit(year.id)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(year.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
