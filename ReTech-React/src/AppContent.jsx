
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/AuthContext"; 

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

export default function AppContent() {
  const { loading, user } = useAuth();

  // Mientras verifica si hay sesión, mostramos un cargando limpio
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>Verificant sessió...</p>
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