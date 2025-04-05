import { useState, useEffect} from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import DegreeProgramList from './DegreeProgramList';
import DegreeProgramForm from './DegreeProgramForm';
import useDegreeApi from '../../api/degreeApi';

interface DegreeProgram {
  id: number;
  name: string;
  description: string;
}

export default function DegreePrograms() {
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [formData, setFormData] = useState<Omit<DegreeProgram, 'id'>>({
    name: '',
    description: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    getAllDegreePrograms,
    getDegreeProgramById,
    saveDegreeProgram,
    updateDegreeProgram,
    deleteDegreeProgram,
  } = useDegreeApi();

  // Fetch degree programs
  const fetchDegreePrograms =async () => {
    try {
      const response = await getAllDegreePrograms();
      setDegreePrograms(response.data);
    } catch (error) {
      console.error('Error fetching degree programs', error);
      setErrorMessage('Error fetching degree programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDegreePrograms();
  }, [fetchDegreePrograms]);

  // Save or update degree program
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    try {
      if (editId !== null) {
        await updateDegreeProgram(editId, formData);
        setSuccessMessage('Degree program updated successfully!');
        setEditId(null);
      } else {
        await saveDegreeProgram(formData);
        setSuccessMessage('Degree program added successfully!');
      }

      resetForm();
      fetchDegreePrograms();
    } catch (error) {
      console.error('Error saving degree program', error);
      setErrorMessage('Error saving degree program.');
    }
  };

  // Edit a degree program
  const handleEdit = async (id: number) => {
    try {
      const response = await getDegreeProgramById(id);
      setFormData({
        name: response.data.name,
        description: response.data.description,
      });
      setEditId(id);
    } catch (error) {
      console.error('Error fetching degree program details', error);
      setErrorMessage('Error fetching degree program details.');
    }
  };

  // Delete a degree program
  const handleDelete = async (id: number) => {
    try {
      await deleteDegreeProgram(id);
      setSuccessMessage('Degree program deleted successfully!');
      fetchDegreePrograms();
    } catch (error) {
      setErrorMessage('Error deleting degree program.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditId(null);
  };

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb pageName="Degree Programs" />
      <div className="grid grid-cols-5 gap-8 ">
        <div className="col-span-5 xl:col-span-3">
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
          <DegreeProgramList
            degreePrograms={degreePrograms}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <DegreeProgramForm
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
