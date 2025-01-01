import { useState, useEffect, createContext, ReactNode } from 'react';
import { privateAxios } from '../common/Axios';

// Define the type for the auth state
type AuthState = {
  id?: string;
  firstName?: string;
  username?: string;
  roles?: string[];
  accessToken?: string;
};

// Define the type for permissions
type Permission = {
  permissionName?: string;
  permissionId?: number;
};

// Define the type for the context value
type AuthContextType = {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  permissions: Permission[];
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize auth state with default values
  const [auth, setAuth] = useState<AuthState>({ accessToken: '' });
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await privateAxios.get('/permissions');
        if (response?.data?.permissions) {
          setPermissions(response.data.permissions);
        }
      } catch (err) {
        console.error('Failed to fetch permissions', err);
      }
    };

    if (auth.accessToken) {
      fetchPermissions();
    }
  }, [auth.accessToken]);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, permissions, setPermissions }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
