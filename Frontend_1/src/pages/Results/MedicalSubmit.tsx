import { useEffect, useState } from 'react';
import useExaminationApi from '../../api/examinationApi';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useResultsApi from '../../api/ResultsApi';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import useExamTimeTableApi from '../../api/examTimeTableApi';
type ExaminationName = {
    key: number;
    name: string;
};

type CourseData = {
    id: number;
    code: string;
    name: string;
    description: string;
    level: string;
    semester: string;
    isActive: boolean;
    courseType: string;
    degreeProgramId: string;
};
type medicalStudents = {
    studentNumber: string;
    status?: string;
}

const MedicalSubmit = () => {
    const [createdExamNames, setCreatedExamNames] = useState<ExaminationName[]>([]);
    const [examName, setExamName] = useState('');
    const [selectedExaminationKey, setSelectedExaminationKey] = useState<number | undefined>(undefined);
    const [courseCode, setCourseCode] = useState('');
    const [examinationCourseCode, setExaminationCourseCode] = useState<CourseData[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [showGoBackConfirm, setShowGoBackConfirm] = useState(false);
    const [submitMedical, setSubmitMedical] = useState<medicalStudents[]>([]);
    const { getAllOngoingExams } = useExaminationApi();
    const { getCourses } = useExamTimeTableApi();
    const { getAbsentStudents, saveSubmittedMedicals } = useResultsApi();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await getAllOngoingExams();
                if (response.data.code === 200) {
                    const exams: ExaminationName[] = response.data.data.map((exam: any) => {
                        const key = exam.id;
                        return {
                            key,
                            name: `${exam.year}-${exam.degreeProgramName}-Level ${exam.level}-Semester ${exam.semester}`,
                        };
                    });

                    setCreatedExamNames(exams);
                }
            } catch (error) {
                setErrorMessage('Failed to fetch exams');
                setSuccessMessage('');
                console.error('Failed to fetch exams:', error);
            }
        };

        fetchExams();
    }, []);


    useEffect(() => {
        const fetchCourses = async () => {
            setExaminationCourseCode([]);
            if (selectedExaminationKey !== undefined) {
                try {
                    const data = await getCourses(selectedExaminationKey);
                    // Remove duplicates based on course code
                    const uniqueCourses = data.data.filter(
                        (course: any, index: number, self: any[]) =>
                            index === self.findIndex((c) => c.code === course.code)
                    );

                    setExaminationCourseCode(uniqueCourses);
                } catch (error) {
                    setErrorMessage('Failed to fetch courses');
                    console.error('Error fetching courses:', error);
                }
            }
        };

        fetchCourses();
    }, [selectedExaminationKey]);


    useEffect(() => {
        const saveSubmitmedicals = async () => {
            console.log("submitmeical", submitMedical);
            try {
                const response = await saveSubmittedMedicals(submitMedical, courseCode, selectedExaminationKey);
                if (response.status === 200) {
                    setErrorMessage('');
                    setSuccessMessage('Medical statuses submitted successfully');
                } else {
                    setSuccessMessage('');
                    setErrorMessage('Failed to submit medical statuses');
                    console.error('Failed to submit medical statuses');

                }
            }
            catch (error) {
                setSuccessMessage('');
                setErrorMessage('Error submitting medical statuses');
                console.error('Error submitting medical statuses:', error);
            }
            finally {
                setIsSubmitting(false);
                setSubmitMedical([]);
                setStudents([]);
            }
        }
        if (isSubmitting) {
            saveSubmitmedicals();
        }
    }, [submitMedical, isSubmitting]);

    const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        setExamName(selectedName);
        const selectedExam = createdExamNames.find((exam) => exam.name === selectedName);
        setSelectedExaminationKey(selectedExam?.key);
        setCourseCode('');
    };

    const handleGetAbsentStudents = async () => {
        try {
            const response = await getAbsentStudents(courseCode, selectedExaminationKey);
            console.log('Fetched absent students:', response.data);
            if (response.status === 200) {
                setStudents(response.data.data);
            } else {
                console.error('No data received for absent students');
            }
        } catch (error) {
            console.error('Error fetching absent students:', error);
        }
    };

    const handleStatusChange = (index: number, newStatus: string) => {
        const updatedStudents = [...students];
        updatedStudents[index].status = newStatus;
        setStudents(updatedStudents);
      
        const updatedStudent: medicalStudents = {
          studentNumber: students[index].studentNumber,
          status: newStatus,
        };
      
        // Clone the submitMedical array
        const submittedMedical = [...submitMedical];
      
        // Check if the student is already in submitMedical
        const existingIndex = submittedMedical.findIndex(
          (s) => s.studentNumber === updatedStudent.studentNumber
        );
      
        if (existingIndex !== -1) {
          // Update existing entry
          submittedMedical[existingIndex] = updatedStudent;
        } else {
          // Add new entry
          submittedMedical.push(updatedStudent);
        }
      
        setSubmitMedical(submittedMedical);
      };
      

    const handleSubmitMedical = () => {
        setIsSubmitting(true);
        setShowSubmitConfirm(false);
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="mx-auto max-w-270">
            {errorMessage && <ErrorMessage message={errorMessage} onClose={() => {
                setErrorMessage('');
            }} />}
            {successMessage && <SuccessMessage message={successMessage} onClose={() => {
                setSuccessMessage('');
            }} />}
            <Breadcrumb pageName="Submit Medical Request" />
            <div className="flex flex-col items-center justify-start">

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-270 mx-auto">

                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark text-center">
                        <h3 className="font-medium text-black dark:text-white">Submit Medical Request</h3>
                    </div>
                    <div className="px-6 pt-4">
                        <div className="bg-yellow-100 text-yellow-800 text-sm px-4 py-2 rounded border border-yellow-300">
                        ⚠️ <strong>Medical requests can only be submitted for results where marks have already been uploaded (First Marking submitted).</strong>                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pt-6 pb-6">
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                                Exam Name
                            </label>
                            <select
                                value={examName}
                                onChange={handleExamChange}
                                className="input-field"
                            >
                                <option value="">-- Select the Exam Name --</option>
                                {createdExamNames.map((exam) => (
                                    <option key={exam.key} value={exam.name}>
                                        {exam.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                                Course Code
                            </label>
                            <select
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                                className="input-field"
                            >
                                <option value="">-- Select the Course Code --</option>
                                {examinationCourseCode.map((course) => (
                                    <option key={course.id} value={course.code}>
                                        {course.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex justify-center">
                        <button
                            onClick={handleGetAbsentStudents}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-200"
                        >
                            Get Absent Students
                        </button>
                    </div>
                </div>
            </div>

            {students.length > 0 && (
                <div className="px-6 mt-8 mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => setShowGoBackConfirm(true)}
                            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Go Back
                        </button>

                        <button
                            onClick={() => setShowSubmitConfirm(true)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Medical
                        </button>
                    </div>

                    <div className="overflow-x-auto px-6 mt-8 mb-10">
                        <table className="min-w-full md:min-w-[800px] border-collapse max-w-6xl mx-auto">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700">
                                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 dark:text-gray-400 text-center">
                                        Student Number
                                    </th>
                                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 dark:text-gray-400 text-center">
                                        Student Name
                                    </th>
                                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 dark:border-gray-600 dark:text-gray-400 text-center">
                                        Medical Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {students.map((student, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200 dark:border-gray-600 dark:text-gray-300 text-center">
                                            {student.studentNumber}
                                        </td>
                                        <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700 border-b border-gray-200 dark:border-gray-600 dark:text-gray-300 text-center">
                                            {student.studentName}
                                        </td>
                                        <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm border-b border-gray-200 dark:border-gray-600 text-center">
                                            <div className="flex justify-center">
                                                <select
                                                    value={student.status || 'Not Approved'}
                                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                                    className="w-36 px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                                                >
                                                    <option value="Not Approved">Not Approved</option>
                                                    <option value="Approved">Approved</option>
                                                </select>
                                            </div>
                                            <div className="mt-1">
                                                <span
                                                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${student.status === 'Approved'
                                                        ? 'bg-green-200 text-green-800'
                                                        : 'bg-orange-200 text-orange-800'
                                                        }`}
                                                >
                                                    {student.status || 'Not Approved'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            )}

            {/* Confirm Submit Dialog */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 w-full max-w-md text-center">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Confirm Submission</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to submit the medical statuses?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleSubmitMedical} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Confirm</button>
                            <button onClick={() => { setShowSubmitConfirm(false); setErrorMessage(''); setSuccessMessage('') }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Go Back Dialog */}
            {showGoBackConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 w-full max-w-md text-center">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Confirm Navigation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to go back? Unsaved changes will be lost.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleGoBack} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Yes, Go Back</button>
                            <button onClick={() => setShowGoBackConfirm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalSubmit;
