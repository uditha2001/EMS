import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useDegreeApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAllDegreePrograms = async () => {
    return axiosPrivate.get('/degreePrograms');
};

const getDegreeProgramById = async (id: number) => {
    return axiosPrivate.get(`/degreePrograms/${id}`);
};

const saveDegreeProgram = async (degreeData: any) => {
    return axiosPrivate.post('/degreePrograms', degreeData);
};

const updateDegreeProgram = async (id: number, degreeData: any) => {
    return axiosPrivate.put(`/degreePrograms/${id}`, degreeData);
};

const deleteDegreeProgram = async (id: number) => {
    return axiosPrivate.delete(`/degreePrograms/${id}`);
};

  return {
    getAllDegreePrograms,
    getDegreeProgramById,
    saveDegreeProgram,
    updateDegreeProgram,
    deleteDegreeProgram,
   
  };
};
export default useDegreeApi;
