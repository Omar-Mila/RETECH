import { useEffect, useState } from "react";

export default function VerificadoPage() {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    localStorage.setItem("retech-email-verified", Date.now().toString());
    setClosing(true);
    const timer = setTimeout(() => window.close(), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "#fff", padding: "48px 56px", borderRadius: 28,
        border: "1px solid #bbf7d0", textAlign: "center",
        boxShadow: "0 12px 48px rgba(0,0,0,0.08)", maxWidth: 380,
      }}>
        <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>✅</div>
        <h1 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 800, color: "#15803d" }}>
          Cuenta verificada
        </h1>
        <p style={{ margin: "0 0 6px", color: "#475569", fontSize: 15, lineHeight: 1.5 }}>
          Tu correo ha sido confirmado correctamente.
        </p>
        {closing && (
          <p style={{ margin: "14px 0 0", color: "#94a3b8", fontSize: 13 }}>
            Puedes cerrar esta pestaña.
          </p>
        )}
      </div>
    </div>
  );
}
