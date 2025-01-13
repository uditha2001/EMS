export default function CreatePaper() {
  const handleSubmitt = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted");
  };

  return (
    <div className="bg-white dark:bg-gray-900 w-full h-[80vh] p-6">
      <h1 className="text-center text-black dark:text-white font-bold text-4xl mb-6">
        Paper Creation
      </h1>
      <form
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md mx-[10px]"
        method="post"
        onSubmit={handleSubmitt}
      >
        {/* Degree Name Field */}
        <div className="mb-4">
          <label
            htmlFor="degreeName"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Degree Name
          </label>
          <input
            id="degreeName"
            name="degreeName"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Year Level Field */}
        <div className="mb-4">
          <label
            htmlFor="Level"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Year Level
          </label>
          <input
            id="Level"
            name="Level"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Semester Field */}
        <div className="mb-4">
          <label
            htmlFor="Semester"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Semester
          </label>
          <input
            id="Semester"
            name="Semester"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
