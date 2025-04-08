import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import ExamTypesList from './ExamTypesList';
import ExamTypesForm from './ExamTypesForm';
import useExamTypesApi from '../../api/examTypesApi';

interface ExamType {
  id: number;
  name: string;
}

export default function ExamTypes() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
  }>({
    name: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    getAllExamTypes,
    getExamTypeById,
    createExamType,
    updateExamType,
    deleteExamType,
  } = useExamTypesApi();

  // Fetch exam types
  const fetchExamTypes = async () => {
    setLoading(true);
    try {
      const response = await getAllExamTypes();
      setExamTypes(response.data);
    } catch (error) {
      console.error('Error fetching exam types', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error fetching exam types.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  // Save or update exam type
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    try {
      if (editId !== null) {
        await updateExamType(editId, formData.name);
        setSuccessMessage('Exam type updated successfully!');
        setEditId(null);
      } else {
        await createExamType(formData.name);
        setSuccessMessage('Exam type added successfully!');
      }

      resetForm();
      fetchExamTypes();
    } catch (error) {
      console.error('Error saving exam type', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error saving exam type.',
      );
    }
  };

  // Edit an exam type
  const handleEdit = async (id: number) => {
    try {
      const response = await getExamTypeById(id);
      setFormData({
        name: response.data[0].name, // Extract only the name
      });
      console.log('Exam type details:', response.data);
      setEditId(id);
    } catch (error) {
      console.error('Error fetching exam type details', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Error fetching exam type details.',
      );
    }
  };

  // Delete an exam type
  const handleDelete = async (id: number) => {
    try {
      await deleteExamType(id);
      setSuccessMessage('Exam type deleted successfully!');
      fetchExamTypes();
    } catch (error) {
      console.error('Error deleting exam type', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error deleting exam type.',
      );
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditId(null);
    setErrorMessage('');
  };

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb pageName="Evaluation Methods" />
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
          <ExamTypesList
            examTypes={examTypes}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <ExamTypesForm
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
