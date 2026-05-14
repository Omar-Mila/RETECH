const KEY = "retech-guest-cart";

export function getGuestCart() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function setGuestCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function clearGuestCart() {
  localStorage.removeItem(KEY);
}

export async function syncGuestCartToServer() {
  const items = getGuestCart();
  if (!items.length) return;

  await fetch("/sanctum/csrf-cookie", { credentials: "include" });
  const xsrfToken = document.cookie
    .split("; ")
    .find(r => r.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  for (const { movil_id, cantidad } of items) {
    try {
      await fetch("/api/carrito", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken || ""),
        },
        body: JSON.stringify({ movil_id, cantidad }),
      });
    } catch { /* item individual falla silenciosamente */ }
  }

  clearGuestCart();
  window.dispatchEvent(new Event("cart-updated"));
}
