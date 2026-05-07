import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError("Credencials incorrectes. Torna-ho a intentar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setError("Error al iniciar sessió amb Google. Torna-ho a intentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Iniciar sessió
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Contrasenya"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition-all ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {error && (
                <p className="text-red-600 text-xs mt-1.5 ml-1 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Entrant..." : "Entrar"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-grow border-t border-gray-200" />
            <span className="text-xs text-gray-400">o continua amb</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Error al iniciar sessió amb Google.")}
              width="368"
              text="signin_with"
              shape="rectangular"
              locale="ca"
            />
          </div>

          <p className="text-sm text-center mt-6 text-gray-600">
            No tens compte?{" "}
            <button
              onClick={() => navigate("/register")}
              className="underline font-bold text-black hover:text-gray-700"
            >
              Registra't
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
