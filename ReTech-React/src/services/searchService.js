export async function buscarProductos(consulta) {
    const res = await fetch(`http://localhost:8000/api/models/search?q=${consulta}`, {
        credentials: "include"
    });

    if (!res.ok) throw new Error("Error en la búsqueda");

    return res.json();
}
