import { createContext, useState, useEffect, ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

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
      const { data: permissions } = await axios.post(
        `http://localhost:8080/api/v1/roles/permissions`,
        roles, // Directly pass the roles array
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        },
      );

      console.log('Permissions fetched successfully:', permissions);

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
        // Add token refresh logic here, if needed
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
