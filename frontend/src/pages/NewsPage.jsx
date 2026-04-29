import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import API_BASE_URL from '../config/api';

const NewsPage = () => {
  const { t } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      const data = await response.json();
      if (data.results) {
        setNews(data.results);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Unable to fetch news. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-page">
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        
        .news-page { 
          min-height: 100vh; 
          background: #f8fafc; 
          font-family: 'Outfit', sans-serif; 
          color: #1e293b; 
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-up {
          animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .news-hero {
          background: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)),
                      url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          padding: 160px 20px 100px;
          text-align: center;
          color: white;
          clip-path: ellipse(150% 100% at 50% 0%);
          margin-bottom: 2rem;
        }
        .news-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -1px; }
        .news-hero p { font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }

        .news-container { max-width: 1200px; margin: 0 auto; padding: 0 20px 80px; }
        
        .news-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
          gap: 2rem; 
        }

        .news-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .news-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: #10b981;
        }

        .news-content { padding: 2rem; flex-grow: 1; display: flex; flex-direction: column; }
        .news-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.3; color: #0f172a; }
        .news-snippet { color: #64748b; font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1; }
        
        .news-meta { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding-top: 1.5rem; 
          border-top: 1px solid #f1f5f9; 
        }
        .news-source { font-weight: 700; color: #10b981; font-size: 0.9rem; }
        .read-more { 
          color: #0f172a; 
          font-weight: 800; 
          text-decoration: none; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          transition: color 0.2s;
        }
        .read-more:hover { color: #10b981; }

        .loading-state { text-align: center; padding: 100px 0; }
        .spinner { 
          width: 50px; 
          height: 50px; 
          border: 5px solid #f1f5f9; 
          border-top-color: #10b981; 
          border-radius: 50%; 
          animation: spin 1s linear infinite; 
          margin: 0 auto 20px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-card { 
          background: #fef2f2; 
          border: 1px solid #fee2e2; 
          border-radius: 20px; 
          padding: 2rem; 
          text-align: center; 
          color: #991b1b; 
        }

        @media (max-width: 768px) {
          .news-hero h1 { font-size: 2.5rem; }
          .news-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="news-hero">
        <h1 className="animate-up">🌾 Crop Intelligence</h1>
        <p className="animate-up" style={{ animationDelay: '0.1s' }}>Latest agricultural news and market insights directly from global experts.</p>
      </section>

      <div className="news-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p style={{ fontWeight: 600, color: '#64748b' }}>Scanning agricultural portals...</p>
          </div>
        ) : error ? (
          <div className="error-card animate-up">
            <i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Connection Issue</h2>
            <p>{error.includes('key') ? 'Please configure your TAVILY_API_KEY in the backend .env file.' : error}</p>
            <button 
              onClick={fetchNews}
              style={{ marginTop: '1.5rem', background: '#991b1b', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="news-grid">
            {news.map((item, idx) => (
              <div key={idx} className="news-card animate-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="news-content">
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-snippet">{item.content.substring(0, 180)}...</p>
                  <div className="news-meta">
                    <span className="news-source">📌 {new URL(item.url).hostname}</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="read-more">
                      Read Full <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewsPage;
