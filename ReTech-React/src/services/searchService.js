export async function searchProducts(query) {
    const res = await fetch(`http://localhost:8000/api/models/search?q=${query}`, {
        credentials: "include"
    });

    if (!res.ok) throw new Error("Search error");

    return res.json();
}

