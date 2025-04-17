import useAxiosPrivate from "../hooks/useAxiosPrivate"
const useNotificationApi = () => {
    const axiosPrivate = useAxiosPrivate()
    const getNotifications=async()=>{
        return await axiosPrivate.get('/notifications');
    }
    const markAsRead=async(notificationId:number)=>{
        return await axiosPrivate.post('/notifications/readStatus', 
            notificationId,
          );    }
  return (
    {
        getNotifications,
        markAsRead

    }
  )
}

export default useNotificationApi