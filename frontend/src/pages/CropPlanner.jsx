import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLanguage } from "../context/LanguageContext";
import cropsJsonData from "../data/crops.json";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const regionColors = {
  "Andhra Pradesh": "#0d9488",
  "Arunachal Pradesh": "#10B981",
  "Assam and North Eastern States": "#F59E0B",
  "Bihar": "#EF4444",
  "Goa": "#8B5CF6",
  "Haryana": "#0d9488",
  "Jharkhand": "#10B981",
  "Karnataka": "#F59E0B",
  "Maharashtra": "#EF4444",
  "Odisha": "#8B5CF6",
  "Punjab": "#0d9488",
  "Rajasthan": "#10B981",
  "Tamil Nadu": "#F59E0B",
  "Uttar Pradesh": "#EF4444",
  "West Bengal": "#8B5CF6",
};

const CropPlanner = () => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState(cropsJsonData[0].region);
  const [filteredCrops, setFilteredCrops] = useState([]);

  useEffect(() => {
    const regionData = cropsJsonData.find((r) => r.region === selectedRegion);
    if (regionData) {
      setFilteredCrops(regionData.crops);
    }
  }, [selectedRegion]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const crops = payload.filter(p => p.value === 1).map(p => p.name);
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Month: ${label}`}</p>
          <p className="tooltip-intro">Crops to plant:</p>
          {crops.map(crop => (
            <p key={crop} className="tooltip-item">{`• ${crop}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CropPlantingChart = ({ crops }) => {
    const COLORS = [
      "#0d9488", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0",
      "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"
    ];

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const chartData = months.map(month => {
      const entry = { month };
      crops.forEach(crop => {
        entry[crop.crop] = crop.plantingMonths.includes(month) ? 1 : 0;
      });
      return entry;
    });

    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            {crops.map((crop, idx) => (
              <Bar
                key={idx}
                dataKey={crop.crop}
                stackId="a"
                radius={[4, 4, 0, 0]}
                fill={COLORS[idx % COLORS.length]}
                isAnimationActive={true}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const CropCard = ({ crop }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <div className={`crop-card ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
        <div className="crop-card-header">
          <h3>{crop.crop}</h3>
          <span className="season-tag" style={{ background: '#f0fdf4', color: '#166534' }}>
            {crop.plantingMonths.length > 6 ? 'Year Round' : 'Seasonal'}
          </span>
        </div>
        <div className="planting-pills">
          {crop.plantingMonths.slice(0, 4).map(m => (
            <span key={m} className="month-pill">{m}</span>
          ))}
          {crop.plantingMonths.length > 4 && <span className="month-pill">+{crop.plantingMonths.length - 4}</span>}
        </div>
        {isExpanded && (
          <div className="recommendation-box">
            <strong>Guidance:</strong>
            <p>{crop.recommendation}</p>
          </div>
        )}
        <div className="expand-hint">{isExpanded ? 'Show less' : 'Click to expand'}</div>
      </div>
    );
  };

  return (
    <div className="crop-planner-page">
      <NavBar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        
        .crop-planner-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Outfit', sans-serif;
          color: #1e293b;
          padding-bottom: 0;
          position: relative;
          overflow-x: hidden;
        }

        /* Entrance Animation */
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-up {
          animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .planner-hero {
          background: linear-gradient(rgba(20, 83, 45, 0.85), rgba(6, 78, 59, 0.95)),
                      url('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          padding: 160px 20px 100px;
          text-align: center;
          color: white;
          clip-path: ellipse(150% 100% at 50% 0%);
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .planner-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -1.5px; text-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .planner-hero p { font-size: 1.25rem; max-width: 700px; margin: 0 auto; opacity: 0.95; font-weight: 500; }

        .main-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 20px 80px; 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 2rem; 
          position: relative; 
          z-index: 2; 
        }
        @media (min-width: 1024px) { 
          .main-container { grid-template-columns: 300px 1fr; gap: 3rem; } 
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 1);
          border-radius: 32px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.04);
        }

        .card-header-main { 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          margin-bottom: 2rem; 
          color: #0d9488; 
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1.5rem;
        }
        .card-header-main i { font-size: 1.5rem; background: #f0fdfa; padding: 10px; border-radius: 12px; }
        .card-header-main h2 { font-size: 1.5rem; margin: 0; font-weight: 800; letter-spacing: -0.5px; }

        .modern-select {
          width: 100%;
          padding: 16px 20px;
          border-radius: 16px;
          border: 2px solid #f1f5f9;
          background: #f8fafc;
          font-size: 1.05rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.3s;
          appearance: none;
        }
        .modern-select:focus { outline: none; border-color: #0d9488; background: white; box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1); }

        .chart-container { background: white; border-radius: 24px; padding: 1rem; }
        
        .crop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .crop-card {
          background: white;
          border-radius: 28px;
          padding: 1.8rem;
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .crop-card:hover { transform: translateY(-8px); border-color: #0d9488; box-shadow: 0 20px 40px rgba(13, 148, 136, 0.1); }
        .crop-card-header h3 { font-size: 1.4rem; margin: 0; font-weight: 800; color: #0f172a; margin-bottom: 0.4rem; }
        
        .season-tag { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #059669; }

        .month-pill {
          display: inline-block;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-right: 6px;
          margin-top: 8px;
          color: #64748b;
        }
        
        .recommendation-box { 
          margin-top: 1.5rem; 
          padding-top: 1.5rem; 
          border-top: 1px dashed #e2e8f0; 
          font-size: 0.95rem; 
          line-height: 1.6; 
          color: #334155;
          animation: fadeIn 0.4s ease;
        }

        .recommendation-box strong { color: #0d9488; font-weight: 800; display: block; margin-bottom: 6px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .expand-hint { text-align: center; margin-top: auto; padding-top: 1.5rem; font-size: 0.7rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }

        .custom-tooltip { background: white; padding: 1.2rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .tooltip-label { font-weight: 800; color: #0d9488; margin-bottom: 6px; font-size: 1rem; }
        .tooltip-intro { font-size: 0.8rem; color: #64748b; margin-bottom: 8px; font-weight: 600; }
        .tooltip-item { font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 2px 0; }
      `}</style>

      <section className="planner-hero">
        <h1 className="animate-up">🌿 {t('plannerTitle')}</h1>
        <p className="animate-up" style={{ animationDelay: '0.1s' }}>{t('plannerSubtitle')}</p>
      </section>

      <div className="main-container animate-up" style={{ animationDelay: '0.3s' }}>
        <aside>
          <div className="glass-card">
            <div className="card-header-main">
              <i>📍</i>
              <h2>Location</h2>
            </div>
            <div style={{ position: 'relative' }}>
              <select
                className="modern-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {cropsJsonData.map((loc, idx) => (
                  <option key={idx} value={loc.region}>{loc.region}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>▼</span>
            </div>
          </div>
        </aside>

        <div className="content-area">
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <div className="card-header-main">
              <i>📊</i>
              <h2>Planting Calendar</h2>
            </div>
            <CropPlantingChart crops={filteredCrops} />
          </div>

          <div className="crops-list">
            <div className="card-header-main">
              <i>🌾</i>
              <h2>Suitable Crops</h2>
            </div>
            <div className="crop-grid">
              {filteredCrops.map((crop, idx) => (
                <CropCard key={idx} crop={crop} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CropPlanner;