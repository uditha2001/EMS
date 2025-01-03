import { Axios } from "../common/Axios";

class AuthService {
  static login(username: string, password: string) {
    try{
      const response= Axios.post(`login/authentication`, {
        username,
        password,
      })
      console.log("hiii")
      return response;
    }
    catch(error){
      return null;
    }
    
    
  }

  static logout(axiosInstance:any) {
    const user = localStorage.getItem("user");
    if (user) {
      const status = axiosInstance.post(`login/logout`);
      return status;
    }
    return Promise.resolve(null); // If no user is found, return null
  }

}

export default AuthService;
