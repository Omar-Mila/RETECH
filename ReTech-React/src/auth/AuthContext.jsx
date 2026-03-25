import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, logoutRequest, getCurrentUser } from "./authService"

let AuthContext = createContext()

export function AuthProvider({ children }) {
  let navigate = useNavigate()

  let [user, setUser] = useState(null)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    let loadUser = async () => {
      try {
        let userData = await getCurrentUser()
        console.log("Respuesta de getCurrentUser:", userData)
        
        // Ajustamos la validación: si userData tiene id o name, es que está logueado
        if (userData && (userData.id || userData.name)) {
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error cargando usuario:", error)
        setUser(null)
      } finally {
        setLoading(false) // Esto SIEMPRE se ejecuta ahora
      }
    }

    loadUser()
  }, [])

  let login = async (email, password) => {
    try {
      const userData = await loginRequest(email, password);
      
      if (userData) {
        setUser(userData); 
        
        console.log("Login con éxito, usuario:", userData);

        if (userData.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      alert("Error de login: " + error.message);
    }
  };

  let logout = async () => {
    try {
      await logoutRequest(); 
    } catch (error) {
      console.error("Error en servidor", error);
    } finally {
      setUser(null);
      
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }

      window.location.replace("/"); 
    }
  }

  // IMPORTANTE: El "return" de carga va justo antes del Provider, 
  // permitiendo que los hooks de arriba se ejecuten.
  if (loading) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <p>Verificando sesión...</p>
          </div>
      );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}