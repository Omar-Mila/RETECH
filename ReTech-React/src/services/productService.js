const API_URL = "http://localhost:8000/api"

export async function getProducts() {
  const response = await fetch("http://localhost:8000/api/moviles")
  const data = await response.json()

  console.info("BACKEND DATA:", data)

  return data
}