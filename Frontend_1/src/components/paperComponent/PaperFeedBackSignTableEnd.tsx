import { useState } from "react";

const PaperFeedbackQuestionTable = (getTableData:any) => {
  const [formData, setFormData] = useState({
    generalComment: "",
    agreeAndAddressed: "",
    notAgreeAndReasons: "",
    names: ["", "", "", ""],
    learningOutcomes: "",
    courseContent: "",
  });

  const handleInputChange = (key: string, value: string, index: number | null = null) => {
    if (index !== null) {
      const updatedNames = [...formData.names];
      updatedNames[index] = value;
      setFormData({ ...formData, names: updatedNames,});
      getTableData(formData);
      console.log(formData);
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 p-6 rounded shadow-md">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td colSpan={5} className="font-bold text-center text-title-lg">
              <div className="mb-4 flex gap-4 items-center justify-center">
                General Comment on Question Paper and Marking Scheme
              </div>
              <textarea
                className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                placeholder="Add comment"
                rows={3}
                value={formData.generalComment}
                onChange={(e) =>
                  handleInputChange("generalComment", e.target.value)
                }
              />
            </td>
          </tr>
          <tr>
            <td className="h-full border px-4 font-bold" colSpan={2}>
              <div className="flex items-end justify-center h-27">
                Name of the Moderator
              </div>
            </td>
            <td className="h-full border px-4 font-bold" colSpan={2}>
              <div className="flex items-end justify-center h-27">
                Signature
              </div>
            </td>
            <td className="h-full border px-4 font-bold" colSpan={1}>
              <div className="flex items-end justify-center h-27">Date</div>
            </td>
          </tr>
          <tr>
            <td colSpan={5} className="font-bold text-center text-title-lg">
              <div className="mb-4 flex gap-4 items-center justify-center">
                Follow-up Action by Examiner/s
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="pr-4">
              <label className="font-bold" htmlFor="agree-a">
                (a) Agree and Addressed
              </label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                placeholder="Add comment"
                rows={3}
                id="agree-a"
                value={formData.agreeAndAddressed}
                onChange={(e) =>
                  handleInputChange("agreeAndAddressed", e.target.value)
                }
              />
            </td>
            <td colSpan={2} className="pl-4">
              <label className="font-bold" htmlFor="agree-b">
                (b) Not Agree and Reasons
              </label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                placeholder="Add comment"
                rows={3}
                id="agree-b"
                value={formData.notAgreeAndReasons}
                onChange={(e) =>
                  handleInputChange("notAgreeAndReasons", e.target.value)
                }
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="align-top pr-4">
              <div>
                <h2 className="font-bold ml-4">Name</h2>
                <ul className="space-y-2">
                  {formData.names.map((name, index) => (
                    <li className="flex items-center" key={index}>
                      <label
                        className="font-bold mr-2"
                        htmlFor={`name${index + 1}`}
                      >
                        ({index + 1})
                      </label>
                      <textarea
                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                        placeholder="Add comment"
                        rows={2}
                        id={`name${index + 1}`}
                        value={name}
                        onChange={(e) =>
                          handleInputChange("names", e.target.value, index)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </td>
            <td colSpan={2} className="align-top pl-8">
              <div>
                <h2 className="font-bold ml-4">Sign</h2>
                <ul className="space-y-2">
                  {[...Array(4)].map((_, index) => (
                    <li className="flex items-center h-20" key={index}>
                      -------------------
                    </li>
                  ))}
                </ul>
              </div>
            </td>
            <td colSpan={2} className="align-top pl-8">
              <div>
                <h2 className="font-bold ml-8">Date</h2>
                <ul className="space-y-2">
                  {[...Array(4)].map((_, index) => (
                    <li className="flex items-center h-20" key={index}>
                      -------------------
                    </li>
                  ))}
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td
              colSpan={5}
              className="border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800"
            >
              <div>
                <label
                  htmlFor="learningOutcomes"
                  className="block font-bold text-gray-700 dark:text-gray-300 mb-2 text-lg"
                >
                  Learning Outcomes:
                </label>
                <textarea
                  id="learningOutcomes"
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                  placeholder="Enter your text here..."
                  rows={4}
                  value={formData.learningOutcomes}
                  onChange={(e) =>
                    handleInputChange("learningOutcomes", e.target.value)
                  }
                ></textarea>
              </div>
            </td>
          </tr>
          <tr>
            <td
              colSpan={5}
              className="border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800"
            >
              <div>
                <label
                  htmlFor="courseContent"
                  className="block font-bold text-gray-700 dark:text-gray-300 mb-2 text-lg"
                >
                  Course Content:
                </label>
                <textarea
                  id="courseContent"
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                  placeholder="Enter your text here..."
                  rows={4}
                  value={formData.courseContent}
                  onChange={(e) =>
                    handleInputChange("courseContent", e.target.value)
                  }
                ></textarea>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaperFeedbackQuestionTable;
