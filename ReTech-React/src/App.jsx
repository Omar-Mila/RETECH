import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"


import Home from "./front/pages/Home"
import Login from "./auth/Login"
import Register from "./auth/Register"
import Admin from "./admin/pages/Admin"
import RequireAdmin from "./auth/RequireAdmin"

export default function App() {

  return (

    <BrowserRouter>
  
      <AuthProvider>
  
        <Routes>
  
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin" element={
          
          <RequireAdmin>
          
              <Admin />
          
            </RequireAdmin>
          
          } />
        
        </Routes>
      
      </AuthProvider>
    
    </BrowserRouter>      
    
  )

}
