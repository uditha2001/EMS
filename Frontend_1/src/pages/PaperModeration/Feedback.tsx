import { FormEvent } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const Feedback = () => {
    function hadleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        // Implement form submission logic here
        console.log("Form submitted");
    }

    return (
        <div className="bg-white dark:bg-gray-900 w-full p-6 position-relative">
            <Breadcrumb pageName="Feedback" />
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
                            className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white appearance-none"
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
                                <tr>
                                    <td colSpan={5} className="font-bold text-center text-title-lg">
                                        <div className="mb-4 flex gap-4 items-center justify-center">
                                            Genaral Comment on Question Paper and marking scheme
                                        </div>
                                        <textarea
                                            className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                            placeholder="Add comment"
                                            rows={3}
                                        />
                                    </td>
                                </tr>
                                <td className="h-full border  px-4 font-bold" colSpan={2}>
                                    <div className="flex items-end justify-center h-27">
                                        Name of the moderator
                                    </div>
                                </td>
                                <td className="h-full border  px-4 font-bold" colSpan={2}>
                                    <div className="flex items-end justify-center h-27">
                                        Signature
                                    </div>
                                </td>
                                <td className="h-full border px-4 font-bold" colSpan={1}>
                                    <div className="flex items-end justify-center h-27">
                                        Date
                                    </div>
                                </td>
                                <tr>

                                </tr>
                                <tr>
                                    <td colSpan={5} className="font-bold text-center text-title-lg">
                                        <div className="mb-4 flex gap-4 items-center justify-center">
                                            Follow up Action by Examiner/s
                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="pr-4">
                                        <label className="font-bold" htmlFor="agree-a">(a) Agree and addressed</label>
                                        <textarea
                                            className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                            placeholder="Add comment"
                                            rows={3}
                                            id="agree-a"
                                        />
                                    </td>
                                    <td colSpan={2} className="pl-4">
                                        <label className="font-bold" htmlFor="agree-b">(b) Not agree and reasons</label>
                                        <textarea
                                            className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                            placeholder="Add comment"
                                            rows={3}
                                            id="agree-b"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="align-top pr-4"> {/* Add padding to the right */}
                                        <div>
                                            <h2 className="font-bold ml-4">Name</h2>
                                            <ul className="space-y-2">
                                                <li className="flex items-center">
                                                    <label className="font-bold mr-2" htmlFor="name1">(1)</label>
                                                    <textarea
                                                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                                        placeholder="Add comment"
                                                        rows={2}
                                                        id="name1"
                                                    />
                                                </li>
                                                <li className="flex items-center">
                                                    <label className="font-bold mr-2" htmlFor="name2">(2)</label>
                                                    <textarea
                                                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                                        placeholder="Add comment"
                                                        rows={2}
                                                        id="name2"
                                                    />
                                                </li>
                                                <li className="flex items-center">
                                                    <label className="font-bold mr-2" htmlFor="name3">(3)</label>
                                                    <textarea
                                                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                                        placeholder="Add comment"
                                                        rows={2}
                                                        id="name3"
                                                    />
                                                </li>
                                                <li className="flex items-center">
                                                    <label className="font-bold mr-2" htmlFor="name4">(4)</label>
                                                    <textarea
                                                        className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                                        placeholder="Add comment"
                                                        rows={2}
                                                        id="name4"
                                                    />
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td colSpan={2} className="align-top pl-8"> {/* Add padding to the left */}
                                        <div>
                                            <h2 className="font-bold ml-4">Sign</h2>
                                            <ul className="space-y-2">
                                                <li className="flex items-center h-20">-------------------</li>
                                                <li className="flex items-center h-20">-------------------</li>
                                                <li className="flex items-center h-20">-------------------</li>
                                                <li className="flex items-center h-20">-------------------</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td colSpan={2} className="align-top pl-8"> {/* Add padding to the left */}
                                        <div>
                                            <h2 className="font-bold ml-8">Date</h2>
                                            <ul className="space-y-2">
                                                <li className="flex items-center h-20">-------------------</li>
                                                <li className="flex items-center h-20">-------------------</li>
                                                <li className="flex items-center h-20">-------------------</li>
                                                <li className="flex items-center h-20">-------------------</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800">
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
                                            ></textarea>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800">
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
                                            ></textarea>
                                        </div>
                                    </td>
                                </tr>


                            </tbody>
                        </table>

                    </div>



                </div>
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Feedback