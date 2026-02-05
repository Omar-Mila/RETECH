import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, logoutRequest } from "./authService"


const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate(); //canal global

    const [user, setUser] = useState(null); //guarda l’estat de l’usuari

    const login = async (email, password) => {
        const userData = await loginRequest(email, password);
        setUser(userData);

        if (userData.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
    }

    const logout = () => {
        setUser(null);
        navigate("/");
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}