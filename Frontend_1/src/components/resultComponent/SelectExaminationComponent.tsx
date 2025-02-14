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
type examTypeData={
    id:number;
    name:string
}
const SelectExaminationComponent = ({ getExamData }: { getExamData: React.Dispatch<React.SetStateAction<requiredData>> }) => {
    const [examOptionIdentifier, setExamOptionIdentifier] = useState<string>("");
    const [examName, setExamName] = useState<string>("");
    const [createdExamNames, setCreatedExamNames] = useState<examinationName[]>([]);
    const [selectedExaminationKey, setSelectedExaminationKey] = useState<number>();
    const [courseCode, setCourseCode] = useState<string>("");
    const [examinationCourseCode, setExaminationCourseCode] = useState<courseData[]>([]);
    const [examType, setExamType] = useState<string>("THEORY");
    const [examTypes,setExamTypes]=useState<examTypeData[]>([]);
    const { getAllExaminationDetailsWithDegreeName, getCoursesUsingExaminationId ,getExamTypes} = useApi();

    useEffect(() => {
        getExamData(
            {
                courseCode: courseCode,
                examName: examName,
                examType: examType
            }
        )
    }, [courseCode, examType, examName])

    useEffect(() => {
        getAllExaminationDetailsWithDegreeName().then((response) => {
            let examData: examinationName[] = [];
            let i = 0;
            for (const obj of response) {
                let examName = `${obj["year"]}-${obj["degreeProgramName"]}-Level ${obj["level"]}-Semester ${obj["semester"]}`;
                examData.push(({ key: obj["id"], name: examName }));
                i++;
            }
            setCreatedExamNames(examData);

        });

        getExamTypes().then((response)=>{
            setExamTypes(response.data);
        })
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
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto">

            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Exam Configuration
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Exam Name</label>
                    <select
                        value={examOptionIdentifier}
                        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                        className="w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                    >
                        {
                            examTypes.map((type, index) => (
                                <option key={index}>
                                    {type.name}
                                </option>
                            ))
                        }                                    </select>
                </div>
            </div>
        </div>)
}

export default SelectExaminationComponent