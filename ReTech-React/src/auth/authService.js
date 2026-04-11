const API_URL = "http://localhost:8000"

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

export async function loginRequest(email, password) {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  })

  const csrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) throw new Error("Credencials incorrectes")

  const data = await response.json();
  return data.user ?? data
}

export async function logoutRequest() {
  const csrfToken = getCookie("XSRF-TOKEN");

  return await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
    headers: { 
      "Accept": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(csrfToken || ""),
    },
  });
}

export const getCurrentUser = async () => {
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