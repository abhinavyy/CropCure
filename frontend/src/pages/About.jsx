import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';
import Footer from '../components/Footer';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <h1>{t('aboutTitle')}</h1>
          <p>{t('aboutSubtitle')}</p>
        </header>

        <section className="about-content">
          <div className="about-text">
            <h2>{t('visionTitle')}</h2>
            <p>{t('visionDesc1')}</p>
            <p>{t('visionDesc2')}</p>
          </div>
          <div className="about-image">
            🚜
          </div>
        </section>

        {/* Global Impact Statistics Section */}
        <section className="impact-section">
          <h3>{t('challengeTitle')}</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">40%</div>
              <p className="stat-label">{t('stat1Label')}</p>
            </div>
            <div className="stat-card">
              <div className="stat-value">$220B+</div>
              <p className="stat-label">{t('stat2Label')}</p>
            </div>
            <div className="stat-card">
              <div className="stat-value">₹2L Cr</div>
              <p className="stat-label">{t('stat3Label')}</p>
            </div>
          </div>
          
        </section>

        <section className="mission-section">
          <h3>{t('whyChoose')}</h3>
          <div className="mission-grid">
            <div className="mission-item">
              <span>🧠</span>
              <h4>{t('aiPrecision')}</h4>
              <p>{t('aiPrecisionDesc')}</p>
            </div>
            <div className="mission-item">
              <span>🌍</span>
              <h4>{t('accessible')}</h4>
              <p>{t('accessibleDesc')}</p>
            </div>
            <div className="mission-item">
              <span>🛠️</span>
              <h4>{t('practical')}</h4>
              <p>{t('practicalDesc')}</p>
            </div>
          </div>
        </section>

        <section className="about-text" style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2>{t('commitment')}</h2>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            {t('commitmentDesc')}
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
