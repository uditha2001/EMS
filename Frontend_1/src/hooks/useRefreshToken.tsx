import { useNavigate } from 'react-router-dom';
import { Axios } from '../common/Axios';
import UseAuth from './useAuth';

const UseRefreshToken = () => {
  const navigate = useNavigate();
  const { setAuth } = UseAuth();

  const refresh = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = user?.accesstoken;
  
    if (!accessToken) {
      console.error('No access token found.');
      navigate('/login');
      return Promise.reject('No access token found.');
    }
  
    try {
      const { data } = await Axios.post(
        `login/refresh-token`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
  
      const newAccessToken = data?.accesstoken;
  
      if (!newAccessToken) throw new Error('Invalid access token.');
  
      // Update localStorage and auth state
      const updatedUser = { ...user, accesstoken: newAccessToken };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuth((prev) => ({
        ...prev,
        ...data.user,
        roles: data.user?.roles || [],
        accessToken: newAccessToken,
      }));
      console.log(data.user);
      return newAccessToken;
    } catch {
      console.error('Error refreshing token.');
      localStorage.removeItem('user');
      setAuth({ roles: [], accessToken: '' });
      navigate('/login');
      return Promise.reject('Error refreshing token.');
    }
  };
  
  return refresh;
  
};

export default UseRefreshToken;
