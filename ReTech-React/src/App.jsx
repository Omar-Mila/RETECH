import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProveedorAuth } from "./auth/AuthContext"
import { ProveedorIdioma } from "./front/context/LanguageContext"
import ContenidoApp from "./AppContent"

export default function App() {

  return (

    <BrowserRouter>
      <ProveedorIdioma>
        <ProveedorAuth>
          <ContenidoApp />
        </ProveedorAuth>
      </ProveedorIdioma>
    </BrowserRouter>

  )

}
