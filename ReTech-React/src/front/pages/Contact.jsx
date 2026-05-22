import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useIdioma } from "../context/LanguageContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

const OFFICE_COORDS = [41.5836374, 1.6018583];

export default function AboutPage() {
  const { t } = useIdioma();
  const c = t("contact");

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

        .map-section { padding: 0 2rem 3rem; max-width: 1000px; margin: 0 auto; }
        .map-wrapper { border-radius: var(--border-radius-lg); overflow: hidden; border: 0.5px solid var(--color-border-tertiary); height: 380px; }

        .historia-titulo { font-size: 26px; font-weight: 800; font-family: 'Sora', sans-serif; margin-bottom: 1rem; }
        .instalaciones-titulo { font-size: 26px; font-weight: 800; font-family: 'Sora', sans-serif; margin-bottom: 2rem; }
        .mapa-titulo { font-size: 26px; font-weight: 800; font-family: 'Sora', sans-serif; margin-bottom: 1.25rem; }
        .cert-caja { margin-top: 1.5rem; padding: 1.5rem; background: white; border: 1px solid #e2e8f0; border-radius: 20px; }
        .cert-titulo { font-size: 13px; color: #0f172a; font-weight: 700; margin-bottom: 5px; }
        .cert-desc { font-size: 14px; font-weight: 600; color: #0f172a; }
        .foto-etiq { font-size: 12px; font-weight: 700; margin-top: 12px; color: #0f172a; }
        .foto-desc { font-size: 14px; color: #64748b; }
        .reviews-titulo { font-size: 28px; font-weight: 500; letter-spacing: -0.5px; }
        .review-stars { display: flex; gap: 3px; margin-bottom: 0.75rem; }
        .award-desc-texto { opacity: 0.8; font-size: 15px; }
        .review-autor-wrap { display: flex; align-items: center; gap: 10px; }
        .review-nombre { font-size: 13px; font-weight: 500; margin: 0; }
        .review-fecha { font-size: 11px; color: var(--color-text-secondary); margin: 0; }

        @media (max-width: 768px) {
          .about-grid, .photos-grid, .reviews-grid { grid-template-columns: 1fr; }
          .hero h1 { font-size: 32px; }
          .award-section { margin: 0 1rem; }
          .map-wrapper { height: 260px; }
        }
      `}</style>

      <Navbar />

      <main className="about-container">
        {/* HERO */}
        <div className="hero">
          <p className="hero-tag">{c.heroTag}</p>
          <h1>{c.heroTitle1}<br/>{c.heroTitle2}</h1>
          <p>{c.heroParagraph}</p>
        </div>

        {/* HISTÒRIA I ESTADÍSTIQUES */}
        <div className="section">
          <div className="about-grid">
            <div className="about-text">
              <p className="section-label">{c.historyLabel}</p>
              <h2 className="historia-titulo">{c.historyTitle}</h2>
              <p>{c.historyP1}</p>
              <p>{c.historyP2}</p>
              <p>{c.historyP3}</p>
            </div>
            <div>
              <div className="stats-row">
                <div className="stat-cell">
                  <div className="stat-num">12k+</div>
                  <div className="stat-lbl">{c.statSold}</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-num">42</div>
                  <div className="stat-lbl">{c.statControl}</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-num">98%</div>
                  <div className="stat-lbl">{c.statSatisfied}</div>
                </div>
              </div>
              <div className="cert-caja">
                <p className="cert-titulo">{c.certTitle}</p>
                <p className="cert-desc">{c.certDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* INSTALACIONES */}
        <div className="section">
          <p className="section-label">{c.facilitiesLabel}</p>
          <h2 className="instalaciones-titulo">{c.facilitiesTitle}</h2>
          <div className="photos-grid">
            <div className="photo-card">
              <div className="photo-frame">
                <img src="/img/retechfuera.png" alt="Exterior" />
              </div>
              <p className="foto-etiq">{c.workshopLabel}</p>
              <p className="foto-desc">{c.workshopDesc}</p>
            </div>
            <div className="photo-card">
              <div className="photo-frame">
                <img src="/img/retechdentro.png" alt="Interior" />
              </div>
              <p className="foto-etiq">{c.labLabel}</p>
              <p className="foto-desc">{c.labDesc}</p>
            </div>
          </div>
        </div>

        {/* MAPA */}
        <div className="map-section">
          <p className="section-label">{c.mapLabel}</p>
          <h2 className="mapa-titulo">Milà i Fontanals, Igualada</h2>
          <div className="map-wrapper">
            <MapContainer center={OFFICE_COORDS} zoom={16} className="w-full h-full" scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={OFFICE_COORDS}>
                <Popup>
                  <strong>ReTech</strong><br />
                  Institut Milà i Fontanals<br />
                  Igualada, Barcelona
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* PREMIO */}
        <div className="award-section">
          <div className="award-badge">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h2 className="award-title">{c.awardTitle}</h2>
          <p className="award-desc-texto">{c.awardDesc}</p>
        </div>

        {/* REVIEWS */}
        <div className="section">
          <div className="reviews-header">
            <h2 className="reviews-titulo">{c.reviewsTitle}</h2>
            <span className="reviews-meta">{c.reviewsMeta}</span>
          </div>

          <div className="reviews-grid">
            {c.reviews.map((rev, i) => (
              <div key={i} className="review-card">
                <div className="review-stars">
                  {[...Array(5)].map((_, starIdx) => (
                    <svg key={starIdx} width="13" height="13" viewBox="0 0 24 24" fill="var(--color-text-primary)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="review-text">"{rev.text}"</p>
                <div className="review-autor-wrap">
                  <div className="review-avatar">{rev.initial}</div>
                  <div>
                    <p className="review-nombre">{rev.name}</p>
                    <p className="review-fecha">{rev.date}</p>
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
