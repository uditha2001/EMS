import { useState } from "react";
import SuccessMessage from "../../components/SuccessMessage";
import useApi from "../../api/api";
import ErrorMessage from "../../components/ErrorMessage";

export default function CreateDegreeProgram() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
});

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {createDegreeProgram} = useApi();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // Add API request here
      createDegreeProgram(formData)
      .then(() => {
        setSuccessMessage('Degree Program created successfully!');
      })
      .catch((error) => {
        setErrorMessage('Failed to create Degree Program. Please try again.');
        console.error('Error creating Degree Program:', error);
      });
      setSuccessMessage('Degree Program added successfully');
    } catch (error) {
      console.error('Error adding Degree Program:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <form onSubmit={handleSubmit}>
        <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
        <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />

        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Add Degree Program</h3>
        </div>

        <div className="p-6.5">
          <div className="mb-4.5">
            <label htmlFor="name" className="mb-2.5 block text-black dark:text-white">Degree Program Name</label>
            <input type="text" name="name" value={formData.name} onChange={(e:any) => {setFormData({...formData, name:e.value})}} placeholder="e.g., Degree Program" required
              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4"
            />
          </div>

          <div className="mb-4.5">
            <label htmlFor="description" className="mb-2.5 block text-black dark:text-white">Degree Program Description</label>
            <textarea name="description" value={formData.description} onChange={(e:any) => {setFormData({...formData, description:e.value})}} placeholder="e.g., Description ..." required
              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white mb-4"
            />
          </div>

          <div className="flex justify-between">
            <button type="submit" className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">Add Degree Program</button>
          </div>

        </div>
      </form>
    </div>
  );
}
