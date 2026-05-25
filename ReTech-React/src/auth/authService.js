const API_URL = "http://localhost:8000"

function obtenerCookie(nombre) {
  return document.cookie
    .split("; ")
    .find(fila => fila.startsWith(nombre + "="))
    ?.split("=")[1];
}

async function obtenerCSRF() {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
  return decodeURIComponent(obtenerCookie("XSRF-TOKEN") || "");
}

export async function solicitarLogin(email, password) {
  const tokenCsrf = await obtenerCSRF();

  const respuesta = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-XSRF-TOKEN": tokenCsrf,
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  if (!respuesta.ok) throw new Error("Credencials incorrectes")

  const datos = await respuesta.json();
  return datos.user ?? datos
}

export async function solicitarLoginGoogle(credencial) {
  const tokenCsrf = await obtenerCSRF();

  const respuesta = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-XSRF-TOKEN": tokenCsrf,
    },
    credentials: "include",
    body: JSON.stringify({ credential: credencial }),
  });

  if (!respuesta.ok) throw new Error("Error al iniciar sessió amb Google");

  const datos = await respuesta.json();
  return datos.user ?? datos;
}

export async function solicitarLogout() {
  const tokenCsrf = obtenerCookie("XSRF-TOKEN");

  return await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(tokenCsrf || ""),
    },
  });
}

export const obtenerUsuarioActual = async () => {
  try {
    const res = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    });

    if (res.status === 401) return null;
    if (!res.ok) throw new Error("Error en el servidor");

    return await res.json();
  } catch (error) {
    console.error("Error cargando usuario:", error);
    return null;
  }
}
