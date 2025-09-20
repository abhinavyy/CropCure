import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import cropsJsonData from "../data/crops.json"; // Assuming the file is named crops_json.json

// Data for regions and colors can be a simple mapping
const regionColors = {
  "Andhra Pradesh": "#3B82F6",
  "Arunachal Pradesh": "#10B981",
  "Assam and North Eastern States": "#F59E0B",
  "Bihar": "#EF4444",
  "Goa": "#8B5CF6",
  "Haryana": "#3B82F6",
  "Jharkhand": "#10B981",
  "Karnataka": "#F59E0B",
  "Maharashtra": "#EF4444",
  "Odisha": "#8B5CF6",
  "Punjab": "#3B82F6",
  "Rajasthan": "#10B981",
  "Tamil Nadu": "#F59E0B",
  "Uttar Pradesh": "#EF4444",
  "West Bengal": "#8B5CF6",
};

const CropPlanner = () => {
  // Use the first region from the imported data as the initial selected region
  const [selectedRegion, setSelectedRegion] = useState(cropsJsonData[0].region);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [regionColor, setRegionColor] = useState(regionColors[cropsJsonData[0].region]);

  // Update crops when the selected region changes
  useEffect(() => {
    // Find the object in the cropsJsonData array that matches the selected region
    const regionData = cropsJsonData.find((r) => r.region === selectedRegion);

    // If a match is found, update the filteredCrops state and region color
    if (regionData) {
      setFilteredCrops(regionData.crops);
      setRegionColor(regionColors[regionData.region] || "#3B82F6"); // Fallback color
    } else {
      setFilteredCrops([]);
      setRegionColor("#3B82F6"); // Fallback color
    }
  }, [selectedRegion]); // This effect runs only when selectedRegion changes

  // Custom Tooltip Component (same as before)
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

  // Crop Planting Chart Component (same as before)
  const CropPlantingChart = ({ crops }) => {
    const COLORS = [
      "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5",
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            {crops.map((crop, idx) => (
              <Bar
                key={idx}
                dataKey={crop.crop}
                stackId="a"
                radius={[6, 6, 0, 0]}
                fill={COLORS[idx % COLORS.length]}
                isAnimationActive={true}
                animationDuration={800}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Crop Card Component (same as before)
  const CropCard = ({ crop }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };

    const getSeasonColor = (months) => {
      if (months.includes("Dec") || months.includes("Jan") || months.includes("Feb")) {
        return "#93c5fd"; // Winter blue
      } else if (months.includes("Mar") || months.includes("Apr") || months.includes("May")) {
        return "#86efac"; // Spring green
      } else if (months.includes("Jun") || months.includes("Jul") || months.includes("Aug")) {
        return "#fde047"; // Summer yellow
      } else {
        return "#fdba74"; // Autumn orange
      }
    };

    const seasonColor = getSeasonColor(crop.plantingMonths);

    return (
      <div
        className={`crop-card ${isExpanded ? 'expanded' : ''}`}
        style={{ borderLeftColor: seasonColor }}
        onClick={toggleExpand}
      >
        <div className="card-header">
          <h3 className="crop-name">{crop.crop}</h3>
        </div>

        <div className="season-indicator">
          <span className="season-dot" style={{backgroundColor: seasonColor}}></span>
          <span className="season-text">
            {crop.plantingMonths.length > 6 ? "Year-round" : "Seasonal"}
          </span>
        </div>

        <div className="crop-basic-info">
          <div className="planting-months">
            <span className="info-label">Planting Time:</span>
            <div className="months-pills">
              {crop.plantingMonths.slice(0, 3).map(month => (
                <span key={month} className="month-pill">{month}</span>
              ))}
              {crop.plantingMonths.length > 3 && (
                <span className="month-pill more">+{crop.plantingMonths.length - 3} more</span>
              )}
            </div>
          </div>
        </div>

        <div className="expandable-content">
          <div className="detailed-months">
            <span className="info-label">All Planting Months:</span>
            <div className="all-months-grid">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(month => (
                <div
                  key={month}
                  className={`calendar-month ${crop.plantingMonths.includes(month) ? 'active' : ''}`}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          <div className="recommendation-section">
            <span className="info-label">Recommendation:</span>
            <p className="recommendation-text">{crop.recommendation}</p>
          </div>
        </div>

        <div className="expand-indicator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="crop-planner-page">
      {/* Hero Section */}
      <section className="planner-hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>🌱 Crop Calendar</h1>
            <p>[ 🌱 Seed | 🌿 Vegetative | 🌸 Flowering | 🌾 Harvest ]</p>
            <p className="hero-subtitle">The 12-month crop calendar provides a clear overview of planting seasons, with each crop highlighted in its ideal growing months. Farmers can easily track when to sow and harvest, ensuring better planning and maximum yield throughout the year.</p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{cropsJsonData.reduce((acc, region) => acc + region.crops.length, 0)}</span>
                <span className="stat-label">Crops in Database</span>
              </div>
              <div className="stat">
                <span className="stat-number">{cropsJsonData.length}</span>
                <span className="stat-label">Regions Covered</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-icons">
              <span className="icon-1">🌾</span>
              <span className="icon-2">🌻</span>
              <span className="icon-3">🌽</span>
              <span className="icon-4">🍅</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location Selection */}
      <section className="location-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Select Your Location</h2>
            <p>Choose your region to see crop recommendations</p>
          </div>

          <div className="location-selectors" style={{ maxWidth: '400px', margin: '0 auto' }}>
            {/* Region Selector */}
            <div className="selector-wrapper region-selector">
              <label htmlFor="region-select">Region</label>
              <div className="custom-select">
                <select
                  id="region-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  style={{ borderLeft: `4px solid ${regionColor}` }}
                >
                  {cropsJsonData.map((loc, idx) => (
                    <option key={idx} value={loc.region} style={{ color: 'black', background: 'white' }}>
                      {loc.region}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>
          </div>

          {/* Selected Location Info */}
          <div className="selected-location-info">
            <div className="info-card" style={{ borderLeft: `4px solid ${regionColor}` }}>
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h4>Currently viewing:</h4>
                <p>{selectedRegion}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content based on selection */}
      {filteredCrops.length > 0 ? (
        <>
          {/* Planting Guide */}
          <section className="chart-section">
            <div className="section-container">
              <div className="section-header">
                <h2>Planting Calendar for {selectedRegion}</h2>
              </div>

              <CropPlantingChart crops={filteredCrops} />
            </div>
          </section>

          {/* Crop Details */}
          <section className="crops-section">
            <div className="section-container">
              <div className="section-header">
                <h2>{filteredCrops.length} crops suitable for {selectedRegion}</h2>
              </div>

              <div className="crop-cards-container">
                {filteredCrops.map((crop, idx) => (
                  <CropCard key={idx} crop={crop} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="no-crops-section">
          <div className="section-container">
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No Crops Found</h3>
              <p>No crops available for the selected region. Please try a different region.</p>
            </div>
          </div>
        </section>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .crop-planner-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow-x: hidden;
        }
        
        /* Hero Section */
        .planner-hero {
          padding: 60px 20px;
          background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        
        .hero-content {
          flex: 1;
        }
        
        .hero-content h1 {
          font-size: 3.5rem;
          margin-top: 70px;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 20px;
          opacity: 0.9;
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin-top: 20px;
        }
        
        .hero-stats {
          display: flex;
          gap: 40px;
          margin-top: 30px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .hero-visual {
          flex: 0 0 300px;
          position: relative;
          min-height: 250px;
        }
        
        .floating-icons {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .floating-icons span {
          position: absolute;
          font-size: 3rem;
          animation: float 6s ease-in-out infinite;
        }
        
        .icon-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .icon-2 {
          top: 30%;
          right: 15%;
          animation-delay: 2s;
        }
        
        .icon-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }
        
        .icon-4 {
          bottom: 10%;
          right: 10%;
          animation-delay: 1s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        
        /* Section Styles */
        .location-section, .chart-section, .crops-section, .no-crops-section {
          padding: 60px 20px;
        }
        
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          color: #0f766e;
          margin-bottom: 15px;
        }
        
        .section-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }
        
        /* Location Selectors */
        .location-selectors {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 30px;
        }
        
        .selector-wrapper {
          flex: 1;
          max-width: 300px;
        }
        
        .selector-wrapper label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
        }
        
        .custom-select {
          position: relative;
        }
        
        .custom-select select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 1rem;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }
        
        .custom-select select:focus {
          outline: none;
          border-color: #10b981;
        }
        
        .select-arrow {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #6b7280;
        }
        
        /* Selected Location Info */
        .selected-location-info {
          display: flex;
          justify-content: center;
        }
        
        .info-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          max-width: 400px;
          width: 100%;
        }
        
        .info-icon {
          font-size: 2rem;
        }
        
        .info-content h4 {
          margin: 0 0 5px 0;
          font-size: 0.9rem;
          color: #6b7280;
        }
        
        .info-content p {
          margin: 0;
          font-weight: 600;
          color: #1f2937;
        }
        
        /* Chart Container */
        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        /* Custom Tooltip */
        .custom-tooltip {
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }
        
        .tooltip-label {
          font-weight: 600;
          margin: 0 0 10px 0;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 8px;
        }
        
        .tooltip-intro {
          margin: 8px 0 5px 0;
          font-size: 0.9rem;
          color: #6b7280;
        }
        
        .tooltip-item {
          margin: 3px 0;
          color: #1f2937;
        }
        
        /* Crop Cards */
        .crop-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        
        .crop-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border-left: 4px solid #10b981;
        }
        
        .crop-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }
        
        .crop-card.expanded {
          padding-bottom: 30px;
        }
        
        .crop-card.expanded .expandable-content {
          max-height: 500px;
          opacity: 1;
          margin-top: 20px;
        }
        
        .crop-card.expanded .expand-indicator {
          transform: rotate(180deg);
        }
        
        .card-header {
          margin-bottom: 15px;
        }
        
        .crop-name {
          margin: 0;
          color: #1f2937;
          font-size: 1.4rem;
        }
        
        .season-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .season-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .season-text {
          font-size: 0.9rem;
          color: #6b7280;
        }
        
        .crop-basic-info {
          margin-bottom: 15px;
        }
        
        .info-label {
          display: block;
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .months-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .month-pill {
          padding: 4px 10px;
          background: #f3f4f6;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #4b5563;
        }
        
        .month-pill.more {
          background: #e5e7eb;
          font-style: italic;
        }
        
        .expandable-content {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        
        .detailed-months {
          margin-bottom: 20px;
        }
        
        .all-months-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-top: 10px;
        }
        
        .calendar-month {
          padding: 6px;
          text-align: center;
          border-radius: 8px;
          font-size: 0.8rem;
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .calendar-month.active {
          background: #dcfce7;
          color: #166534;
          font-weight: 600;
        }
        
        .recommendation-section {
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
        }
        
        .recommendation-text {
          margin: 10px 0 0 0;
          color: #4b5563;
          line-height: 1.5;
          font-size: 0.95rem;
        }
        
        .expand-indicator {
          display: flex;
          justify-content: center;
          margin-top: 15px;
          transition: transform 0.3s ease;
        }
        
        .expand-indicator svg {
          color: #9ca3af;
        }
        
        /* No Results */
        .no-results {
          text-align: center;
          padding: 60px 20px;
        }
        
        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }
        
        .no-results h3 {
          margin: 0 0 15px 0;
          color: #4b5563;
        }
        
        .no-results p {
          margin: 0;
          color: #6b7280;
          max-width: 400px;
          margin: 0 auto;
        }
        
        /* Footer */
        .planner-footer {
          padding: 30px 20px;
          background: #1f2937;
          color: white;
          text-align: center;
        }
        
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        /* Responsive Design */
        @media (max-width: 968px) {
          .hero-container {
            flex-direction: column;
            text-align: center;
            gap: 30px;
          }
          
          .hero-content h1 {
            font-size: 2.8rem;
          }
          
          .hero-stats {
            justify-content: center;
          }
          
          .stat {
            align-items: center;
          }
        }
        
        @media (max-width: 768px) {
          .location-selectors {
            flex-direction: column;
            align-items: center;
          }
          
          .selector-wrapper {
            max-width: 100%;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
          
          .all-months-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .crop-cards-container {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 2.2rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 20px;
          }
          
          .section-header h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CropPlanner;