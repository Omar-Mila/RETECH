import { useEffect, useState } from "react";

export default function VerificadoPage() {
  const [cerrando, fijarCerrando] = useState(false);

  useEffect(() => {
    localStorage.setItem("retech-email-verified", Date.now().toString());
    fijarCerrando(true);
    const temporizador = setTimeout(() => window.close(), 3000);
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <>
      <div className="vp-page">
        <div className="vp-box">
          <div className="vp-icon">✅</div>
          <h1 className="vp-title">Cuenta verificada</h1>
          <p className="vp-text">Tu correo ha sido confirmado correctamente.</p>
          {cerrando && (
            <p className="vp-close">Puedes cerrar esta pestaña.</p>
          )}
        </div>
      </div>

      <style>{`

        /* página */
        .vp-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%);
          font-family: system-ui, sans-serif;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        /* caja */
        .vp-box {
          background: #fff;
          padding: 3rem 3.5rem;
          border-radius: 28px;
          border: 1px solid #bbf7d0;
          text-align: center;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
          max-width: 380px;
          width: 100%;
        }

        /* contenido */
        .vp-icon  { font-size: 64px; margin-bottom: 20px; line-height: 1; }
        .vp-title { margin: 0 0 10px; font-size: 22px; font-weight: 800; color: #15803d; }
        .vp-text  { margin: 0 0 6px; color: #475569; font-size: 15px; line-height: 1.5; }
        .vp-close { margin: 14px 0 0; color: #94a3b8; font-size: 13px; }

        /* responsive */
        @media (max-width: 480px) {
          .vp-box   { padding: 2rem 1.5rem; border-radius: 20px; }
          .vp-icon  { font-size: 52px; }
          .vp-title { font-size: 19px; }
          .vp-text  { font-size: 14px; }
        }

      `}</style>
    </>
  );
}
