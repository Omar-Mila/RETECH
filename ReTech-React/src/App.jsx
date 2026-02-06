import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import AppContent from "./AppContent"

export default function App() {

  return (

    <BrowserRouter>

      <AuthProvider>
    
        <AppContent />
    
      </AuthProvider>
    
    </BrowserRouter>     
    
  )

}
