import { FormEvent, useState, useEffect } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import PaperFeedbackQuestionTable from "../../components/paperComponent/PaperFeedbackQuestionTable";
import PaperFeedbackSignEndTable from "../../components/paperComponent/PaperFeedBackSignTableEnd";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PdfViewOfFeedBack from "./PdfViewOfFeedBack";
type questionData = {
    answer: string;
    comment: string;
    id: number;
    questions?: string[];
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


}

const Feedback = () => {
    const [QuestionData, setQuestionData] = useState<{ [key: string]: questionData }>({
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
    const [degreeName, setDegreeName] = useState<any[]>([]);
    const [courseData, setCourseData] = useState<any[]>([]);
    const Axios = useAxiosPrivate();
    const [formData, setFormData] = useState<finalData | null>(null);
    const [selectedDegreeProgram, setSelectedDegreeProgram] = useState<string>("");
    const [selectedCourseCode, setSelectedCourseCode] = useState<string>("");
    const [selectedCourseName, setSelectedCourseName] = useState<string>("");
    const [examination, setExamination] = useState<string>("");
    const [pdfRequest, setPdfRequest] = useState<boolean>(false);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await Axios.get(`/courses/byDegreeProgram?degreeName=${selectedDegreeProgram}`);
                if (courses.status === 200) {
                    const data = Array.isArray(courses.data.data) ? courses.data.data : [courses.data.data];
                    setCourseData(data);
                    handleCourseCode(null, data[0]?.code);
                }
                else if (courses.status === 500) {
                    console.log("No courses found");
                }
            }
            catch (error) {
                console.log("failed to load courses");
            }

        }
        fetchCourses();
    }, [selectedDegreeProgram])

    useEffect(() => {
        handleCourseName();
    }, [selectedCourseCode])

    useEffect(() => {
        console.log("runing");
        console.log(formData);

    }
        , [formData])

    useEffect(() => {
        const fetchDegreePrograms = async () => {
            try {
                const degreeData = await Axios.get("/degreePrograms");
                if (degreeData.data) {
                    const arrayData = Array.isArray(degreeData.data) ? degreeData.data : [degreeData.data];
                    setDegreeName(arrayData);

                }
            } catch (error) {
                console.log("failed to load degree programs");
            }
        };
        fetchDegreePrograms();
    }, [])

    const [moderatorData, setModeratorData] = useState({
        generalComment: "",
        names: ["", "", "", ""],
        learningOutcomes: "",
        courseContent: "",
        agreeAndAddressed: "",
        notAgreeAndReasons: ""
    });
    const handleDegreeName = (event: any) => {
        setSelectedDegreeProgram(event.target.value);
    }
    const handleCourseCode = (event: any, code: string) => {
        if (event !== null) {
            setSelectedCourseCode(event.target.value);
        }
        else {
            setSelectedCourseCode(code);
        }
    }
    const handleCourseName = () => {
        Object.values(courseData).forEach((course) => {
            if (course.code === selectedCourseCode) {
                setSelectedCourseName(course.name);
                console.log(course.name);
            }
        }
        )
    }


    const handleQuestionsData = (Data: { answer: string; comment: string; id: number }[]) => {
        const updatedData = { ...QuestionData };
        Object.values(Data).forEach((item) => {
            const key = `item${item.id}`;
            if (updatedData[key]) {
                updatedData[key] = {
                    ...updatedData[key],
                    answer: item.answer,
                    comment: item.comment,
                    questions: ["Does the exam paper provide clear instructions to the candidates?",
                         "Do the Questions reflect the learning outcomes adequately?"
                         , "Are the questions clear and easily understandable?"
                         , "Is there any repetition of questions?"
                        ,"Are the marks allocated for questions and sections appropriate?",
                        "Is the time given to attend each question/section adequate?",
                    "Are the questions up to the standard and appropriate to the level being assessed?",
                    " Are the answers correct/justifiable?",
                    " Is the marking scheme clear and fair?"]
                };
                
            }
        });

        setQuestionData(updatedData); // Update the state with the modified object
    }
    const handleModerateData = (Data: { generalComment: string; learningOutcomes: string; courseContent: string; agreeAndAddressed: string; notAgreeAndReasons: string }) => {
        setModeratorData((prevData) => ({ ...prevData, generalComment: Data.generalComment, learningOutcomes: Data.learningOutcomes, courseContent: Data.courseContent, agreeAndAddressed: Data.agreeAndAddressed, notAgreeAndReasons: Data.notAgreeAndReasons }));
    }

    function hadleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setFormData((prevData) => ({
            ...prevData,
            Question: Object.values(QuestionData),
            generalComment: moderatorData.generalComment,
            learningOutcomes: moderatorData.learningOutcomes,
            courseContent: moderatorData.courseContent,
            degreeProgram: selectedDegreeProgram,
            courseCode: selectedCourseCode || "",
            courseName: selectedCourseName || "",
            examination: examination || "",
            agreeAndAddressed: moderatorData.agreeAndAddressed || "",
            notAgreeAndReasons: moderatorData.notAgreeAndReasons || ""
        }))
        setPdfRequest(true);

    }
    if (pdfRequest && formData) {
        return <PdfViewOfFeedBack {...formData} />
    }

    return (
        <div className="bg-white dark:bg-gray-900 w-full p-6 relative">
            <Breadcrumb pageName="Feedback" />
            <h1 className="text-center font-bold text-title-lg">
                Evaluation Form for Moderation of Examination Papers
                <br /> Department of Computer Science - University of Ruhuna
            </h1>
            <form
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md mx-4 md:mx-8 lg:mx-16 mt-6"
                method="post"
                onSubmit={hadleSubmit}
            >
                <div className="space-y-6">
                    {/* Degree Program */}
                    <div className="flex flex-col md:flex-row items-center">
                        <label htmlFor="degreeProgram" className="font-bold md:w-1/3 w-full mb-2 md:mb-0">
                            Degree Program
                        </label>
                        <select
                            id="degreeProgram"
                            name={selectedDegreeProgram}
                            value={selectedDegreeProgram}
                            className="w-full md:w-2/3 rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            onChange={handleDegreeName}
                        >
                            <option value="" disabled>
                                -- Select a degree --
                            </option>
                            {degreeName.map((degree) => (
                                <option key={degree.id} value={degree.name}>
                                    {degree.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Examination */}
                    <div className="flex flex-col md:flex-row items-center">
                        <label htmlFor="examination" className="font-bold md:w-1/3 w-full mb-2 md:mb-0">
                            Enter Examination Name
                        </label>
                        <input
                            id="examination"
                            name="examination"
                            type="text"
                            className="w-full md:w-2/3 h-10 border-2 border-gray-300 p-2 rounded-md"
                            placeholder="Examination"
                            onChange={(event) => setExamination(event.target.value)}
                        />
                    </div>

                    {/* Course Information */}
                    <div className="space-y-4">
                        <div className="font-bold">Course Information</div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Course Code */}
                            <div className="flex flex-col">
                                <label htmlFor="code" className="font-bold mb-1">
                                    Course Code
                                </label>
                                <select
                                    id="code"
                                    name="courseCode"
                                    className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                    onChange={(event) => handleCourseCode(event, "")}
                                >
                                    {courseData.map((course) => (
                                        <option key={course.id} value={course.code}>
                                            {course.code}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Title */}
                            <div className="flex flex-col">
                                <label htmlFor="title" className="font-bold mb-1">
                                    Course Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={selectedCourseName ? selectedCourseName : ""}
                                    disabled
                                    className="h-10 border-2 border-gray-300 p-2 rounded-md"
                                    placeholder={selectedCourseName}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Child Components */}
                    <PaperFeedbackQuestionTable getDataFromTable={handleQuestionsData} />
                    <PaperFeedbackSignEndTable getModerateData={handleModerateData} />
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