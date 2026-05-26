import { useState, useEffect } from "react";
import { useAutenticacion } from "../../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { obtenerUsuarioActual } from "../../../auth/authService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useIdioma } from "../../context/LanguageContext";

/* ── Fuerza de contraseña ── */
const FUERZA_COLOR_BARRA = ["#ef4444", "#ef4444", "#f97316", "#eab308", "#22c55e"];
const FUERZA_COLOR_TEXTO = ["#ef4444", "#ef4444", "#ea580c", "#a16207", "#15803d"];

function calcFuerza(pass) {
  if (!pass) return 0;
  let p = 0;
  if (pass.length >= 8)          p++;
  if (/[A-Z]/.test(pass))        p++;
  if (/[0-9]/.test(pass))        p++;
  if (/[^A-Za-z0-9]/.test(pass)) p++;
  return p;
}

function requisitos(pass) {
  return [
    { label: "Mínimo 8 caracteres",     met: pass.length >= 8 },
    { label: "Una letra mayúscula",      met: /[A-Z]/.test(pass) },
    { label: "Un número",               met: /[0-9]/.test(pass) },
    { label: "Un carácter especial",    met: /[^A-Za-z0-9]/.test(pass) },
  ];
}

const FUERZA_TEXTO = ["", "Muy débil", "Débil", "Aceptable", "Fuerte"];

/* Ojo mostrar/ocultar */
function OjoIcon({ visible }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

const CampoLectura = ({ label, value, className }) => (
  <section className={className}>
    <label className="up-field-label">{label}</label>
    <div className={`up-field-read${value ? "" : " up-field-read--empty"}`}>
      {value || "—"}
    </div>
  </section>
);

const CampoEdicion = ({ label, name, value, onChange, className }) => (
  <section className={className}>
    <label className="up-field-label">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="up-field-input"
    />
  </section>
);

const formatTelefono = (raw = "") => {
  const d = raw.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
};

const CampoTelefonoEdicion = ({ label, name, value, onChange, className }) => {
  const handleChange = (e) => {
    const soloDigitos = e.target.value.replace(/\D/g, "").slice(0, 9);
    onChange({ target: { name, value: soloDigitos } });
  };
  return (
    <section className={className}>
      <label className="up-field-label">{label}</label>
      <div className="up-phone-wrap">
        <span className="up-phone-prefix">🇪🇸 +34</span>
        <input
          type="tel"
          name={name}
          value={formatTelefono(value)}
          onChange={handleChange}
          className="up-field-input up-phone-input"
          placeholder="600 00 00 00"
        />
      </div>
    </section>
  );
};

const CampoTelefonoLectura = ({ label, value, className }) => (
  <section className={className}>
    <label className="up-field-label">{label}</label>
    <div className={`up-field-read${value ? "" : " up-field-read--empty"}`}>
      {value
        ? <><span className="up-phone-prefix-read">🇪🇸 +34</span> {formatTelefono(value)}</>
        : "—"}
    </div>
  </section>
);

const PAISES = [
  { code: 'ES', label: 'España'        },
  { code: 'PT', label: 'Portugal'      },
  { code: 'FR', label: 'Francia'       },
  { code: 'DE', label: 'Alemania'      },
  { code: 'IT', label: 'Italia'        },
  { code: 'GB', label: 'Reino Unido'   },
  { code: 'NL', label: 'Países Bajos'  },
  { code: 'BE', label: 'Bélgica'       },
  { code: 'CH', label: 'Suiza'         },
  { code: 'AT', label: 'Austria'       },
  { code: 'MX', label: 'México'        },
  { code: 'AR', label: 'Argentina'     },
  { code: 'CO', label: 'Colombia'      },
  { code: 'US', label: 'Estados Unidos'},
];

const etiqPais = (code) => PAISES.find(p => p.code === code)?.label ?? code ?? "—";

const SelectEdicion = ({ label, name, value, onChange, className }) => (
  <section className={className}>
    <label className="up-field-label">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`up-field-select${value ? " up-field-select--filled" : ""}`}
    >
      <option value="">— Selecciona país —</option>
      {PAISES.map(p => (
        <option key={p.code} value={p.code}>{p.label}</option>
      ))}
    </select>
  </section>
);

const TituloSeccion = ({ color = "#6366f1", children }) => (
  <h2 className="up-section-title" style={{ color }}>
    {children}
  </h2>
);

function BadgeVerificado({ verified, label }) {
  return (
    <span className={`up-badge${verified ? " up-badge--verified" : " up-badge--pending"}`}>
      {verified ? "✓" : "!"} {label}
    </span>
  );
}

export default function UserProfile() {
  const { user, setUser } = useAutenticacion();
  const { t }             = useIdioma();
  const ubicacion         = useLocation();
  const navegar           = useNavigate();
  const cliente           = user?.cliente;

  const [editando,    fijarEditando]    = useState(false);
  const [guardando,   fijarGuardando]   = useState(false);
  const [error,       fijarError]       = useState("");
  const [toastVerif,  fijarToastVerif]  = useState(null);
  const [reenviando,  fijarReenviando]  = useState(false);
  const [msgReenvio,  fijarMsgReenvio]  = useState(null);
  const [estadoCp,    fijarEstadoCp]    = useState(null);

  // Cambio de contraseña
  const [cpAbierto,      fijarCpAbierto]      = useState(false);
  const [cpGuardando,    fijarCpGuardando]    = useState(false);
  const [cpError,        fijarCpError]        = useState("");
  const [cpOk,           fijarCpOk]           = useState(false);
  const [cpDatos,        fijarCpDatos]        = useState({ actual: "", nueva: "", confirmar: "" });
  const [cpVerActual,    fijarCpVerActual]    = useState(false);
  const [cpVerNueva,     fijarCpVerNueva]     = useState(false);
  const [cpVerConfirmar, fijarCpVerConfirmar] = useState(false);

  const cpFuerza = calcFuerza(cpDatos.nueva);

  const [datos, fijarDatos] = useState({
    nombre:        user?.cliente?.nombre        || "",
    apellidos:     user?.cliente?.apellidos     || "",
    nif:           user?.cliente?.nif           || "",
    pais:          user?.cliente?.pais          || "",
    provincia:     user?.cliente?.provincia     || "",
    municipio:     user?.cliente?.municipio     || "",
    codigo_postal: user?.cliente?.codigo_postal || "",
    calle:         user?.cliente?.calle         || "",
    telefono:      user?.cliente?.telefono      || "",
  });

  const reenviarVerificacion = async () => {
    fijarReenviando(true);
    fijarMsgReenvio(null);
    try {
      const tokenXsrf = document.cookie
        .split("; ")
        .find(f => f.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf || "") },
        credentials: "include",
        body: JSON.stringify({ lang: localStorage.getItem("retech-lang") || "es" }),
      });
      const data = await res.json();
      fijarMsgReenvio(res.ok && data.message !== "error" ? "success" : "error");
    } catch { fijarMsgReenvio("error"); }
    finally  { fijarReenviando(false); }
  };

  useEffect(() => {
    const params    = new URLSearchParams(ubicacion.search);
    const verificado = params.get("verified");
    if (verificado === "1") {
      fijarToastVerif("success");
      navegar("/perfil", { replace: true });
      obtenerUsuarioActual().then(f => { if (f) setUser(f); });
    } else if (verificado === "invalid") {
      fijarToastVerif("invalid");
      navegar("/perfil", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (user?.cliente) {
      fijarDatos({
        nombre:        user.cliente.nombre        || "",
        apellidos:     user.cliente.apellidos     || "",
        nif:           user.cliente.nif           || "",
        pais:          user.cliente.pais          || "",
        provincia:     user.cliente.provincia     || "",
        municipio:     user.cliente.municipio     || "",
        codigo_postal: user.cliente.codigo_postal || "",
        calle:         user.cliente.calle         || "",
        telefono:      user.cliente.telefono      || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!editando) return;
    const cp   = datos.codigo_postal?.trim();
    const pais = datos.pais?.trim();
    if (!cp || cp.length < 4 || !pais) { fijarEstadoCp(null); return; }
    fijarEstadoCp('loading');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.zippopotam.us/${pais}/${cp}`);
        if (!res.ok) { fijarEstadoCp('invalid'); return; }
        const lugar = await res.json();
        const sitio = lugar.places?.[0];
        if (sitio) {
          fijarEstadoCp('valid');
          fijarDatos(prev => ({ ...prev, municipio: sitio['place name'] || prev.municipio, provincia: sitio.state || prev.provincia }));
        } else { fijarEstadoCp('invalid'); }
      } catch { fijarEstadoCp(null); }
    }, 600);
    return () => clearTimeout(timer);
  }, [datos.codigo_postal, datos.pais, editando]);

  const alCambiar = (e) => fijarDatos(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const cambiarContrasena = async () => {
    fijarCpError(""); fijarCpOk(false);
    if (!cpDatos.actual)    { fijarCpError("Introduce la contraseña actual."); return; }
    if (!cpDatos.nueva)     { fijarCpError("Introduce la nueva contraseña."); return; }
    if (cpDatos.nueva.length < 8) { fijarCpError("La contraseña debe tener mínimo 8 caracteres."); return; }
    if (cpDatos.nueva !== cpDatos.confirmar) { fijarCpError("Las contraseñas no coinciden."); return; }

    fijarCpGuardando(true);
    try {
      const tokenXsrf = document.cookie.split("; ").find(f => f.startsWith("XSRF-TOKEN="))?.split("=")[1];
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf || "") },
        credentials: "include",
        body: JSON.stringify({
          current_password:          cpDatos.actual,
          new_password:              cpDatos.nueva,
          new_password_confirmation: cpDatos.confirmar,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message === "wrong_password") fijarCpError("La contraseña actual es incorrecta.");
        else fijarCpError("Error al cambiar la contraseña.");
        return;
      }
      fijarCpOk(true);
      fijarCpDatos({ actual: "", nueva: "", confirmar: "" });
      setTimeout(() => { fijarCpAbierto(false); fijarCpOk(false); }, 2000);
    } catch { fijarCpError("Error de conexión."); }
    finally  { fijarCpGuardando(false); }
  };

  const guardar = async () => {
    fijarGuardando(true); fijarError("");
    try {
      const tokenXsrf = document.cookie.split("; ").find(f => f.startsWith("XSRF-TOKEN="))?.split("=")[1];
      const res = await fetch("/api/user/cliente", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf || "") },
        credentials: "include",
        body: JSON.stringify(datos),
      });
      const data = await res.json();
      if (!res.ok) { fijarError(data.errors?.nif ? t('profile.nifDuplicate') : t('profile.saveError')); return; }
      setUser(data);
      fijarEditando(false);
    } catch { fijarError(t('profile.saveError')); }
    finally  { fijarGuardando(false); }
  };

  const cancelar = () => {
    fijarDatos({
      nombre:        cliente?.nombre        || "",
      apellidos:     cliente?.apellidos     || "",
      nif:           cliente?.nif           || "",
      pais:          cliente?.pais          || "",
      provincia:     cliente?.provincia     || "",
      municipio:     cliente?.municipio     || "",
      codigo_postal: cliente?.codigo_postal || "",
      calle:         cliente?.calle         || "",
      telefono:      cliente?.telefono      || "",
    });
    fijarEstadoCp(null); fijarEditando(false); fijarError("");
  };

  return (
    <div className="up-page">
      <Navbar />

      <div className="up-wrap">

        {/* Toast verificación */}
        {toastVerif && (
          <div className={`up-toast${toastVerif === "success" ? " up-toast--ok" : " up-toast--warn"}`}>
            <span>
              {toastVerif === "success" ? "✓ " : "! "}
              {toastVerif === "success" ? t('profile.verifiedSuccess') : t('profile.verifiedInvalid')}
            </span>
            <button className="up-toast-close" onClick={() => fijarToastVerif(null)}>×</button>
          </div>
        )}

        {/* Cabecera avatar */}
        <div className="up-header">
          <div className="up-avatar">
            <span className="up-avatar-icon">👤</span>
          </div>
          <h1 className="up-title">
            {t('profile.title')}
            {user?.email_verified_at && (
              <span className="up-verified-icon" title={t('profile.verifiedAccount')}>✓</span>
            )}
          </h1>
          {user?.email_verified_at && (
            <p className="up-verified-text">{t('profile.verifiedAccount')}</p>
          )}
        </div>

        {/* Grid tarjetas */}
        <div className="up-grid">

          {/* Tarjeta cuenta */}
          <div className="up-card">
            <TituloSeccion>{t('profile.account')}</TituloSeccion>
            <div className="up-fields">
              <CampoLectura label={t('profile.username')} value={user?.name} />
              <section>
                <div className="up-email-row">
                  <label className="up-field-label">{t('profile.email')}</label>
                  <BadgeVerificado
                    verified={!!user?.email_verified_at}
                    label={user?.email_verified_at ? t('profile.verified') : t('profile.notVerified')}
                  />
                </div>
                <div className={`up-field-read${user?.email ? "" : " up-field-read--empty"}`}>
                  {user?.email || "—"}
                </div>
                {!user?.email_verified_at && (
                  <div className="up-resend-wrap">
                    <button
                      onClick={reenviarVerificacion}
                      disabled={reenviando || msgReenvio === "success"}
                      className={`up-btn-resend${msgReenvio === "success" ? " up-btn-resend--ok" : " up-btn-resend--normal"}${reenviando ? " up-btn-resend--sending" : ""}`}
                    >
                      {reenviando
                        ? t('profile.resendingSending')
                        : msgReenvio === "success"
                          ? "✓ " + t('profile.resendSent')
                          : t('profile.resendVerification')}
                    </button>
                    {msgReenvio === "error" && (
                      <p className="up-resend-error">{t('profile.resendError')}</p>
                    )}
                  </div>
                )}
              </section>

              {/* ── Cambiar contraseña ── */}
              <section className="up-cp-section">
                <button
                  className="up-cp-toggle"
                  onClick={() => { fijarCpAbierto(o => !o); fijarCpError(""); fijarCpOk(false); fijarCpDatos({ actual: "", nueva: "", confirmar: "" }); fijarCpVerActual(false); fijarCpVerNueva(false); fijarCpVerConfirmar(false); }}
                >
                  <span>Cambiar contraseña</span>
                  <span className={`up-cp-chevron${cpAbierto ? " up-cp-chevron--open" : ""}`}>›</span>
                </button>

                {cpAbierto && (
                  user?.google_id ? (
                    <p className="up-cp-google-msg">
                      Tu cuenta está vinculada con Google. El acceso se gestiona desde tu cuenta de Google.
                    </p>
                  ) : (
                    <div className="up-cp-form">
                      {cpError && <p className="up-cp-form-error">{cpError}</p>}
                      {cpOk    && <p className="up-cp-form-ok">✓ Contraseña actualizada correctamente.</p>}

                      {/* Contraseña actual */}
                      <div className="up-cp-field">
                        <label className="up-field-label">Contraseña actual</label>
                        <div className="up-cp-input-wrap">
                          <input
                            type={cpVerActual ? "text" : "password"}
                            value={cpDatos.actual}
                            onChange={e => fijarCpDatos(p => ({ ...p, actual: e.target.value }))}
                            className="up-field-input up-cp-input"
                            placeholder="••••••••"
                            autoComplete="current-password"
                          />
                          <button type="button" className="up-cp-ojo" onClick={() => fijarCpVerActual(v => !v)} tabIndex={-1}>
                            <OjoIcon visible={cpVerActual} />
                          </button>
                        </div>
                      </div>

                      {/* Nueva contraseña + indicador de fuerza */}
                      <div className="up-cp-field">
                        <label className="up-field-label">Nueva contraseña</label>
                        <div className="up-cp-input-wrap">
                          <input
                            type={cpVerNueva ? "text" : "password"}
                            value={cpDatos.nueva}
                            onChange={e => fijarCpDatos(p => ({ ...p, nueva: e.target.value }))}
                            className="up-field-input up-cp-input"
                            placeholder="Mínimo 8 caracteres"
                            autoComplete="new-password"
                          />
                          <button type="button" className="up-cp-ojo" onClick={() => fijarCpVerNueva(v => !v)} tabIndex={-1}>
                            <OjoIcon visible={cpVerNueva} />
                          </button>
                        </div>

                        {/* Barra de fuerza */}
                        {cpDatos.nueva && (
                          <div className="up-cp-fuerza">
                            <div className="up-cp-fuerza-barras">
                              {[1,2,3,4].map(i => (
                                <div
                                  key={i}
                                  className="up-cp-fuerza-barra"
                                  style={{ background: i <= cpFuerza ? FUERZA_COLOR_BARRA[cpFuerza] : "#e2e8f0" }}
                                />
                              ))}
                            </div>
                            <span className="up-cp-fuerza-texto" style={{ color: FUERZA_COLOR_TEXTO[cpFuerza] }}>
                              {FUERZA_TEXTO[cpFuerza]}
                            </span>
                            <ul className="up-cp-requisitos">
                              {requisitos(cpDatos.nueva).map(({ label, met }) => (
                                <li key={label} className={`up-cp-req${met ? " up-cp-req--ok" : ""}`}>
                                  <span className="up-cp-req-icon">{met ? "✓" : "·"}</span>
                                  {label}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Confirmar contraseña */}
                      <div className="up-cp-field">
                        <label className="up-field-label">Confirmar nueva contraseña</label>
                        <div className="up-cp-input-wrap">
                          <input
                            type={cpVerConfirmar ? "text" : "password"}
                            value={cpDatos.confirmar}
                            onChange={e => fijarCpDatos(p => ({ ...p, confirmar: e.target.value }))}
                            className={`up-field-input up-cp-input${cpDatos.confirmar && cpDatos.confirmar !== cpDatos.nueva ? " up-cp-input--mismatch" : ""}`}
                            placeholder="Repite la contraseña"
                            autoComplete="new-password"
                          />
                          <button type="button" className="up-cp-ojo" onClick={() => fijarCpVerConfirmar(v => !v)} tabIndex={-1}>
                            <OjoIcon visible={cpVerConfirmar} />
                          </button>
                        </div>
                        {cpDatos.confirmar && cpDatos.confirmar !== cpDatos.nueva && (
                          <p className="up-cp-mismatch">Las contraseñas no coinciden</p>
                        )}
                      </div>

                      <button
                        onClick={cambiarContrasena}
                        disabled={cpGuardando || cpOk}
                        className={`up-cp-btn-save${cpGuardando || cpOk ? " up-cp-btn-save--disabled" : ""}`}
                      >
                        {cpGuardando ? "Guardando…" : cpOk ? "✓ Guardado" : "Actualizar contraseña"}
                      </button>
                    </div>
                  )
                )}
              </section>

            </div>
          </div>

          {/* Tarjeta datos personales */}
          <div className="up-card">
            <div className="up-card-head">
              <TituloSeccion>{t('profile.personalData')}</TituloSeccion>
              {!editando && (
                <button className="up-btn-edit" onClick={() => fijarEditando(true)}>
                  {t('profile.edit')}
                </button>
              )}
            </div>

            {error && <p className="up-error">{error}</p>}

            <div className="up-form-grid">
              {editando ? (
                <>
                  {/* fila 1: nombre | apellidos */}
                  <CampoEdicion label={t('profile.name')}     name="nombre"    value={datos.nombre}    onChange={alCambiar} />
                  <CampoEdicion label={t('profile.surnames')} name="apellidos" value={datos.apellidos} onChange={alCambiar} />
                  {/* fila 2: NIF (ancho completo) */}
                  <CampoEdicion label={t('profile.nif')} name="nif" value={datos.nif} onChange={alCambiar} className="up-form-full" />
                  {/* fila 3: país | CP */}
                  <SelectEdicion label={t('profile.pais')} name="pais" value={datos.pais} onChange={alCambiar} />
                  <div>
                    <CampoEdicion label={t('profile.codigoPostal')} name="codigo_postal" value={datos.codigo_postal} onChange={alCambiar} />
                    {estadoCp === 'loading' && <p className="up-cp-msg up-cp-msg--loading">Validando…</p>}
                    {estadoCp === 'valid'   && <p className="up-cp-msg up-cp-msg--ok">✓ Código postal válido</p>}
                    {estadoCp === 'invalid' && <p className="up-cp-msg up-cp-msg--error">{t('cart.profileCpNotFound')}</p>}
                  </div>
                  {/* fila 4: provincia | municipio */}
                  <CampoEdicion label={t('profile.provincia')} name="provincia" value={datos.provincia} onChange={alCambiar} />
                  <CampoEdicion label={t('profile.municipio')} name="municipio" value={datos.municipio} onChange={alCambiar} />
                  {/* fila 5: calle (ancho completo) */}
                  <CampoEdicion label={t('profile.calle')} name="calle" value={datos.calle} onChange={alCambiar} className="up-form-full" />
                  {/* fila 6: teléfono (ancho completo) */}
                  <CampoTelefonoEdicion label={t('profile.phone')} name="telefono" value={datos.telefono} onChange={alCambiar} className="up-form-full" />
                  {/* fila 7: botones (ancho completo) */}
                  <div className="up-btn-row up-form-full">
                    <button onClick={guardar} disabled={guardando} className={`up-btn-save${guardando ? " up-btn-save--loading" : ""}`}>
                      {guardando ? t('profile.saving') : t('profile.save')}
                    </button>
                    <button onClick={cancelar} disabled={guardando} className="up-btn-cancel">
                      {t('profile.cancel')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <CampoLectura label={t('profile.name')}         value={cliente?.nombre} />
                  <CampoLectura label={t('profile.surnames')}     value={cliente?.apellidos} />
                  <CampoLectura label={t('profile.nif')}          value={cliente?.nif}             className="up-form-full" />
                  <CampoLectura label={t('profile.pais')}         value={etiqPais(cliente?.pais)} />
                  <CampoLectura label={t('profile.codigoPostal')} value={cliente?.codigo_postal} />
                  <CampoLectura label={t('profile.provincia')}    value={cliente?.provincia} />
                  <CampoLectura label={t('profile.municipio')}    value={cliente?.municipio} />
                  <CampoLectura label={t('profile.calle')}        value={cliente?.calle}           className="up-form-full" />
                  <CampoTelefonoLectura label={t('profile.phone')} value={cliente?.telefono}       className="up-form-full" />
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />

      <style>{`

        /* Página */
        .up-page { min-height: 100vh; background: #f8fafc; }
        .up-wrap {
          max-width: 56rem;
          margin: 0 auto;
          padding: 3.75rem 1.25rem 4rem;
        }

        /* Toast */
        .up-toast {
          margin-bottom: 1.25rem;
          padding: .875rem 1.25rem;
          border-radius: .75rem;
          font-weight: 600;
          font-size: .875rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .up-toast--ok   { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .up-toast--warn { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .up-toast-close { background: none; border: none; cursor: pointer; font-size: 1rem; color: inherit; padding: 0 .25rem; }

        /* Cabecera */
        .up-header { text-align: center; margin-bottom: 2rem; }
        .up-avatar {
          width: 5rem; height: 5rem;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }
        .up-avatar-icon   { font-size: 2rem; }
        .up-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          display: flex; align-items: center; justify-content: center; gap: .5rem;
        }
        .up-verified-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 1.625rem; height: 1.625rem;
          border-radius: 50%;
          background: #3b82f6; color: #fff;
          font-size: .875rem; font-weight: 900; flex-shrink: 0;
        }
        .up-verified-text { margin: .375rem 0 0; font-size: .8125rem; color: #3b82f6; font-weight: 600; }

        /* Grid */
        .up-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* Tarjeta */
        .up-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,.03);
        }
        .up-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        /* Campos */
        .up-fields         { display: flex; flex-direction: column; gap: 1rem; }
        .up-form-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; }
        .up-form-full      { grid-column: 1 / -1; }
        .up-field-label {
          font-size: .625rem;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: .06em;
          display: block;
          margin-bottom: .25rem;
        }
        .up-field-read {
          padding: .5rem .75rem;
          background: #f8fafc;
          border-radius: .625rem;
          border: 1px solid #f1f5f9;
          font-size: .875rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
        }
        .up-field-read--empty { color: #cbd5e1; }
        .up-field-input {
          display: block;
          padding: .5rem .75rem;
          width: 100%;
          box-sizing: border-box;
          background: #fff;
          border-radius: .625rem;
          border: 1px solid #0f172a;
          font-size: .875rem;
          font-weight: 600;
          color: #1e293b;
          outline: none;
          transition: box-shadow .15s;
          line-height: 1.4;
        }
        .up-field-input:focus { box-shadow: 0 0 0 3px rgba(15,23,42,.12); }
        .up-field-select {
          display: block;
          padding: .5rem .75rem;
          width: 100%;
          box-sizing: border-box;
          background: #fff;
          border-radius: .625rem;
          border: 1px solid #0f172a;
          font-size: .875rem;
          font-weight: 600;
          color: #94a3b8;
          outline: none;
          cursor: pointer;
          line-height: 1.4;
        }
        .up-field-select--filled { color: #1e293b; }

        /* Sección título */
        .up-section-title {
          font-size: .75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin: 0 0 1rem;
        }

        /* Badge verificado */
        .up-badge {
          display: inline-flex; align-items: center; gap: .25rem;
          font-size: .6875rem; font-weight: 700;
          padding: .1875rem .5rem; border-radius: 20px;
        }
        .up-badge--verified { background: #dbeafe; color: #1d4ed8; }
        .up-badge--pending  { background: #fef3c7; color: #92400e; }

        /* Email fila */
        .up-email-row {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: .375rem;
        }

        /* Reenviar */
        .up-resend-wrap  { margin-top: .625rem; }
        .up-btn-resend {
          font-size: .75rem; font-weight: 700;
          padding: .4375rem .875rem;
          border-radius: .5rem; border: 1px solid #e2e8f0;
          cursor: pointer; transition: all .2s;
        }
        .up-btn-resend--ok      { background: #f0fdf4; color: #15803d; cursor: default; }
        .up-btn-resend--normal  { background: #fff; color: #6366f1; }
        .up-btn-resend--sending { opacity: .7; }
        .up-resend-error        { margin: .375rem 0 0; font-size: .75rem; color: #ef4444; }

        /* Teléfono con prefijo */
        .up-phone-wrap {
          display: flex;
          align-items: stretch;
        }
        .up-phone-prefix {
          display: flex;
          align-items: center;
          padding: 0 .625rem;
          background: #f1f5f9;
          border: 1px solid #0f172a;
          border-right: none;
          border-radius: .625rem 0 0 .625rem;
          font-size: .8125rem;
          font-weight: 700;
          color: #475569;
          white-space: nowrap;
          user-select: none;
          gap: .3rem;
        }
        .up-phone-input {
          border-radius: 0 .625rem .625rem 0 !important;
          flex: 1;
        }
        .up-phone-prefix-read {
          display: inline-flex;
          align-items: center;
          gap: .3rem;
          font-weight: 700;
          color: #475569;
          margin-right: .25rem;
        }

        /* Código postal */
        .up-cp-msg          { margin: .1875rem 0 0; font-size: .6875rem; }
        .up-cp-msg--loading { color: #6366f1; }
        .up-cp-msg--ok      { color: #22c55e; }
        .up-cp-msg--error   { color: #ef4444; }

        /* Botón editar */
        .up-btn-edit {
          font-size: .75rem; font-weight: 700;
          color: #fff; background: #0f172a;
          border: 1px solid #0f172a; border-radius: 8px;
          padding: 6px 10px; cursor: pointer;
          transition: opacity .15s;
        }
        .up-btn-edit:hover { opacity: .8; }

        /* Error */
        .up-error { color: #ef4444; font-size: .8125rem; margin-bottom: .75rem; }

        /* Botones guardar/cancelar */
        .up-btn-row { display: flex; gap: .625rem; margin-top: .25rem; }
        .up-btn-save {
          flex: 1; background: #10b981; color: #fff;
          border: none; border-radius: .625rem;
          padding: .6875rem 0; font-weight: 700;
          font-size: .875rem; cursor: pointer;
          transition: background .15s;
        }
        .up-btn-save:hover:not(.up-btn-save--loading) { background: #059669; }
        .up-btn-save--loading { cursor: not-allowed; opacity: .7; }
        .up-btn-cancel {
          flex: 1; background: #f1f5f9; color: #64748b;
          border: none; border-radius: .625rem;
          padding: .6875rem 0; font-weight: 700;
          font-size: .875rem; cursor: pointer;
          transition: background .15s;
        }
        .up-btn-cancel:hover { background: #e2e8f0; }

        /* ── Cambiar contraseña ── */
        .up-cp-section {
          border-top: 1px solid #f1f5f9;
          padding-top: .875rem;
          margin-top: .25rem;
        }
        .up-cp-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          padding: .375rem 0;
          font-size: .8125rem;
          font-weight: 700;
          color: #334155;
          text-align: left;
        }
        .up-cp-toggle:hover { color: #0f172a; }
        .up-cp-chevron {
          font-size: 1.1rem;
          font-weight: 400;
          color: #94a3b8;
          transition: transform .2s;
          line-height: 1;
        }
        .up-cp-chevron--open { transform: rotate(90deg); }

        .up-cp-google-msg {
          font-size: .75rem;
          color: #94a3b8;
          margin: .5rem 0 0;
          padding: .625rem .75rem;
          background: #f8fafc;
          border-radius: .5rem;
          border: 1px solid #f1f5f9;
        }
        .up-cp-form {
          display: flex;
          flex-direction: column;
          gap: .625rem;
          margin-top: .625rem;
        }
        .up-cp-field { display: flex; flex-direction: column; }
        .up-cp-form-error {
          font-size: .75rem;
          color: #ef4444;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: .5rem;
          padding: .5rem .75rem;
          margin: 0;
        }
        .up-cp-form-ok {
          font-size: .75rem;
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: .5rem;
          padding: .5rem .75rem;
          margin: 0;
        }
        /* Input con botón ojo */
        .up-cp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .up-cp-input { padding-right: 2.25rem !important; }
        .up-cp-input--mismatch { border-color: #ef4444 !important; }
        .up-cp-ojo {
          position: absolute;
          right: .625rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color .15s;
        }
        .up-cp-ojo:hover { color: #475569; }

        /* Barra de fuerza */
        .up-cp-fuerza {
          margin-top: .5rem;
          padding: 0 .125rem;
        }
        .up-cp-fuerza-barras {
          display: flex;
          gap: .25rem;
          margin-bottom: .25rem;
        }
        .up-cp-fuerza-barra {
          height: 5px;
          flex: 1;
          border-radius: 99px;
          transition: background .3s;
        }
        .up-cp-fuerza-texto {
          font-size: .6875rem;
          font-weight: 700;
        }

        /* Lista de requisitos */
        .up-cp-requisitos {
          list-style: none;
          margin: .375rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: .125rem;
        }
        .up-cp-req {
          display: flex;
          align-items: center;
          gap: .375rem;
          font-size: .6875rem;
          color: #94a3b8;
          transition: color .2s;
        }
        .up-cp-req--ok { color: #16a34a; }
        .up-cp-req-icon { font-weight: 700; width: .75rem; text-align: center; }

        /* Mismatch */
        .up-cp-mismatch {
          margin: .25rem 0 0;
          font-size: .6875rem;
          color: #ef4444;
        }

        .up-cp-btn-save {
          margin-top: .25rem;
          padding: .625rem;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: .625rem;
          font-weight: 700;
          font-size: .875rem;
          cursor: pointer;
          transition: background .15s;
        }
        .up-cp-btn-save:hover:not(.up-cp-btn-save--disabled) { background: #1e293b; }
        .up-cp-btn-save--disabled { opacity: .6; cursor: not-allowed; }

        /* Responsive */
        @media (max-width: 768px) {
          .up-grid { grid-template-columns: 1fr; }
          .up-wrap { padding: 2rem 1rem 3rem; }
        }

        @media (max-width: 480px) {
          .up-card        { padding: 1.125rem; border-radius: 1rem; }
          .up-title       { font-size: 1.25rem; }
          .up-form-grid   { grid-template-columns: 1fr; }
          .up-form-full   { grid-column: auto; }
          .up-btn-row     { flex-direction: column; }
          .up-btn-save,
          .up-btn-cancel  { padding: .625rem 0; }
        }

      `}</style>
    </div>
  );
}
