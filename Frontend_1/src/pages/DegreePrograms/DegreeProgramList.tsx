import { useState } from 'react';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../common/Loader';

interface DegreeProgram {
  id: number;
  name: string;
  description: string;
}

interface DegreeProgramListProps {
  degreePrograms: DegreeProgram[] | null | undefined;
  loading: boolean;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

export default function DegreeProgramList({
  degreePrograms,
  loading,
  handleEdit,
  handleDelete,
}: DegreeProgramListProps) {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
      {loading ? (
        <p>
          <Loader />
        </p>
      ) : !degreePrograms || degreePrograms.length === 0 ? (
        <p>No degree programs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {degreePrograms.map((program) => (
            <div
              key={program.id}
              className="flex flex-col border p-4 rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-xl transition-all duration-300"
            >
              <div className="text-primary dark:text-white font-medium">
                <FontAwesomeIcon icon={faGraduationCap} className='mr-2' />
                {program.name}
              </div>
              <div className="text-black dark:text-white">
                {program.description}
              </div>
              <div className="mt-4 flex justify-start space-x-4">
                <button
                  onClick={() => handleEdit(program.id)}
                  className="text-primary hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleOpenModal(program.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this degree program?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}