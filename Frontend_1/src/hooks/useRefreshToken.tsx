import { Axios } from '../common/Axios';
import UseAuth from './useAuth';

const UseRefreshToken = () => {
  const { setAuth } = UseAuth();

  const refresh = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      const accessToken = user["accesstoken"];

      if (!accessToken) {
        console.error("No access token found");
        return null;
      }

     // console.log("Old Access Token:", accessToken);

      const response = await Axios.post(
        `login/refresh-token`, 
        {}, // Empty request body if needed
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send old access token
          },
          withCredentials: true,
        }
      );

      const newAccessToken = response.data['accesstoken'];
      // Update localStorage and auth state
      const updatedUser = {
        ...user,
        accesstoken: newAccessToken,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setAuth((prev: any) => ({
        ...prev,
        roles: updatedUser["user"]["roles"],
        accessToken: newAccessToken,
      }));

      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error; // Optionally, propagate the error
    }
  };

  return refresh;
};

export default UseRefreshToken;
