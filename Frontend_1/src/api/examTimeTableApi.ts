import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useExamTimeTableApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getExamTimeTableByExamination = async (examinationId: number) => {
    return axiosPrivate.get(`/exam-time-table/exam/${examinationId}`);
  };

  const getExamTimeTableByExaminationWithResources = async (
    examinationId: number,
  ) => {
    return axiosPrivate.get(
      `/exam-time-table/exam/${examinationId}/with-resources`,
    );
  };

  const getExamTimeTableByExaminationsWithResources = async (
    examinationIds: any,
  ) => {
    return axiosPrivate.post(
      `/exam-time-table/exam/with-resources`,
      examinationIds,
    );
  };

  const saveExamTimeTable = async (examTimeTableData: any) => {
    console.log(examTimeTableData);
    return axiosPrivate.post('/exam-time-table/create', examTimeTableData);
  };

  const deleteExamTimeTable = async (id: number) => {
    return axiosPrivate.delete(`/exam-time-table/delete/${id}`);
  };

  const getCourses = async (examinationId: number) => {
    return axiosPrivate.get(`/academic-years/${examinationId}/courses`);
  };

  const approveTimetable = async (examinationId: number) => {
    return axiosPrivate.post(`/exam-time-table/approve/${examinationId}`);
  };

  // Allocate or update exam centers
  const allocateExamCenters = async (allocationData: any) => {
    return axiosPrivate.post(
      '/exam-time-table/allocate-exam-centers',
      allocationData,
    );
  };

  // Assign or update supervisors
  const assignSupervisors = async (supervisorData: any) => {
    return axiosPrivate.post(
      '/exam-time-table/assign-supervisors',
      supervisorData,
    );
  };

  // Assign or update invigilators
  const assignInvigilators = async (invigilatorData: any) => {
    return axiosPrivate.post(
      '/exam-time-table/assign-invigilators',
      invigilatorData,
    );
  };

  // Remove an invigilator
  const removeInvigilator = async (invigilatorId: number) => {
    return axiosPrivate.delete(`/exam-time-table/invigilator/${invigilatorId}`);
  };

  // Remove an exam center
  const removeExamCenter = async (examCenterId: number) => {
    return axiosPrivate.delete(`/exam-time-table/center/${examCenterId}`);
  };

  const checkConflicts = async (examinationIds: any) => {
    return axiosPrivate.post(
      '/exam-time-table/check-conflicts',
      examinationIds,
    );
  };

  const getSynchronizedTimetable = async (examinationIds: any) => {
    return axiosPrivate.post('/exam-time-table/synchronize', examinationIds);
  };

  const getOnGoingExaminations = async () => {
    return axiosPrivate.get('/academic-years/with-timetable');
  };

  return {
    getExamTimeTableByExamination,
    saveExamTimeTable,
    deleteExamTimeTable,
    getCourses,
    allocateExamCenters,
    assignSupervisors,
    assignInvigilators,
    getExamTimeTableByExaminationWithResources,
    removeInvigilator,
    removeExamCenter,
    checkConflicts,
    getSynchronizedTimetable,
    getExamTimeTableByExaminationsWithResources,
    approveTimetable,
    getOnGoingExaminations,
  };
};

export default useExamTimeTableApi;
