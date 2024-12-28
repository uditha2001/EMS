import { useEffect } from 'react';
import { Axios } from '../common/axios';
import UseAuth from './useAuth';

const UseRefreshToken = () => {
  const { auth, setAuth } = UseAuth();
  const refresh = () => {
    // Retrieve the user object from localStorage
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const accessToken = user["accesstoken"];

    // Check if accessToken exists
    if (!accessToken) {
      console.error("No access token found");
      return Promise.reject("No access token found");
    }

    // Make the API request to refresh the token
    return Axios.post(
      `login/refresh-token`,
      {}, // Empty request body if needed
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send old access token
        },
        withCredentials: true,
      }
    )
      .then((response) => {
        const newAccessToken = response.data['accesstoken'];

        // Update localStorage with the new token
        const updatedUser = {
          ...user,
          accesstoken: newAccessToken,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update the auth state with new token and roles
        setAuth(
          {
            roles: response.data?.user?.roles || [], // Extract roles from response
            accessToken: newAccessToken,
          }
        );

        // Return the new access token
        return newAccessToken;
      })
      .catch((error) => {
        console.error("Error refreshing token:", error);
        throw error; // Optionally, propagate the error
      });
  };

  return refresh;
};

export default UseRefreshToken;
