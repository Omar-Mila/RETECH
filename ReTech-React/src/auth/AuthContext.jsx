import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, logoutRequest, getCurrentUser } from "./authService"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        const userData = await getCurrentUser()

        // ✅ normalització forta
        if (userData && userData.name) {
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [])

  const login = async (email, password) => {
    const userData = await loginRequest(email, password)
    setUser(userData)

    if (userData?.role === "admin") {
      navigate("/admin")
    } else {
      navigate("/")
    }
  }

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    navigate("/");
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
