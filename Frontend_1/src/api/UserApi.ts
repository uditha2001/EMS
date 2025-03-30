import useAxiosPrivate from "../hooks/useAxiosPrivate"

const UserApi = () => {
    const axiosPrivate=useAxiosPrivate();
    const confirmUser = async (password: string) => {
        try {
            const response = await axiosPrivate.get("/user/confirm", {
                params: { password: password }
            });
            return response;
        } catch (error: any) {    
          if (error.response) {
            return {
                error: true,
                status: error.response.status,
                message: error.response.data?.message || "Request failed",
            };
        }
        else if (error.request) {
            return {
                error: true,
                status: 500,
                message: "No response from server. Check your connection.",
            };
        }
        }
    };
    
  return {
    confirmUser
  }
  
}

export default UserApi