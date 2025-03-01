import { useState, useEffect, useCallback } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import ExamCenterList from './ExamCenterList';
import ExamCenterForm from './ExamCenterForm';
import useExamCenterApi from '../../api/examCenterApi';

interface ExamCenter {
  id: number;
  name: string;
  location: string;
  capacity: number;
  contactPerson: string;
}

export default function ExamCenters() {
  const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
  const [formData, setFormData] = useState<Omit<ExamCenter, 'id'>>({
    name: '',
    location: '',
    capacity: 0,
    contactPerson: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    getAllExamCenters,
    getExamCenterById,
    saveExamCenter,
    updateExamCenter,
    deleteExamCenter,
  } = useExamCenterApi();

  // Fetch exam centers
  const fetchExamCenters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllExamCenters();
      setExamCenters(response.data.data);
    } catch (error) {
      console.error('Error fetching exam centers', error);
      setErrorMessage('Error fetching exam centers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExamCenters();
  }, [fetchExamCenters]);

  // Save or update exam center
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    try {
      if (editId !== null) {
        await updateExamCenter(editId, formData);
        setSuccessMessage('Exam center updated successfully!');
        setEditId(null);
      } else {
        await saveExamCenter(formData);
        setSuccessMessage('Exam center added successfully!');
      }

      resetForm();
      fetchExamCenters();
    } catch (error) {
      console.error('Error saving exam center', error);
      setErrorMessage('Error saving exam center.');
    }
  };

  // Edit an exam center
  const handleEdit = async (id: number) => {
    try {
      const response = await getExamCenterById(id);
      setFormData({
        name: response.data.data.name,
        location: response.data.data.location,
        capacity: response.data.data.capacity,
        contactPerson: response.data.data.contactPerson,
      });
      setEditId(id);
    } catch (error) {
      console.error('Error fetching exam center details', error);
      setErrorMessage('Error fetching exam center details.');
    }
  };

  // Delete an exam center
  const handleDelete = async (id: number) => {
    try {
      deleteExamCenter(id);
      fetchExamCenters();
      setSuccessMessage('Exam center deleted successfully!');
      fetchExamCenters();
    } catch (error) {
      setErrorMessage('Error deleting exam center.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', capacity: 0, contactPerson: '' });
    setEditId(null);
  };

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb pageName="Exam Centers" />
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
          <ExamCenterList
            examCenters={examCenters}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <ExamCenterForm
            formData={formData}
            setFormData={setFormData}
            editId={editId}
            handleSave={handleSave}
            cancelEdit={resetForm}
          />
        </div>
      </div>
    </div>
  );
}
