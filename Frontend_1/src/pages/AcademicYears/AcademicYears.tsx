import { useState, useEffect, useCallback } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import AcademicYearForm from './AcademicYearForm';
import AcademicYearList from './AcademicYearList';

interface AcademicYear {
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

export default function AcademicYears() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
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
  const axiosPrivate = useAxiosPrivate();

  // Fetch degree programs
  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const response = await axiosPrivate.get('/degreePrograms');
        setDegreePrograms(response.data);
      } catch (error) {
        console.error('Error fetching degree programs', error);
        setErrorMessage('Failed to load degree programs.');
      }
    };
    fetchDegreePrograms();
  }, [axiosPrivate]);

  // Fetch academic years
  const fetchAcademicYears = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get('/academic-years');
      if (response.data.code === 200) {
        setAcademicYears(response.data.data);
      } else {
        setErrorMessage('Unexpected response from the server.');
      }
    } catch (error) {
      setErrorMessage('Error fetching academic years.');
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchAcademicYears();
  }, [fetchAcademicYears]);

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
        await axiosPrivate.put(`/academic-years/${editId}`, payload);
        setSuccessMessage('Academic year updated successfully!');
        setEditId(null);
      } else {
        await axiosPrivate.post('/academic-years', payload);
        setSuccessMessage('Academic year added successfully!');
        resetForm();
      }

      // Clear form and refresh data
      setFormData({ year: '', level: '', semester: '' });
      setSelectedDegreeProgram('');
      fetchAcademicYears();
    } catch (error) {
      setErrorMessage('Error saving academic year.');
    }
  };

  // Edit an academic year
  const handleEdit = (id: number) => {
    const yearToEdit = academicYears.find((year) => year.id === id);
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
      await axiosPrivate.delete(`/academic-years/${id}`);
      fetchAcademicYears();
      setSuccessMessage('Academic year deleted successfully!');
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
      <Breadcrumb pageName="Academic Years" />

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
          <AcademicYearList
            academicYears={academicYears}
            degreePrograms={degreePrograms}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <AcademicYearForm
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
