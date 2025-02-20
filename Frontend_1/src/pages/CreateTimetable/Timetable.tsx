import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useApi from '../../api/api';

interface Examination {
  id: string;
  degreeProgramName: string;
  level: string;
  semester: string;
  year: string;
  description?: string;
}

const CreateTimetable: React.FC = () => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamination, setSelectedExamination] = useState<string>('');
  const [selectedExamDetails, setSelectedExamDetails] = useState<Examination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getExaminations, getExaminationDetails } = useApi();

  // Fetch examinations on component mount
  useEffect(() => {
    getExaminations()
      .then((response) => {
        if (response.data.code === 200) {
          setExaminations(response.data.data);
        } else {
          console.error('Unexpected response code:', response.data.code);
        }
      })
      .catch((error) => {
        console.error('  fetching examinations:', error);
      });
  }, [getExaminations]);

  // Fetch selected examination details when dropdown changes
  useEffect(() => {
    const fetchExamDetails = async () => {
      if (selectedExamination) {
        setLoading(true);
        try {
          const response = await getExaminationDetails(selectedExamination);
          if (response.data.code === 200) {
            setSelectedExamDetails(response.data.data);
          } else {
            console.error('Unexpected response code:', response.data.code);
            setSelectedExamDetails(null);
          }
        } catch (error) {
          console.error('Error fetching examination details:', error);
          setSelectedExamDetails(null);
        } finally {
          setLoading(false);
        }
      } else {
        setSelectedExamDetails(null);
      }
    };
    fetchExamDetails();
  }, [selectedExamination]);

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Create Timetable" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm relative p-5">
        <div className="flex gap-4 items-start">
          {/* Dropdown Section */}
          <div className="w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Select Examination
            </label>
            <select
              value={selectedExamination}
              onChange={(e) => setSelectedExamination(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
              required
            >
              <option value="">Select Examination</option>
              {examinations.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {`${exam.degreeProgramName} - Level ${exam.level} (Semester ${exam.semester})`}
                </option>
              ))}
            </select>
          </div>

          {/* Small Preview Card Section - Positioned to the right */}
          {loading ? (
            <div className="w-1/2 bg-gray-100 dark:bg-gray-900 shadow-md rounded-md p-3 border border-gray-300 dark:border-gray-700 text-center">
              <p className="text-xs text-black dark:text-white">Loading...</p>
            </div>
          ) : selectedExamDetails ? (
            <div className="w-1/2 bg-blue-100 dark:bg-gray-800 shadow-md rounded-md p-3 border border-gray-300 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                Examination Details
              </h3>
              <div className="text-xs text-black dark:text-white">
                <p><strong>Degree:</strong>{getExaminationDetails.level}</p>
                <p><strong>Level:</strong> {getExaminationDetails.levl}</p>
                <p><strong>Semester:</strong> {getExaminationDetails.semester}</p>
                <p><strong>Year:</strong> {getExaminationDetails.year}</p>
                {getExaminationDetails.description && (
                  <p><strong>Description:</strong> {getExaminationDetails.description}</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreateTimetable;
