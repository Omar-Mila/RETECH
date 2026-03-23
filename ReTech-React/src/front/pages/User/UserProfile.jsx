import { useAuth } from "../../../auth/AuthContext";
import Navbar from "../../components/Navbar";
export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div style={{ maxWidth: 650, margin: "60px auto", padding: "0 20px" }}>
        <div style={{ 
          background: "#fff", 
          padding: 40, 
          borderRadius: 24, 
          border: "1px solid #e2e8f0", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)" 
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ 
              width: 80, height: 80, background: "#f1f5f9", borderRadius: "50%", 
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" 
            }}>
               <span style={{ fontSize: 32 }}>👤</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>El meu Perfil</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Gestiona la teva informació personal</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <section>
              <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em" }}>Nom Complet</label>
              <div style={{ marginTop: 6, padding: "12px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
                {user?.name}
              </div>
            </section>

            <section>
              <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em" }}>Correu Electrònic</label>
              <div style={{ marginTop: 6, padding: "12px 16px", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
                {user?.email}
              </div>
            </section>

            <section>
              <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em" }}>Rol d'usuari</label>
              <div style={{ marginTop: 6 }}>
                <span style={{ padding: "6px 12px", background: "#e0e7ff", color: "#4338ca", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {user?.role === 'admin' ? 'Administrador' : 'Client Standard'}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}