import { ChangeEvent, FormEvent } from 'react';

interface ExamCenterFormProps {
  formData: {
    name: string;
    location: string;
    capacity: number;
    contactPerson: string;
  };
  setFormData: (data: ExamCenterFormProps['formData']) => void;
  editId: number | null;
  handleSave: () => void;
  cancelEdit: () => void;
}

export default function ExamCenterForm({
  formData,
  setFormData,
  editId,
  handleSave,
  cancelEdit,
}: ExamCenterFormProps) {
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
            {editId !== null ? 'Edit Exam Center' : 'Add Exam Center'}
          </h3>
        </div>

        <div className="p-6.5">
          <div className="mb-4.5">
            <label
              htmlFor="name"
              className="mb-2.5 block text-black dark:text-white"
            >
              Center Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder=' e.g. "Central Exam Center"'
              required
            />
          </div>

          <div className="mb-4.5">
            <label
              htmlFor="location"
              className="mb-2.5 block text-black dark:text-white"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input-field"
              placeholder=' e.g. "New York"'
              required
            />
          </div>

          <div className="mb-4.5">
            <label
              htmlFor="capacity"
              className="mb-2.5 block text-black dark:text-white"
            >
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="input-field"
              placeholder=' e.g. "200"'
              required
            />
          </div>

          <div className="mb-4.5">
            <label
              htmlFor="contactPerson"
              className="mb-2.5 block text-black dark:text-white"
            >
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="input-field"
              placeholder=' e.g. "John Doe"'
              required
            />
          </div>

          <div className="flex justify-between">
            {editId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary">
              {editId !== null ? 'Update Center' : 'Add Center'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
