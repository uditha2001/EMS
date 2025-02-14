import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faSync,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { Link } from 'react-router-dom';

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
    <div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : sortedExaminations.length === 0 ? (
          <p>No academic years found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
            {sortedExaminations.map((year) => (
              <div
                key={year.id}
                className="flex flex-col border p-4 rounded-sm  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-xl transition-all duration-300 "
              >
                <div>{getStatusBadge(year.status)}</div>
                <div className="mt-2">
                  <div className="text-black dark:text-white font-medium">
                    Year: {year.year}
                  </div>
                  <div className="text-black dark:text-white">
                    Degree Program: {getDegreeProgramName(year.degreeProgramId)}
                  </div>
                  <div className="text-black dark:text-white">
                    Level: {year.level}
                  </div>
                  {year.semester !== 'b' && (
                    <div className="text-black dark:text-white">
                      Semester: {year.semester}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-normal gap-4">
                  <button
                    onClick={() => handleEdit(year.id)}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <Link
                    to={`/paper/preview-assigned-roles/${year.id}`}
                    className="text-primary hover:underline"
                  >
                    Roles
                  </Link>

                  <Link
                    to={`/paper/preview-assigned-roles/${year.id}`}
                    className="text-primary hover:underline"
                  >
                    Time Table
                  </Link>

                  <button
                    onClick={() => handleOpenModal(year.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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
