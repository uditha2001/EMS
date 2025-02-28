import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useExamCenterApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAllExamCenters = async () => {
    return axiosPrivate.get('/exam-centers');
  };

  const getExamCenterById = async (id: number) => {
    return axiosPrivate.get(`/exam-centers/${id}`);
  };

  const saveExamCenter = async (examCenterData: any) => {
    return axiosPrivate.post('/exam-centers', examCenterData);
  };

  const updateExamCenter = async (id: number, examCenterData: any) => {
    return axiosPrivate.put(`/exam-centers/${id}`, examCenterData);
  };

  const deleteExamCenter = async (id: number) => {
    return axiosPrivate.delete(`/exam-centers/${id}`);
  };

  return {
    getAllExamCenters,
    getExamCenterById,
    saveExamCenter,
    updateExamCenter,
    deleteExamCenter,
  };
};

export default useExamCenterApi;
