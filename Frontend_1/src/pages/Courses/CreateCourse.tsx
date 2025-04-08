import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import useCourseApi from '../../api/courseApi';
import useDegreeApi from '../../api/degreeApi';

import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

import {
  faBook,
  faList,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Stepper from '../PaperTransfer/Stepper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useExamTypeApi from '../../api/examTypesApi';

const levels = ['1', '2', '3', '4'];
const courseTypes = ['THEORY', 'PRACTICAL', 'BOTH', 'NO_PAPER'];

const CreateCourse: React.FC = () => {
  const { saveCourse } = useCourseApi();
  const { getAllDegreePrograms } = useDegreeApi();
  const { getAllExamTypes } = useExamTypeApi();

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [degreePrograms, setDegreePrograms] = useState<
    { id: string; name: string }[]
  >([]);
  const [examTypes, setExamTypes] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    level: '',
    semester: '',
    isActive: true,
    courseType: '',
    degreeProgramId: '',
    courseEvaluations: [] as {
      examTypeId: string;
      passMark: string;
      weightage: string;
    }[],
  });

  const steps = [
    { id: 1, name: 'Course Details', icon: faBook },
    { id: 2, name: 'Course Evaluations', icon: faList },
  ];

  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const response = await getAllDegreePrograms();
        setDegreePrograms(response.data);
      } catch (err) {
        setErrorMessage('Failed to load degree programs.');
      }
    };
    fetchDegreePrograms();
  }, []);

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await getAllExamTypes();
        setExamTypes(response.data);
      } catch (err) {
        setErrorMessage('Failed to load exam types.');
      }
    };
    fetchExamTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'code') {
      const levelInCode = value.charAt(3);
      let semesterInCode = value.charAt(4);

      if (levels.includes(levelInCode)) {
        setFormData((prev) => ({ ...prev, level: levelInCode }));
      }

      if (['b', '0'].includes(semesterInCode)) {
        semesterInCode = '2';
      }

      if (['1', '2'].includes(semesterInCode)) {
        setFormData((prev) => ({ ...prev, semester: semesterInCode }));
      }
    }

    // Handle course type change
    if (name === 'courseType') {
      let evaluations: {
        examTypeId: string;
        passMark?: string;
        weightage: string;
      }[] = [];

      if (value === 'THEORY') {
        evaluations = [
          {
            examTypeId: '1',
            passMark: '40',
            weightage: '100',
          },
        ];
      } else if (value === 'PRACTICAL') {
        evaluations = [
          {
            examTypeId: '2',
            passMark: '40',
            weightage: '100',
          },
        ];
      } else if (value === 'BOTH') {
        evaluations = [
          {
            examTypeId: '1',
            passMark: '35',
            weightage: '70',
          },
          {
            examTypeId: '2',
            passMark: '30',
            weightage: '30',
          },
        ];
      } else if (value === 'NO_PAPER') {
        evaluations = [];
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        courseEvaluations: evaluations.map((evaluation) => ({
          ...evaluation,
          passMark: evaluation.passMark || '',
        })),
      }));
    }
  };

  const handleAddEvaluation = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseEvaluations: [
        ...prevFormData.courseEvaluations,
        { examTypeId: '', passMark: '', weightage: '' },
      ],
    }));
  };

  const handleEvaluationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newEvaluations = [...prevFormData.courseEvaluations];
      newEvaluations[index] = { ...newEvaluations[index], [name]: value };
      return { ...prevFormData, courseEvaluations: newEvaluations };
    });
  };

  const handleRemoveEvaluation = (index: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseEvaluations: prevFormData.courseEvaluations.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleSubmit = async () => {
    setLoadingStatus(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.code || !formData.name || !formData.degreeProgramId) {
      setErrorMessage('Please complete all required fields.');
      setLoadingStatus(false);
      return;
    }

    try {
      await saveCourse({
        ...formData,
        courseEvaluations: formData.courseEvaluations.map((evaluation) => ({
          ...evaluation,
          passMark: parseFloat(evaluation.passMark),
          weightage: parseFloat(evaluation.weightage),
        })),
      });
      setSuccessMessage('Course created successfully!');
      setFormData({
        code: '',
        name: '',
        description: '',
        level: '',
        semester: '',
        isActive: true,
        courseType: '',
        degreeProgramId: '',
        courseEvaluations: [],
      });
      setCurrentStep(1);
    } catch (err) {
      setErrorMessage('Failed to create course. Please try again.');
    }
    setLoadingStatus(false);
  };

  const nextStep = () => {
    if (
      currentStep === 1 &&
      (!formData.code ||
        !formData.name ||
        !formData.degreeProgramId ||
        !formData.courseType ||
        !formData.level ||
        !formData.semester)
    ) {
      setErrorMessage('Please complete all required fields.');
      return;
    }
    setErrorMessage('');
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      {loadingStatus && <Loader />}
      <Breadcrumb
        items={[
          {
            label: 'Courses',
            path: `/courses`,
          },
          { label: 'Create Course' },
        ]}
      />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Create Course
          </h3>
        </div>

        <div className="p-6.5">
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />

          <Stepper currentStep={currentStep} steps={steps} />

          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Degree Program
                </label>
                <select
                  name="degreeProgramId"
                  value={formData.degreeProgramId}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Degree Program</option>
                  {degreePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Course Code
                </label>
                <input
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Course Code"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Course Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Course Name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Examination Held Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  What type of end examination paper?
                </label>
                {courseTypes.map((type) => (
                  <label key={type} className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name="courseType"
                      value={type}
                      checked={formData.courseType === type}
                      onChange={handleChange}
                      className="mr-2"
                      required
                    />
                    {type}
                  </label>
                ))}
              </div>

              <div className="col-span-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description (Optional)"
                  className="input-field"
                />
              </div>

              <div className="col-span-full">
                <label className="flex items-center mb-2.5 text-black dark:text-white">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-6">
              <div className="col-span-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Course Evaluations
                </label>
                {formData.courseEvaluations.map((evaluation, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
                  >
                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        Exam Type
                      </label>
                      <select
                        name="examTypeId"
                        value={evaluation.examTypeId}
                        onChange={(e) => handleEvaluationChange(index, e)}
                        className="input-field"
                        required
                      >
                        <option value="">Select Exam Type</option>
                        {examTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        Pass Mark
                      </label>
                      <input
                        type="number"
                        name="passMark"
                        value={evaluation.passMark}
                        onChange={(e) => handleEvaluationChange(index, e)}
                        placeholder="Pass Mark"
                        className="input-field"
                        min={0}
                        max={100}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2.5 block text-black dark:text-white">
                        Weightage
                      </label>
                      <input
                        type="number"
                        name="weightage"
                        value={evaluation.weightage}
                        onChange={(e) => handleEvaluationChange(index, e)}
                        placeholder="Weightage"
                        className="input-field"
                        min={0}
                        max={100}
                        required
                      />
                    </div>

                    {/* Remove Button aligned to the right */}
                    <div className="col-span-full flex justify-end items-center mt-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveEvaluation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEvaluation}
                  className="text-green-500 hover:underline"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Evaluation
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 text-sm">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary"
            >
              Previous
            </button>

            {currentStep < steps.length ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loadingStatus}
                className="btn-primary"
              >
                {loadingStatus ? 'Creating...' : 'Create Course'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
