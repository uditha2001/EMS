import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useExamTimeTableApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAllExamTimeTables = async () => {
    return axiosPrivate.get('/exam-time-table/all');
  };

  const getExamTimeTableByExamination = async (examinationId: number) => {
    return axiosPrivate.get(`/exam-time-table/exam/${examinationId}`);
  };

  const saveExamTimeTable = async (examTimeTableData: any) => {
    console.log(examTimeTableData);
    return axiosPrivate.post('/exam-time-table/create', examTimeTableData);
  };

  const deleteExamTimeTable = async (id: number) => {
    return axiosPrivate.delete(`/exam-time-table/delete/${id}`);
  };

  const assignExamCenter = async (
    examTimeTableId: number,
    centerId: number,
  ) => {
    return axiosPrivate.post(
      `/exam-time-table/assign-center/${examTimeTableId}/${centerId}`,
    );
  };

  const assignInvigilator = async (
    examTimeTableId: number,
    invigilatorId: number,
  ) => {
    return axiosPrivate.post(
      `/exam-time-table/assign-invigilator/${examTimeTableId}/${invigilatorId}`,
    );
  };

  const assignSupervisor = async (
    examTimeTableId: number,
    supervisorId: number,
  ) => {
    return axiosPrivate.post(
      `/exam-time-table/assign-supervisor/${examTimeTableId}/${supervisorId}`,
    );
  };

  const getCourses = async (examinationId: number) => {
    return axiosPrivate.get(`/academic-years/${examinationId}/courses`);
  };

  return {
    getAllExamTimeTables,
    getExamTimeTableByExamination,
    saveExamTimeTable,
    deleteExamTimeTable,
    assignExamCenter,
    assignInvigilator,
    assignSupervisor,
    getCourses,
  };
};

export default useExamTimeTableApi;
