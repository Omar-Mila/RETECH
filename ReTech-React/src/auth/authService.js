const API_URL = "http://localhost:8000"

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

export async function loginRequest(email, password) {
  
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {// CSRF cookie (Sanctum)
    credentials: "include",
  })

  const csrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(`${API_URL}/api/login`, { // Login
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(csrfToken),
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Credencials incorrectes")
  }

  const data = await response.json()
  return data.user
}

export async function logoutRequest() {
  await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  })
}
