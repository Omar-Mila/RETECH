import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function RequireAdmin({ children }) {

    const { user, isAuthenticated } = useAuth();

    // Si no esta autenticat o no ws admin, redirigeix a la pagina d’inici
    if (!isAuthenticated || user.role !== "admin") return <Navigate to="/" />;
    
    return children;

}