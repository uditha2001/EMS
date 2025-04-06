import { createContext, useState, useEffect, ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/useRefreshToken';
import { Axios } from '../common/Axios';

type PermissionsState = {
  permissions: string[];
  loading: boolean;
  error: string | null;
};

type PermissionsContextType = {
  permissionsState: PermissionsState;
  fetchPermissions: () => Promise<void>;
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { auth } = useAuth();
  const refreshToken = useRefreshToken();
  const [permissionsState, setPermissionsState] = useState<PermissionsState>({
    permissions: [],
    loading: false,
    error: null,
  });

  const fetchPermissions = async () => {
    const roles = Array.isArray(auth?.roles) ? auth.roles : [];
    if (!auth?.accessToken || !roles.length) {
      console.warn('No access token or roles available to fetch permissions.');
      return;
    }

    setPermissionsState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Updated request to send an array of roles
      const { data: permissions } = await Axios.post(
        `/roles/permissions`,
        roles, // Directly pass the roles array
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        },
      );

      setPermissionsState({
        permissions, // Store the array of permissions
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'An error occurred';

      console.error('Error fetching permissions:', errorMessage);

      if (error.response?.status === 401) {
        console.error('Unauthorized: Token may be expired or invalid.');

        // Handle token refresh logic here
        try {
          await refreshToken(); // Fetch a new access token
          fetchPermissions(); // Retry the request with the new token
        } catch (err) {
          console.warn('Failed to refresh token or unauthorized.');
        }
      }

      setPermissionsState({
        permissions: [],
        loading: false,
        error: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (auth?.accessToken && Array.isArray(auth?.roles) && auth.roles.length) {
      fetchPermissions();
    }
  }, [auth?.accessToken, auth?.roles]);

  return (
    <PermissionsContext.Provider value={{ permissionsState, fetchPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext;
