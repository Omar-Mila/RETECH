
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useLanguage } from "./front/context/LanguageContext";
import { getCurrentUser } from "./auth/authService";
import { syncGuestCartToServer } from "./services/guestCart";

import Home from "./front/pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Admin from "./admin/pages/Admin";
import RequireAdmin from "./auth/RequireAdmin";
import SearchResults from "./front/pages/SearchResults";
import CartCheckoutPage from "./front/pages/Carrito";
import UserProfile from "./front/pages/User/UserProfile";
import OrdersPage from "./front/pages/User/OrdersPage";
import ModelPage from "./front/pages/ModelPage";
import Contact from "./front/pages/Contact";
import VerificadoPage from "./front/pages/VerificadoPage";

export default function AppContent() {
  const { loading, user, setUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = async (e) => {
      if (e.key === 'retech-email-verified' && e.newValue !== null) {
        localStorage.removeItem('retech-email-verified');
        const fresh = await getCurrentUser();
        if (fresh) {
          setUser(fresh);
          await syncGuestCartToServer();
        }
        const returnUrl = sessionStorage.getItem('retech-return-url') || '/';
        sessionStorage.removeItem('retech-return-url');
        navigate(returnUrl);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>{t('appLoading')}</p>
      </div>
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
      <Route path="/carrito" element={<CartCheckoutPage />} />
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