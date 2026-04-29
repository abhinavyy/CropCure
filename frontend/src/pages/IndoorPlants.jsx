import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import API_BASE_URL from '../config/api';

const IndoorPlants = () => {
  const { t } = useLanguage();
  const [plantType, setPlantType] = useState('');
  const [lightCondition, setLightCondition] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [spaceAvailable, setSpaceAvailable] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const totalSteps = 4;

  const plantTypeOptions = [
    { value: 'leafy-greens', label: 'Leafy Greens', icon: '🥬' },
    { value: 'herbs', label: 'Herbs', icon: '🌿' },
    { value: 'succulents', label: 'Succulents', icon: '🌵' },
    { value: 'flowering', label: 'Flowering Plants', icon: '🌸' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥕' },
    { value: 'other', label: 'Other/Mixed', icon: '🌱' },
  ];

  const lightConditionOptions = [
    { value: 'low', label: 'Low Light', icon: '🌙' },
    { value: 'moderate', label: 'Moderate Light', icon: '🌤️' },
    { value: 'bright', label: 'Bright Indirect', icon: '🔆' },
    { value: 'direct', label: 'Direct Sunlight', icon: '☀️' },
  ];

  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', icon: '🌿' },
    { value: 'expert', label: 'Expert', icon: '🌳' },
  ];

  const spaceAvailableOptions = [
    { value: 'small', label: 'Small Space', description: 'windowsill/shelf', icon: '📦' },
    { value: 'medium', label: 'Medium Space', description: 'tabletop/stand', icon: '🖼️' },
    { value: 'large', label: 'Large Space', description: 'dedicated room', icon: '🏡' },
  ];

  const handleNextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const handlePreviousStep = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const prompt = `You are a friendly gardening expert helper. Based on these parameters: grower experience: ${experienceLevel}, plants: ${plantType}, space: ${spaceAvailable}, light: ${lightCondition}.
      Provide 3 practical and helpful indoor gardening tips. 
      IMPORTANT: Do NOT use technical words like 'Hydroponics', 'Aeroponics', or 'Vertical Gardening'. 
      Instead, use simple names like 'Water Trays', 'Wall Shelves', 'Smart Pots', or 'Window Box'.
      For each tip, provide:
      1. A simple Name (max 3 words)
      2. A RICH description (2-3 full sentences) explaining exactly how to do it and why it helps, using very simple English.
      3. 3 clear benefits in simple words
      4. A relevant emoji
      Respond ONLY with a JSON object in this format: {"recommendations": [{"technique": "...", "description": "...", "benefits": ["...", "...", "..."], "image": "..."}]}`;

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt })
      });

      const data = await response.json();
      
      if (data.reply) {
        // Try to parse JSON from the reply string
        try {
          const jsonMatch = data.reply.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setRecommendations(parsed.recommendations);
            setStep(5);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (parseError) {
          console.error("Parse Error:", parseError);
          setError("Failed to process AI recommendations. Please try again.");
        }
      } else {
        throw new Error(data.error || "Failed to get advice");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("The advisor service is currently offline. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = (s) => {
    switch (s) {
      case 1: return "What do you want to grow?";
      case 2: return "How is your lighting?";
      case 3: return "What is your experience?";
      case 4: return "How much space do you have?";
      default: return "";
    }
  };

  return (
    <div className="indoor-plants-page">
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        
        .indoor-plants-page { 
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
        
        .plants-hero {
          background: linear-gradient(rgba(20, 83, 45, 0.85), rgba(6, 78, 59, 0.95)),
                      url('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          padding: 160px 20px 100px;
          text-align: center;
          color: white;
          clip-path: ellipse(150% 100% at 50% 0%);
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        .plants-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -1px; }
        .plants-hero p { font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }

        .advisor-container { max-width: 1000px; margin: 0 auto; padding: 0 20px 80px; position: relative; z-index: 10; }
        .glass-card { 
          background: rgba(255, 255, 255, 0.95); 
          backdrop-filter: blur(10px);
          border-radius: 32px; 
          padding: 3.5rem; 
          border: 1px solid rgba(255, 255, 255, 1); 
          box-shadow: 0 20px 60px rgba(0,0,0,0.04); 
        }

        @media (max-width: 768px) { .glass-card { padding: 1.5rem; } }

        .progress-track { height: 8px; background: #f1f5f9; border-radius: 10px; margin-bottom: 3.5rem; position: relative; }
        .progress-bar { height: 100%; background: #10b981; border-radius: 10px; transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        
        .options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3.5rem; }
        .option-card { 
          background: white; 
          border: 2px solid #f1f5f9; 
          border-radius: 28px; 
          padding: 2.5rem; 
          text-align: center; 
          cursor: pointer; 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          box-shadow: 0 4px 6px rgba(0,0,0,0.01);
        }
        .option-card:hover { border-color: #10b981; transform: translateY(-8px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.1); }
        .option-card.selected { border-color: #10b981; background: #f0fdf4; transform: scale(1.02); }
        .option-icon { font-size: 3.5rem; margin-bottom: 1.2rem; display: block; }
        .option-label { font-weight: 800; font-size: 1.1rem; color: #1e293b; }

        .btn-primary { background: #10b981; color: white; padding: 16px 45px; border-radius: 50px; font-weight: 800; border: none; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-secondary { background: transparent; color: #64748b; padding: 16px 45px; border-radius: 50px; font-weight: 800; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.3s; }
        .btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }

        .results-container { animation: fadeIn 0.8s ease; }
        .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .technique-card { 
          background: white; 
          border-radius: 32px; 
          padding: 2.5rem; 
          border: 1px solid #f1f5f9; 
          transition: all 0.4s; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }
        .technique-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.05); border-color: #10b981; }
        .benefit-tag { display: inline-block; background: #dcfce7; color: #166534; padding: 6px 14px; border-radius: 50px; font-size: 0.8rem; font-weight: 800; margin: 8px 8px 0 0; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <section className="plants-hero">
        <h1 className="animate-up">🌿 {t('indoorHeroTitle')}</h1>
        <p className="animate-up" style={{ animationDelay: '0.1s' }}>{t('indoorHeroSubtitle')}</p>
      </section>

      <div className="advisor-container animate-up" style={{ animationDelay: '0.2s' }}>
        {step <= 4 ? (
          <div className="glass-card">
            <div className="progress-track"><div className="progress-bar" style={{ width: `${(step-1)/totalSteps*100}%` }}></div></div>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{getStepTitle(step)}</h2>
              <p style={{ color: '#64748b', fontWeight: 600 }}>Step {step} of {totalSteps}</p>
            </div>
            <div className="options-grid">
              {step === 1 && plantTypeOptions.map(o => (
                <div key={o.value} className={`option-card ${plantType === o.value ? 'selected' : ''}`} onClick={() => { setPlantType(o.value); handleNextStep(); }}>
                  <span className="option-icon">{o.icon}</span><span className="option-label">{o.label}</span>
                </div>
              ))}
              {step === 2 && lightConditionOptions.map(o => (
                <div key={o.value} className={`option-card ${lightCondition === o.value ? 'selected' : ''}`} onClick={() => { setLightCondition(o.value); handleNextStep(); }}>
                  <span className="option-icon">{o.icon}</span><span className="option-label">{o.label}</span>
                </div>
              ))}
              {step === 3 && experienceLevelOptions.map(o => (
                <div key={o.value} className={`option-card ${experienceLevel === o.value ? 'selected' : ''}`} onClick={() => { setExperienceLevel(o.value); handleNextStep(); }}>
                  <span className="option-icon">{o.icon}</span><span className="option-label">{o.label}</span>
                </div>
              ))}
              {step === 4 && spaceAvailableOptions.map(o => (
                <div key={o.value} className={`option-card ${spaceAvailable === o.value ? 'selected' : ''}`} onClick={() => setSpaceAvailable(o.value)}>
                  <span className="option-icon">{o.icon}</span><span className="option-label">{o.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {step > 1 && <button className="btn-secondary" onClick={handlePreviousStep}>Back</button>}
                {step === 4 && <button className="btn-primary" onClick={handleSubmit} disabled={!spaceAvailable || loading}>{loading ? "Analyzing..." : "Get Advisory"}</button>}
              </div>
              {error && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', fontWeight: 600 }}>{error}</p>}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Tailored Advisory</h2>
              <p>The best techniques for your indoor sanctuary:</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {recommendations.map((r, i) => (
                <div key={i} className="technique-card">
                  <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.5rem' }}>{r.image}</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{r.technique}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>{r.description}</p>
                  <div style={{ marginTop: '1rem' }}>{r.benefits.map((b, bi) => <span key={bi} className="benefit-tag">{b}</span>)}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '4rem' }}><button className="btn-secondary" onClick={() => setStep(1)}>Start Over</button></div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default IndoorPlants;