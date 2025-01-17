import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import UseRefreshToken from "../hooks/useRefreshToken";
import UseAuth from "../hooks/useAuth";

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
                }
            finally {
                setLoading(false);
            }
        };
        !auth.accessToken ? verifyRefreshToken() : setLoading(false);
        
    }, []);
        
    
   return (
    <>
    {loading ? (
        <div>Loading...</div>
    ) : (
        <Outlet />
    )}
    </>
   )
};
export default PersistLogin;