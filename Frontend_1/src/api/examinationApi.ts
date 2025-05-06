import useAxiosPrivate from "../hooks/useAxiosPrivate";
const useExaminationApi = () => {
    const axiosPrivate = useAxiosPrivate();
    const getFirstMarkerAssignedExaminations = async () => {
        try {
            const response = await axiosPrivate.get('role-assignments/FirstMarkingexaminations');
            if (response.data.code === 200) {
                return response.data.data;
              }
        } catch (error: any) {
            if (error.response) {
                return { error: true, status: 500, message: error.response.data };
            } else if (error.request) {
                return {
                    error: true,
                    status: 500,    
                    message: 'No response received from the server',
                };
            }
            else {
                return { error: true, status: 500, message: error.message };
            }
        }
    }
    const getSecondMarkerAssignedExaminations = async () => {
        try {
            const response = await axiosPrivate.get('role-assignments/secondMarkingexaminations');
            if (response.data.code === 200) {
                return response.data.data;
              }
        } catch (error: any) {
            if (error.response) {
                return { error: true, status: 500, message: error.response.data };
            } else if (error.request) {
                return {
                    error: true,
                    status: 500,    
                    message: 'No response received from the server',
                };
            }
            else {
                return { error: true, status: 500, message: error.message };
            }
        }
    }
    const getAllOngoingExams = async () => {
        return await axiosPrivate.get('result/onGoingExams');
     }
     


  return (
    {
        getFirstMarkerAssignedExaminations,
        getSecondMarkerAssignedExaminations,
        getAllOngoingExams
    }
  )
}

export default useExaminationApi