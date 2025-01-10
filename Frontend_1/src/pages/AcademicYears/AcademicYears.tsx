import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import AcademicYearForm from './AcademicYearForm';
import AcademicYearList from './AcademicYearList';

interface AcademicYear {
  id: number;
  year: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AcademicYears() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [formData, setFormData] = useState<{ year: string }>({ year: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get<AcademicYear[]>(
        '/academic-years',
      );
      setAcademicYears(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Error fetching academic years.');
      setLoading(false);
    }
  };

  const handleSave = async (year: string) => {
    try {
      if (editId !== null) {
        await axiosPrivate.put(`/academic-years/${editId}`, { year });
        setEditId(null);
        setSuccessMessage('Academic year updated successfully!');
      } else {
        await axiosPrivate.post('/academic-years', { year });
        setSuccessMessage('Academic year added successfully!');
      }
      setFormData({ year: '' });
      fetchAcademicYears();
    } catch (error) {
      setErrorMessage('Error saving academic year.');
    }
  };

  const handleEdit = (id: number) => {
    const yearToEdit = academicYears.find((year) => year.id === id);
    if (yearToEdit) {
      setFormData({ year: yearToEdit.year });
      setEditId(id);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosPrivate.delete(`/academic-years/${id}`);
      fetchAcademicYears();
      setSuccessMessage('Academic year deleted successfully!');
    } catch (error) {
      setErrorMessage('Error deleting academic year.');
    }
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
            cancelEdit={() => setEditId(null)}
          />
        </div>
      </div>
    </div>
  );
}
