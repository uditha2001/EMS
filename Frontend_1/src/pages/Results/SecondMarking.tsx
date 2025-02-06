import { Key, useEffect, useState } from 'react'
import SelectExaminationComponent from '../../components/resultComponent/SelectExaminationComponent'
import useApi from '../../api/api'
type requiredData = {
    courseCode: string;
    examName: string;
    examType: string
}
type RowData = {
    [key: string]: any;
};

const SecondMarking = () => {
    const [examsData, setExamsData] = useState<requiredData>({

        courseCode: "",
        examName: "",
        examType: ""

    });
    const { getFirstMarkingResults } = useApi();
    const [studentsData, setStudentsData] = useState<RowData[]>([]);
    const [editable, setEditable] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterData, setFilterData] = useState<RowData[]>([]);
    const [editedMarks, setEditedMarks] = useState<{ [key: number]: string }[]>([]);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [highlightChanges, setHighlightChanges] = useState(false);
    const [secondMarking, setSecondMarking] = useState<RowData[]>([]);

    useEffect(() => {
        setFilterData(studentsData);
    }, [studentsData]);


    // useEffect(() => {
        
    //     studentsData.map((key,index)=> {
    //             console.log(editedMarks[index].key)
    //          if (editedMarks.some(mark => mark[index])) {
    //             setSecondMarking(
    //                 studentsData[index].firstMarking
    //             )
    //         }
    //         else {
    //             setSecondMarking(
    //                 studentsData[index].firstMarking
    //             )
    //         }
    //     });
    // }, [editedMarks])

    useEffect(() => {

    }, [secondMarking, highlightChanges])

    useEffect(() => {
        const filteredData = studentsData.filter(row =>
            Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        setFilterData(filteredData);
    }, [searchTerm])

    const handleEdit = () => {
        setShowSaveButton(true);
        setEditable(true);
    }

    const handleEditMarks = (studentId: number, value: string) => {
        setEditedMarks([...editedMarks, { [studentId]: value }]);

    };


    const handleSave = () => {
        setEditable(false);
        setShowSaveButton(false);
        setHighlightChanges(true);


    }




    const handleSubmit = () => {
        if (examsData.courseCode != "" && examsData.examName != "" && examsData.examType != "") {
            getFirstMarkingResults(examsData.examName, examsData.courseCode, examsData.examType).then((data) => {
                if (data.code === 200) {
                    setStudentsData(data.data);
                }
            })
        }
    }
    const handleUpload = () => {

    }

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-6xl">
                <div className="text-center mb-4 dark:bg-black">
                    <h1 className="text-4xl font-bold text-gray-800 mb-1 dark:text-gray-200">
                        Second Marking Results Upload
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Upload and manage examination results</p>
                </div>
                <SelectExaminationComponent getExamData={setExamsData} />

                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
                        onClick={handleSubmit}
                        aria-label="Search first marking marks"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Search FirstMarking Marks</span>
                    </button>

                </div>
                <div className="mt-4 flex justify-center">
                    {studentsData.length > 0 && (
                        <div className="w-full ">
                            <div className="bg-blue-50 p-4 rounded-xl mb-4 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 shadow-md">
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                    You can edit second marks if any marks change.
                                </p>
                            </div>

                            <div className="relative mb-4 mt-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                                <div className="relative flex-1">
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Enter student sc number ex:SC/XXXX/XXXX"
                                        className="w-full pl-10 p-1.5 border rounded-md focus:ring focus:ring-blue-300 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>

                            <div className="w-full flex flex-col">
                                <div className="flex justify-end space-x-4 mb-4">
                                    {/* Edit Marks Button */}
                                    <div className="flex space-x-2">
                                        {showSaveButton ? (
                                            // Save Button
                                            <button
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
                                                onClick={handleSave}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M3 10a1 1 0 011-1h3V7a1 1 0 112 0v2h3a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm5 0V7h4v3h3l-5 5-5-5h3z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Save Marks</span>
                                            </button>
                                        ) : (
                                            // Edit Button
                                            <button
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:bg-green-600 dark:hover:bg-green-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
                                                onClick={handleEdit}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M17.293 4.707a1 1 0 00-1.414 0l-9 9a1 1 0 00-.293.707v2.828a1 1 0 001 1h2.828a1 1 0 001-1v-2.828a1 1 0 00-.293-.707l-9-9a1 1 0 10-1.414 1.414l8 8V16h2v-2.586l4.707 4.707a1 1 0 001.414-1.414l-6-6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Edit Marks</span>
                                            </button>
                                        )}
                                    </div>


                                    {/* Upload Results Button */}
                                    <button
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
                                        onClick={handleUpload}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 10a1 1 0 011-1h3V7a1 1 0 112 0v2h3a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm5 0V7h4v3h3l-5 5-5-5h3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>Upload Results</span>
                                    </button>
                                </div>

                                {/* Scrollable Table Container */}
                                <div className="w-full overflow-x-auto rounded-lg shadow-sm flex justify-center">
                                    {filterData.length > 0 && (
                                        <table className="min-w-full md:min-w-[800px] border-collapse max-w-6xl">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-gray-700">
                                                    {Object.keys(filterData[0]).map((key) => (
                                                        <th
                                                            key={key}
                                                            className="px-3 py-2 sm:px-6 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 dark:text-gray-400 whitespace-nowrap"
                                                        >
                                                            {key}
                                                        </th>
                                                    ))}
                                                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                        Second Marking
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {filterData.map((row: any, rowIndex: any) => (
                                                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        {Object.values(row).map((value, colIndex) => (
                                                            <td
                                                                key={colIndex}
                                                                className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200 dark:border-gray-600 dark:text-gray-300 whitespace-nowrap text-center"
                                                            >
                                                                {value as string}
                                                            </td>
                                                        ))}
                                                        <td className={`px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200 dark:border-gray-600 dark:text-gray-300 text-center ${highlightChanges && editedMarks.some(mark => mark[rowIndex]) ? 'bg-green-500' : ''}`}>
                                                            {editable ? (
                                                                <input
                                                                    type="text"

                                                                    className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm"
                                                                    defaultValue={Object.values(row)[Object.values(row).length - 1] as string}
                                                                    onChange={(e) => {

                                                                        handleEditMarks(rowIndex, e.target.value)
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="relative">
                                                                    {Object.values(row)[Object.values(row).length - 1] as string}

                                                                    {highlightChanges && editedMarks.some(mark => mark[rowIndex]) && (
                                                                        <span className="absolute text-sm text-white bg-green-600 rounded-full px-2 py-1 top-0 right-0">
                                                                            Edited
                                                                        </span>
                                                                    )}
                                                                </div>

                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );


}

export default SecondMarking