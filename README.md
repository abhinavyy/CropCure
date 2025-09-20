# CropCure: An AI-Powered Agricultural Platform 🌿

**A smart farming web platform that provides instant plant disease diagnosis, state-wise crop recommendations, and personalized indoor plant guidance.**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

---

## About The Project

CropCure is a comprehensive, multi-featured web platform designed to serve as a complete agricultural assistant for the modern farmer. It leverages a powerful combination of Deep Learning and Large Language Models to provide tools that enhance decision-making and plant management. The platform's goal is to make expert agricultural knowledge accessible, instant, and easy to understand.

---

## Key Features

CropCure is built around three core modules:

1.  **🌱 AI-Powered Disease Diagnosis:**
    * Upload an image of a sick plant leaf.
    * Our **Convolutional Neural Network (CNN)** instantly identifies the disease with high accuracy.
    * An integrated **LLM-powered chatbot** provides a conversational diagnosis and a step-by-step treatment plan.

2.  **🗺️ State-Wise Crop Advisory:**
    * Select your state from a dropdown menu.
    * Receive a list of commercially viable and agronomically suitable crops based on regional climate, soil, and seasonality data.
    * Make informed decisions for your next planting season.

3.  **🌿 Personalized Indoor Plant Guide:**
    * Specify your home's environmental conditions (e.g., light, humidity).
    * Our **GPT-powered engine** generates a personalized list of suitable indoor plants.
    * Includes detailed care instructions to help your plants thrive.

---

## Technology Stack

This project is built with a modern tech stack, separating the frontend and backend for a scalable architecture.

**Backend:**
* **Python:** The core language for the server.
* **Flask:** A lightweight web framework to build the API.
* **PyTorch/TensorFlow:** For running the CNN model inference.
* **Scikit-learn:** For data pre-processing.
* **LLM APIs:** Integration with APIs like **Llama-3** and **OpenRouter (GPT)**.


**Frontend:**
* **React.js:** For building the user interface.
* **Styled-Components:** For styling the components.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your system:
* Node.js and npm (`https://nodejs.org/`)
* Python 3.8+ and pip (`https://www.python.org/`)

### Installation and Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/abhinavyy/CropCure.git
    cd CropCure
    ```

2.  **Setup the Backend (Python):**
    ```sh
    # Navigate to the backend folder
    cd backend

    # Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install the required packages
    pip install -r requirements.txt
    ```

3.  **Setup the Frontend (React):**
    ```sh
    # Navigate to the frontend folder from the root directory
    cd frontend

    # Install npm packages
    npm install
    ```

4.  **Configure Environment Variables:**
    * The backend requires API keys for the LLMs. In the `backend/` folder, create a `.env` file and add your keys:
        ```
        OPENROUTER_API_KEY="your_openrouter_api_key"
        LLAMA_API_KEY="your_llama_api_key"
        ```
    * The frontend requires the backend API URL. In the `frontend/` folder, create a `.env` file:
        ```
        REACT_APP_API_URL="[http://127.0.0.1:5000](http://127.0.0.1:5000)"
        ```

### Running the Application

You need to run the backend and frontend servers in separate terminals.

1.  **Run the Backend Server:**
    * Open a terminal, navigate to the `backend/` folder, and activate the virtual environment.
    * Run the Flask server:
        ```sh
        flask run
        ```
    * The backend will be running on `http://127.0.0.1:5000`.

2.  **Run the Frontend Application:**
    * Open a second terminal and navigate to the `frontend/` folder.
    * Start the React development server:
        ```sh
        npm start
        ```
    * The application will open in your browser at `http://localhost:3000`.

---

## Acknowledgments

This project was developed by: Abhinav Yadav

---

## License

This project is distributed under the MIT License. See `LICENSE` for more information.

