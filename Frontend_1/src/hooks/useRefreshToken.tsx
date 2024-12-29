import { useNavigate } from 'react-router-dom';
import { Axios } from '../common/Axios';
import UseAuth from './useAuth';

const UseRefreshToken = () => {
  const navigate = useNavigate();
  const { setAuth } = UseAuth();

  const refresh = async () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const accessToken = user?.accesstoken;

    if (!accessToken) {
      console.error("No access token found.");
      navigate('/login');
      return Promise.reject("No access token found.");
    }

    try {
      const response = await Axios.post(
        `login/refresh-token`,
        {}, // Empty request body if needed
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      console.log("Token refreshed successfully.");
      const newAccessToken = response.data?.accesstoken;

      if (!newAccessToken) {
        console.error("New access token is null or undefined.");
        navigate('/login');
        return Promise.reject("Invalid access token.");
      }

      // Update localStorage with the new token
      const updatedUser = { ...user, accesstoken: newAccessToken };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the auth state with the new token and roles
      setAuth({
        roles: response.data?.user?.roles || [],
        accessToken: newAccessToken,
      });

      return newAccessToken; // Return the new access token
    } catch (error) {
      console.error("Error refreshing token:");
      // Clear invalid user data and redirect to login
      localStorage.removeItem("user");
      setAuth({});
      navigate('/login');
      return Promise.reject("Error refreshing token.");}
  };

  return refresh;
};

export default UseRefreshToken;
