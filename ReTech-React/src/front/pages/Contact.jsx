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
      <Navbar />

      <main className="ct-page">

        {/* HERO */}
        <div className="ct-hero">
          <p className="ct-hero-tag">{c.heroTag}</p>
          <h1 className="ct-hero-title">{c.heroTitle1}<br/>{c.heroTitle2}</h1>
          <p className="ct-hero-desc">{c.heroParagraph}</p>
        </div>

        {/* HISTORIA Y ESTADÍSTICAS */}
        <div className="ct-section">
          <div className="ct-about-grid">
            <div className="ct-about-text">
              <p className="ct-section-label">{c.historyLabel}</p>
              <h2 className="ct-history-title">{c.historyTitle}</h2>
              <p>{c.historyP1}</p>
              <p>{c.historyP2}</p>
              <p>{c.historyP3}</p>
            </div>
            <div>
              <div className="ct-stats-row">
                <div className="ct-stat-cell">
                  <div className="ct-stat-num">12k+</div>
                  <div className="ct-stat-label">{c.statSold}</div>
                </div>
                <div className="ct-stat-cell">
                  <div className="ct-stat-num">42</div>
                  <div className="ct-stat-label">{c.statControl}</div>
                </div>
                <div className="ct-stat-cell">
                  <div className="ct-stat-num">98%</div>
                  <div className="ct-stat-label">{c.statSatisfied}</div>
                </div>
              </div>
              <div className="ct-cert-box">
                <p className="ct-cert-label">{c.certTitle}</p>
                <p className="ct-cert-desc">{c.certDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* INSTALACIONES */}
        <div className="ct-section">
          <p className="ct-section-label">{c.facilitiesLabel}</p>
          <h2 className="ct-facilities-title">{c.facilitiesTitle}</h2>
          <div className="ct-photos-grid">
            <div className="ct-photo-card">
              <div className="ct-photo-frame">
                <img src="/img/retechfuera.png" alt="Exterior" />
              </div>
              <p className="ct-photo-label">{c.workshopLabel}</p>
              <p className="ct-photo-desc">{c.workshopDesc}</p>
            </div>
            <div className="ct-photo-card">
              <div className="ct-photo-frame">
                <img src="/img/retechdentro.png" alt="Interior" />
              </div>
              <p className="ct-photo-label">{c.labLabel}</p>
              <p className="ct-photo-desc">{c.labDesc}</p>
            </div>
          </div>
        </div>

        {/* MAPA */}
        <div className="ct-map-section">
          <p className="ct-section-label">{c.mapLabel}</p>
          <h2 className="ct-map-title">Milà i Fontanals, Igualada</h2>
          <div className="ct-map-wrapper">
            <MapContainer center={OFFICE_COORDS} zoom={16} className="ct-map" scrollWheelZoom={false}>
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
        <div className="ct-award">
          <div className="ct-award-badge">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h2 className="ct-award-title">{c.awardTitle}</h2>
          <p className="ct-award-desc">{c.awardDesc}</p>
        </div>

        {/* REVIEWS */}
        <div className="ct-section">
          <div className="ct-reviews-header">
            <h2 className="ct-reviews-title">{c.reviewsTitle}</h2>
            <span className="ct-reviews-meta">{c.reviewsMeta}</span>
          </div>
          <div className="ct-reviews-grid">
            {c.reviews.map((rev, i) => (
              <div key={i} className="ct-review-card">
                <div className="ct-review-stars">
                  {[...Array(5)].map((_, starIdx) => (
                    <svg key={starIdx} width="13" height="13" viewBox="0 0 24 24" fill="#0f172a">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="ct-review-text">"{rev.text}"</p>
                <div className="ct-review-author">
                  <div className="ct-review-avatar">{rev.initial}</div>
                  <div>
                    <p className="ct-review-name">{rev.name}</p>
                    <p className="ct-review-date">{rev.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

        /* ── Variables ──────────────────────────────────────── */
        :root {
          --ct-text:        #0f172a;
          --ct-muted:       #64748b;
          --ct-border:      #e2e8f0;
          --ct-bg:          #ffffff;
          --ct-bg-soft:     #f8fafc;
          --ct-radius-lg:   20px;
          --ct-radius-md:   12px;
        }

        /* ── Página ─────────────────────────────────────────── */
        .ct-page {
          font-family: 'Inter', sans-serif;
          background: var(--ct-bg-soft);
          color: var(--ct-text);
        }

        /* ── Hero ───────────────────────────────────────────── */
        .ct-hero {
          padding: 5rem 2rem 4rem;
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
          border-bottom: 0.5px solid var(--ct-border);
        }
        .ct-hero-tag {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--ct-text);
          margin-bottom: 1.5rem;
          font-weight: 700;
        }
        .ct-hero-title {
          font-size: 42px;
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 1.25rem;
          letter-spacing: -1px;
          font-family: 'Sora', sans-serif;
        }
        .ct-hero-desc {
          font-size: 16px;
          color: var(--ct-muted);
          line-height: 1.7;
          max-width: 540px;
          margin: 0 auto;
        }

        /* ── Sección genérica ───────────────────────────────── */
        .ct-section {
          padding: 3rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .ct-section-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--ct-muted);
          margin-bottom: 1rem;
          font-weight: 600;
        }

        /* ── Grid about ─────────────────────────────────────── */
        .ct-about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .ct-about-text p {
          font-size: 15px;
          color: var(--ct-muted);
          line-height: 1.8;
          margin-bottom: 1.25rem;
        }

        /* ── Estadísticas ───────────────────────────────────── */
        .ct-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--ct-border);
          border: 0.5px solid var(--ct-border);
          border-radius: var(--ct-radius-lg);
          overflow: hidden;
          margin-top: 1rem;
        }
        .ct-stat-cell {
          background: var(--ct-bg);
          padding: 1.5rem;
          text-align: center;
        }
        .ct-stat-num {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: var(--ct-text);
          font-family: 'Sora', sans-serif;
        }
        .ct-stat-label { font-size: 12px; color: var(--ct-muted); margin-top: 4px; }

        /* ── Certificación ──────────────────────────────────── */
        .ct-cert-box {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: var(--ct-bg);
          border: 1px solid var(--ct-border);
          border-radius: var(--ct-radius-lg);
        }
        .ct-cert-label { font-size: 13px; color: var(--ct-text); font-weight: 700; margin-bottom: 5px; }
        .ct-cert-desc  { font-size: 14px; font-weight: 600; color: var(--ct-text); margin: 0; }

        /* ── Instalaciones ──────────────────────────────────── */
        .ct-history-title,
        .ct-facilities-title,
        .ct-map-title {
          font-size: 26px;
          font-weight: 800;
          font-family: 'Sora', sans-serif;
          margin-bottom: 1rem;
        }
        .ct-facilities-title { margin-bottom: 2rem; }
        .ct-map-title        { margin-bottom: 1.25rem; }

        .ct-photos-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .ct-photo-frame {
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: var(--ct-radius-lg);
          overflow: hidden;
          border: 0.5px solid var(--ct-border);
          position: relative;
        }
        .ct-photo-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ct-photo-label { font-size: 12px; font-weight: 700; margin-top: 12px; color: var(--ct-text); }
        .ct-photo-desc  { font-size: 14px; color: var(--ct-muted); margin: 4px 0 0; }

        /* ── Mapa ───────────────────────────────────────────── */
        .ct-map-section {
          padding: 0 2rem 3rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .ct-map-wrapper {
          border-radius: var(--ct-radius-lg);
          overflow: hidden;
          border: 0.5px solid var(--ct-border);
          height: 380px;
        }
        .ct-map { width: 100%; height: 100%; }

        /* ── Premio ─────────────────────────────────────────── */
        .ct-award {
          padding: 4rem 2rem;
          background: #0f172a;
          color: white;
          text-align: center;
          border-radius: 30px;
          margin: 0 2rem;
        }
        .ct-award-badge {
          width: 100px; height: 100px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          margin: 0 auto 1.5rem;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
        }
        .ct-award-title {
          font-size: 24px;
          font-weight: 800;
          font-family: 'Sora', sans-serif;
          margin: 0 0 0.5rem;
        }
        .ct-award-desc { opacity: 0.8; font-size: 15px; margin: 0; }

        /* ── Reseñas ────────────────────────────────────────── */
        .ct-reviews-header { margin-bottom: 0; }
        .ct-reviews-title {
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.5px;
          margin: 0 0 0.25rem;
        }
        .ct-reviews-meta { font-size: 13px; color: var(--ct-muted); }
        .ct-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .ct-review-card {
          background: var(--ct-bg);
          border: 1px solid var(--ct-border);
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(15,23,42,0.03);
        }
        .ct-review-stars { display: flex; gap: 3px; margin-bottom: 0.75rem; }
        .ct-review-text {
          font-size: 14px;
          color: var(--ct-muted);
          line-height: 1.6;
          margin-bottom: 1rem;
          font-style: italic;
        }
        .ct-review-author { display: flex; align-items: center; gap: 10px; }
        .ct-review-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 12px;
          flex-shrink: 0;
        }
        .ct-review-name { font-size: 13px; font-weight: 500; margin: 0; }
        .ct-review-date { font-size: 11px; color: var(--ct-muted); margin: 0; }

        /* ── Responsive ─────────────────────────────────────── */
        @media (max-width: 768px) {
          .ct-about-grid,
          .ct-photos-grid,
          .ct-reviews-grid { grid-template-columns: 1fr; }
          .ct-hero-title   { font-size: 32px; }
          .ct-award        { margin: 0 1rem; }
          .ct-map-wrapper  { height: 260px; }
          .ct-stats-row    { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 640px) {
          .ct-hero         { padding: 3.5rem 1.25rem 3rem; }
          .ct-hero-title   { font-size: 26px; }
          .ct-hero-desc    { font-size: 14px; }
          .ct-section      { padding: 2rem 1.25rem; }
          .ct-map-section  { padding: 0 1.25rem 2rem; }
          .ct-award        { padding: 2.5rem 1.25rem; margin: 0 1rem; border-radius: 20px; }
          .ct-award-badge  { width: 80px; height: 80px; }
          .ct-award-title  { font-size: 20px; }
          .ct-award-desc   { font-size: 13.5px; }
          .ct-stat-num     { font-size: 24px; }
          .ct-stat-cell    { padding: 1rem 0.5rem; }
          .ct-reviews-title { font-size: 22px; }
        }

        @media (max-width: 480px) {
          .ct-hero-title    { font-size: 22px; letter-spacing: -0.5px; }
          .ct-stats-row     { grid-template-columns: 1fr; gap: 0; }
          .ct-map-wrapper   { height: 220px; }
          .ct-review-card   { padding: 1.25rem; }
          .ct-history-title,
          .ct-facilities-title,
          .ct-map-title     { font-size: 21px; }
        }

      `}</style>
    </>
  );
}
