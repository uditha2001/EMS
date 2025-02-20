import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import useCourseApi from '../../api/courseApi';
import useDegreeApi from '../../api/degreeApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';

const levels = ['1', '2', '3', '4'];
const courseTypes = ['THEORY', 'PRACTICAL', 'BOTH'];

const EditCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById, updateCourse } = useCourseApi();
  const { getAllDegreePrograms } = useDegreeApi();

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [degreePrograms, setDegreePrograms] = useState<
    { id: string; name: string }[]
  >([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    level: '',
    semester: '',
    isActive: true,
    courseType: '',
    degreeProgramId: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseResponse, degreeResponse] = await Promise.all([
          getCourseById(Number(courseId)),
          getAllDegreePrograms(),
        ]);
        setFormData(courseResponse.data.data);
        setDegreePrograms(degreeResponse.data);
      } catch (err) {
        setErrorMessage('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.code || !formData.name || !formData.degreeProgramId) {
      setErrorMessage('Please complete all required fields.');
      setLoading(false);
      return;
    }

    try {
      await updateCourse(Number(courseId), formData);
      setSuccessMessage('Course updated successfully!');
    } catch (err) {
      setErrorMessage('Failed to update course. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-270">
      {loading && <Loader />}
      <Breadcrumb pageName="Edit Course" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Edit Course
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6.5">
          <SuccessMessage
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="degreeProgramId"
                className="mb-2.5 block text-black dark:text-white"
              >
                Degree Program
              </label>
              <select
                id="degreeProgramId"
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
              <label
                htmlFor="code"
                className="mb-2.5 block text-black dark:text-white"
              >
                Course Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2.5 block text-black dark:text-white"
              >
                Course Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label
                htmlFor="level"
                className="mb-2.5 block text-black dark:text-white"
              >
                Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>{`Level ${level}`}</option>
                ))}
              </select>
            </div>
            <div>
                <label
                  htmlFor="semester"
                  className="mb-2.5 block text-black dark:text-white"
                >
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="b">Both</option>
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Course Type
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
                <label
                  htmlFor="description"
                  className="mb-2.5 block text-black dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="input-field"
                />
              </div>

              {/* Active Status Checkbox */}
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

          <div className="flex justify-between mt-4">
            <Link to={'/courses'} className="btn-secondary">
              Back
            </Link>
            <button type="submit" className="btn-primary">
              Update Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
