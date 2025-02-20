import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useCourseApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAllCourses = async () => {
    return axiosPrivate.get('/courses');
  };

  const getCourseById = async (id: number) => {
    return axiosPrivate.get(`/courses/${id}`);
  };

  const saveCourse = async (courseData: any) => {
    return axiosPrivate.post('/courses', courseData);
  };

  const updateCourse = async (id: number, courseData: any) => {
    return axiosPrivate.put(`/courses/${id}`, courseData);
  };

  const deleteCourse = async (id: number) => {
    return axiosPrivate.delete(`/courses/${id}`);
  };

  return {
    getAllCourses,
    getCourseById,
    saveCourse,
    updateCourse,
    deleteCourse,
  };
};
export default useCourseApi;
