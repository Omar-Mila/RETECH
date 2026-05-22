import { useState, useEffect } from "react";
import { useAutenticacion } from "../../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { obtenerUsuarioActual } from "../../../auth/authService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useIdioma } from "../../context/LanguageContext";

const CampoLectura = ({ label, value }) => (
  <section>
    <label className="campo-etiq">{label}</label>
    <div className={`campo-lectura${value ? "" : " vacio"}`}>
      {value || "—"}
    </div>
  </section>
);

const CampoEdicion = ({ label, name, value, onChange }) => (
  <section>
    <label className="campo-etiq">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="campo-input"
    />
  </section>
);

const PAISES = [
  { code: 'ES', label: 'España' },
  { code: 'PT', label: 'Portugal' },
  { code: 'FR', label: 'Francia' },
  { code: 'DE', label: 'Alemania' },
  { code: 'IT', label: 'Italia' },
  { code: 'GB', label: 'Reino Unido' },
  { code: 'NL', label: 'Países Bajos' },
  { code: 'BE', label: 'Bélgica' },
  { code: 'CH', label: 'Suiza' },
  { code: 'AT', label: 'Austria' },
  { code: 'MX', label: 'México' },
  { code: 'AR', label: 'Argentina' },
  { code: 'CO', label: 'Colombia' },
  { code: 'US', label: 'Estados Unidos' },
];

const etiqPais = (code) => PAISES.find(p => p.code === code)?.label ?? code ?? "—";

const SelectEdicion = ({ label, name, value, onChange }) => (
  <section>
    <label className="campo-etiq">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`campo-select${value ? " tiene-valor" : ""}`}
    >
      <option value="">— Selecciona país —</option>
      {PAISES.map(p => (
        <option key={p.code} value={p.code}>{p.label}</option>
      ))}
    </select>
  </section>
);

const TituloSeccion = ({ color = "#6366f1", children }) => (
  <h2 className="seccion-titulo" style={{ color }}>
    {children}
  </h2>
);

function BadgeVerificado({ verified, label }) {
  return (
    <span className={`badge-verif${verified ? " verificado" : " pendiente"}`}>
      {verified ? "✓" : "!"} {label}
    </span>
  );
}

export default function UserProfile() {
  const { user, setUser } = useAutenticacion();
  const { t } = useIdioma();
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const cliente = user?.cliente;

  const [editando, fijarEditando] = useState(false);
  const [guardando, fijarGuardando] = useState(false);
  const [error, fijarError] = useState("");
  const [toastVerif, fijarToastVerif] = useState(null);
  const [reenviando, fijarReenviando] = useState(false);
  const [msgReenvio, fijarMsgReenvio] = useState(null);

  const reenviarVerificacion = async () => {
    fijarReenviando(true);
    fijarMsgReenvio(null);
    try {
      const tokenXsrf = document.cookie
        .split("; ")
        .find(fila => fila.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf || ""),
        },
        credentials: "include",
        body: JSON.stringify({ lang: localStorage.getItem("retech-lang") || "es" }),
      });
      const respData = await res.json();
      if (res.ok && respData.message !== "error") {
        fijarMsgReenvio("success");
      } else {
        fijarMsgReenvio("error");
      }
    } catch {
      fijarMsgReenvio("error");
    } finally {
      fijarReenviando(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(ubicacion.search);
    const verificado = params.get("verified");
    if (verificado === "1") {
      fijarToastVerif("success");
      navegar("/perfil", { replace: true });
      obtenerUsuarioActual().then(fresco => { if (fresco) setUser(fresco); });
    } else if (verificado === "invalid") {
      fijarToastVerif("invalid");
      navegar("/perfil", { replace: true });
    }
  }, []);

  const [estadoCp, fijarEstadoCp] = useState(null);

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
    const cp = datos.codigo_postal?.trim();
    const pais = datos.pais?.trim();
    if (!cp || cp.length < 4 || !pais) { fijarEstadoCp(null); return; }

    fijarEstadoCp('loading');
    const temporizador = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.zippopotam.us/${pais}/${cp}`);
        if (!res.ok) { fijarEstadoCp('invalid'); return; }
        const lugar = await res.json();
        const sitio = lugar.places?.[0];
        if (sitio) {
          fijarEstadoCp('valid');
          fijarDatos(prev => ({
            ...prev,
            municipio: sitio['place name'] || prev.municipio,
            provincia: sitio.state || prev.provincia,
          }));
        } else {
          fijarEstadoCp('invalid');
        }
      } catch {
        fijarEstadoCp(null);
      }
    }, 600);
    return () => clearTimeout(temporizador);
  }, [datos.codigo_postal, datos.pais, editando]);

  const alCambiar = (e) => {
    fijarDatos(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const guardar = async () => {
    fijarGuardando(true);
    fijarError("");
    try {
      const tokenXsrf = document.cookie
        .split("; ")
        .find(fila => fila.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const res = await fetch("/api/user/cliente", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf || ""),
        },
        credentials: "include",
        body: JSON.stringify(datos),
      });

      const respData = await res.json();

      if (!res.ok) {
        if (respData.errors?.nif) {
          fijarError(t('profile.nifDuplicate'));
        } else {
          fijarError(t('profile.saveError'));
        }
        return;
      }

      setUser(respData);
      fijarEditando(false);
    } catch {
      fijarError(t('profile.saveError'));
    } finally {
      fijarGuardando(false);
    }
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
    fijarEstadoCp(null);
    fijarEditando(false);
    fijarError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .campo-etiq {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .campo-lectura {
          margin-top: 6px;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
        }
        .campo-lectura.vacio { color: #cbd5e1; }
        .campo-input {
          display: block;
          margin-top: 6px;
          padding: 12px 16px;
          width: 100%;
          box-sizing: border-box;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #6366f1;
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          outline: none;
        }
        .campo-select {
          display: block;
          margin-top: 6px;
          padding: 12px 16px;
          width: 100%;
          box-sizing: border-box;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #6366f1;
          font-size: 15px;
          font-weight: 600;
          color: #94a3b8;
          outline: none;
          cursor: pointer;
        }
        .campo-select.tiene-valor { color: #1e293b; }
        .seccion-titulo {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
          margin-top: 0;
        }
        .badge-verif {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
        }
        .badge-verif.verificado { background: #dbeafe; color: #1d4ed8; }
        .badge-verif.pendiente  { background: #fef3c7; color: #92400e; }
        .toast-verif {
          margin-bottom: 20px;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .toast-verif.exito { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .toast-verif.invalido { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .btn-cerrar-toast { background: none; border: none; cursor: pointer; font-size: 16px; color: inherit; padding: 0 4px; }
        #perfil-wrap { max-width: 900px; margin: 60px auto; padding: 0 20px; }
        #perfil-cab { text-align: center; margin-bottom: 32px; }
        #perfil-avatar { width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        #perfil-avatar-icono { font-size: 32px; }
        #perfil-titulo { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; display: flex; align-items: center; justify-content: center; gap: 8px; }
        #perfil-verif-icono { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #3b82f6; color: #fff; font-size: 14px; font-weight: 900; flex-shrink: 0; }
        #perfil-verif-texto { margin: 6px 0 0; font-size: 13px; color: #3b82f6; font-weight: 600; }
        #perfil-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        .perfil-tarjeta { background: #fff; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03); }
        .perfil-campos { display: flex; flex-direction: column; gap: 16px; }
        .email-fila { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .btn-reenviar { font-size: 12px; font-weight: 700; padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s; }
        .btn-reenviar.exito { background: #f0fdf4; color: #15803d; cursor: default; }
        .btn-reenviar.normal { background: #fff; color: #6366f1; }
        .btn-reenviar.enviando { opacity: 0.7; }
        .resend-wrap { margin-top: 10px; }
        .btn-reenviar-error { margin: 6px 0 0; font-size: 12px; color: #ef4444; }
        .perfil-der-cab { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .btn-editar { font-size: 12px; font-weight: 700; color: #6366f1; background: #eef2ff; border: none; border-radius: 8px; padding: 6px 14px; cursor: pointer; margin-bottom: 16px; }
        .perfil-error { color: #ef4444; font-size: 13px; margin-bottom: 12px; }
        .cp-estado { margin: 3px 0 0; font-size: 11px; }
        .cp-validando { color: #6366f1; }
        .cp-valido    { color: #22c55e; }
        .cp-invalido  { color: #ef4444; }
        .perfil-botones { display: flex; gap: 10px; margin-top: 4px; }
        .btn-guardar { flex: 1; background: #10b981; color: #fff; border: none; border-radius: 10px; padding: 11px 0; font-weight: 700; font-size: 14px; }
        .btn-guardar.guardando { cursor: not-allowed; opacity: 0.7; }
        .btn-guardar:not(.guardando) { cursor: pointer; }
        .btn-cancelar { flex: 1; background: #f1f5f9; color: #64748b; border: none; border-radius: 10px; padding: 11px 0; font-weight: 700; font-size: 14px; cursor: pointer; }
      `}</style>

      <Navbar />
      <div id="perfil-wrap">

        {toastVerif && (
          <div className={`toast-verif${toastVerif === "success" ? " exito" : " invalido"}`}>
            <span>
              {toastVerif === "success" ? "✓ " : "! "}
              {toastVerif === "success" ? t('profile.verifiedSuccess') : t('profile.verifiedInvalid')}
            </span>
            <button className="btn-cerrar-toast" onClick={() => fijarToastVerif(null)}>×</button>
          </div>
        )}

        <div id="perfil-cab">
          <div id="perfil-avatar">
            <span id="perfil-avatar-icono">👤</span>
          </div>
          <h1 id="perfil-titulo">
            {t('profile.title')}
            {user?.email_verified_at && (
              <span id="perfil-verif-icono" title={t('profile.verifiedAccount')}>✓</span>
            )}
          </h1>
          {user?.email_verified_at && (
            <p id="perfil-verif-texto">{t('profile.verifiedAccount')}</p>
          )}
        </div>

        <div id="perfil-grid">

          <div className="perfil-tarjeta">
            <TituloSeccion>{t('profile.account')}</TituloSeccion>
            <div className="perfil-campos">
              <CampoLectura label={t('profile.username')} value={user?.name} />
              <section>
                <div className="email-fila">
                  <label className="campo-etiq">{t('profile.email')}</label>
                  <BadgeVerificado
                    verified={!!user?.email_verified_at}
                    label={user?.email_verified_at ? t('profile.verified') : t('profile.notVerified')}
                  />
                </div>
                <div className={`campo-lectura${user?.email ? "" : " vacio"}`}>
                  {user?.email || "—"}
                </div>
                {!user?.email_verified_at && (
                  <div className="resend-wrap">
                    <button
                      onClick={reenviarVerificacion}
                      disabled={reenviando || msgReenvio === "success"}
                      className={`btn-reenviar${msgReenvio === "success" ? " exito" : " normal"}${reenviando ? " enviando" : ""}`}
                    >
                      {reenviando
                        ? t('profile.resendingSending')
                        : msgReenvio === "success"
                          ? "✓ " + t('profile.resendSent')
                          : t('profile.resendVerification')}
                    </button>
                    {msgReenvio === "error" && (
                      <p className="btn-reenviar-error">{t('profile.resendError')}</p>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>

          <div className="perfil-tarjeta">
            <div className="perfil-der-cab">
              <TituloSeccion color="#10b981">{t('profile.personalData')}</TituloSeccion>
              {!editando && (
                <button className="btn-editar" onClick={() => fijarEditando(true)}>
                  {t('profile.edit')}
                </button>
              )}
            </div>

            {error && <p className="perfil-error">{error}</p>}

            <div className="perfil-campos">
              {editando ? (
                <>
                  <CampoEdicion label={t('profile.name')}         name="nombre"        value={datos.nombre}        onChange={alCambiar} />
                  <CampoEdicion label={t('profile.surnames')}     name="apellidos"     value={datos.apellidos}     onChange={alCambiar} />
                  <CampoEdicion label={t('profile.nif')}          name="nif"           value={datos.nif}           onChange={alCambiar} />
                  <SelectEdicion label={t('profile.pais')}        name="pais"          value={datos.pais}          onChange={alCambiar} />
                  <div>
                    <CampoEdicion label={t('profile.codigoPostal')} name="codigo_postal" value={datos.codigo_postal} onChange={alCambiar} />
                    {estadoCp === 'loading' && <p className="cp-estado cp-validando">Validando…</p>}
                    {estadoCp === 'valid'   && <p className="cp-estado cp-valido">✓ Código postal válido</p>}
                    {estadoCp === 'invalid' && <p className="cp-estado cp-invalido">{t('cart.profileCpNotFound')}</p>}
                  </div>
                  <CampoEdicion label={t('profile.provincia')}    name="provincia"     value={datos.provincia}     onChange={alCambiar} />
                  <CampoEdicion label={t('profile.municipio')}    name="municipio"     value={datos.municipio}     onChange={alCambiar} />
                  <CampoEdicion label={t('profile.calle')}        name="calle"         value={datos.calle}         onChange={alCambiar} />
                  <CampoEdicion label={t('profile.phone')}        name="telefono"      value={datos.telefono}      onChange={alCambiar} />

                  <div className="perfil-botones">
                    <button
                      onClick={guardar}
                      disabled={guardando}
                      className={`btn-guardar${guardando ? " guardando" : ""}`}
                    >
                      {guardando ? t('profile.saving') : t('profile.save')}
                    </button>
                    <button onClick={cancelar} disabled={guardando} className="btn-cancelar">
                      {t('profile.cancel')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <CampoLectura label={t('profile.name')}         value={cliente?.nombre} />
                  <CampoLectura label={t('profile.surnames')}     value={cliente?.apellidos} />
                  <CampoLectura label={t('profile.nif')}          value={cliente?.nif} />
                  <CampoLectura label={t('profile.pais')}         value={etiqPais(cliente?.pais)} />
                  <CampoLectura label={t('profile.codigoPostal')} value={cliente?.codigo_postal} />
                  <CampoLectura label={t('profile.provincia')}    value={cliente?.provincia} />
                  <CampoLectura label={t('profile.municipio')}    value={cliente?.municipio} />
                  <CampoLectura label={t('profile.calle')}        value={cliente?.calle} />
                  <CampoLectura label={t('profile.phone')}        value={cliente?.telefono} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
