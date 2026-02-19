export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <h3 className="text-xl font-bold mb-4">ReTech</h3>
          <p className="text-gray-400 text-sm">
            Especialistes en dispositius reacondicionats amb garantia.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Compra</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Mòbils</li>
            <li>Tablets</li>
            <li>Accessoris</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Suport</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Contacte</li>
            <li>Garantia</li>
            <li>Enviaments</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Política de privacitat</li>
            <li>Termes i condicions</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm mt-12">
        © {new Date().getFullYear()} ReTech. Tots els drets reservats.
      </div>
    </footer>
  )
}
