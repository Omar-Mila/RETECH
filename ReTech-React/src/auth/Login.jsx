import { useState } from "react"
import { useAuth } from "./AuthContext"


export default function Login() {

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password)
    } catch (err) {
      setError("Credencials incorrectes")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Iniciar sessió
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded p-2"
          />

          <input
            type="password"
            placeholder="Contrasenya"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded p-2"
          />

          <button className="w-full bg-black text-white py-2 rounded">
            Entrar
          </button>
        </form>
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  )
}
