import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../front/components/Footer"; // Importamos el Footer

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el botón

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("Les contrasenyes no coincideixen");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error desconegut al servidor");
      }

      navigate("/login");
      
    } catch (err) {
      // Si el error es "Unexpected token <", es que Laravel envió HTML
      if (err.message.includes("Unexpected token")) {
        setError("Error crític: El servidor ha enviat HTML. Revisa la pestanya Network.");
      } else {
        setError(err.message); // Aquí saldrá el error de SQL si lo capturamos bien
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Contenido principal centrado */}
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Crear compte
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
              required
            />

            <input
              type="email"
              placeholder="Correu electrònic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
              required
            />

            <input
              type="password"
              placeholder="Contrasenya"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
              required
            />

            <div className="flex flex-col">
              <input
                type="password"
                placeholder="Confirmar contrasenya"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={`w-full rounded-lg border p-3 focus:ring-2 outline-none ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {/* Mensaje de error integrado debajo del campo */}
              {error && (
                <p className="text-red-600 text-sm mt-2 ml-1 font-medium">
                    {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Registrant..." : "Registrar-me"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Ja tens compte?{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline font-bold text-black hover:text-gray-700"
            >
              Inicia sessió
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}