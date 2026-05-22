import { useState, useEffect } from "react";
import { useAutenticacion } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useIdioma } from "../front/context/LanguageContext";

export default function Login() {
  const { login, loginWithGoogle } = useAutenticacion();
  const { t } = useIdioma();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const from = ubicacion.state?.from || (
    ubicacion.pathname !== '/login' && ubicacion.pathname !== '/register'
      ? ubicacion.pathname
      : null
  );

  useEffect(() => {
    if (from && from !== '/') {
      sessionStorage.setItem('retech-return-url', from);
    }
  }, []);

  const [email, setEmail] = useState("");
  const [contrasena, fijarContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, fijarCargando] = useState(false);
  const [verContrasena, fijarVerContrasena] = useState(false);

  const alEnviar = async (e) => {
    e.preventDefault();
    setError("");
    fijarCargando(true);
    try {
      await login(email, contrasena, from);
    } catch (err) {
      setError(t('login.error'));
    } finally {
      fijarCargando(false);
    }
  };

  const alExitoGoogle = async (respuestaCredencial) => {
    setError("");
    fijarCargando(true);
    try {
      await loginWithGoogle(respuestaCredencial.credential, from);
    } catch (err) {
      setError(t('login.googleError'));
    } finally {
      fijarCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {t('login.title')}
          </h1>

          <form onSubmit={alEnviar} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <input
                type={verContrasena ? "text" : "password"}
                placeholder={t('login.password')}
                value={contrasena}
                onChange={(e) => fijarContrasena(e.target.value)}
                className={`w-full border rounded-lg p-3 pr-11 focus:ring-2 focus:ring-black outline-none transition-all ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => fijarVerContrasena(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {verContrasena ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
              {error && (
                <p className="text-red-600 text-xs mt-1.5 ml-1 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              disabled={cargando}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {cargando ? t('login.entering') : t('login.enter')}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-grow border-t border-gray-200" />
            <span className="text-xs text-gray-400">{t('login.orWith')}</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={alExitoGoogle}
              onError={() => setError(t('login.googleError'))}
              width="368"
              text="signin_with"
              shape="rectangular"
              locale={t('login.locale')}
            />
          </div>

          <p className="text-sm text-center mt-6 text-gray-600">
            {t('login.noAccount')}{" "}
            <button
              onClick={() => navegar("/register", { state: { from } })}
              className="underline font-bold text-black hover:text-gray-700"
            >
              {t('login.register')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
