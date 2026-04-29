import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Home.css";
import videoBg from "../assets/v1.mp4";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { t } = useLanguage();

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleFeatureSelect = (path) => {
    setShowModal(false);
    navigate(path);
  };

  const goToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Page Section with Video */}
      <section className="page-section">
        <video
          className="page-video"
          autoPlay
          loop
          muted
          playsInline
          src={videoBg}
        />

        {/* Hero Section */}
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{t('heroTitle')}</h1>
            <h2>{t('heroSubtitle')}</h2>
            
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => goToSection("features")}>
                {t('getStarted')}
              </button>
              <button className="btn-secondary" onClick={() => navigate("/plant-disease")}>
                {t('tryAi')}
              </button>
            </div>

          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <span>{t('scroll')}</span>
            <div className="scroll-line"></div>
          </div>
        </div>

        {/* Global Impact Section */}
        <section className="impact-section-home">
          <div className="section-header">
            <h2>{t('challengeTitle')}</h2>
            <p>{t('challengeSubtitle')}</p>
          </div>
          
          <div className="stats-grid-home">
            <div className="stat-card-home">
              <div className="stat-value-home">40%</div>
              <p className="stat-label-home">{t('stat1Label')}</p>
            </div>
            <div className="stat-card-home">
              <div className="stat-value-home">$220B+</div>
              <p className="stat-label-home">{t('stat2Label')}</p>
            </div>
            <div className="stat-card-home">
              <div className="stat-value-home">₹2L Cr</div>
              <p className="stat-label-home">{t('stat3Label')}</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="features-section" id="features">
          <div className="section-header">
            <h2>{t('ourFeatures')}</h2>
            <p>{t('featuresSubtitle')}</p>
          </div>

          <div className="features-container">
            {/* 01: Plant Disease Detection */}
            <div
              className="feature-card-improved"
              data-number="01"
              onClick={() => navigate("/plant-disease")}
            >
              <div className="feature-icon-improved">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L4.5 9C4.5 9 3 10.5 3 13C3 15.5 5 17.5 7.5 17.5C10 17.5 12 15.5 12 13V2Z" />
                  <path d="M12 2L19.5 9C19.5 9 21 10.5 21 13C21 15.5 19 17.5 16.5 17.5C14 17.5 12 15.5 12 13V2Z" />
                  <path d="M12 13V22" />
                </svg>
              </div>
              <div className="feature-content-improved">
                <h3>{t('diseaseTitle')}</h3>
                <p>{t('diseaseDesc')}</p>
                <span className="feature-link-improved">{t('diseaseBtn')} →</span>
              </div>
            </div>

            {/* 02: INDOOR PLANT TECHNIQUES */}
            <div
              className="feature-card-improved"
              data-number="02"
              onClick={() => navigate("/indoor-plants")}
            >
              <div className="feature-icon-improved">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                  <path d="M12 7v3M10 8h4" />
                </svg>
              </div>
              <div className="feature-content-improved">
                <h3>{t('indoorTitle')}</h3>
                <p>{t('indoorDesc')}</p>
                <span className="feature-link-improved">{t('indoorBtn')} →</span>
              </div>
            </div>

            {/* 03: Crop Intelligence */}
            <div
              className="feature-card-improved"
              data-number="03"
              onClick={() => navigate("/news")}
            >
              <div className="feature-icon-improved">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2z" />
                  <path d="M14 2v6h6" />
                  <path d="M7 10h4M7 14h10M7 18h10" />
                </svg>
              </div>
              <div className="feature-content-improved">
                <h3>{t('newsTitle')}</h3>
                <p>{t('newsDesc')}</p>
                <span className="feature-link-improved">{t('newsBtn')} →</span>
              </div>
            </div>

            {/* 04: Crop Calendar */}
            <div
              className="feature-card-improved"
              data-number="04"
              onClick={() => navigate("/crop-planner")}
            >
              <div className="feature-icon-improved">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                </svg>
              </div>
              <div className="feature-content-improved">
                <h3>{t('calendarTitle')}</h3>
                <p>{t('calendarDesc')}</p>
                <span className="feature-link-improved">{t('calendarBtn')} →</span>
              </div>
            </div>
            
            {/* 05: Weather Forecast */}
            <div
              className="feature-card-improved"
              data-number="05"
              onClick={() => navigate("/weather")}
            >
              <div className="feature-icon-improved">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                </svg>
              </div>
              <div className="feature-content-improved">
                <h3>{t('weatherTitle')}</h3>
                <p>{t('weatherDesc')}</p>
                <span className="feature-link-improved">{t('weatherBtn')} →</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>{t('heroSubtitle')}</h2>
            <h3>{t('diseaseDesc')}</h3>
          </div>
        </div>

        {/* Footer Section */}
        <Footer />
      </section>
    </>
  );
};

export default Home;