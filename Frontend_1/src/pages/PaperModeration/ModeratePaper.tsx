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
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-800 dark:text-gray-200">Row No.</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-800 dark:text-gray-200">Item</th>
                  <th className="border border-gray-300 px-4 py-2 text-gray-800 dark:text-gray-200">Yes</th>
                  <th className="border border-gray-300 px-4 py-2 text-gray-800 dark:text-gray-200">No</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-800 dark:text-gray-200">Specific Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">1</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Does the exam paper provide clear instructions to<br />the candidates?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item1" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item1" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />

                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">2</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Do the Questions reflect the learning outcomes<br />adequately?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item2" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item2" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />

                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">3</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Are the questions clear and easily understandable?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item3" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item3" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />

                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">4</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Is there anyrepetition of questions?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item4" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item4" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />

                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">5</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Are the marks allocated for questions and sections<br />appropriate?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item5" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item5" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />

                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">6</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Is the time given to attend each questions/section<br />adequate?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item6" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item6" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">7</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Are the questions up to the standard and<br />appropriate to the level being assessed (SLQF 5/6)?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item7" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item7" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />
                  </td>
                </tr>
                <tr><td colSpan={5} className="font-bold text-center text-title-lg">Comment on Marking Scheme</td></tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">8</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Are the answer correct/justifiable?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item8" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item8" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
                    />
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">9</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Are the main points of the answer highlighted?</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item9" value="yes" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <input type="radio" name="item9" value="no" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                      placeholder="Add comment"
                      rows={3}
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
