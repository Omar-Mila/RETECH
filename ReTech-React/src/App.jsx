import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./front/components/Navbar"
import Home from "./front/pages/Home"
import Login from "./auth/Login"

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>      
    </>
  )
}
