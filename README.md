# 🌿 CropCure — AI-Powered Agricultural Platform

**A smart farming web platform that provides instant plant disease diagnosis, real-time crop news, personalized indoor plant guidance, and an AI agriculture chatbot.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-cropcure--frontend.onrender.com-10b981?style=for-the-badge)](https://cropcure-frontend.onrender.com/)
[![Backend API](https://img.shields.io/badge/⚡_API-cropcure--backend.onrender.com-0f172a?style=for-the-badge)](https://cropcure-backend-xqmm.onrender.com/)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🔗 Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | [https://cropcure-frontend.onrender.com/](https://cropcure-frontend.onrender.com/) |
| **Backend API** | [https://cropcure-backend-xqmm.onrender.com/](https://cropcure-backend-xqmm.onrender.com/) |

> **Note:** Hosted on Render free tier — first load may take ~30s if the server is cold (spins down after 15 min of inactivity).

---

## About The Project

CropCure is a comprehensive, multi-featured web platform designed to serve as a complete agricultural assistant for the modern farmer. It leverages a powerful combination of Deep Learning and Large Language Models to provide tools that enhance decision-making and plant management. The platform's goal is to make expert agricultural knowledge accessible, instant, and easy to understand.

---

<img width="2879" height="1468" alt="Screenshot 2025-11-21 164608" src="https://github.com/user-attachments/assets/a9d50d60-6904-4822-9347-07d38c279494" />
<img width="2879" height="1455" alt="Screenshot 2025-11-21 164618" src="https://github.com/user-attachments/assets/93a70a19-360c-4125-8a5a-26ac5825e252" />
<img width="2879" height="1454" alt="Screenshot 2025-11-21 164650" src="https://github.com/user-attachments/assets/f3841dbc-e62f-45cd-9ae6-3787c2cfe3c8" />

---

## Key Features

| Feature | Description |
|---------|-------------|
| 🌱 **AI Disease Diagnosis** | Upload a plant leaf image → CNN identifies the disease → get treatment & prevention info from our knowledge base |
| 💬 **AI Agriculture Chatbot** | Ask any farming question → powered by Groq (Llama-3.3-70b) with a crop disease knowledge base |
| 📰 **Real-Time Crop News** | Latest agricultural news from India, powered by Tavily search API |
| 🌤️ **Weather & Soil Data** | Location-based weather, soil moisture, and temperature data via AgroMonitoring API |
| 🌿 **Indoor Plant Guide** | Specify your conditions → AI generates personalized indoor growing techniques |
| 🗺️ **Crop Planner** | State-wise crop recommendations based on regional climate and soil data |

---

## Technology Stack

### Backend (Python + Flask)
- **Flask** — REST API framework
- **PyTorch** — CNN model inference for plant disease detection
- **Groq API** — LLM chat (Llama-3.3-70b-versatile)
- **Tavily API** — Real-time news search
- **OpenRouter API** — Indoor plant recommendations (GPT-3.5)
- **Gunicorn** — Production WSGI server
- **Scikit-learn** — Label encoding for predictions

### Frontend (React + Vite)
- **React 19** with React Router
- **Vite** — Build tool
- **Recharts** — Data visualization (weather charts)
- **Styled-Components** — Component styling
- **AgroMonitoring API** — Weather & soil data

---

## Project Structure

```
CropCure/
├── backend/
│   ├── app.py                    # Flask API (5 endpoints)
│   ├── rag_pipeline.py           # Groq chat with crop knowledge base
│   ├── plant_disease_classifier.py  # PyTorch CNN model
│   ├── models/                   # ML model weights (.pth, .pkl)
│   ├── data/crop_data.json       # Crop disease knowledge base
│   ├── requirements.txt
│   ├── wsgi.py                   # Gunicorn entry point
│   └── Procfile                  # Render process definition
└── frontend/
    └── src/
        ├── App.jsx               # Main app with chatbot widget
        ├── config/api.js         # Central API URL config
        ├── pages/                # Home, Weather, News, CropPlanner, etc.
        ├── components/           # NavBar, Footer, PlantDiseaseChat
        ├── services/weatherApi.js
        └── context/LanguageContext.jsx
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/chat` | AI agriculture chatbot |
| `POST` | `/predict` | Plant disease detection (image upload) |
| `GET` | `/news` | Latest crop news (Tavily) |
| `POST` | `/indoor-plants/recommend` | Indoor plant recommendations |
| `POST` | `/test-leaf` | Test leaf verification only |

---

## Getting Started (Local Development)

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.10+** and pip

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/abhinavyy/CropCure.git
    cd CropCure
    ```

2. **Setup the Backend:**
    ```sh
    cd backend
    python -m venv venv
    venv\Scripts\activate        # Windows
    # source venv/bin/activate   # Mac/Linux
    pip install -r requirements.txt
    ```

3. **Setup the Frontend:**
    ```sh
    cd frontend
    npm install
    ```

4. **Configure Environment Variables:**

    **`backend/.env`**
    ```env
    GROQ_API_KEY=your_groq_api_key
    OPENROUTER_API_KEY=your_openrouter_api_key
    TAVILY_API_KEY=your_tavily_api_key
    PORT=10000
    ```

    **`frontend/.env`**
    ```env
    VITE_API_BASE_URL=http://127.0.0.1:10000
    ```

### Running the Application

#### Option 1: Single Command (Recommended) 🚀
```sh
# From the root directory
npm install
npm start    # Starts both backend and frontend together
```

#### Option 2: Manual (Separate Terminals)

**Terminal 1 — Backend:**
```sh
cd backend
python app.py
# Runs on http://127.0.0.1:10000
```

**Terminal 2 — Frontend:**
```sh
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Deployment (Render)

The app is deployed as two separate services on [Render](https://render.com):

| Service | Type | Root Directory | Build Command | Start/Publish |
|---------|------|---------------|---------------|---------------|
| Backend | Web Service | `backend` | `pip install -r requirements.txt` | `gunicorn wsgi:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120` |
| Frontend | Static Site | `frontend` | `npm install && npm run build` | Publish: `dist` |

**Frontend env var:** `VITE_API_BASE_URL = https://cropcure-backend-xqmm.onrender.com`

---

## Acknowledgments

Developed by **Abhinav Yadav**

---
