import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import useCourseApi from '../../api/courseApi';
import useDegreeApi from '../../api/degreeApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import Stepper from '../PaperTransfer/Stepper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faDeleteLeft,
  faList,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import useExamTypeApi from '../../api/examTypesApi';

const levels = ['1', '2', '3', '4'];
const courseTypes = ['THEORY', 'PRACTICAL', 'BOTH', 'NO_PAPER'];

const EditCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById, updateCourse, deleteCourseEvaluation } =
    useCourseApi();
  const { getAllDegreePrograms } = useDegreeApi();
  const { getAllExamTypes } = useExamTypeApi();

  const [loading, setLoading] = useState(true);
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
      courseEvaluationId?: string;
      examTypeId: string;
      passMark: string;
      weightage: string;
    }[],
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<null | string>(
    null,
  );

  const steps = [
    { id: 1, name: 'Course Details', icon: faBook },
    { id: 2, name: 'Course Evaluations', icon: faList },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, degreeResponse, examTypesResponse] =
          await Promise.all([
            getCourseById(Number(courseId)),
            getAllDegreePrograms(),
            getAllExamTypes(),
          ]);
        setFormData(courseResponse.data.data);
        setDegreePrograms(degreeResponse.data);
        setExamTypes(examTypesResponse.data);
      } catch (err) {
        setErrorMessage('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

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
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.code || !formData.name || !formData.degreeProgramId) {
      setErrorMessage('Please complete all required fields.');
      setLoading(false);
      return;
    }

    try {
      await updateCourse(Number(courseId), {
        ...formData,
        courseEvaluations: formData.courseEvaluations.map((evaluation) => ({
          ...evaluation,
          passMark: parseFloat(evaluation.passMark),
          weightage: parseFloat(evaluation.weightage),
        })),
      });
      setSuccessMessage('Course updated successfully!');
      setCurrentStep(1);
    } catch (err) {
      setErrorMessage('Failed to update course. Please try again.');
    }
    setLoading(false);
  };

  const handleEvaluationDelete = (evaluationId: string) => {
    setEvaluationToDelete(evaluationId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCourseEvaluation(Number(evaluationToDelete));
      setFormData((prevFormData) => ({
        ...prevFormData,
        courseEvaluations: prevFormData.courseEvaluations.filter(
          (evaluation) => evaluation.courseEvaluationId !== evaluationToDelete,
        ),
      }));
      setSuccessMessage('Course evaluation deleted successfully!');
    } catch (error) {
      setErrorMessage('Failed to delete course evaluation');
    }
    setShowConfirmationModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setEvaluationToDelete(null);
  };

  const nextStep = () => {
    if (
      currentStep === 1 &&
      (!formData.code || !formData.name || !formData.degreeProgramId)
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
      {loading && <Loader />}
      <Breadcrumb
        items={[
          {
            label: 'Courses',
            path: `/courses`,
          },
          { label: 'Edit Course' },
        ]}
      />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Edit Course
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
                  placeholder="Description"
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
                        required
                      />
                    </div>

                    <div className="col-span-full flex justify-end items-center mt-2">
                      {/* Conditional Rendering for Remove/Delete Button */}
                      {!evaluation.courseEvaluationId ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveEvaluation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleEvaluationDelete(
                              evaluation.courseEvaluationId!,
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faDeleteLeft} />
                        </button>
                      )}
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
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Updating...' : 'Update Course'}
              </button>
            )}
          </div>
          {/* Show Confirmation Modal */}
          {showConfirmationModal && (
            <ConfirmationModal
              message="Are you sure you want to delete this course evaluation?"
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
