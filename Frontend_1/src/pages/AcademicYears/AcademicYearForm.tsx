import { ChangeEvent, FormEvent } from 'react';

interface AcademicYearFormProps {
  formData: { year: string };
  setFormData: (data: { year: string }) => void;
  editId: number | null;
  handleSave: (year: string) => void;
  cancelEdit: () => void;
}

export default function AcademicYearForm({
  formData,
  setFormData,
  editId,
  handleSave,
  cancelEdit,
}: AcademicYearFormProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSave(formData.year);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <form onSubmit={handleSubmit}>
        {/* Form Header */}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            {editId !== null ? 'Edit Academic Year' : 'Add Academic Year'}
          </h3>
        </div>

        {/* Form Body */}
        <div className="p-6.5">
          <div className="mb-4.5">
            <label
              htmlFor="year"
              className="mb-2.5 block text-black dark:text-white"
            >
              Academic Year
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="e.g., 2023/2024"
              required
              className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex justify-between">
            {editId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded bg-gray-500 py-2 px-6 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
            >
              {editId !== null ? 'Update Year' : 'Add Year'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
