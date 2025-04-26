import useAxiosPrivate from "../hooks/useAxiosPrivate";
const useResultsApi = () => {
    const axiosPrivate=useAxiosPrivate();
    const saveMarkingResults = async (result: any, config = {}) => {
        try {
          const response = await axiosPrivate.post('result/saveMarking', result, {
            ...config,
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


      const getGradingResults = async (courseCode: string, ExaminationId: String) => {
          const response = await axiosPrivate.get('grading/grades', {
            params: { courseCode, ExaminationId },
          });
          return response; 
      }

      const saveFinalResults=async (publishedData:any)=>{
        try{
          const response=await axiosPrivate.post('result/saveFinalResults',publishedData);
          return response;
        }
        catch(error: any) {
          if (error.response) {
            return {
                error: true,
                status: error.response.status,
                message: error.response.data?.message || "Request failed",
            };
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
            
      }
      const getResultsReleaedCourses = async (degreeProgramId: number) => {
        return await axiosPrivate.get(`grading/publishedCourses`, {
          params: { degreeProgramId }
        });
      };
      
      const getResultsReleasedYears=async()=>{
        return await axiosPrivate.get('grading/resultsReleasedYears');
      }
      const getAllPublishedResultsWithProgramId=async(degreeProgramId: number)=>{
        return await axiosPrivate.get(`grading/allCourseWithAllYears`, {
          params: { degreeProgramId }
        });      }

        const getAllPublishedResultsWithCourse = async (degreeProgramId: number, courseCode: string) => {
          return axiosPrivate.get(`grading/allResultsWithCourse`, {
              params: { degreeProgramId, courseCode }
          });
        };
        
        const getAllPublishedResultsWithCourseAndYear = async (degreeProgramId: number, courseCode: string, year: string) => {
          return axiosPrivate.get(`grading/allResultsWithCourseAndYear`, {
              params: { degreeProgramId, courseCode, year }
          });
        };
        const getPublishedResultsByProgramAndYear = async (
          degreeProgramId: number,
          year: string
        ) => {
          return axiosPrivate.get(`grading/resultsByProgramAndYear`, {
            params: { degreeProgramId, year }
          });
        };
        
     
        

  return {
    saveMarkingResults,
    getFirstMarkingResults,
    saveChangeMarksConditions,
    getGradingResults,
    saveFinalResults,
    getResultsReleaedCourses,
    getResultsReleasedYears,
    getAllPublishedResultsWithProgramId,
    getAllPublishedResultsWithCourse,
    getAllPublishedResultsWithCourseAndYear,
    getPublishedResultsByProgramAndYear,
    }
}

export default useResultsApi