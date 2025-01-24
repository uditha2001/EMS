import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UseRefreshToken from '../hooks/useRefreshToken';
import UseAuth from '../hooks/useAuth';
import Loader from '../common/Loader';

const PersistLogin = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { auth } = UseAuth();
  const refreshToken = UseRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    !auth.accessToken ? verifyRefreshToken() : setLoading(false);
  }, []);

  return <>{loading ? <Loader /> : <Outlet />}</>;
};
export default PersistLogin;
