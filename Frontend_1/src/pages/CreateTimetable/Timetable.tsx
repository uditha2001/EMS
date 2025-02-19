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
  const { getExaminations } = useApi();

  useEffect(() => {
    getExaminations()
      .then((response) => {
        if (response.data.code === 200) {
          setExaminations(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching examinations:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedExamination) {
      const selectedExam = examinations.find((exam) => exam.id === selectedExamination);
      setSelectedExamDetails(selectedExam || null);
    } else {
      setSelectedExamDetails(null);
    }
  }, [selectedExamination, examinations]);

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Create Timetable" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm relative">
        <div className="grid">
          <div className="mb-4.5 mx-5 mt-2">
            <label className="mb-2.5 block text-black dark:text-white">
              Select Examination
            </label>
            <select
              value={selectedExamination}
              onChange={(e) => setSelectedExamination(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
              required
            >
              <option value="" >Select Examination</option>
              {examinations.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {`${exam.degreeProgramName} - Level ${exam.level} (Semester ${exam.semester})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Small Floating Preview Window */}
        {selectedExamDetails && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-64 border border-gray-300 dark:border-gray-700 z-10">
            <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
              Examination Details
            </h3>
            <div className="text-xs text-black dark:text-white">
              <p><strong>Degree:</strong> {selectedExamDetails.degreeProgramName}</p>
              <p><strong>Level:</strong> {selectedExamDetails.level}</p>
              <p><strong>Semester:</strong> {selectedExamDetails.semester}</p>
              <p><strong>Year:</strong> {selectedExamDetails.year}</p>
              {selectedExamDetails.description && (
                <p><strong>Description:</strong> {selectedExamDetails.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTimetable;
