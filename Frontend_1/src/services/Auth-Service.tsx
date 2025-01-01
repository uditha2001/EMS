import { Axios } from "../common/Axios";

class AuthService {
  static login(username: string, password: string) {
    return Axios.post(`login/authentication`, {
      username,
      password,
    }).then((response:any) => {
      if (response.data["accesstoken"]) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
      else{
        return null;
      }
    });
  }

  static logout(axiosInstance:any) {
    const user = localStorage.getItem("user");
    if (user) {
      const status = axiosInstance.post(`login/logout`);
      return status;
    }
    return Promise.resolve(null); // If no user is found, return null
  }

  static getCurrentUser() {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
}

export default AuthService;
