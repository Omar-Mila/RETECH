
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAutenticacion } from "./auth/AuthContext";
import { useIdioma } from "./front/context/LanguageContext";
import { obtenerUsuarioActual } from "./auth/authService";
import { sincronizarCarritoServidor } from "./services/guestCart";

import Home from "./front/pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Admin from "./admin/pages/Admin";
import RequireAdmin from "./auth/RequireAdmin";
import SearchResults from "./front/pages/SearchResults";
import PaginaCarrito from "./front/pages/Carrito";
import UserProfile from "./front/pages/User/UserProfile";
import OrdersPage from "./front/pages/User/OrdersPage";
import ModelPage from "./front/pages/ModelPage";
import Contact from "./front/pages/Contact";
import VerificadoPage from "./front/pages/VerificadoPage";

export default function AppContent() {
  const { loading, user, setUser } = useAutenticacion();
  const { t } = useIdioma();
  const navegar = useNavigate();

  useEffect(() => {
    const manejarAlmacenamiento = async (e) => {
      if (e.key === 'retech-email-verified' && e.newValue !== null) {
        localStorage.removeItem('retech-email-verified');
        const usuarioActual = await obtenerUsuarioActual();
        if (usuarioActual) {
          setUser(usuarioActual);
          await sincronizarCarritoServidor();
        }
        const urlRetorno = sessionStorage.getItem('retech-return-url') || '/';
        sessionStorage.removeItem('retech-return-url');
        navegar(urlRetorno);
      }
    };
    window.addEventListener('storage', manejarAlmacenamiento);
    return () => window.removeEventListener('storage', manejarAlmacenamiento);
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          #cargando {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: sans-serif;
          }
        `}</style>
        <div id="cargando">
          <p>{t('appLoading')}</p>
        </div>
      </>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/perfil" element={user ? <UserProfile /> : <Login />} />
      <Route path="/mis-pedidos" element={user ? <OrdersPage /> : <Login />} />

      <Route path="/search" element={<SearchResults />} />
      <Route path="/carrito" element={<PaginaCarrito />} />
      <Route path="/models/:id" element={<ModelPage />} />

      <Route path="/contact" element={<Contact />} />
      <Route path="/verificado" element={<VerificadoPage />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}
