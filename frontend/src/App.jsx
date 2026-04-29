import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import PlantDiseaseChat from "./components/PlantDiseaseChat.jsx";
import CropPlanner from "./pages/CropPlanner.jsx";
import WeatherPage from "./pages/WeatherPage";
import IndoorPlants from "./pages/IndoorPlants.jsx";
import About from "./pages/About.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import { useLanguage } from "./context/LanguageContext";
import API_BASE_URL from "./config/api";
import "./App.css";

// SVG icon for the send button
const SendIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
      fill="white"
    />
  </svg>
);

// Simple ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const { t, language } = useLanguage();
  // --- Chatbot state ---
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWidgetRef = useRef(null);

  // Initialize messages when language changes
  useEffect(() => {
    setMessages([
      { sender: "bot", text: t('botGreeting') },
    ]);
  }, [language, t]);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm having trouble connecting. Please try again later." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-minimize when scrolling (but not when scrolling inside the chat)
  useEffect(() => {
    const handleScroll = (event) => {
      if (chatWidgetRef.current && chatWidgetRef.current.contains(event.target)) return;
      if (isOpen && !isMinimized) minimizeChat();
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen, isMinimized]);

  // Auto-minimize when clicking outside (but not on the chat itself)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWidgetRef.current &&
          !chatWidgetRef.current.contains(event.target) &&
          !event.target.closest('.chat-toggle-button') &&
          isOpen && !isMinimized) {
        minimizeChat();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMinimized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <>
      {/* Scroll Restoration */}

      {/* Scroll Restoration */}
      <ScrollToTop />

      {/* Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plant-disease" element={<PlantDiseaseChat />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/indoor-plants" element={<IndoorPlants />} />
        <Route path="/crop-planner" element={<CropPlanner />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* --- Chatbot JSX --- */}
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>

      <div 
        ref={chatWidgetRef}
        className={`chat-widget ${isOpen ? "open" : ""} ${isMinimized ? "minimized" : ""}`}
      >
        <div className="chat-header" onClick={isMinimized ? toggleChat : undefined}>
          <div className="avatar">🌱</div>
          <div className="header-title">
            <h2>{t('botName')}</h2>
            <span>{isMinimized ? t('clickToOpen') : t('online')}</span>
          </div>
          {!isMinimized && (
            <button className="minimize-btn" onClick={minimizeChat} aria-label="Minimize">
              −
            </button>
          )}
        </div>
        
        {isOpen && (
          <>
            <div className="chat-body">
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-message bot typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('askPlaceholder')}
              />
              <button type="submit" aria-label="Send">
                <SendIcon />
              </button>
            </form>
          </>
        )}
      </div>

      <button className={`chat-toggle-button ${isOpen || isMinimized ? "open" : ""}`} onClick={toggleChat}>
        {isOpen || isMinimized ? '✕' : `${t('askHere')} 🌱`}
      </button>
    </>
  );
}

export default App;