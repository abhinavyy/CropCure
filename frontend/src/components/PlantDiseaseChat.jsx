import React, { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import NavBar from "./NavBar";
import Footer from "./Footer";
import API_BASE_URL from "../config/api";
// 1. Import your JSON data file
import diseaseData from '../data/crop_data.json';

// 2. Map prediction names to clean crop/disease names from your JSON
const predictionMap = {
  Pepper__bell___Bacterial_spot: { crop: "Pepper (Bell)", disease: "Bacterial Spot" },
  Pepper__bell___healthy: { crop: "Pepper (Bell)", disease: "Healthy" },
  Potato___Early_blight: { crop: "Potato", disease: "Early Blight" },
  Potato___Late_blight: { crop: "Potato", disease: "Late Blight" },
  Potato___healthy: { crop: "Potato", disease: "Healthy" },
  Tomato_Bacterial_spot: { crop: "Tomato", disease: "Bacterial Spot" },
  Tomato_Early_blight: { crop: "Tomato", disease: "Early Blight" },
  Tomato_Late_blight: { crop: "Tomato", disease: "Late Blight" },
  Tomato_Leaf_Mold: { crop: "Tomato", disease: "Leaf Mold" },
  Tomato_Septoria_leaf_spot: { crop: "Tomato", disease: "Septoria Leaf Spot" },
  Tomato_Spider_mites_Two_spotted_spider_mite: { crop: "Tomato", disease: "Spider Mites (Two-spotted Spider Mite)" },
  Tomato__Target_Spot: { crop: "Tomato", disease: "Target Spot" },
  Tomato__Tomato_YellowLeaf__Curl_Virus: { crop: "Tomato", disease: "Tomato Yellow Leaf Curl Virus" },
  Tomato__Tomato_mosaic_virus: { crop: "Tomato", disease: "Tomato Mosaic Virus" },
  Tomato_healthy: { crop: "Tomato", disease: "Healthy" },
};

const PlantDiseaseChat = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError("");
    setPredictions([]);
    setDiseaseInfo(null);
    
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (JPG, PNG, WEBP)");
      resetFileInput();
      return;
    }
    
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      setImage(img.src);
    };
    
    img.onerror = () => {
      setError("Failed to load image. Please try another file.");
      resetFileInput();
    };
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImage(null);
  };

  const handleDetect = async () => {
    if (!image) return;
    
    setLoading(true);
    setError("");
    setDiseaseInfo(null);
    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setError("Prediction error: " + data.error);
        return;
      }

      const topPreds = data.top_classes.map((cls, i) => ({
        name: cls,
        prob: data.top_probabilities[i],
      }));

      setPredictions(topPreds);
      
      // 3. Get disease information locally for the top prediction
      if (topPreds.length > 0) {
        findDiseaseInfo(topPreds[0].name);
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // 4. New local function to find disease info from the imported JSON
  const findDiseaseInfo = (predictionName) => {
    setInfoLoading(true);
    const mapping = predictionMap[predictionName];

    if (mapping) {
      const info = diseaseData.find(
        (item) => item.crop === mapping.crop && item.disease === mapping.disease
      );
      
      if (info) {
        setDiseaseInfo(info);
      } else {
        setError(`Details for "${predictionName.replace(/_/g, ' ')}" not found in the database.`);
        setDiseaseInfo(null);
      }
    } else {
      setError(`Unknown prediction: "${predictionName.replace(/_/g, ' ')}".`);
      setDiseaseInfo(null);
    }
    setInfoLoading(false);
  };

  const handleClear = () => {
    setImage(null);
    setPredictions([]);
    setError("");
    setDiseaseInfo(null);
    resetFileInput();
  };

  return (
    <div className="plant-disease-chat-container">
      <style>
        {`
          .plant-disease-chat-container {
            min-height: 100vh;
            background: #f0fdf4 url('https://www.transparenttextures.com/patterns/p6.png'); /* Subtle grain texture */
            font-family: 'Outfit', sans-serif;
            color: #164e63;
            padding-bottom: 4rem;
          }
          
          .disease-hero {
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
          }

          .hero-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-bottom: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeInUp 0.6s ease-out;
          }

          .disease-hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -1px;
            animation: fadeInUp 0.8s ease-out;
          }

          .disease-hero p {
            font-size: 1.25rem;
            max-width: 600px;
            margin: 0 auto;
            opacity: 0.95;
            line-height: 1.5;
            animation: fadeInUp 1s ease-out;
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .main-content {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2.5rem;
            padding: 0 20px;
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 5;
          }

          @media (min-width: 992px) {
            .main-content {
              grid-template-columns: 1fr 1fr;
            }
          }

          .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 20px;
            padding: 1.5rem; /* Reduced from 2.5rem */
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
            height: fit-content;
          }

          .card-header-icon {
            width: 36px; /* Reduced from 50px */
            height: 36px;
            background: #10b981;
            color: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            margin-bottom: 1rem;
            box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2);
          }

          .glass-card h2 {
            font-size: 1.4rem; /* Reduced from 1.8rem */
            font-weight: 700;
            color: #064e3b;
            margin-bottom: 1rem;
          }

          .upload-zone {
            border: 2px dashed #d1d5db;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            background: #f9fafb;
            cursor: pointer;
            position: relative;
          }

          .upload-zone:hover {
            border-color: #10b981;
            background: #f0fdf4;
          }

          .upload-placeholder {
            color: #6b7280;
          }

          .upload-placeholder i {
            font-size: 3rem;
            color: #10b981;
            margin-bottom: 1rem;
            display: block;
          }

          .preview-container {
            margin-top: 1.5rem;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            position: relative;
          }

          .preview-container img {
            width: 100%;
            display: block;
            max-height: 300px;
            object-fit: cover;
          }

          .clear-image {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }

          .primary-action-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 16px;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
          }

          .primary-action-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(16, 185, 129, 0.4);
          }

          .primary-action-btn:disabled {
            background: #d1d5db;
            cursor: not-allowed;
            box-shadow: none;
          }

          .how-it-works-grid {
            margin-top: 2rem;
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .work-step {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
          }

          .step-num {
            width: 28px;
            height: 28px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 700;
            flex-shrink: 0;
          }

          .step-text h4 {
            font-size: 1rem;
            margin: 0 0 4px 0;
            color: #064e3b;
          }

          .step-text p {
            font-size: 0.9rem;
            color: #6b7280;
            margin: 0;
          }

          .prediction-item {
            display: flex;
            flex-direction: column;
            padding: 1rem; /* Reduced from 1.5rem */
            border-radius: 16px;
            background: white;
            margin-bottom: 0.8rem;
            border: 1px solid #e2e8f0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .prediction-item.top {
            border: 1.5px solid #10b981;
            background: linear-gradient(to right, #ffffff, #f0fdf4);
            transform: scale(1.01);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.08);
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 10px;
            border-radius: 50px;
            font-size: 0.65rem; /* Reduced from 0.75rem */
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 6px;
          }

          .status-healthy { background: #dcfce7; color: #15803d; }
          .status-warning { background: #fef9c3; color: #a16207; }
          .status-critical { background: #fee2e2; color: #b91c1c; }

          .pred-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .pred-name {
            font-size: 0.95rem; /* Reduced from 1.1rem */
            font-weight: 800;
            color: #1e293b;
            text-transform: capitalize;
            line-height: 1.2;
          }

          .wellness-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .score-circle {
            width: 32px; /* Reduced from 45px */
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.7rem;
            border: 2px solid;
          }

          .pred-bar-bg {
            height: 6px; /* Reduced from 8px */
            background: #f1f5f9;
            border-radius: 10px;
            overflow: hidden;
            flex: 1;
          }

          .pred-bar-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 1.5s ease-out;
          }

          .fill-healthy { background: linear-gradient(90deg, #10b981, #34d399); }
          .fill-warning { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
          .fill-critical { background: linear-gradient(90deg, #ef4444, #f87171); }

          .report-section {
            grid-column: 1 / -1;
            margin-top: 2rem;
            border: 1px solid rgba(16, 185, 129, 0.2);
          }

          .report-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px dashed #e2e8f0;
          }

          .report-header h2 {
            font-size: 1.5rem; /* Reduced from 2.2rem */
            margin: 0;
            color: #064e3b;
          }

          .report-badge {
            background: #064e3b;
            color: white;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 600;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .report-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
          }

          .report-block {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
          }

          .block-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 1rem;
            color: #065f46;
            font-weight: 700;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 10px;
          }

          .block-header i { color: #10b981; }

          .report-text {
            font-size: 1rem;
            line-height: 1.7;
            color: #4b5563;
          }

          .scheme-list, .resource-list {
            padding-left: 20px;
            margin: 0;
          }

          .scheme-list li, .resource-list li {
            margin-bottom: 10px;
          }

          .scheme-list a, .resource-list a {
            color: #10b981;
            text-decoration: none;
            font-weight: 500;
          }

          .scheme-list a:hover, .resource-list a:hover {
            text-decoration: underline;
          }

          .helpline-box {
            background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 16px;
            text-align: center;
          }

          .helpline-box h4 { margin: 0 0 8px 0; font-size: 0.9rem; opacity: 0.8; }
          .helpline-box .number { font-size: 1.5rem; font-weight: 800; display: block; }
        `}
      </style>

      <NavBar />
      <div className="disease-hero">
        <h1>🌿 {t('diseaseDetectionTitle')}</h1>
        <p>{t('diseaseDetectionSubtitle')}</p>
      </div>

      <div className="main-content">
        {/* Upload Section */}
        <div className="glass-card">
          <div className="card-header-icon">📸</div>
          <h2>{t('uploadImage')}</h2>
          
          <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              ref={fileInputRef} 
              style={{display: 'none'}}
            />
            {!image ? (
              <div className="upload-placeholder">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>{t('chooseFile')}</p>
                <small>Support for JPG, PNG, WEBP</small>
              </div>
            ) : (
              <div className="preview-container">
                <img src={image} alt="Uploaded plant" />
                <button className="clear-image" onClick={(e) => { e.stopPropagation(); handleClear(); }}>×</button>
              </div>
            )}
          </div>

          <button 
            disabled={!image || loading} 
            onClick={handleDetect} 
            className="primary-action-btn"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                {t('analyzing')}
              </>
            ) : (
              <>
                <span>🔍</span> {t('detectDiseaseBtn')}
              </>
            )}
          </button>

          <div className="how-it-works-grid">
            <h3>{t('howItWorks')}</h3>
            <div className="work-step">
              <div className="step-num">1</div>
              <div className="step-text">
                <p>{t('step1')}</p>
              </div>
            </div>
            <div className="work-step">
              <div className="step-num">2</div>
              <div className="step-text">
                <p>{t('step2')}</p>
              </div>
            </div>
            <div className="work-step">
              <div className="step-num">3</div>
              <div className="step-text">
                <p>{t('step3')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="glass-card">
          <div className="card-header-icon">📊</div>
          <h2>{t('predictionResults')}</h2>
          
          <div className="results-content">
            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
                <button onClick={() => setError("")} className="dismiss-btn">×</button>
              </div>
            )}
            
            {predictions.length > 0 && !error ? (
              <div className="predictions-list">
                {predictions.map((pred, idx) => {
                  const isHealthy = pred.name.toLowerCase().includes('healthy');
                  const isTop = idx === 0;
                  const prob = Math.round(pred.prob * 100);
                  
                  let status = "critical";
                  if (isHealthy) status = "healthy";
                  else if (prob < 40) status = "warning";

                  return (
                    <div key={idx} className={`prediction-item ${isTop ? 'top' : ''}`}>
                      <div className={`status-badge status-${status}`}>
                        {status === 'healthy' ? '✅ Healthy' : status === 'warning' ? '⚠️ Moderate' : '🚨 Critical'}
                      </div>
                      
                      <div className="pred-header">
                        <span className="pred-name">{pred.name.replace(/_/g, ' ')}</span>
                        <div className="wellness-indicator">
                          <div className={`score-circle`} style={{ borderColor: status === 'healthy' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444', color: status === 'healthy' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444' }}>
                            {prob}%
                          </div>
                        </div>
                      </div>

                      <div className="pred-bar-bg">
                        <div 
                          className={`pred-bar-fill fill-${status}`} 
                          style={{ width: `${prob}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : !error && (
              <div style={{textAlign: 'center', color: '#6b7280', padding: '40px 0'}}>
                <i className="fas fa-microscope" style={{fontSize: '3rem', opacity: 0.2, marginBottom: '15px', display: 'block'}}></i>
                {t('noPredictions')}
              </div>
            )}
          </div>
        </div>

        {/* Diagnostic Report Section */}
        {diseaseInfo && (
          <div className="report-section glass-card">
            <div className="report-header">
              <div className="card-header-icon">📋</div>
              <div>
                <span className="report-badge">Official Diagnostic Report</span>
                <h2>{diseaseInfo.disease} {t('on')} {diseaseInfo.crop}</h2>
              </div>
            </div>
            
            <div className="report-grid">
              <div className="report-block">
                <div className="block-header"><i>🔬</i> {t('symptoms')}</div>
                <p className="report-text">{diseaseInfo.symptoms}</p>
              </div>

              <div className="report-block">
                <div className="block-header"><i>💊</i> {t('treatment')}</div>
                <p className="report-text">{diseaseInfo.treatment}</p>
              </div>

              <div className="report-block">
                <div className="block-header"><i>🛡️</i> {t('prevention')}</div>
                <p className="report-text">{diseaseInfo.prevention}</p>
              </div>

              <div className="report-block">
                <div className="block-header"><i>🏛️</i> {t('govSchemes')}</div>
                <ul className="scheme-list">
                  {diseaseInfo.schemes.map((scheme, index) => {
                    const [name, link] = scheme.split(': ');
                    return <li key={index}><a href={link} target="_blank" rel="noopener noreferrer">{name}</a></li>
                  })}
                </ul>
              </div>

              <div className="report-block">
                <div className="block-header"><i>📚</i> {t('helpfulResources')}</div>
                <ul className="resource-list">
                  {diseaseInfo.resources.map((res, index) => (
                    <li key={index}><a href={res.link} target="_blank" rel="noopener noreferrer">{res.name}</a></li>
                  ))}
                </ul>
              </div>

              <div className="helpline-box">
                <h4>{t('farmerHelpline')}</h4>
                <span className="number">{diseaseInfo.helpline}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PlantDiseaseChat;