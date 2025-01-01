import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[]; // List of roles allowed to access this route
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { auth } = useAuth();

  // Check if the user is logged in and has one of the allowed roles
  const hasAccess =
    auth?.accessToken && (auth?.roles as string[]).some((role) => allowedRoles.includes(role));

  if (!auth?.accessToken) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" replace />;
  } else if (!hasAccess) {
    // Redirect to an unauthorized page if the user's role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // Render child routes if the user is authenticated and has access
  return <Outlet />;
};

export default RequireAuth;
