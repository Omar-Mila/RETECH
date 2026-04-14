import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const cliente = user?.cliente;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

      if (!res.ok) {
        const data = await res.json();
        console.error("Error resposta:", data);
        throw new Error();
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditing(false);
    } catch {
      setError("Error en desar els canvis. Torna-ho a intentar.");
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

        {/* Cabecera */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, background: "#f1f5f9", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
          }}>
            <span style={{ fontSize: 32 }}>👤</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Tu Perfil</h1>
        </div>

        {/* Dos columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Izquierda — solo lectura */}
          <div style={{
            background: "#fff", padding: 32, borderRadius: 24,
            border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}>
            <SectionTitle>Compte</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <ReadField label="Nom d'usuari" value={user?.name} />
              <ReadField label="Correu Electrònic" value={user?.email} />
            </div>
          </div>

          {/* Derecha — editable */}
          <div style={{
            background: "#fff", padding: 32, borderRadius: 24,
            border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}>
            {/* Título + botón editar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <SectionTitle color="#10b981">Dades Personals</SectionTitle>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    fontSize: 12, fontWeight: 700, color: "#6366f1",
                    background: "#eef2ff", border: "none", borderRadius: 8,
                    padding: "6px 14px", cursor: "pointer", marginBottom: 16
                  }}
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {editing ? (
                <>
                  <EditField label="Nom"     name="nombre"    value={form.nombre}    onChange={handleChange} />
                  <EditField label="Cognoms" name="apellidos" value={form.apellidos} onChange={handleChange} />
                  <EditField label="NIF"     name="nif"       value={form.nif}       onChange={handleChange} />
                  <EditField label="Adreça"  name="direccion" value={form.direccion} onChange={handleChange} />
                  <EditField label="Telèfon" name="telefono"  value={form.telefono}  onChange={handleChange} />

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
                      {saving ? "Desant..." : "Desar canvis"}
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
                      Cancel·lar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <ReadField label="Nom"     value={cliente?.nombre} />
                  <ReadField label="Cognoms" value={cliente?.apellidos} />
                  <ReadField label="NIF"     value={cliente?.nif} />
                  <ReadField label="Adreça"  value={cliente?.direccion} />
                  <ReadField label="Telèfon" value={cliente?.telefono} />
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