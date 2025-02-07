import { useEffect, useState} from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useApi from '../../api/api';


export default function CreateTimetable(){
    const [selectedExamination, setSelectedExamination] = useState<string>('');
    const {getExaminations,getDegreePrograms}=useApi();
    const [examData,setExamData]=useState([]);
    const [examNames,setExamNames]=useState<String[]>([]);
    const [DegreeName,setDegreeName]=useState<String[]>([]);

    useEffect(()=> {
      getExaminations().then(
        (response)=>{
          if(response.data.code==200){
            getDegreePrograms().then(
              (degreeResponse)=>{
                  console.log(degreeResponse);
              }   
            )
            setExamData(response.data.data);
           }
        }
      )
    },[])
    
    useEffect(()=>{
      // console.log(examData);
      examData.map((value)=>{
          // let name=value.
      })

    },[examData])

    return (
        <div className="mx-auto max-w-270">
            <Breadcrumb pageName="Create Timetable" />
  
         <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark max-w-270 mx-auto text-sm">
            <div className="grid ">
              <div className="mb-4.5 mx-5 mt-2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Academic Year
                </label>
                <select
                  value={selectedExamination}
                  onChange={(e) => setSelectedExamination(e.target.value)}
                  className="w-100 rounded border-[1.5px] border-stroke bg-gray py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary appearance-none"
                  required
                >
                  <option value="">Select Examination</option>

                  
                  
                </select>
              </div>
            </div>
        </div>
      </div>
    )
  }
  