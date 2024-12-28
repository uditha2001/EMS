import AuthService from "../../services/Auth-Service";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const AdminDashboard=() => {
  const { setAuth } = useAuth();
  const [status, setStatus] = useState<{ code?: number }>({});
  const navigate = useNavigate(); 
  const privateAxios = useAxiosPrivate();
 
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <h2>Admin Dashboard</h2>
       
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"></div>
    </>
  );
};

export default AdminDashboard;
