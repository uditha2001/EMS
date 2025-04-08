import { ChangeEvent, FormEvent } from 'react';

interface ExamTypeFormProps {
  formData: {
    name: string;
  };
  setFormData: (data: ExamTypeFormProps['formData']) => void;
  editId: number | null;
  handleSave: () => void;
  cancelEdit: () => void;
}

export default function ExamTypesForm({
  formData,
  setFormData,
  editId,
  handleSave,
  cancelEdit,
}: ExamTypeFormProps) {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <form onSubmit={handleSubmit}>
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            {editId !== null ? 'Edit Evaluation Type' : 'Add Evaluation Type'}
          </h3>
        </div>

        <div className="p-6.5">
          <div className="mb-4.5">
            <label
              htmlFor="name"
              className="mb-2.5 block text-black dark:text-white"
            >
              Evaluation Type Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder='e.g. "Continuous assessment"'
              required
              maxLength={50}
            />
          </div>

          <div className="flex justify-between">
            {editId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
            >
              {editId !== null ? 'Update Exam Type' : 'Add Exam Type'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
