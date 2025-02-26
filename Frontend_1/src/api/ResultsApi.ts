import useAxiosPrivate from "../hooks/useAxiosPrivate";
const useResultsApi = () => {
    const axiosPrivate=useAxiosPrivate();
    const saveMarkingResults = async (result: any, config = {}) => {
        try {
          const response = await axiosPrivate.post('result/firstMarking', result, {
            ...config,
          });
          console.log(response.data);
          return response.data;
        } catch (error: any) {
          if (error.response) {
            return { error: true, status: 500, message: error.response.data };
          } else if (error.request) {
            return {
              error: true,
              status: 500,
              message: 'No response received from the server',
            };
          } else {
            return { error: true, status: 500, message: error.message };
          }
        }
      };

    const getFirstMarkingResults = async (

        id: number|undefined,
        courseCode: string,
        examType: string,
      ) => {
        try {
          const response = await axiosPrivate.get('result/getFirstMarking', {
            params: { id, courseCode, examType },
          });
          return response.data;
        } catch (error: any) {
          if (error.response) {
            return { error: true, status: 500, message: error.response.data };
          } else if (error.request) {
            return {
              error: true,
              status: 500,
              message: 'No response received from the server',
            };
          } else {
            return { error: true, status: 500, message: error.message };
          }
        }
      };
    const saveChangeMarksConditions=async (conditions:any)=>{
       try{
        const response=await axiosPrivate.post('grading/changedMarksPercentages',conditions);
        return response.data;
       }

       catch (error: any) {
        if (error.response) {
          return { error: true, status: 500, message: error.response.data };
        } else if (error.request) {
          return {
            error: true,
            status: 500,
            message: 'No response received from the server',
          };
        } else {
          return { error: true, status: 500, message: error.message };
        }
      }    }


      

  return {
    saveMarkingResults,
    getFirstMarkingResults,
    saveChangeMarksConditions
    }
}

export default useResultsApi