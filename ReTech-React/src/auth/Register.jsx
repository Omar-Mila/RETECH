import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIdioma } from "../front/context/LanguageContext";

const COLORES_BARRA_FUERZA = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
const COLORES_TEXTO_FUERZA = ["text-red-500", "text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

function obtenerFuerzaContrasena(contra) {
  if (!contra) return 0;
  let puntuacion = 0;
  if (contra.length >= 8) puntuacion++;
  if (/[A-Z]/.test(contra)) puntuacion++;
  if (/[0-9]/.test(contra)) puntuacion++;
  if (/[^A-Za-z0-9]/.test(contra)) puntuacion++;
  return puntuacion;
}

function obtenerRequisitos(contra, t) {
  return [
    { label: t('register.reqLength'),   met: contra.length >= 8 },
    { label: t('register.reqUppercase'), met: /[A-Z]/.test(contra) },
    { label: t('register.reqNumber'),   met: /[0-9]/.test(contra) },
    { label: t('register.reqSymbol'),   met: /[^A-Za-z0-9]/.test(contra) },
  ];
}

export default function Register() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { t } = useIdioma();
  const from = ubicacion.state?.from || null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, fijarContrasena] = useState("");
  const [confirmarContrasena, fijarConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, fijarCargando] = useState(false);
  const [verContrasena, fijarVerContrasena] = useState(false);
  const [verConfirmar, fijarVerConfirmar] = useState(false);

  const fuerza = obtenerFuerzaContrasena(contrasena);

  const alEnviar = async (e) => {
    e.preventDefault();
    if (fuerza < 4) {
      setError(t('register.weakPassword'));
      return;
    }
    if (contrasena !== confirmarContrasena) {
      setError(t('register.passwordMismatch'));
      return;
    }

    setError("");
    fijarCargando(true);

    try {
      const respuesta = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name, email, password: contrasena, lang: localStorage.getItem("retech-lang") || "es" }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "Error");
      }

      navegar("/login", { state: { from } });
    } catch (err) {
      if (err.message.includes("Unexpected token")) {
        setError("Error crític: El servidor ha enviat HTML. Revisa la pestanya Network.");
      } else {
        setError(err.message);
      }
    } finally {
      fijarCargando(false);
    }
  };

  const etiqFuerza = t('register.strength');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {t('register.title')}
          </h1>

          <form onSubmit={alEnviar} className="space-y-4">
            <input
              type="text"
              placeholder={t('register.fullName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
              required
            />

            <input
              type="email"
              placeholder={t('register.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
              required
            />

            <div>
              <div className="relative">
                <input
                  type={verContrasena ? "text" : "password"}
                  placeholder={t('register.password')}
                  value={contrasena}
                  onChange={(e) => fijarContrasena(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-3 pr-11 focus:ring-2 focus:ring-black outline-none"
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
              </div>

              {contrasena && (
                <div className="mt-2 px-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= fuerza ? COLORES_BARRA_FUERZA[fuerza] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${COLORES_TEXTO_FUERZA[fuerza]}`}>
                    {etiqFuerza[fuerza]}
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {obtenerRequisitos(contrasena, t).map(({ label, met }) => (
                      <li
                        key={label}
                        className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                          met ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        <span className="font-bold">{met ? "✓" : "·"}</span>
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="relative">
                <input
                  type={verConfirmar ? "text" : "password"}
                  placeholder={t('register.confirmPassword')}
                  value={confirmarContrasena}
                  onChange={(e) => fijarConfirmarContrasena(e.target.value)}
                  className={`w-full rounded-lg border p-3 pr-11 focus:ring-2 outline-none ${
                    error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-black"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => fijarVerConfirmar(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {verConfirmar ? (
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
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2 ml-1 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {cargando ? t('register.submitting') : t('register.submit')}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            {t('register.haveAccount')}{" "}
            <button
              onClick={() => navegar("/login", { state: { from } })}
              className="underline font-bold text-black hover:text-gray-700"
            >
              {t('register.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
