const API_URL = "http://localhost:8000/api"

export async function obtenerProductos() {
  const respuesta = await fetch("http://localhost:8000/api/moviles", {
    credentials: "include"
  })
  const datos = await respuesta.json()
  console.info("BACKEND DATA:", datos)
  return datos
}

export async function obtenerMasVendidos() {
  const respuesta = await fetch("http://localhost:8000/api/moviles/best-sellers", {
    credentials: "include",
  });
  return respuesta.json();
}

export async function obtenerProducto(id) {
    const res = await fetch(`http://localhost:8000/api/models/${id}`, {
        credentials: "include"
    })

    if (!res.ok) {
        throw new Error("Producto no encontrado")
    }

    return res.json()
}

export async function obtenerOpcionesModelo(id) {
  const res = await fetch(`http://localhost:8000/api/models/${id}/options`)
  if (!res.ok) throw new Error("Error en opciones")
  return res.json()
}

export async function obtenerPrecioModelo(id, parametros) {
  const consulta = new URLSearchParams(parametros).toString()
  const res = await fetch(
    `http://localhost:8000/api/models/${id}/price?${consulta}`
  )
  if (!res.ok) throw new Error("Error en precio")
  return res.json()
}

export async function obtenerImagenesModelo(id) {
  const res = await fetch(`http://localhost:8000/api/models/${id}/images`);
  return res.json();
}

export async function obtenerOpcionesFiltradas(id, parametros) {
  const consulta = new URLSearchParams(parametros).toString()
  const res = await fetch(`http://localhost:8000/api/models/${id}/options?${consulta}`)
  if (!res.ok) throw new Error("Error en opciones")
  return res.json()
}

export async function obtenerUnidadesModelo(id) {
  const res = await fetch(`http://localhost:8000/api/models/${id}/units`)
  if (!res.ok) throw new Error("Error en unidades")
  return res.json()
}
