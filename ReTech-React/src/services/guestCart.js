const CLAVE = "retech-guest-cart";

export function obtenerCarritoInvitado() {
  try { return JSON.parse(localStorage.getItem(CLAVE) || "[]"); }
  catch { return []; }
}

export function guardarCarritoInvitado(arts) {
  localStorage.setItem(CLAVE, JSON.stringify(arts));
}

export function limpiarCarritoInvitado() {
  localStorage.removeItem(CLAVE);
}

export async function sincronizarCarritoServidor() {
  const arts = obtenerCarritoInvitado();
  if (!arts.length) return;

  await fetch("/sanctum/csrf-cookie", { credentials: "include" });
  const tokenXsrf = document.cookie
    .split("; ")
    .find(r => r.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  for (const { movil_id, cantidad } of arts) {
    try {
      await fetch("/api/carrito", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(tokenXsrf || ""),
        },
        body: JSON.stringify({ movil_id, cantidad }),
      });
    } catch { /* artículo individual falla silenciosamente */ }
  }

  limpiarCarritoInvitado();
  window.dispatchEvent(new Event("cart-updated"));
}
