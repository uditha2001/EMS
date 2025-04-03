import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useDashboardApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getSystemPerformance = async () => {
    return axiosPrivate.get('/system-performance');
  };

  return {
    getSystemPerformance,
  };
};
export default useDashboardApi;
