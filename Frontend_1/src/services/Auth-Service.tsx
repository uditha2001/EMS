import { Axios } from "../common/Axios";

class AuthService {
    static login(username: string, password: string) {
        return Axios.post(`login/authentication`, {
            username,
            password,
        }).then((response) => {
            if (response.data["accesstoken"]) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    static logout() {
        localStorage.removeItem("user");
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
