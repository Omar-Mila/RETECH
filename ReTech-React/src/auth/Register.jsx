import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();

        //validar contrasenyes
        if(password !== passwordConfirm){
            setError("Les contrasenyes no coincideixen")
            return;
        }

        setError("");
        console.log({ name, email, password })

        // De moment simulació
        navigate("/login");

    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Crear compte
                </h1>

                {error && (
                    <div className="mb-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Nom */}
                    <input
                        type="text"
                        placeholder="Nom complet"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded border-gray-300 shadow-sm"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Correu electrònic"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded border-gray-300 shadow-sm"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Contrasenya"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full rounded border-gray-300 shadow-sm"
                        required
                    />

                    {/* Confirm Password */}
                    <input
                        type="password"
                        placeholder="Confirmar contrasenya"
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                        className="w-full rounded border-gray-300 shadow-sm"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                    >
                        Registrar-me
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    Ja tens compte?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="underline"
                    >
                        Inicia sessió
                    </button>
                </p>
            </div>
        </div>
    )
}


