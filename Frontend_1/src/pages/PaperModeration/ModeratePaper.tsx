import { FormEvent } from "react";

export default function ModeratePaper() {
  function hadleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // Implement form submission logic here
    console.log("Form submitted");
  }

  return (
    <div className="bg-white dark:bg-gray-900 w-full p-6 position-relative">
      <h1 className="text-center font-bold text-title-lg">
        Evaluation Form for Moderation of Examination papers
        <br /> Department of Computer Science-University of Ruhuna
      </h1>
      <form
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md mx-[10px] mt-6"
        method="post"
        onSubmit={hadleSubmit}
      >
        <div className="space-y-6">
          {/* Degree Program */}
          <div className="flex items-center">
            <label htmlFor="degreeProgram" className="font-bold w-1/3">
              Degree Program
            </label>
            <select
              id="degreeProgram"
              name="degreeProgram"
              className="w-2/3 h-8 border-2 border-gray-300 p-1 rounded-md  dark:text-black"
            >
              <option>Computer Science</option>
            </select>
          </div>

          {/* Examination */}
          <div className="flex items-center">
            <label htmlFor="examination" className="font-bold w-1/3">
              Enter Examination name
            </label>
            <input
              id="examination"
              name="examination"
              type="text"
              className="w-2/3 h-8 border-2 border-gray-300 p-2 rounded-md"
              placeholder="Examination"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-bold">Course Information</div>
            <div className="flex gap-4 items-center">
              {/* Course Code */}
              <div className="flex items-center gap-2">
                <label htmlFor="code" className="font-bold w-32">
                  Course Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  className="h-8 border-2 border-gray-300 p-2 rounded-md flex-grow"
                  placeholder="Course Code"
                />
              </div>
              {/* Course Title */}
              <div className="flex items-center gap-2">
                <label htmlFor="title" className="font-bold w-32">
                  Course Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="h-8 border-2 border-gray-300 p-2 rounded-md flex-grow"
                  placeholder="Course Title"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white dark:bg-gray-900 p-6 rounded shadow-md">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-800">
                  <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                  <th className="border border-gray-300 px-4 py-2">Yes</th>
                  <th className="border border-gray-300 px-4 py-2">No</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Specific Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Item 1</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item1" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item1" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-md"
                      placeholder="Add comment"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Item 2</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item2" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item2" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-md"
                      placeholder="Add comment"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Item 3</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item3" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item3" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-md"
                      placeholder="Add comment"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>




        </div>
      </form>
    </div>
  );
}
