import { useState, useEffect } from "react";
import useApi from "../../api/api";

type examinationName = {
    key: number;
    name: string;
}
type courseData = {
    id: number,
    code: string,
    name: string,
    description: string,
    level: string,
    semester: string,
    isActive: boolean,
    courseType: string,
    degreeProgramId: string,
};

type requiredData = {
    courseCode: string;
    examName: string;
    examType: string
    
}
const SelectExaminationComponent = ({ getExamData }: { getExamData: React.Dispatch<React.SetStateAction<requiredData>> }) => {
    const [examOptionIdentifier, setExamOptionIdentifier] = useState<string>("");
    const [examName, setExamName] = useState<string>("");
    const [createdExamNames, setCreatedExamNames] = useState<examinationName[]>([]);
    const [selectedExaminationKey, setSelectedExaminationKey] = useState<number>();
    const [courseCode, setCourseCode] = useState<string>("");
    const [examinationCourseCode, setExaminationCourseCode] = useState<courseData[]>([]);
    const [examType, setExamType] = useState<string>("THEORY");
    const examTypes = ['THEORY', 'PRACTICAL', 'CA', 'PROJECT'];
    const { getAllExaminationDetailsWithDegreeName, getCoursesUsingExaminationId } = useApi();

    useEffect(() => {
        getExamData(
            {
                courseCode:courseCode,
                examName:examName,
                examType:examType
            }
        )
    },[courseCode,examType])

    useEffect(() => {
        getAllExaminationDetailsWithDegreeName().then((response) => {
            let examData: examinationName[] = [];
            let i = 0;
            for (const obj of response) {
                let examName = `${obj["year"]}-${obj["degreeName"]}-Level ${obj["level"]}-Semester ${obj["semester"]}`;
                examData.push(({ key: obj["id"], name: examName }));
                i++;
            }
            setCreatedExamNames(examData);

        });



    }, []);

    useEffect(() => {
        if (examinationCourseCode != null && examOptionIdentifier != "" && examinationCourseCode[0] != undefined) {
            setCourseCode(examinationCourseCode[0].code);
        }

    }, [examinationCourseCode])

    useEffect(() => {
        if (examName != "" && examName != null) {
            getCoursesUsingExaminationId(selectedExaminationKey).then((data) => {
                setExaminationCourseCode(data);
            })
        }

    }, [examName])

    return (
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 w-full max-w-6xl dark:bg-gray-800 dark:shadow-gray-700/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-gray-300">
                <span className="bg-blue-100 p-2 rounded-lg mr-2 dark:bg-blue-900/30">⚙️</span>
                Exam Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Exam Name</label>
                    <select
                        value={examOptionIdentifier}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black-2 dark:focus:ring-blue-500/50"
                        onChange={(e) => {
                            setExamOptionIdentifier(e.target.value);
                            const selectedIndex = parseInt(e.target.value, 10);
                            setExamName(createdExamNames[selectedIndex].name);
                            setSelectedExaminationKey(createdExamNames[selectedIndex].key);
                        }}
                    >
                        <option value="" disabled>
                            -- Select the exam Name --
                        </option>
                        {createdExamNames &&
                            createdExamNames.map((examName1, index) => (
                                <option key={index} value={index}>
                                    {examName1.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Course Code</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black-2 dark:focus:ring-blue-500/50"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                    >
                        {examinationCourseCode &&
                            examinationCourseCode.map((course, index) => (
                                <option key={index} value={course.code}>
                                    {course.code}
                                </option>
                            ))}                                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Exam Type</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black-2 dark:focus:ring-blue-500/50"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                    >
                        {
                            examTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))
                        }                                    </select>
                </div>
            </div>
        </div>)
}

export default SelectExaminationComponent