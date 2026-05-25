import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useIdioma } from "../../context/LanguageContext";

const fmtPrecio = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

function generarFacturaHTML(compraId, arts, total, usuario, etiquetas, localeFecha) {
  const fecha      = new Date().toLocaleDateString(localeFecha, { day: "numeric", month: "long", year: "numeric" });
  const numFactura = `FAC-${String(compraId).padStart(5, "0")}`;

  const PAISES_ETIQ = {
    ES: 'España', PT: 'Portugal', FR: 'Francia', DE: 'Alemania', IT: 'Italia',
    GB: 'Reino Unido', NL: 'Países Bajos', BE: 'Bélgica', CH: 'Suiza',
    AT: 'Austria', MX: 'México', AR: 'Argentina', CO: 'Colombia', US: 'Estados Unidos',
  };
  const fmtTel = (t) => {
    if (!t) return null;
    const d = t.replace(/\D/g, '').slice(0, 9);
    if (d.length <= 3) return `+34 ${d}`;
    if (d.length <= 5) return `+34 ${d.slice(0,3)} ${d.slice(3)}`;
    if (d.length <= 7) return `+34 ${d.slice(0,3)} ${d.slice(3,5)} ${d.slice(5)}`;
    return `+34 ${d.slice(0,3)} ${d.slice(3,5)} ${d.slice(5,7)} ${d.slice(7)}`;
  };

  const c              = usuario?.cliente ?? {};
  const clienteNombre    = c.nombre && c.apellidos ? `${c.nombre} ${c.apellidos}` : usuario?.name ?? "—";
  const clienteEmail     = usuario?.email      ?? "—";
  const clienteNif       = c.nif               ?? null;
  const clienteTel       = fmtTel(c.telefono);
  const clienteCalle     = c.calle             ?? null;
  const clienteMunicipio = c.municipio         ?? null;
  const clienteProvincia = c.provincia         ?? null;
  const clienteCp        = c.codigo_postal     ?? null;
  const clienteEtiqPais  = c.pais ? (PAISES_ETIQ[c.pais] ?? c.pais) : null;

  const filas = arts.map(art => `
    <tr>
      <td><strong>${art.modelo ?? ""}</strong><br><small>${art.almacenamiento ?? ""} GB · ${art.ram ?? ""} GB RAM · ${art.color ?? ""} · ${art.estado ?? ""}</small></td>
      <td>${art.cantidad}</td>
      <td>${fmtPrecio(art.precio)}</td>
      <td>${fmtPrecio(art.subtotal)}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="${localeFecha.split('-')[0]}">
<head>
  <meta charset="UTF-8">
  <title>Factura ${numFactura}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1e293b; padding: 52px; font-size: 13px; background: #fff; }
    .top-bar { background: #0f172a; height: 5px; border-radius: 3px; margin-bottom: 40px; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
    .brand { font-size: 30px; font-weight: 900; letter-spacing: -1.5px; color: #0f172a; }
    .brand span { color: #6366f1; }
    .tagline { color: #64748b; font-size: 11.5px; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-num { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -1px; }
    .invoice-meta p { color: #64748b; font-size: 12px; margin-top: 4px; line-height: 1.6; }
    .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 36px; }
    .info-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; }
    .info-block h3 { font-size: 9px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px; }
    .info-block p { font-size: 12.5px; color: #1e293b; line-height: 1.75; }
    .info-block p strong { color: #0f172a; font-weight: 700; }
    hr { border: none; border-top: 2px solid #e2e8f0; margin: 0 0 24px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #0f172a; color: #fff; padding: 11px 14px; font-size: 10px; text-transform: uppercase; letter-spacing: .8px; text-align: left; }
    thead th:first-child { border-radius: 6px 0 0 6px; }
    thead th:last-child  { border-radius: 0 6px 6px 0; }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
    tbody td { padding: 13px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-size: 12.5px; }
    tbody td:nth-child(2), tbody td:nth-child(3), tbody td:nth-child(4) { text-align: right; white-space: nowrap; }
    small { color: #64748b; font-size: 11px; }
    .totals { margin-top: 24px; display: flex; justify-content: flex-end; }
    .totals-inner { width: 280px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; }
    .total-final { display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 10px; border-top: 2px solid #0f172a; font-size: 17px; font-weight: 800; color: #0f172a; }
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .footer-left { color: #94a3b8; font-size: 11px; line-height: 1.8; }
    .footer-badge { background: #6366f1; color: #fff; font-size: 10px; font-weight: 800; padding: 5px 12px; border-radius: 20px; letter-spacing: .5px; }
    @media print { body { padding: 28px; } .top-bar { display: none; } }
  </style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="header-row">
    <div>
      <div class="brand">Re<span>Tech</span></div>
      <p class="tagline">${etiquetas.tagline}</p>
    </div>
    <div class="invoice-meta">
      <div class="invoice-num">${numFactura}</div>
      <p>${etiquetas.issueDate} <strong style="color:#0f172a">${fecha}</strong></p>
      <p>${etiquetas.orderNum} #${compraId}</p>
    </div>
  </div>
  <div class="info-row">
    <div class="info-block">
      <h3>${etiquetas.seller}</h3>
      <p><strong>ReTech SL</strong><br>CIF: B-08700123<br>Carrer de la Tecnologia, 12<br>08700 Igualada, Barcelona<br>Tel: +34 938 00 12 34<br>info@retech.cat</p>
    </div>
    <div class="info-block">
      <h3>${etiquetas.client}</h3>
      <p>
        <strong>${clienteNombre}</strong><br>
        ${clienteNif        ? `NIF: ${clienteNif}<br>`                                                          : ""}
        ${clienteCalle      ? `${clienteCalle}<br>`                                                             : ""}
        ${clienteMunicipio  ? `${clienteMunicipio}${clienteProvincia ? `, ${clienteProvincia}` : ''}<br>`       : ""}
        ${clienteCp         ? `CP ${clienteCp}${clienteEtiqPais ? ` — ${clienteEtiqPais}` : ''}<br>`           : ""}
        ${clienteTel        ? `Tel: ${clienteTel}<br>`                                                          : ""}
        ${clienteEmail}
      </p>
    </div>
  </div>
  <hr>
  <table>
    <thead>
      <tr><th>${etiquetas.product}</th><th>${etiquetas.quantity}</th><th>${etiquetas.unitPrice}</th><th>${etiquetas.total}</th></tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
  <div class="totals">
    <div class="totals-inner">
      <div class="total-final"><span>${etiquetas.total}</span><span>${fmtPrecio(total)}</span></div>
    </div>
  </div>
  <div class="footer">
    <div class="footer-left">
      <p>${etiquetas.thanks}</p>
      <p>${etiquetas.simplifiedInvoice}</p>
    </div>
    <div class="footer-badge">RETECH CERT</div>
  </div>
</body>
</html>`;
}

const ESTADO_CLASE = {
  "Como nuevo": "est-excelente",
  "Excelente":  "est-excelente",
  "Muy Bueno":  "est-mbueno",
  "Bueno":      "est-bueno",
  "Aceptable":  "est-aceptable",
};

function BarraBateria({ valor }) {
  const claseColor = valor >= 85 ? "bat-alta" : valor >= 70 ? "bat-media" : "bat-baja";
  return (
    <div className="bat-wrap">
      <div className="bat-fondo">
        <div className={`bat-relleno ${claseColor}`} style={{ width: `${valor}%` }} />
      </div>
      <span className={`bat-valor ${claseColor}`}>{valor}%</span>
    </div>
  );
}

function MiniaturaMovil({ imagenUrl }) {
  return (
    <div className="phone-thumb">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="20" rx="3" stroke="#64748b" strokeWidth="1.8" />
        <circle cx="12" cy="18.5" r="1" fill="#64748b" />
        <rect x="9" y="5" width="6" height="1.5" rx="0.75" fill="#64748b" opacity="0.5" />
      </svg>
      {imagenUrl && (
        <img src={imagenUrl} alt="" className="phone-thumb-img" onError={e => { e.currentTarget.style.display = "none" }} />
      )}
    </div>
  );
}

function ElementoPedido({ art, movil, t }) {
  if (!movil) {
    return (
      <div className="pedido-item pedido-item-skel">
        <div className="phone-thumb-skel" />
        <div className="pedido-item-body">
          <div className="skel-linea ancha" />
          <div className="skel-linea corta" />
        </div>
      </div>
    );
  }

  const claseEstado = ESTADO_CLASE[movil.estado] ?? "est-bueno";
  const precio      = art.precio ?? art.precio_unitario ?? movil.precio;
  const subtotal    = precio * art.cantidad;

  return (
    <div className="pedido-item">
      <MiniaturaMovil imagenUrl={movil.imagen_url} />
      <div className="pedido-item-body">
        <div className="pedido-item-fila">
          <div>
            <p className="pedido-modelo">{movil.modelo}</p>
            <p className="pedido-specs">{movil.almacenamiento} GB · {movil.ram} GB RAM · {movil.color}</p>
          </div>
          <div className="pedido-precio-col">
            <p className="pedido-subtotal">{fmtPrecio(subtotal)}</p>
            {art.cantidad > 1 && (
              <p className="pedido-precio-ud">{fmtPrecio(precio)} {t('orders.perUnit')}</p>
            )}
          </div>
        </div>
        <div className="pedido-item-badges">
          <span className={`pedido-estado ${claseEstado}`}>{movil.estat ?? movil.estado}</span>
          <BarraBateria valor={movil.bateria} />
          <span className="pedido-unidades">{t('orders.units')(art.cantidad)}</span>
        </div>
      </div>
    </div>
  );
}

function TarjetaPedido({ pedido, cachMoviles, alAlternar, estaAbierto, usuario, t }) {
  const verFactura = () => {
    const arts = (pedido.items || []).map(art => {
      const movil  = cachMoviles[art.movil_id] || {};
      const precio = art.precio ?? art.precio_unitario ?? movil.precio ?? 0;
      return { ...movil, cantidad: art.cantidad, precio, subtotal: precio * art.cantidad };
    });
    const etiquetas  = t('invoice');
    const localeFecha = t('orders.dateLocale');
    const htmlFactura = generarFacturaHTML(pedido.id, arts, pedido.precio_total, usuario, etiquetas, localeFecha);
    const ventana = window.open("", "_blank");
    if (!ventana) return;
    ventana.document.write(htmlFactura);
    ventana.document.close();
    ventana.focus();
    ventana.print();
  };

  const totalProductos = pedido.items?.reduce((acc, i) => acc + (Number(i.cantidad) || 0), 0) || 0;
  const localeFecha    = t('orders.dateLocale');
  const etiqEstado     = t('orders.status');
  const confEstado = {
    pagado:    { clase: "est-pagado",    label: etiqEstado.pagado    },
    pendiente: { clase: "est-pendiente", label: etiqEstado.pendiente },
    fallido:   { clase: "est-fallido",   label: etiqEstado.fallido   },
  }[pedido.estado] ?? { clase: "est-neutro", label: pedido.estado?.toUpperCase() };

  return (
    <div className={`tarjeta-pedido${estaAbierto ? " abierta" : ""}`}>
      <button onClick={alAlternar} className="tarjeta-pedido-btn">
        <div className="tarjeta-pedido-izq">
          <div className="pedido-icono">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div className="pedido-meta">
            <p className="pedido-num">{t('orders.order')} #{pedido.id}</p>
            <p className="pedido-fecha">
              {new Date(pedido.created_at).toLocaleDateString(localeFecha, { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="pedido-resumen">{t('orders.productCount')(totalProductos)} · {pedido.metodo_pago}</p>
          </div>
        </div>

        <div className="tarjeta-pedido-der">
          <div className="pedido-total-col">
            <p className="pedido-total-val">{fmtPrecio(pedido.precio_total)}</p>
            <span className={`pedido-estado-badge ${confEstado.clase}`}>{confEstado.label}</span>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#94a3b8" strokeWidth="2.5"
            className={`pedido-flecha${estaAbierto ? " girada" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {estaAbierto && (
        <div className="tarjeta-pedido-body">
          <p className="pedido-productos-titulo">{t('orders.products')}</p>

          {pedido.items?.map((art, i) => (
            <ElementoPedido key={i} art={art} movil={cachMoviles[art.movil_id]} t={t} />
          ))}

          <div className="pedido-total-caja">
            <div className="pedido-total-fila">
              <span className="pedido-total-etiq">{t('orders.total')}</span>
              <span className="pedido-total-num">{fmtPrecio(pedido.precio_total)}</span>
            </div>
          </div>

          <div className="pedido-factura-wrap">
            <button onClick={verFactura} className="btn-factura">{t('orders.downloadInvoice')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { t } = useIdioma();
  const [pedidos,      fijarPedidos]      = useState([]);
  const [cargando,     fijarCargando]     = useState(true);
  const [cachMoviles,  fijarCachMoviles]  = useState({});
  const [idAbierto,    fijarIdAbierto]    = useState(null);
  const [usuario,      fijarUsuario]      = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resPedidos, resUser] = await Promise.all([
          fetch("/api/compras", { credentials: "include", headers: { "Accept": "application/json" } }),
          fetch("/api/user",    { credentials: "include", headers: { "Accept": "application/json" } }),
        ]);

        if (resUser.ok) fijarUsuario(await resUser.json());

        if (resPedidos.ok) {
          const datos = await resPedidos.json();
          fijarPedidos(datos);

          const ids = [...new Set(datos.flatMap(o => (o.items || []).map(i => i.movil_id)))];
          const resultados = await Promise.all(
            ids.map(id =>
              fetch(`/api/products/${id}`, { headers: { "Accept": "application/json" } })
                .then(r => r.ok ? r.json() : null)
                .catch(() => null)
            )
          );

          const cache = {};
          ids.forEach((id, i) => { if (resultados[i]) cache[id] = resultados[i]; });
          fijarCachMoviles(cache);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        fijarCargando(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <>
      <Navbar />

      <div className="op-page">
        <div className="op-container">

          <div className="op-header">
            <h2 className="op-title">{t('orders.title')}</h2>
            {!cargando && <p className="op-count">{t('orders.count')(pedidos.length)}</p>}
          </div>

          {cargando ? (
            <div className="op-spinner">
              <svg className="op-spinner-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="op-empty">
              <div className="op-empty-icon">📦</div>
              <p className="op-empty-title">{t('orders.empty')}</p>
              <p className="op-empty-desc">{t('orders.emptyDesc')}</p>
              <button className="op-btn-shop" onClick={() => window.location.href = "/"}>
                {t('orders.goToShop')}
              </button>
            </div>
          ) : (
            <div className="op-list">
              {pedidos.map(pedido => (
                <TarjetaPedido
                  key={pedido.id}
                  pedido={pedido}
                  cachMoviles={cachMoviles}
                  estaAbierto={idAbierto === pedido.id}
                  alAlternar={() => fijarIdAbierto(idAbierto === pedido.id ? null : pedido.id)}
                  usuario={usuario}
                  t={t}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes op-spin { to { transform: rotate(360deg); } }

        /* ── Página ─────────────────────────────────────────── */
        .op-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2.5rem 1rem 5rem;
        }
        .op-container {
          max-width: 45rem;
          margin: 0 auto;
        }

        /* ── Cabecera ───────────────────────────────────────── */
        .op-header   { margin-bottom: 1.75rem; }
        .op-title {
          margin: 0;
          font-size: 1.625rem;
          font-weight: 800;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          letter-spacing: -.5px;
        }
        .op-count {
          margin: .25rem 0 0;
          font-size: .8125rem;
          color: #64748b;
        }

        /* ── Spinner ────────────────────────────────────────── */
        .op-spinner { text-align: center; padding: 5rem; }
        .op-spinner-icon { animation: op-spin .8s linear infinite; }

        /* ── Vacío ──────────────────────────────────────────── */
        .op-empty {
          text-align: center;
          padding: 3.75rem 1.25rem;
          background: #fff;
          border-radius: 1.5rem;
          border: 1px solid #e2e8f0;
        }
        .op-empty-icon  { font-size: 3rem; margin-bottom: .75rem; }
        .op-empty-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
        }
        .op-empty-desc  { margin: .375rem 0 1.25rem; color: #64748b; font-size: .84375rem; }
        .op-btn-shop {
          padding: .625rem 1.5rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          border: none;
          border-radius: .625rem;
          font-weight: 700;
          cursor: pointer;
          font-size: .84375rem;
          font-family: 'Sora', sans-serif;
        }

        /* ── Lista ──────────────────────────────────────────── */
        .op-list { display: flex; flex-direction: column; gap: 1rem; }

        /* ── Batería ────────────────────────────────────────── */
        .bat-wrap  { display: flex; align-items: center; gap: 5px; }
        .bat-fondo { width: 34px; height: 7px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
        .bat-relleno { height: 100%; border-radius: 4px; }
        .bat-alta  { background: #22c55e; color: #0f172a; }
        .bat-media { background: #f59e0b; color: #0f172a; }
        .bat-baja  { background: #ef4444; color: #0f172a; }
        .bat-valor { font-size: 10px; font-weight: 700; background: transparent; }

        /* ── Miniatura teléfono ─────────────────────────────── */
        .phone-thumb {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; overflow: hidden; position: relative;
        }
        .phone-thumb-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: contain; padding: 4px;
        }
        .phone-thumb-skel {
          width: 44px; height: 44px;
          border-radius: 12px; background: #f1f5f9; flex-shrink: 0;
        }

        /* ── Esqueleto ──────────────────────────────────────── */
        .skel-linea { height: 12px; background: #e2e8f0; border-radius: 4px; margin-bottom: 6px; }
        .skel-linea.ancha { width: 140px; }
        .skel-linea.corta { height: 10px; width: 90px; background: #f1f5f9; }

        /* ── Item pedido ────────────────────────────────────── */
        .pedido-item {
          display: flex; gap: 14px; padding: 16px 0;
          border-bottom: 1px solid #f8fafc; align-items: flex-start;
        }
        .pedido-item-skel { align-items: center; }
        .pedido-item-body { flex: 1; min-width: 0; }
        .pedido-item-fila { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .pedido-modelo {
          margin: 0; font-weight: 700; font-size: 14px;
          color: #0f172a; font-family: 'Sora', sans-serif;
        }
        .pedido-specs    { margin: 2px 0 0; font-size: 12px; color: #64748b; }
        .pedido-precio-col { text-align: right; flex-shrink: 0; }
        .pedido-subtotal {
          margin: 0; font-weight: 800; font-size: 15px;
          color: #0f172a; font-family: 'Sora', sans-serif;
        }
        .pedido-precio-ud { margin: 0; font-size: 11px; color: #94a3b8; }
        .pedido-item-badges { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .pedido-estado {
          font-size: 10.5px; font-weight: 700;
          padding: 2px 8px; border-radius: 20px;
        }
        .pedido-unidades { font-size: 11px; color: #94a3b8; margin-left: auto; }

        /* ── Estados producto ───────────────────────────────── */
        .est-excelente { background: #d1fae5; color: #065f46; }
        .est-mbueno    { background: #dbeafe; color: #1e40af; }
        .est-bueno     { background: #fef9c3; color: #854d0e; }
        .est-aceptable { background: #fee2e2; color: #991b1b; }

        /* ── Tarjeta pedido ─────────────────────────────────── */
        .tarjeta-pedido {
          background: #fff;
          border-radius: 1.25rem;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(15,23,42,.04);
          transition: box-shadow .2s;
        }
        .tarjeta-pedido.abierta { box-shadow: 0 8px 32px rgba(15,23,42,.08); }
        .tarjeta-pedido-btn {
          width: 100%; background: none; border: none; cursor: pointer;
          padding: 1.25rem 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; text-align: left;
        }
        .tarjeta-pedido-izq {
          display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 0;
        }
        .pedido-icono {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 4px 10px rgba(99,102,241,.3);
        }
        .pedido-meta   { min-width: 0; }
        .pedido-num    { margin: 0; font-size: 11px; color: #94a3b8; font-weight: 800; letter-spacing: .5px; }
        .pedido-fecha  {
          margin: 2px 0 0; font-size: 15px; font-weight: 700;
          color: #0f172a; font-family: 'Sora', sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pedido-resumen { margin: 0; font-size: 12px; color: #64748b; }
        .tarjeta-pedido-der { display: flex; align-items: center; gap: .75rem; flex-shrink: 0; }
        .pedido-total-col { text-align: right; }
        .pedido-total-val {
          margin: 0; font-size: 1.125rem; font-weight: 800;
          color: #4f46e5; font-family: 'Sora', sans-serif;
        }
        .pedido-estado-badge {
          display: inline-block; margin-top: 4px;
          padding: 3px 10px; border-radius: 8px;
          font-size: 10px; font-weight: 800;
        }
        .est-pagado    { background: #d1fae5; color: #065f46; }
        .est-pendiente { background: #fef9c3; color: #854d0e; }
        .est-fallido   { background: #fee2e2; color: #991b1b; }
        .est-neutro    { background: #f1f5f9; color: #475569; }
        .pedido-flecha { transition: transform .2s; flex-shrink: 0; }
        .pedido-flecha.girada { transform: rotate(180deg); }

        /* ── Cuerpo desplegable ─────────────────────────────── */
        .tarjeta-pedido-body { padding: 0 1.5rem 1.25rem; border-top: 1px solid #f1f5f9; }
        .pedido-productos-titulo {
          margin: 1rem 0 .25rem; font-size: 11px; font-weight: 700;
          color: #94a3b8; text-transform: uppercase; letter-spacing: .7px;
        }
        .pedido-total-caja {
          margin-top: 1rem; padding: 1rem;
          background: #f8fafc; border-radius: .75rem; border: 1px solid #e2e8f0;
        }
        .pedido-total-fila { display: flex; justify-content: space-between; }
        .pedido-total-etiq {
          font-weight: 800; font-size: 15px;
          color: #0f172a; font-family: 'Sora', sans-serif;
        }
        .pedido-total-num {
          font-weight: 800; font-size: 17px;
          color: #4f46e5; font-family: 'Sora', sans-serif;
        }
        .pedido-factura-wrap { margin-top: .875rem; display: flex; justify-content: flex-end; }
        .btn-factura {
          padding: .5625rem 1.125rem;
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: .625rem;
          font-size: .8125rem; font-weight: 700; cursor: pointer;
          color: #0f172a; font-family: 'Sora', sans-serif;
          transition: background .15s;
        }
        .btn-factura:hover { background: #f1f5f9; }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 640px) {
          .op-page           { padding: 1.5rem .75rem 3rem; }
          .op-title          { font-size: 1.375rem; }
          .tarjeta-pedido-btn{ padding: 1rem; }
          .tarjeta-pedido-body{ padding: 0 1rem 1rem; }
          .pedido-fecha      { font-size: 13px; }
          .pedido-total-val  { font-size: 1rem; }
          .pedido-icono      { width: 34px; height: 34px; border-radius: 10px; }
          .tarjeta-pedido-izq{ gap: .625rem; }
        }

        @media (max-width: 400px) {
          .pedido-resumen    { display: none; }
          .pedido-estado-badge{ display: none; }
          .op-title          { font-size: 1.2rem; }
        }
      `}</style>
    </>
  );
}
