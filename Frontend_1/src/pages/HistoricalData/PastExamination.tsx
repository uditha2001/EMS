import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faCheckCircle,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useApi from '../../api/api';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Loader from '../../common/Loader';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

interface Examination {
  id: number;
  year: string;
  degreeProgramId: string;
  level: string;
  semester: string;
  status: string;
  examProcessStartDate: string | null;
  paperSettingCompleteDate: string | null;
  markingCompleteDate: string | null;
}

interface DegreeProgram {
  id: string;
  name: string;
}

export default function PastExaminations() {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { getDegreePrograms, getCompletedExaminations } = useApi();

  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const response = await getDegreePrograms();
        setDegreePrograms(response.data);
      } catch (err) {
        console.error('Error fetching degree programs', err);
        setError('Failed to load degree programs.');
      }
    };
    fetchDegreePrograms();
  }, []);

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        setLoading(true);
        const response = await getCompletedExaminations();
        if (response.data.code === 200) {
          setExaminations(response.data.data);
        } else {
          setError('Unexpected response from the server.');
        }
      } catch (err) {
        console.error('Error fetching examinations', err);
        setError('Error fetching past examinations.');
      } finally {
        setLoading(false);
      }
    };
    fetchExaminations();
  }, []);

  const getDegreeProgramName = (id: string): string => {
    const program = degreePrograms.find((program) => program.id === id);
    return program ? program.name : 'Unknown Program';
  };

  const filteredExaminations = examinations.filter((exam) => {
    const degreeProgramName = getDegreeProgramName(exam.degreeProgramId);
    return (
      exam.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.semester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      degreeProgramName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalItems = filteredExaminations.length;
  const paginatedExaminations = filteredExaminations.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="mx-auto max-w-full">
      {loading && <Loader />}
      <Breadcrumb pageName="Past Examinations" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-full mx-auto">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Past Examinations</h3>
        </div>

        <div className="p-6.5">
          <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
          <ErrorMessage message={error} onClose={() => setError('')} />

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by year, program, level, or semester..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0); // reset page on new search
              }}
            />
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white dark:bg-gray-800 border-collapse border border-gray-200 dark:border-strokedark">
              <thead>
                <tr className="bg-gray-100 dark:bg-form-input">
                  <th className="border px-4 py-2 text-left">Year</th>
                  <th className="border px-4 py-2 text-left">Degree Program</th>
                  <th className="border px-4 py-2 text-left">Level</th>
                  <th className="border px-4 py-2 text-left">Semester</th>
                  <th className="border px-4 py-2 text-left">Completed Date</th>
                  <th className="border px-4 py-2 text-left">Links</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExaminations.length > 0 ? (
                  paginatedExaminations.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border px-4 py-2">{exam.year}</td>
                      <td className="border px-4 py-2">{getDegreeProgramName(exam.degreeProgramId)}</td>
                      <td className="border px-4 py-2">{exam.level}</td>
                      <td className="border px-4 py-2">
                        {exam.semester === 'b' ? 'Both' : exam.semester}
                      </td>
                      <td className="border px-4 py-2">
                        {exam.markingCompleteDate
                          ? new Date(exam.markingCompleteDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex space-x-4">
                          <Link
                            to={`/paper/preview-assigned-roles/${exam.id}`}
                            className="text-green-600 hover:underline"
                            title="View Role Assignments"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} /> Role Assignments
                          </Link>
                          <Link
                            to={`/paper/preview-assigned-revision/${exam.id}`}
                            className="text-primary hover:underline"
                            title="Role Assignment Revisions"
                          >
                            <FontAwesomeIcon icon={faHistory} /> Role Assignment Revisions
                          </Link>
                          <Link
                            to={`/scheduling/preview-timetable/${exam.id}`}
                            className="text-green-600 hover:underline"
                            title="View Timetable"
                          >
                            <FontAwesomeIcon icon={faCalendarAlt} /> View Timetable
                          </Link>
                          <Link
                            to={`/scheduling/revisions/${exam.id}`}
                            className="text-primary hover:underline"
                            title="Timetable Revisions"
                          >
                            <FontAwesomeIcon icon={faHistory} />Timetable Revisions
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center border p-2">
                      No past examinations available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}
