import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

// Reutilizamos el formateador que ya tienes para mantener coherencia
const fmt = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export default function AboutPage() {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        :root {
          --color-text-primary: #0f172a;
          --color-text-secondary: #64748b;
          --color-border-tertiary: #e2e8f0;
          --color-background-primary: #ffffff;
          --color-background-secondary: #f8fafc;
          --border-radius-lg: 20px;
          --border-radius-md: 12px;
        }

        .about-container { font-family: 'Inter', sans-serif; background: #f8fafc; color: var(--color-text-primary); }
        
        .hero { padding: 5rem 2rem 4rem; max-width: 760px; margin: 0 auto; text-align: center; border-bottom: 0.5px solid var(--color-border-tertiary); }
        .hero-tag { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #0f172a; margin-bottom: 1.5rem; font-weight: 700; }
        .hero h1 { font-size: 42px; font-weight: 800; line-height: 1.15; margin-bottom: 1.25rem; letter-spacing: -1px; fontFamily: 'Sora', sans-serif; }
        .hero p { font-size: 16px; color: var(--color-text-secondary); line-height: 1.7; max-width: 540px; margin: 0 auto; }

        .section { padding: 3rem 2rem; max-width: 1000px; margin: 0 auto; }
        .section-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: 600; }
        
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
        .about-text p { font-size: 15px; color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 1.25rem; }

        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--color-border-tertiary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); overflow: hidden; margin-top: 1rem; }
        .stat-cell { background: var(--color-background-primary); padding: 1.5rem; text-align: center; }
        .stat-num { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: #0f172a; font-family: 'Sora', sans-serif; }
        .stat-lbl { font-size: 12px; color: var(--color-text-secondary); margin-top: 4px; }

        .photos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .photo-frame { width: 100%; aspect-ratio: 16/10; border-radius: var(--border-radius-lg); overflow: hidden; border: 0.5px solid var(--color-border-tertiary); position: relative; }
        .photo-frame img { width: 100%; height: 100%; object-fit: cover; }

        .award-section { padding: 4rem 2rem; background: #0f172a; color: white; text-align: center; border-radius: 30px; margin: 0 2rem; }
        .award-badge { width: 100px; height: 100px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#6366f1,#4f46e5); }
        .award-title { font-size: 24px; font-weight: 800; font-family: 'Sora', sans-serif; margin-bottom: 0.5rem; }

        .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 2rem; }
        .review-card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(15,23,42,0.03); }
        .review-text { font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1rem; font-style: italic; }
        .review-avatar { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; }

        @media (max-width: 768px) {
          .about-grid, .photos-grid, .reviews-grid { grid-template-columns: 1fr; }
          .hero h1 { font-size: 32px; }
          .award-section { margin: 0 1rem; }
        }
      `}</style>
     
      <Navbar />

      <main className="about-container">
        {/* HERO */}
        <div className="hero">
          <p className="hero-tag">Sobre ReTech</p>
          <h1>Tecnología de calidad.<br/>Precio honesto.</h1>
          <p>Damos una segunda vida a los mejores dispositivos del mercado con revisión técnica certificada y compromiso real con el planeta.</p>
        </div>

        {/* HISTORIA Y STATS */}
        <div className="section">
          <div className="about-grid">
            <div className="about-text">
              <p className="section-label">Nuestra historia</p>
              <h2 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Sora, sans-serif', marginBottom: '1rem' }}>
                Nacidos para cambiar la forma de comprar móviles
              </h2>
              <p>ReTech va néixer el 2019 amb una idea simple: per què llençar un dispositiu perfectament funcional quan es pot restaurar i donar-li una nova vida? Des d'aleshores hem processat més de 12.000 dispositius des del nostre taller a Barcelona.</p>
            <p>Cada mòbil passa per un procés de revisió de 42 punts: pantalla, bateria, càmera, connectors, software. Si no supera els nostres estàndards, no surt a la venda. Així de senzill.</p>
            <p>Treballem amb els principals fabricants — Apple, Samsung, Xiaomi — per garantir que els recanvis siguin originals i que la teva experiència sigui idèntica a la d'un dispositiu nou.</p>
            </div>
            <div>
              <div className="stats-row">
                <div className="stat-cell">
                  <div className="stat-num">12k+</div>
                  <div className="stat-lbl">Vendidos</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-num">42</div>
                  <div className="stat-lbl">Puntos Control</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-num">98%</div>
                  <div className="stat-lbl">Satisfechos</div>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px' }}>
                <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700, marginBottom: '5px' }}>CERTIFICACIÓN RE-TECH</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Todos los dispositivos incluyen 12 meses de garantía y 30 días de devolución.</p>
              </div>
            </div>
          </div>
        </div>

        {/* INSTALACIONES */}
        <div className="section">
          <p className="section-label">Instalaciones</p>
          <h2 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Sora, sans-serif', marginBottom: '2rem' }}>Donde ocurre la magia</h2>
          <div className="photos-grid">
            <div className="photo-card">
              <div className="photo-frame">
                <img src="/img/retechfuera.png" alt="Exterior" />
              </div>
              <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '12px', color: '#0f172a' }}>TALLER CENTRAL</p>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Nuestro centro de revisión técnica en el distrito tecnológico de Barcelona.</p>
            </div>
            <div className="photo-card">
              <div className="photo-frame">
                <img src="/img/retechdentro.png" alt="Interior" />
              </div>
              <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '12px', color: '#0f172a' }}>LABORATORIO</p>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Equipamiento de precisión para garantizar el estado óptimo de cada batería y pantalla.</p>
            </div>
          </div>
        </div>

        {/* PREMIO */}
        <div className="award-section">
          <div className="award-badge">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h2 className="award-title">Mejor tienda reacondicionada 2024</h2>
          <p style={{ opacity: 0.8, fontSize: '15px' }}>Basado en +1.400 valoraciones reales verificadas</p>
        </div>

        {/* REVIEWS */}
        {/* SECCIÓ DE RESSENYES */}
            <div className="section">
            <div className="reviews-header">
                <h2 style={{ fontSize: '28px', fontWeight: 500, letterSpacing: '-0.5px' }}>El que diuen els nostres clients</h2>
                <span className="reviews-meta">+1.400 ressenyes verificades · Mitjana 4.9/5</span>
            </div>

            <div className="reviews-grid">
                {[
                {
                    name: "Marc Andreu",
                    date: "Febrer 2025 · iPhone 13",
                    text: "Vaig comprar un iPhone 13 i sembla nou de trinca. La bateria al 96%, la pantalla impecable i va arribar en 24h. Impossible trobar millor relació qualitat-preu.",
                    initial: "MA"
                },
                {
                    name: "Laura Puig",
                    date: "Gener 2025 · Samsung S23",
                    text: "Tercera vegada que compro a ReTech. L'atenció al client és excel·lent — vaig tenir un dubte amb la garantia i en menys d'una hora ja tenia resposta. Totalment recomanat.",
                    initial: "LP"
                },
                {
                    name: "Jordi Casamitjana",
                    date: "Març 2025 · Xiaomi 13",
                    text: "Em van trucar per confirmar l'estat del mòbil abans d'enviar-lo. Detalls com aquest marquen la diferència. El Xiaomi que vaig rebre funcionava perfectament.",
                    initial: "JC"
                },
                {
                    name: "Rosa Guitart",
                    date: "Abril 2025 · iPhone 12 Pro",
                    text: "Estic molt content. El procés de compra és molt fàcil i la pàgina ben explicada. En 2 dies tenia el mòbil a casa i tot en perfecte estat. Repetiré segur.",
                    initial: "RG"
                },
                {
                    name: "Pere Sala",
                    date: "Febrer 2025 · Samsung A54",
                    text: "He comprat per a tota la família. La garantia d'un any és real i funciona. Quan van tenir un problema amb el mòbil del meu fill, ho van solucionar sense cap cost.",
                    initial: "PS"
                },
                {
                    name: "Núria Torras",
                    date: "Març 2025 · iPhone 14",
                    text: "Sóc tècnic informàtic i he revisat el mòbil a fons. Tot impecable. Recanvis originals, software net, bateria en bon estat. Saben el que fan i es nota.",
                    initial: "NT"
                }
                ].map((rev, i) => (
                <div key={i} className="review-card">
                    <div className="review-stars" style={{ display: 'flex', gap: '3px', marginBottom: '0.75rem' }}>
                    {[...Array(5)].map((_, starIdx) => (
                        <svg key={starIdx} width="13" height="13" viewBox="0 0 24 24" fill="var(--color-text-primary)">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    ))}
                    </div>
                    <p className="review-text" style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                    "{rev.text}"
                    </p>
                    <div className="review-author" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="review-avatar">{rev.initial}</div>
                    <div>
                        <p className="review-name" style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{rev.name}</p>
                        <p className="review-date" style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>{rev.date}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
      </main>

      <Footer />
    </>
  );
}