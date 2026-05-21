import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../../auth/authService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";

// Fuera del componente para evitar re-renders que quitan el focus
const ReadField = ({ label, value }) => (
  <section>
    <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em" }}>
      {label}
    </label>
    <div style={{
      marginTop: 6, padding: "12px 16px", background: "#f8fafc",
      borderRadius: 12, border: "1px solid #f1f5f9",
      fontSize: 15, fontWeight: 600, color: value ? "#1e293b" : "#cbd5e1"
    }}>
      {value || "—"}
    </div>
  </section>
);

const EditField = ({ label, name, value, onChange }) => (
  <section>
    <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em" }}>
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      style={{
        display: "block", marginTop: 6, padding: "12px 16px", width: "100%",
        boxSizing: "border-box", background: "#fff", borderRadius: 12,
        border: "1px solid #6366f1", fontSize: 15, fontWeight: 600,
        color: "#1e293b", outline: "none"
      }}
    />
  </section>
);

const SectionTitle = ({ color = "#6366f1", children }) => (
  <h2 style={{
    fontSize: 12, fontWeight: 800, color,
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, marginTop: 0
  }}>
    {children}
  </h2>
);

function VerifiedBadge({ verified, label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
      background: verified ? "#dbeafe" : "#fef3c7",
      color: verified ? "#1d4ed8" : "#92400e",
    }}>
      {verified ? "✓" : "!"} {label}
    </span>
  );
}

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const cliente = user?.cliente;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [verifyToast, setVerifyToast] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState(null);

  const handleResendVerification = async () => {
    setResending(true);
    setResendMsg(null);
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
        },
        credentials: "include",
        body: JSON.stringify({ lang: localStorage.getItem("retech-lang") || "es" }),
      });
      const data = await res.json();
      if (res.ok && data.message !== "error") {
        setResendMsg("success");
      } else {
        setResendMsg("error");
      }
    } catch {
      setResendMsg("error");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    if (verified === "1") {
      setVerifyToast("success");
      navigate("/perfil", { replace: true });
      getCurrentUser().then(fresh => { if (fresh) setUser(fresh); });
    } else if (verified === "invalid") {
      setVerifyToast("invalid");
      navigate("/perfil", { replace: true });
    }

  }, []);

  const [form, setForm] = useState({
    nombre:    user?.cliente?.nombre    || "",
    apellidos: user?.cliente?.apellidos || "",
    nif:       user?.cliente?.nif       || "",
    direccion: user?.cliente?.direccion || "",
    telefono:  user?.cliente?.telefono  || "",
  });

  useEffect(() => {
    if (user?.cliente) {
      setForm({
        nombre:    user.cliente.nombre    || "",
        apellidos: user.cliente.apellidos || "",
        nif:       user.cliente.nif       || "",
        direccion: user.cliente.direccion || "",
        telefono:  user.cliente.telefono  || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const res = await fetch("/api/user/cliente", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors?.nif) {
          setError(t('profile.nifDuplicate'));
        } else {
          setError(t('profile.saveError'));
        }
        return;
      }

      setUser(data);
      setEditing(false);
    } catch {
      setError(t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      nombre:    cliente?.nombre    || "",
      apellidos: cliente?.apellidos || "",
      nif:       cliente?.nif       || "",
      direccion: cliente?.direccion || "",
      telefono:  cliente?.telefono  || "",
    });
    setEditing(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div style={{ maxWidth: 900, margin: "60px auto", padding: "0 20px" }}>

        {/* Toast verificación */}
        {verifyToast && (
          <div style={{
            marginBottom: 20, padding: "14px 20px", borderRadius: 12, fontWeight: 600, fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: verifyToast === "success" ? "#dcfce7" : "#fef3c7",
            color: verifyToast === "success" ? "#15803d" : "#92400e",
            border: `1px solid ${verifyToast === "success" ? "#bbf7d0" : "#fde68a"}`,
          }}>
            <span>
              {verifyToast === "success" ? "✓ " : "! "}
              {verifyToast === "success" ? t('profile.verifiedSuccess') : t('profile.verifiedInvalid')}
            </span>
            <button
              onClick={() => setVerifyToast(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "inherit", padding: "0 4px" }}
            >
              ×
            </button>
          </div>
        )}

        {/* Cabecera */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, background: "#f1f5f9", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
          }}>
            <span style={{ fontSize: 32 }}>👤</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {t('profile.title')}
            {user?.email_verified_at && (
              <span title={t('profile.verifiedAccount')} style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: "50%", background: "#3b82f6",
                color: "#fff", fontSize: 14, fontWeight: 900, flexShrink: 0
              }}>✓</span>
            )}
          </h1>
          {user?.email_verified_at && (
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>
              {t('profile.verifiedAccount')}
            </p>
          )}
        </div>

        {/* Dos columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Izquierda — solo lectura */}
          <div style={{
            background: "#fff", padding: 32, borderRadius: 24,
            border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}>
            <SectionTitle>{t('profile.account')}</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <ReadField label={t('profile.username')} value={user?.name} />
              <section>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em" }}>
                    {t('profile.email')}
                  </label>
                  <VerifiedBadge
                    verified={!!user?.email_verified_at}
                    label={user?.email_verified_at ? t('profile.verified') : t('profile.notVerified')}
                  />
                </div>
                <div style={{
                  padding: "12px 16px", background: "#f8fafc",
                  borderRadius: 12, border: "1px solid #f1f5f9",
                  fontSize: 15, fontWeight: 600, color: user?.email ? "#1e293b" : "#cbd5e1"
                }}>
                  {user?.email || "—"}
                </div>
                {!user?.email_verified_at && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={handleResendVerification}
                      disabled={resending || resendMsg === "success"}
                      style={{
                        fontSize: 12, fontWeight: 700, padding: "7px 14px",
                        borderRadius: 8, border: "1px solid #e2e8f0",
                        background: resendMsg === "success" ? "#f0fdf4" : "#fff",
                        color: resendMsg === "success" ? "#15803d" : "#6366f1",
                        cursor: (resending || resendMsg === "success") ? "default" : "pointer",
                        opacity: resending ? 0.7 : 1,
                        transition: "all 0.2s",
                      }}
                    >
                      {resending
                        ? t('profile.resendingSending')
                        : resendMsg === "success"
                          ? "✓ " + t('profile.resendSent')
                          : t('profile.resendVerification')}
                    </button>
                    {resendMsg === "error" && (
                      <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ef4444" }}>
                        {t('profile.resendError')}
                      </p>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Derecha — editable */}
          <div style={{
            background: "#fff", padding: 32, borderRadius: 24,
            border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}>
            {/* Título + botón editar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <SectionTitle color="#10b981">{t('profile.personalData')}</SectionTitle>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    fontSize: 12, fontWeight: 700, color: "#6366f1",
                    background: "#eef2ff", border: "none", borderRadius: 8,
                    padding: "6px 14px", cursor: "pointer", marginBottom: 16
                  }}
                >
                  {t('profile.edit')}
                </button>
              )}
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {editing ? (
                <>
                  <EditField label={t('profile.name')}     name="nombre"    value={form.nombre}    onChange={handleChange} />
                  <EditField label={t('profile.surnames')} name="apellidos" value={form.apellidos} onChange={handleChange} />
                  <EditField label={t('profile.nif')}      name="nif"       value={form.nif}       onChange={handleChange} />
                  <EditField label={t('profile.address')}  name="direccion" value={form.direccion} onChange={handleChange} />
                  <EditField label={t('profile.phone')}    name="telefono"  value={form.telefono}  onChange={handleChange} />

                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        flex: 1, background: "#10b981", color: "#fff", border: "none",
                        borderRadius: 10, padding: "11px 0", fontWeight: 700,
                        fontSize: 14, cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.7 : 1
                      }}
                    >
                      {saving ? t('profile.saving') : t('profile.save')}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{
                        flex: 1, background: "#f1f5f9", color: "#64748b", border: "none",
                        borderRadius: 10, padding: "11px 0", fontWeight: 700,
                        fontSize: 14, cursor: "pointer"
                      }}
                    >
                      {t('profile.cancel')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <ReadField label={t('profile.name')}     value={cliente?.nombre} />
                  <ReadField label={t('profile.surnames')} value={cliente?.apellidos} />
                  <ReadField label={t('profile.nif')}      value={cliente?.nif} />
                  <ReadField label={t('profile.address')}  value={cliente?.direccion} />
                  <ReadField label={t('profile.phone')}    value={cliente?.telefono} />
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