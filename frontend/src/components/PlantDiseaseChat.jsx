import React, { useState, useRef } from "react";
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
      const res = await fetch("http://127.0.0.1:5000/predict", {
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
            background-color: #f9fafb;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            color: #1f2937;
          }
          .header {
            position: relative;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
            padding: 2rem 1rem;
            text-align: center;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23059669' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
            opacity: 0.3;
          }
          .header-content {
            position: relative;
            z-index: 10;
          }
          .header-content h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-top: 70px;
            margin-bottom: 0.5rem;
            letter-spacing: -0.025em;
          }
          .header-content p {
            max-width: 600px;
            margin: 0 auto;
            font-size: 1.125rem;
            opacity: 0.9;
            font-weight: 500;
          }
          .error-message {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            color: #b91c1c;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .dismiss-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #b91c1c;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .main-content {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 1rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          @media (min-width: 768px) {
            .main-content {
              grid-template-columns: 1fr 1fr;
            }
          }
          .upload-card, .results-card {
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            height: fit-content;
          }
          .upload-card h2, .results-card h2 {
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #064e3b;
          }
          .custom-file-upload {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #10b981;
            color: white;
            border-radius: 9999px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 1.5rem;
            width: 100%;
            box-sizing: border-box;
          }
          .custom-file-upload:hover {
            background-color: #059669;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          #file-upload {
            display: none;
          }
          .image-preview {
            margin-bottom: 1.5rem;
          }
          .image-preview img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .detect-btn {
            width: 100%;
            padding: 0.875rem 1.5rem;
            background: linear-gradient(to right, #10b981, #059669);
            color: white;
            border: none;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 1.125rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .detect-btn:hover:not(:disabled) {
            background: linear-gradient(to right, #059669, #047857);
            transform: translateY(-2px);
            box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.15);
          }
          .detect-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 2px solid white;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .info-section {
            background-color: #ecfdf5;
            padding: 1rem;
            border-radius: 0.5rem;
            border-left: 4px solid #10b981;
          }
          .info-section h4 {
            margin-top: 0;
            margin-bottom: 0.5rem;
            color: #065f46;
            font-weight: 600;
          }
          .info-section ul {
            margin: 0;
            padding-left: 1.25rem;
            color: #374151;
          }
          .info-section li {
            margin-bottom: 0.25rem;
            line-height: 1.5;
          }
          .results-content {
            min-height: 300px;
            display: flex;
            flex-direction: column;
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #d1fae5;
            border-top: 4px solid #10b981;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 2rem auto;
          }
          .predictions-list {
            list-style: none;
            padding: 0;
            margin: 0 0 1.5rem 0;
          }
          .prediction-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            margin-bottom: 0.75rem;
            border-radius: 0.5rem;
            background-color: #f9fafb;
            border-left: 4px solid #e5e7eb;
          }
          .top-prediction {
            background: linear-gradient(to right, #ecfdf5, #d1fae5);
            border-left: 4px solid #10b981;
          }
          .prediction-info {
            flex: 1;
            margin-right: 1rem;
          }
          .disease-name {
            display: block;
            font-weight: 600;
            text-transform: capitalize;
            margin-bottom: 0.25rem;
            color: #064e3b;
          }
          .confidence-value {
            font-size: 0.875rem;
            color: #6b7280;
            margin-left: 0.5rem;
          }
          .prediction-bar-container {
            display: flex;
            align-items: center;
            width: 40%;
          }
          .prediction-bar {
            width: 100%;
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 9999px;
            overflow: hidden;
            margin-right: 0.5rem;
          }
          .confidence-fill {
            height: 100%;
            background: linear-gradient(to right, #10b981, #34d399);
            border-radius: 9999px;
            transition: width 0.5s ease-in-out;
          }
          .recommendations-section {
            grid-column: 1 / -1;
            margin-top: 1rem;
          }
          .recommendations-card {
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .recommendations-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #ecfdf5;
          }
          .recommendations-header h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #064e3b;
            margin: 0;
          }
          .recommendations-content {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          @media (min-width: 768px) {
            .recommendations-content {
              grid-template-columns: 1fr 1fr;
            }
          }
          .recommendation-card {
            background: #f0fdfa;
            border-radius: 0.75rem;
            padding: 1.25rem;
            border-left: 4px solid #10b981;
          }
          .recommendation-title {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
          }
          .recommendation-title h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #065f46;
            margin: 0;
          }
          .recommendation-icon {
            margin-right: 0.5rem;
            color: #059669;
            flex-shrink: 0;
          }
          .recommendation-text {
            line-height: 1.6;
            color: #374151;
          }
          .recommendation-list {
            list-style-type: disc;
            padding-left: 1.25rem;
            margin-top: 0.5rem;
            color: #374151;
          }
          .recommendation-list a {
            color: #059669;
            text-decoration: none;
            font-weight: 500;
          }
          .recommendation-list a:hover {
            text-decoration: underline;
          }
        `}
      </style>
        
      <div className="header">
        <div className="header-content">
          <h1>Plant Disease Detection</h1>
          <p>Upload an image of your plant, and our AI will detect possible diseases with expert recommendations.</p>
        </div>
      </div>

      <div className="main-content">
        <div className="upload-section">
          <div className="upload-card">
            <h2>Upload Plant Image</h2>
            <label htmlFor="file-upload" className="custom-file-upload">Choose File</label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />
            {image && (
              <div className="image-preview">
                <img src={image} alt="Uploaded plant" />
              </div>
            )}
            <button disabled={!image || loading} onClick={handleDetect} className="detect-btn">
              {loading ? (<><span className="spinner"></span>Analyzing...</>) : "Detect Disease"}
            </button>
            <div className="info-section">
              <h4>How it works</h4>
              <ul>
                <li>Snap a Photo: Take a clear picture of the plant leaf showing the symptoms.</li>
                <li>AI Analysis: Our powerful AI instantly analyzes your photo to identify the specific disease.</li>
                <li>Get Your Plan: Receive an instant diagnosis and a step-by-step treatment plan to save your crop.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="results-section">
          <div className="results-card">
            <h2>Prediction Results</h2>
            <div className="results-content">
              {error && (
                <div className="error-message">
                  <span>⚠️ {error}</span>
                  <button onClick={() => setError("")} className="dismiss-btn">×</button>
                </div>
              )}
              {predictions.length > 0 && !error && (
                <ul className="predictions-list">
                  {predictions.map((pred, idx) => (
                    <li key={idx} className={`prediction-item ${idx === 0 ? 'top-prediction' : ''}`}>
                      <div className="prediction-info">
                        <span className="disease-name">{pred.name.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="prediction-bar-container">
                        <div className="prediction-bar">
                          <div className="confidence-fill" style={{ width: `${pred.prob * 100}%` }}></div>
                        </div>
                        <span className="confidence-value">{Math.round(pred.prob * 100)}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {predictions.length === 0 && !error && (
                 <div style={{textAlign: 'center', color: '#6b7280'}}>No predictions yet. Upload an image to start.</div>
              )}
            </div>
          </div>
        </div>

        {diseaseInfo && (
          <div className="recommendations-section">
            <div className="recommendations-card">
              <div className="recommendations-header">
                <h2>{diseaseInfo.disease} on {diseaseInfo.crop}</h2>
              </div>
              <div className="recommendations-content">
                <div className="recommendation-card">
                  <div className="recommendation-title"><h3>Symptoms</h3></div>
                  <p className="recommendation-text">{diseaseInfo.symptoms}</p>
                </div>
                
                <div className="recommendation-card">
                  <div className="recommendation-title"><h3>Treatment</h3></div>
                  <p className="recommendation-text">{diseaseInfo.treatment}</p>
                </div>

                <div className="recommendation-card">
                  <div className="recommendation-title"><h3>Prevention</h3></div>
                  <p className="recommendation-text">{diseaseInfo.prevention}</p>
                </div>

                <div className="recommendation-card">
                  <div className="recommendation-title"><h3>Government Schemes</h3></div>
                  <ul className="recommendation-list">
                    {diseaseInfo.schemes.map((scheme, index) => {
                       const [name, link] = scheme.split(': ');
                       return <li key={index}><a href={link} target="_blank" rel="noopener noreferrer">{name}</a></li>
                    })}
                  </ul>
                </div>
                
                <div className="recommendation-card">
                  <div className="recommendation-title"><h3>Helpful Resources</h3></div>
                  <ul className="recommendation-list">
                     {diseaseInfo.resources.map((res, index) => (
                       <li key={index}><a href={res.link} target="_blank" rel="noopener noreferrer">{res.name}</a></li>
                     ))}
                  </ul>
                </div>
                
                 <div className="recommendation-card">
                  <div className="recommendation-title"><h3>Farmer Helpline</h3></div>
                  <p className="recommendation-text">Call: {diseaseInfo.helpline}</p>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDiseaseChat;