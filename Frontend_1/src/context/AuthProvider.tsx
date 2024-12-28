import { useState, createContext, ReactNode } from "react";

// Define the type for the auth state
type AuthState = {
    roles?: string[];
    accessToken?: string;
};

// Define the type for the context value
type AuthContextType = {
    auth: AuthState;
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // Initialize auth state with the proper type
    const [auth, setAuth] = useState<AuthState>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
