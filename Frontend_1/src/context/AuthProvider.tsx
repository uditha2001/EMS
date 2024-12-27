import { useState, createContext, useContext, ReactNode } from "react";

// Define the type for the context value
interface AuthContextType {
    auth: Record<string, unknown>;
    setAuth: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<Record<string, unknown>>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;
