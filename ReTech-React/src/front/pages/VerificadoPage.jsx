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
      <style>{`
        #pag-verif {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%);
          font-family: system-ui, sans-serif;
        }
        #verif-caja {
          background: #fff;
          padding: 48px 56px;
          border-radius: 28px;
          border: 1px solid #bbf7d0;
          text-align: center;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
          max-width: 380px;
        }
        #verif-icono {
          font-size: 64px;
          margin-bottom: 20px;
          line-height: 1;
        }
        #verif-titulo {
          margin: 0 0 10px;
          font-size: 22px;
          font-weight: 800;
          color: #15803d;
        }
        #verif-texto {
          margin: 0 0 6px;
          color: #475569;
          font-size: 15px;
          line-height: 1.5;
        }
        #verif-cierre {
          margin: 14px 0 0;
          color: #94a3b8;
          font-size: 13px;
        }
      `}</style>

      <div id="pag-verif">
        <div id="verif-caja">
          <div id="verif-icono">✅</div>
          <h1 id="verif-titulo">Cuenta verificada</h1>
          <p id="verif-texto">Tu correo ha sido confirmado correctamente.</p>
          {cerrando && (
            <p id="verif-cierre">Puedes cerrar esta pestaña.</p>
          )}
        </div>
      </div>
    </>
  );
}
