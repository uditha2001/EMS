import { ChangeEvent, FormEvent } from 'react';

interface DegreeProgramFormProps {
  formData: {
    name: string;
    description: string;
  };
  setFormData: (data: DegreeProgramFormProps['formData']) => void;
  editId: number | null;
  handleSave: () => void;
  cancelEdit: () => void;
}

export default function DegreeProgramForm({
  formData,
  setFormData,
  editId,
  handleSave,
  cancelEdit,
}: DegreeProgramFormProps) {
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
            {editId !== null ? 'Edit Degree Program' : 'Add Degree Program'}
          </h3>
        </div>

        <div className="p-6.5">
          <div className="mb-4.5">
            <label
              htmlFor="name"
              className="mb-2.5 block text-black dark:text-white"
            >
              Program Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder=' e.g. "BCS(Genanral)"'
              required
            />
          </div>

          <div className="mb-4.5">
            <label
              htmlFor="description"
              className="mb-2.5 block text-black dark:text-white"
            >
              Program Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              placeholder=' e.g. "Bachelor of Computer Science (General)"'
              required
              maxLength={100}
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
              {editId !== null ? 'Update Program' : 'Add Program'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
