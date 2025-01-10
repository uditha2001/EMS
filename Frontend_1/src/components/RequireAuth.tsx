import React from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useHasPermission from '../hooks/useHasPermission';

interface RequireAuthProps {
  allowedRoles?: string[]; // List of roles allowed to access this route
  allowedPermissions?: string[]; // List of permissions allowed to access this route
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  allowedRoles,
  allowedPermissions,
}) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Check if the user has one of the allowed roles (if roles are specified)
  const hasRoleAccess = allowedRoles?.length
    ? auth?.roles?.some((role) => allowedRoles.includes(role)) ?? false
    : true; // Allow access if no roles are specified

  // Check if the user has the required permissions (if provided)
  const hasPermissionAccess =
    allowedPermissions?.every((permission) => useHasPermission(permission)) ??
    true;

  if (!auth?.accessToken) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" replace state={{ from: location }} />;
  } else if (!hasRoleAccess || !hasPermissionAccess) {
    // Render a message for unauthorized access
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Unauthorized</h1>
        <p>You do not have access to view this page.</p>
        <p>
          Please contact the administrator if you believe this is an error, or{' '}
          <Link to="/login">log in with a different account</Link>.
        </p>
      </div>
    );
  }

  // Render child routes if the user is authenticated and has access
  return <Outlet />;
};

export default RequireAuth;
