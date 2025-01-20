
import { useState } from 'react';

type questionData = {
  answer: string;
  comment: string;
  id: number;
  question: string;
};

type finalData = {
  Question: questionData[];
  generalComment: string;
  learningOutcomes: string;
  courseContent: string;
  degreeProgram: string;
  courseCode: string;
  courseName: string;
  examination: string;
  agreeAndAddressed: string;
  notAgreeAndReasons: string;
};

const PdfViewOfFeedBack = (finalData: finalData) => {

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded shadow-md overflow-x-auto">
      <h1 className="text-center font-bold text-title-lg">
        Evaluation Form for Moderation of Examination papers
        <br /> Department of Computer Science-University of Ruhuna
      </h1>

      <div className="mb-6 mt-6">
        <p><strong>Degree Program:</strong> {finalData.degreeProgram}</p>
        <p><strong>Examination:</strong> {finalData.examination}</p>
        <p><strong>Course Name:</strong> {finalData.courseName}</p>
        <p><strong>Course Code:</strong> {finalData.courseCode}</p>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="border border-gray-300 px-4 py-2 text-left">Row No.</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Question</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Yes</th>
            <th className="border border-gray-300 px-4 py-2 text-center">No</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Specific Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center">1</td>
            <td className="border border-gray-300 px-4 py-2">Does the exam paper provide clear instructions to the candidates?</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[0]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[0]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[0]?.comment}</td>
          </tr>

          <tr className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center">2</td>
            <td className="border border-gray-300 px-4 py-2">Do the Questions reflect the learning outcomes adequately?</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[1]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[1]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[1]?.comment}</td>
          </tr>

          <tr className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center">3</td>
            <td className="border border-gray-300 px-4 py-2">Are the questions clear and easily understandable?</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[2]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[2]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[2]?.comment}</td>
          </tr>

          <tr className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center">4</td>
            <td className="border border-gray-300 px-4 py-2">Is there any repetition of questions?</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[3]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[3]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[3]?.comment}</td>
          </tr>

          <tr className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center">5</td>
            <td className="border border-gray-300 px-4 py-2">Are the marks allocated for questions and sections appropriate?</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[4]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[4]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[4]?.comment}</td>
          </tr>

          <tr className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center">6</td>
            <td className="border border-gray-300 px-4 py-2">Is the time given to attend each question/section adequate?</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[5]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[5]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[5]?.comment}</td>
          </tr>

          <tr className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center">7</td>
            <td className="border border-gray-300 px-4 py-2">Are the questions up to the standard and appropriate to the level being assessed?</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[6]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[6]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[6]?.comment}</td>
          </tr>

          {/* New Row for Marking Scheme Comment */}
          <tr>
            <td colSpan={5} className="font-bold text-center text-title-lg">
              Comment on Marking Scheme
            </td>
          </tr>

          {/* Last Two Questions */}
          <tr key="8" className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">8</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">
              Are the answers correct/justifiable?
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[7]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[7]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[7]?.comment}</td>
          </tr>

          <tr key="9" className="bg-white dark:bg-gray-800">
            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">9</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">
              Is the marking scheme clear and fair?
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[8]?.answer === "yes" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {finalData.Question[8]?.answer === "no" ? "✔" : ""}
            </td>
            <td className="border border-gray-300 px-4 py-2">{finalData.Question[8]?.comment}</td>
          </tr>

          <tr>
            <td colSpan={5}>
              <div className="mb-4 w-full">
                <div className="font-bold text-title-lg justify-center text-center">
                  General Comment on Question Paper and Marking Scheme
                </div>
                <span className="ml-6 mr-6">* {finalData.generalComment}</span>
              </div>
            </td>
          </tr>

          <tr>
            <td className="h-full border pr-4 font-bold" colSpan={1}>
              <div className="items-end block  h-27">
                <p className="mt-25 text-center">
                  __________________________</p><br />
                <p className="text-center">
                  Name of the Moderator
                </p>
              </div>
            </td>
            <td className="h-full border pr-4 font-bold" colSpan={2}>
              <div className="items-end block  h-27">
                <p className="mt-25 text-center">
                  __________________________</p><br />
                <p className="text-center">
                  Signature
                </p>
              </div>
            </td>
            <td className="h-full border px-4 font-bold" colSpan={2}>
              <div className="items-end block  h-27">
                <p className="mt-25 text-center">
                  __________________________</p><br />
                <p className="text-center">
                  Date
                </p>
              </div>
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
            <td colSpan={2} className="border border-gray-300 py-2">
              <div>
                <p className="font-bold mr-5">(a) Agree and Addressed:</p>
                <p className="ml-4">{finalData.agreeAndAddressed}</p>
              </div>
            </td>
            <td colSpan={3} className="border border-gray-300 py-2">
              <div>
                <p className="font-bold mr-5">(b) Not Agree and Reasons:</p>
                <p className="ml-4">{finalData.notAgreeAndReasons}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td colSpan={5}>
              <div className="flex justify-between">
                {/* Name Column */}
                <div className="flex-1 pr-4">
                  <h2 className="font-bold ml-4">Name</h2>
                  <ul className="space-y-4">
                    {[...Array(4)].map((_, index) => (
                      <li className="flex items-center h-20" key={index}>
                        <label className="font-bold mr-2" htmlFor={`name${index + 1}`}>
                          ({index + 1})
                        </label>
                        <div className="flex flex-col items-start space-y-4">
                          <label className="ml-2">---------------------</label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sign Column */}
                <div className="flex-1 pl-4">
                  <h2 className="font-bold ml-4">Sign</h2>
                  <ul className="space-y-4">
                    {[...Array(4)].map((_, index) => (
                      <li className="flex items-center h-20" key={index}>
                        -------------------
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Date Column */}
                <div className="flex-1 pl-4">
                  <h2 className="font-bold ml-8">Date</h2>
                  <ul className="space-y-4">
                    {[...Array(4)].map((_, index) => (
                      <li className="flex items-center h-20" key={index}>
                        -------------------
                      </li>
                    ))}
                  </ul>
                </div>
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
                {finalData.learningOutcomes}
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
                  Course Content:
                </label>
                {finalData.courseContent}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  );
};

export default PdfViewOfFeedBack;
