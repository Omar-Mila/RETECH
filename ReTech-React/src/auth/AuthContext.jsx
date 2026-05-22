import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { solicitarLogin, solicitarLogout, obtenerUsuarioActual, solicitarLoginGoogle } from "./authService"
import { sincronizarCarritoServidor } from "../services/guestCart"

let ContextoAuth = createContext()

export function ProveedorAuth({ children }) {
  let navegar = useNavigate()

  let [usuario, fijarUsuario] = useState(null)
  let [cargando, fijarCargando] = useState(true)

  useEffect(() => {
    let cargarUsuario = async () => {
      try {
        let datosUsuario = await obtenerUsuarioActual()
        if (datosUsuario && (datosUsuario.id || datosUsuario.name)) {
          fijarUsuario(datosUsuario)
        } else {
          fijarUsuario(null)
        }
      } catch (error) {
        console.error("Error cargando usuario:", error)
        fijarUsuario(null)
      } finally {
        fijarCargando(false)
      }
    }

    cargarUsuario()
  }, [])

  const redirigirPorRol = (datosUsuario, from) => {
    if (datosUsuario.role === 'admin') {
      navegar("/admin");
    } else {
      navegar(from || "/");
    }
  };

  let iniciarSesion = async (email, password, from) => {
    try {
      const datosUsuario = await solicitarLogin(email, password);
      if (datosUsuario) {
        fijarUsuario(datosUsuario);
        await sincronizarCarritoServidor();
        redirigirPorRol(datosUsuario, from);
      }
    } catch (error) {
      throw error;
    }
  };

  let iniciarConGoogle = async (credencial, from) => {
    try {
      const datosUsuario = await solicitarLoginGoogle(credencial);
      if (datosUsuario) {
        fijarUsuario(datosUsuario);
        await sincronizarCarritoServidor();
        redirigirPorRol(datosUsuario, from);
      }
    } catch (error) {
      throw error;
    }
  };

  let cerrarSesion = async () => {
    try {
      await solicitarLogout();
    } catch (error) {
      console.error("Error en servidor", error);
    } finally {
      fijarUsuario(null);

      const listaCookies = document.cookie.split(";");
      for (let i = 0; i < listaCookies.length; i++) {
        const ck = listaCookies[i];
        const posIgual = ck.indexOf("=");
        const nombreCookie = posIgual > -1 ? ck.substr(0, posIgual) : ck;
        document.cookie = nombreCookie + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }

      window.location.replace("/");
    }
  }

  if (cargando) {
    return (
      <>
        <style>{`
          #verificando {
            display: flex;
            justify-content: center;
            margin-top: 50px;
          }
        `}</style>
        <div id="verificando">
          <p>Verificando sesión...</p>
        </div>
      </>
    );
  }

  return (
    <ContextoAuth.Provider
      value={{
        user: usuario,
        setUser: fijarUsuario,
        loading: cargando,
        isAuthenticated: !!usuario,
        login: iniciarSesion,
        loginWithGoogle: iniciarConGoogle,
        logout: cerrarSesion,
      }}
    >
      {children}
    </ContextoAuth.Provider>
  )
}

export function useAutenticacion() {
  return useContext(ContextoAuth)
}
