import React, { useState } from "react";
import Navbar from "../components/NavBar";
import "./Home.css";
import videoBg from "../assets/v1.mp4";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleFeatureSelect = (path) => {
    setShowModal(false);
    navigate(path);
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
            <h1>Smart Farming Solutions for the Modern Grower</h1>
            <h2>Protect Your Harvest, Boost Your Profits</h2>

          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <div className="scroll-line"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section" id="features">
          <div className="section-header">
            <h2>Our Features</h2>
            <p>AI-powered tools designed for modern agriculture</p>
          </div>

          <div className="features-container">
            <div className="features-row">
              {/* Plant Disease Detection */}
              <div
                className="feature-card-improved"
                onClick={() => navigate("/plant-disease")}
              >
                <div className="feature-icon-improved">🌱</div>
                <div className="feature-content-improved">
                  <h3>Plant Disease Detection</h3>
                  <p>
                    Detect crop diseases early with AI-powered insights for healthier yields.
                  </p>
                  <span className="feature-link-improved">Explore →</span>
                </div>
              </div>

              {/* Crop Planting Planner */}
              <div
                className="feature-card-improved"
                onClick={() => navigate("/crop-planner")}
              >
                <div className="feature-icon-improved">🌾</div>
                <div className="feature-content-improved">
                  <h3>Crop Calendar</h3>
                  <p>
                    Discover the best months to plant different crops and maximize yield with seasonal recommendations.
                  </p>
                  <span className="feature-link-improved">Explore →</span>
                </div>
              </div>
            </div>
            
            <div className="features-row">
              {/* INDOOR PLANT TECHNIQUES - NEW CARD */}
              <div
                className="feature-card-improved"
                onClick={() => navigate("/indoor-plants")}
              >
                <div className="feature-icon-improved">🏡</div>
                <div className="feature-content-improved">
                  <h3>Indoor Plant Techniques</h3>
                  <p>
                    Get AI-powered recommendations for optimal indoor planting methods based on your specific conditions.
                  </p>
                  <span className="feature-link-improved">Explore →</span>
                </div>
              </div>
              
              {/* Weather Forecast */}
              <div
                className="feature-card-improved"
                onClick={() => navigate("/weather")}
              >
                <div className="feature-icon-improved">☀️</div>
                <div className="feature-content-improved">
                  <h3>Weather Forecast</h3>
                  <p>
                    Accurate real-time weather updates to plan your farming activities efficiently.
                  </p>
                  <span className="feature-link-improved">Explore →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Healthier Crops, Higher Yields</h2>
            <h3>Use AI to instantly diagnose diseases and get expert treatment plans.</h3>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="footer-section" id="contact">
          <div className="footer-container">
            <div className="footer-left">
              <h3>CropCure</h3>
              <p>AI-driven Smart Farming Solutions</p>
              <div className="footer-tagline">
                Transforming agriculture through technology and innovation
              </div>
            </div>

            <div className="footer-center">
              <h4>Developer Info</h4>
              <p>Abhinav Yadav</p>
              <p>Delhi, India</p>
              <p>
                <a href="mailto:abhinavat3791@gmail.com">abhinavat3791@gmail.com</a>
              </p>
            </div>

            <div className="footer-right">
              <h4>Connect with me</h4>
              <div className="social-links">
                <a
                  href="https://github.com/abhinavyy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="social-icon">📱</span> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/abhinav-yadav-909708256/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="social-icon">💼</span> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 CropCare. All rights reserved.</p>
          </div>
        </footer>
      </section>
    </>
  );
};

export default Home;