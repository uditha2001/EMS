import { useState,useEffect } from "react";

type FormData = {
    answer: string;
    comment: string;
    id:number;
}

const PaperFeedbackTable = ({getDataFromTable}:any) => {
    const [formData, setFormData] = useState<{ [key: string]: FormData }>({
        item1: { answer: "", comment: "", id: 1 },
        item2: { answer: "", comment: "", id: 2 },
        item3: { answer: "", comment: "", id: 3 },
        item4: { answer: "", comment: "", id: 4 },
        item5: { answer: "", comment: "", id: 5 },
        item6: { answer: "", comment: "", id: 6 },
        item7: { answer: "", comment: "", id: 7 },
        item8: { answer: "", comment: "", id: 8 },
        item9: { answer: "", comment: "", id: 9 }
    });
    useEffect(()=>{
        getDataFromTable(formData);
    },[formData])
    const handleRadioChange = (item: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [item]: { ...prevData[item], answer: value }
        }));
    };

    const handleCommentChange = (item: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [item]: { ...prevData[item], comment: value }
        }));
    };

    return (
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
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <tr key={i} className="bg-white dark:bg-gray-800">
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">{i}</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">
                                {/* Update the text for each row */}
                                {i === 1 ? "Does the exam paper provide clear instructions to the candidates?" : 
                                 i === 2 ? "Do the Questions reflect the learning outcomes adequately?" :
                                 i === 3 ? "Are the questions clear and easily understandable?" :
                                 i === 4 ? "Is there any repetition of questions?" :
                                 i === 5 ? "Are the marks allocated for questions and sections appropriate?" :
                                 i === 6 ? "Is the time given to attend each question/section adequate?" :
                                 i === 7 ? "Are the questions up to the standard and appropriate to the level being assessed?" : ""}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <input 
                                    type="radio" 
                                    name={`item${i}`} 
                                    value="yes" 
                                    checked={formData[`item${i}`]?.answer === 'yes'}
                                    required
                                    onChange={() => handleRadioChange(`item${i}`, 'yes')}
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <input 
                                    type="radio" 
                                    name={`item${i}`} 
                                    value="no" 
                                    checked={formData[`item${i}`]?.answer === 'no'}
                                    required
                                    onChange={() => handleRadioChange(`item${i}`, 'no')}
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <textarea
                                    className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                    placeholder="Add comment"
                                    rows={3}
                                    value={formData[`item${i}`]?.comment}
                                    onChange={(e) => handleCommentChange(`item${i}`, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                    <tr><td colSpan={5} className="font-bold text-center text-title-lg">Comment on Marking Scheme</td></tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">8</td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Are the answers correct/justifiable?</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            <input 
                                type="radio" 
                                name="item8" 
                                value="yes" 
                                checked={formData.item8?.answer === 'yes'}
                                onChange={() => handleRadioChange('item8', 'yes')}
                            />
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            <input 
                                type="radio" 
                                name="item8" 
                                value="no" 
                                checked={formData.item8?.answer === 'no'}
                                onChange={() => handleRadioChange('item8', 'no')}
                            />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                placeholder="Add comment"
                                rows={3}
                                value={formData.item8?.comment}
                                onChange={(e) => handleCommentChange('item8', e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 dark:text-gray-300">9</td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-300">Are the main points of the answer highlighted?</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            <input 
                                type="radio" 
                                name="item9" 
                                value="yes" 
                                checked={formData.item9?.answer === 'yes'}
                                onChange={() => handleRadioChange('item9', 'yes')}
                            />
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            <input 
                                type="radio" 
                                name="item9" 
                                value="no" 
                                checked={formData.item9?.answer === 'no'}
                                onChange={() => handleRadioChange('item9', 'no')}
                            />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
                                placeholder="Add comment"
                                rows={3}
                                value={formData.item9?.comment}
                                onChange={(e) => handleCommentChange('item9', e.target.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default PaperFeedbackTable;
