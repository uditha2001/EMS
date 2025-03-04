import { useState } from 'react';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../common/Loader';

interface ExamCenter {
  id: number;
  name: string;
  location: string;
  capacity: number;
  contactPerson: string;
}

interface ExamCenterListProps {
  examCenters: ExamCenter[] | null | undefined;
  loading: boolean;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

export default function ExamCenterList({
  examCenters = [],
  loading,
  handleEdit,
  handleDelete,
}: ExamCenterListProps) {
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
      {Array.isArray(examCenters) && examCenters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {examCenters.map((center) => (
            <div
              key={center.id}
              className="flex flex-col border p-4 rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-xl transition-all duration-300"
            >
              <div className="text-primary dark:text-white font-medium">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                {center.name}
              </div>
              <div className="text-black dark:text-white">
                {center.location}
              </div>
              <div className="text-black dark:text-white">
                Capacity: {center.capacity}
              </div>
              <div className="text-black dark:text-white">
                Contact: {center.contactPerson}
              </div>
              <div className="mt-4 flex justify-start space-x-4">
                <button
                  onClick={() => handleEdit(center.id)}
                  className="text-primary hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleOpenModal(center.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : loading ? (
        <Loader />
      ) : (
        <div className="text-center text-black dark:text-white">
          No exam centers found.
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this exam center?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
