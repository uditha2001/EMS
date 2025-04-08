import { useState } from 'react';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../common/Loader';

interface ExamType {
  id: number;
  name: string;
}

interface ExamTypesListProps {
  examTypes: ExamType[] | null | undefined;
  loading: boolean;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

export default function ExamTypesList({
  examTypes,
  loading,
  handleEdit,
  handleDelete,
}: ExamTypesListProps) {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const PROTECTED_TYPES = ['PRACTICAL', 'THEORY'];

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

  const isProtectedType = (examTypeName: string) => {
    return PROTECTED_TYPES.includes(examTypeName.toUpperCase());
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : !examTypes || examTypes.length === 0 ? (
        <p>No exam types found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {examTypes.map((examType) => {
            const isProtected = isProtectedType(examType.name);
            return (
              <div
                key={examType.id}
                className={`flex flex-col border p-4 rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-xl transition-all duration-300 ${
                  isProtected ? 'opacity-80' : ''
                }`}
              >
                <div className="text-primary dark:text-white font-medium">
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  {examType.name}
                  {isProtected && (
                    <span className="ml-2 text-xs text-gray-500">(System)</span>
                  )}
                </div>

                <div className="mt-4 flex justify-start space-x-4">
                  <button
                    onClick={() => !isProtected && handleEdit(examType.id)}
                    className={`text-primary hover:underline ${
                      isProtected ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isProtected}
                    title={
                      isProtected ? 'System exam types cannot be edited' : ''
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => !isProtected && handleOpenModal(examType.id)}
                    className={`text-red-600 hover:underline ${
                      isProtected ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isProtected}
                    title={
                      isProtected ? 'System exam types cannot be deleted' : ''
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this exam type?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
