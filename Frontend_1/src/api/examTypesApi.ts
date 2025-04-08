import useAxiosPrivate from "../hooks/useAxiosPrivate"
const useExamTypesApi = () => {
 const axiosPrivate = useAxiosPrivate();
 const getAllExamTypes = async () => {
    try {
      const response = await axiosPrivate.get('/examType/allExamTypes');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const getExamTypeById = async (examTypeId:number) => {
    try {
      const response = await axiosPrivate.get('/examType/examTypesById', {
        params: { examTypeId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const createExamType = async (examType:String) => {
    try {
      const response = await axiosPrivate.post('/examType/examTypes', null, {
        params: { examType }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const updateExamType = async (examTypeId:number, examType:string) => {
    try {
      const response = await axiosPrivate.put('/examType/examType', null, {
        params: { examTypeId, examType }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const deleteExamType = async (examTypeId:number) => {
    try {
      const response = await axiosPrivate.delete('/examType/deleteExamType', {
        params: { examTypeId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  
  
  
  
  return (
    {
        getAllExamTypes,
        getExamTypeById,
        createExamType,
        updateExamType,
        deleteExamType

    }
  )
}

export default useExamTypesApi