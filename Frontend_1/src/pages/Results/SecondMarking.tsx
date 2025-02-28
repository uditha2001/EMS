import { useRef, useEffect, useState } from 'react';
import SelectExaminationComponent from '../../components/resultComponent/SelectExaminationComponent';
import useResultsApi from '../../api/ResultsApi';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
type requiredData = {
  id: number | undefined;
  courseCode: string;
  examName: string;
  examType: string;
};
type RowData = {
  [key: string]: any;
};

const SecondMarking = () => {
  const [examsData, setExamsData] = useState<requiredData>({
    id: 0,
    courseCode: '',
    examName: '',
    examType: '',
  });
  const { getFirstMarkingResults, saveMarkingResults } = useResultsApi();
  const [studentsData, setStudentsData] = useState<RowData[]>([]);
  const [editable, setEditable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterData, setFilterData] = useState<RowData[]>([]);
  const [editedMarks, setEditedMarks] = useState<
    { key: number; value: string }[]
  >([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [highlightChanges, setHighlightChanges] = useState(false);
  const [secondMarking, setSecondMarking] = useState<RowData[]>([]);
  const originalIndexes = useRef<Number[]>([]);
  const [allowToSend, setAllowToSend] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [totalData, setTotalData] = useState({});
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (!originalIndexes.current) {
      originalIndexes.current = studentsData.map((_, index) => index);
    }
    const updatedMarking = studentsData.map((data, index) => ({
      ...data,
      secondMarking: data.secondMarking,
      originalIndex: originalIndexes.current[index] ?? index,
    }));

    setSecondMarking(updatedMarking);
  }, [studentsData]);

  useEffect(() => {
    if (allowToSend) {
      saveMarkingResults(totalData, {
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total != undefined) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          }
        },
      }).then((data) => {
        if (data.code === 201) {
          setHighlightChanges(false);
          setAllowToSend(false);
          setSuccessMessage('result upload successfull');
          setShowProgressBar(false);
        } else if (data.status === 500) {
          setAllowToSend(false);
          setErrorMessage('result upload failed!');
          setShowProgressBar(false);
        }
      });
    }
  }, [totalData]);

  useEffect(() => {
    if (highlightChanges) {
      const updatedMarking = secondMarking.map((data, index) => {
        const checkedIndex = editedMarks.findIndex(
          (mark) => mark?.key === index,
        );
        if (checkedIndex !== -1) {
          console.log(editedMarks);
          return { ...data, secondMarking: editedMarks[checkedIndex].value };
        } else {
          return { ...data };
        }
      });
      setSecondMarking(updatedMarking);
    }
  }, [editedMarks, highlightChanges]);

  useEffect(() => {
    setFilterData(secondMarking);
  }, [secondMarking]);

  useEffect(() => {
    const filteredData = secondMarking.filter((row) =>
      Object.values(row).some(
        (value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    setFilterData(filteredData);
  }, [searchTerm]);

  const handleEdit = () => {
    setShowSaveButton(true);
    setEditable(true);
    setHighlightChanges(false);
    setIsSaved(false);
  };

  const handleEditMarks = (studentId: number, value: string) => {
    setEditedMarks((prev) => {
      const existingIndex = prev.findIndex((mark) => mark.key === studentId);

      if (existingIndex !== -1) {
        return prev.map((mark, index) =>
          index === existingIndex ? { ...mark, value } : mark,
        );
      } else {
        return [...prev, { key: studentId, value }];
      }
    });
  };

  const handleSave = () => {
    setEditable(false);
    setShowSaveButton(false);
    setHighlightChanges(true);
    setIsSaved(true);
    setErrorMessage('');
  };

  const handleSubmit = () => {
    if(isSaved){
    if (
      examsData.courseCode != '' &&
      examsData.examName != '' &&
      examsData.examType != ''
    ) {
      getFirstMarkingResults(
        examsData.id,
        examsData.courseCode,
        examsData.examType,
      ).then((data) => {
        if (data.code === 200) {
          setStudentsData(data.data);
        }
      });
    }
  }else{
    setErrorMessage('please save before search');
  }
  };
  const handleUpload = () => {
    if (isSaved) {
      setTotalData({
        id: examsData.id,
        studentsData: secondMarking,
        courseCode: examsData.courseCode,
        examName: examsData.examName,
        examType: examsData.examType,
      });
      setErrorMessage('');
      setSuccessMessage('');
      setShowProgressBar(true);
      setAllowToSend(true);
    } else {
      setErrorMessage('please save before upload');
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Second Marking" />
      <div>
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
        <div className="flex flex-col items-center justify-start">
          <SelectExaminationComponent getExamData={setExamsData} />

          <div className="flex justify-center space-x-4 mt-4">
            <button
              className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
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
                <div className="bg-blue-50 p-4 rounded mb-4 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 shadow-md">
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m2.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Enter student sc number ex:SC/XXXX/XXXX"
                      className="input-field text-sm pl-10"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
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
                          className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
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
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded shadow-md transition-all duration-300 hover:shadow-lg dark:bg-green-600 dark:hover:bg-green-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
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
                      className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded shadow-md transition-all duration-300 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:shadow-gray-700/30 flex items-center justify-center space-x-1.5"
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
                  {showProgressBar && (
                    <div>
                      <div
                        style={{
                          width: '100%',
                          backgroundColor: '#e0e0e0',
                          borderRadius: '5px',
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            backgroundColor: '#76c7c0',
                            height: '10px',
                            borderRadius: '5px',
                          }}
                        ></div>
                      </div>
                      <div>Upload Progress: {progress}%</div>
                    </div>
                  )}

                  {/* Scrollable Table Container */}
                  <div className="w-full overflow-x-auto rounded-sm shadow-sm flex justify-center">
                    {filterData.length > 0 && (
                      <table className="min-w-full md:min-w-[800px] border-collapse max-w-6xl">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            {Object.keys(filterData[0])
                              .slice(0, -2)
                              .map((key) => (
                                <th
                                  key={key}
                                  className="px-3 py-2 sm:px-6 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 dark:text-gray-400 whitespace-nowrap"
                                >
                                  {key}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          {filterData.map((row: any, rowIndex: any) => (
                            <tr
                              key={rowIndex}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              {Object.values(row)
                                .slice(0, -3)
                                .map((value, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200 dark:border-gray-600 dark:text-gray-300 whitespace-nowrap text-center"
                                  >
                                    {value as string}
                                  </td>
                                ))}
                              <td
                                className={`px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200 dark:border-gray-600 dark:text-gray-300 text-center ${
                                  highlightChanges &&
                                  editedMarks.some(
                                    (mark) => mark.key === row['originalIndex'],
                                  )
                                    ? 'bg-yellow-500 && npmdark:text-black'
                                    : ''
                                }`}
                              >
                                {editable ? (
                                  <input
                                    type="text"
                                    className="w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm"
                                    defaultValue={
                                      Object.values(row).at(-3) as string
                                    }
                                    onChange={(e) => {
                                      console.log(
                                        'befor tun edit' + row['originalIndex'],
                                      );
                                      handleEditMarks(
                                        row['originalIndex'],
                                        e.target.value,
                                      );
                                      console.log(
                                        'after tun edit' + row['originalIndex'],
                                      );
                                    }}
                                  />
                                ) : (
                                  <div className="relative">
                                    {Object.values(row).at(-3) as string}

                                    {highlightChanges &&
                                      editedMarks.some(
                                        (mark) =>
                                          mark.key === row['originalIndex'],
                                      ) && (
                                        <span className="absolute text-sm text-white bg-yellow-600 rounded-full px-2 py-1 top-0 right-0">
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
    </div>
  );
};

export default SecondMarking;
