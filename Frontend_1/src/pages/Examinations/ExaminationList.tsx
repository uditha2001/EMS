import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faSync,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';

interface Examination {
  id: number;
  year: string;
  degreeProgramId: string;
  level: string;
  semester: string;
  status: string;
}

interface DegreeProgram {
  id: string;
  name: string;
}

interface ExaminationListProps {
  examinations: Examination[] | null | undefined;
  degreePrograms: DegreeProgram[];
  loading: boolean;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

export default function ExaminationList({
  examinations,
  degreePrograms,
  loading,
  handleEdit,
  handleDelete,
}: ExaminationListProps) {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const safeExaminations = Array.isArray(examinations) ? examinations : [];
  const sortedExaminations = safeExaminations.slice().sort((a, b) => {
    const yearA = a.year.split('/')[0];
    const yearB = b.year.split('/')[0];
    return parseInt(yearB) - parseInt(yearA);
  });

  const getDegreeProgramName = (id: string): string => {
    const program = degreePrograms.find((program) => program.id === id);
    return program ? program.name : 'Unknown Program';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="flex items-center text-blue-500">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> Scheduled
          </span>
        );
      case 'ONGOING':
        return (
          <span className="flex items-center text-yellow-500">
            <FontAwesomeIcon icon={faSync} className="mr-1" spin /> Ongoing
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center text-green-500">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Completed
          </span>
        );
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
      setDeleteId(null);
    }
    setShowModal(false);
  };

  const handleOpenModal = (id: number) => {
    setDeleteId(id);
    setShowModal(true);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-full mx-auto">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Examinations List
        </h3>
      </div>
      <div className="p-6.5">
        {loading ? (
          <p>Loading...</p>
        ) : sortedExaminations.length === 0 ? (
          <p>No academic years found.</p>
        ) : (
          <ul className="space-y-2">
            {sortedExaminations.map((year) => (
              <li
                key={year.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded bg-gray-100 p-4 dark:bg-gray-800"
              >
                <div>
                  <span className="font-medium text-black dark:text-white flex items-center">
                    {getStatusBadge(year.status)}
                    <span className="ml-2">
                      {year.year} - {getDegreeProgramName(year.degreeProgramId)}{' '}
                      - Level {year.level}
                    </span>
                    {year.semester !== 'b' && <> - Semester {year.semester}</>}
                  </span>
                </div>
                <div className="mt-2 sm:mt-0">
                  <button
                    onClick={() => handleEdit(year.id)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenModal(year.id)}
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

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this academic year?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
