import { useState, useEffect } from "react";
import { useAutenticacion } from "../../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { obtenerUsuarioActual } from "../../../auth/authService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useIdioma } from "../../context/LanguageContext";

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
