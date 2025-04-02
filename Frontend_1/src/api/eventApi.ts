import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useEventApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const getPublicEvents = async () => {
    return axiosPrivate.get('/events/public');
  };

  const getEventByUserId = async (userId: number) => {
    return axiosPrivate.get(`/events/user/${userId}`);
  };

  const saveEvent = async (eventData: any) => {
    return axiosPrivate.post('/events', eventData);
  };

  const updateEvent = async (id: number, eventData: any) => {
    return axiosPrivate.put(`/events/${id}`, eventData);
  };

  const deleteEvent = async (id: number) => {
    return axiosPrivate.delete(`/events/${id}`);
  };

  return {
    getPublicEvents,
    getEventByUserId,
    saveEvent,
    updateEvent,
    deleteEvent,
  };
};
export default useEventApi;
