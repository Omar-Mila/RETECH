import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../front/context/LanguageContext";

const STRENGTH_BAR_COLORS = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
const STRENGTH_TEXT_COLORS = ["text-red-500", "text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

function getPasswordStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

function getRequirements(pwd, t) {
  return [
    { label: t('register.reqLength'),   met: pwd.length >= 8 },
    { label: t('register.reqUppercase'), met: /[A-Z]/.test(pwd) },
    { label: t('register.reqNumber'),   met: /[0-9]/.test(pwd) },
    { label: t('register.reqSymbol'),   met: /[^A-Za-z0-9]/.test(pwd) },
  ];
}

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 4) {
      setError(t('register.weakPassword'));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t('register.passwordMismatch'));
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
        body: JSON.stringify({ name, email, password, lang: localStorage.getItem("retech-lang") || "es" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error");
      }

      navigate("/login");
    } catch (err) {
      if (err.message.includes("Unexpected token")) {
        setError("Error crític: El servidor ha enviat HTML. Revisa la pestanya Network.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const strengthLabels = t('register.strength');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {t('register.title')}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t('register.fullName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
              required
            />

            <input
              type="email"
              placeholder={t('register.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
              required
            />

            <div>
              <input
                type="password"
                placeholder={t('register.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-black outline-none"
                required
              />

              {password && (
                <div className="mt-2 px-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? STRENGTH_BAR_COLORS[strength] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${STRENGTH_TEXT_COLORS[strength]}`}>
                    {strengthLabels[strength]}
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {getRequirements(password, t).map(({ label, met }) => (
                      <li
                        key={label}
                        className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                          met ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        <span className="font-bold">{met ? "✓" : "·"}</span>
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="password"
                placeholder={t('register.confirmPassword')}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={`w-full rounded-lg border p-3 focus:ring-2 outline-none ${
                  error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-black"
                }`}
                required
              />
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
              {loading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            {t('register.haveAccount')}{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline font-bold text-black hover:text-gray-700"
            >
              {t('register.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
