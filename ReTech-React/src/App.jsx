import { useEffect } from "react";
import api from "./api/api";

function App() {
  useEffect(() => {
    api.get("/marcas")
      .then((res) => console.log("MARQUES:", res.data))
      .catch((err) => console.error("ERROR API:", err));
  }, []);

  return <h1>Prova API</h1>;
}

export default App;