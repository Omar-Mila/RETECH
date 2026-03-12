const API_URL = "http://localhost:8000/api"

export async function getProducts() {
  const response = await fetch("http://localhost:8000/api/moviles", {
    credentials: "include"
  })
  const data = await response.json()
  console.info("BACKEND DATA:", data)
  return data
}

export async function getProduct(id) {
    const res = await fetch(`http://localhost:8000/api/models/${id}`, {
        credentials: "include"
    })

    if (!res.ok) {
        throw new Error("Product not found")
    }

    return res.json()
}

export async function getModelOptions(id) {
  const res = await fetch(`http://localhost:8000/api/models/${id}/options`)
  if (!res.ok) throw new Error("Options error")
  return res.json()
}

export async function getModelPrice(id, params) {

  const query = new URLSearchParams(params).toString()

  const res = await fetch(
    `http://localhost:8000/api/models/${id}/price?${query}`
  )

  if (!res.ok) throw new Error("Price error")

  return res.json()
}