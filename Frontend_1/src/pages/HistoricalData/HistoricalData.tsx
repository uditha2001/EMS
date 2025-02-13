import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArchive, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function HistoricalData() {
  // Example counts (Replace these with actual data from API or state)
  const archivedPapersCount = 25;
  const resultsCount = 18;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {/* Archived Papers Card */}
      <Link to="/history/archived">
        <div
          className="border p-4 rounded-sm cursor-pointer border-stroke bg-white shadow-default 
                    dark:border-strokedark dark:bg-boxdark hover:shadow-lg transition"
        >
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon
              icon={faFileArchive}
              className="text-blue-700 text-4xl"
            />
            <h3 className="text-lg font-semibold">Archived Papers</h3>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            View and manage all archived exam papers.
          </p>
          <p className="text-sm font-semibold mt-2">
            Total: {archivedPapersCount}
          </p>
        </div>
      </Link>

      {/* Results Card */}
      <Link to="#">
        <div
          className="border p-4 rounded-sm cursor-pointer border-stroke bg-white shadow-default 
                    dark:border-strokedark dark:bg-boxdark hover:shadow-lg transition"
        >
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon
              icon={faChartBar}
              className="text-green-500 text-4xl"
            />
            <h3 className="text-lg font-semibold">Results</h3>
          </div>
          <p className="text-sm mt-2 text-gray-600">
            Check and analyze past exam results.
          </p>
          <p className="text-sm font-semibold mt-2">Total: {resultsCount}</p>
        </div>
      </Link>
    </div>
  );
}
