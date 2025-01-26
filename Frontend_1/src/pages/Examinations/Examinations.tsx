import { useState, useEffect, useCallback } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

import useApi from '../../api/api';
import ExaminationList from './ExaminationList';
import ExaminationForm from './ExaminationForm';

interface Examination {
  id: number;
  year: string;
  degreeProgramId: string;
  level: string;
  semester: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface DegreeProgram {
  id: string;
  name: string;
}

export default function Examinations() {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [formData, setFormData] = useState({
    year: '',
    level: '',
    semester: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [degreePrograms, setDegreePrograms] = useState<DegreeProgram[]>([]);
  const [selectedDegreeProgram, setSelectedDegreeProgram] =
    useState<string>('');
  const {
    getDegreePrograms,
    getExaminations,
    deleteExamination,
    createExamination,
    updateExamination,
  } = useApi();

  // Fetch degree programs
  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const response = await getDegreePrograms();
        setDegreePrograms(response.data);
      } catch (error) {
        console.error('Error fetching degree programs', error);
        setErrorMessage('Failed to load degree programs.');
      }
    };

    fetchDegreePrograms();
  }, []); // Removed axiosPrivate dependency

  // Fetch academic years
  const fetchExaminations = useCallback(async () => {
    try {
      setLoading(true); // Start loading indicator
      const response = await getExaminations(); // Call the API function
      if (response.data.code === 200) {
        setExaminations(response.data.data); // Set the response data into state
      } else {
        setErrorMessage('Unexpected response from the server.');
      }
    } catch (error) {
      console.error('Error fetching academic years', error);
      setErrorMessage('Error fetching academic years.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  }, []);

  useEffect(() => {
    fetchExaminations();
  }, [fetchExaminations]); // Dependencies are optimized

  // Save or update an academic year
  const handleSave = async () => {
    const { year, level, semester } = formData;

    if (!year.trim()) {
      setErrorMessage('Year cannot be empty.');
      return;
    }
    if (!selectedDegreeProgram) {
      setErrorMessage('Please select a degree program.');
      return;
    }

    try {
      const payload = {
        year,
        degreeProgramId: selectedDegreeProgram,
        level,
        semester,
      };

      console.log('payload', payload);

      if (editId !== null) {
        await updateExamination(editId, payload);
        setSuccessMessage('Academic year updated successfully!');
        setEditId(null);
      } else {
        await createExamination(payload);
        setSuccessMessage('Academic year added successfully!');
        resetForm();
      }

      // Clear form and refresh data
      setFormData({ year: '', level: '', semester: '' });
      setSelectedDegreeProgram('');
      fetchExaminations();
    } catch (error) {
      setErrorMessage('Error saving academic year.');
    }
  };

  // Edit an academic year
  const handleEdit = (id: number) => {
    const yearToEdit = examinations.find((year) => year.id === id);
    if (yearToEdit) {
      setFormData({
        year: yearToEdit.year,
        level: yearToEdit.level,
        semester: yearToEdit.semester,
      });
      setSelectedDegreeProgram(yearToEdit.degreeProgramId);
      setEditId(id);
    }
  };

  // Delete an academic year
  const handleDelete = async (id: number) => {
    try {
      await deleteExamination(id);
      setSuccessMessage('Academic year deleted successfully!');
      fetchExaminations();
    } catch (error) {
      setErrorMessage('Error deleting academic year.');
    }
  };

  const resetForm = () => {
    setFormData({ year: '', level: '', semester: '' });
    setSelectedDegreeProgram('');
    setEditId(null);
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Examinations" />

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
          <ExaminationList
            examinations={examinations}
            degreePrograms={degreePrograms}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <ExaminationForm
            formData={formData}
            setFormData={setFormData}
            editId={editId}
            handleSave={handleSave}
            cancelEdit={() => resetForm()}
            degreePrograms={degreePrograms}
            selectedDegreeProgram={selectedDegreeProgram}
            setSelectedDegreeProgram={setSelectedDegreeProgram}
          />
        </div>
      </div>
    </div>
  );
}
