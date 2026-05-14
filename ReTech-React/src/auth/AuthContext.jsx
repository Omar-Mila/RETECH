import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, logoutRequest, getCurrentUser, googleLoginRequest } from "./authService"
import { syncGuestCartToServer } from "../services/guestCart"

let AuthContext = createContext()

export function AuthProvider({ children }) {
  let navigate = useNavigate()

  let [user, setUser] = useState(null)
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    let loadUser = async () => {
      try {
        let userData = await getCurrentUser()
        if (userData && (userData.id || userData.name)) {
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error cargando usuario:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const redirectByRole = (userData, from) => {
    if (userData.role === 'admin') {
      navigate("/admin");
    } else {
      navigate(from || "/");
    }
  };

  let login = async (email, password, from) => {
    try {
      const userData = await loginRequest(email, password);
      if (userData) {
        setUser(userData);
        await syncGuestCartToServer();
        redirectByRole(userData, from);
      }
    } catch (error) {
      throw error;
    }
  };

  let loginWithGoogle = async (credential, from) => {
    try {
      const userData = await googleLoginRequest(credential);
      if (userData) {
        setUser(userData);
        await syncGuestCartToServer();
        redirectByRole(userData, from);
      }
    } catch (error) {
      throw error;
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
        setUser,
        loading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
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
