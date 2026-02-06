import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function RequireAdmin({ children }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return null
  if (!isAuthenticated || user?.role !== "admin") return <Navigate to="/" />

  return children
}