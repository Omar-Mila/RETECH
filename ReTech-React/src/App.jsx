import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./auth/AuthContext"
import { LanguageProvider } from "./front/context/LanguageContext"
import AppContent from "./AppContent"

export default function App() {

  return (

    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>

  )

}
