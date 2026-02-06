import { Routes, Route } from "react-router-dom"
import { useAuth } from "./auth/AuthContext"

import Home from "./front/pages/Home"
import Login from "./auth/Login"
import Register from "./auth/Register"
import Admin from "./admin/pages/Admin"
import RequireAdmin from "./auth/RequireAdmin"

export default function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return <div>Carregant...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />
    </Routes>
  )
}
