from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_pipeline import ask_groq
from plant_disease_classifier import PlantDiseaseModel, predict_image
from torchvision import transforms
import torch
import json
import pickle
import os
import numpy as np
import requests
import cv2
from PIL import Image
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

app = Flask(__name__)
CORS(app)

# --- Load Leaf Verification Model ---
class CNNModel(torch.nn.Module):
    def __init__(self, img_size=128):
        super(CNNModel, self).__init__()
        self.conv_layers = torch.nn.Sequential(
            torch.nn.Conv2d(3, 32, 3, padding=1), torch.nn.ReLU(), torch.nn.MaxPool2d(2,2),
            torch.nn.Conv2d(32, 64, 3, padding=1), torch.nn.ReLU(), torch.nn.MaxPool2d(2,2),
            torch.nn.Conv2d(64, 128, 3, padding=1), torch.nn.ReLU(), torch.nn.MaxPool2d(2,2)
        )
        self.fc_layers = torch.nn.Sequential(
            torch.nn.Flatten(),
            torch.nn.Linear(128 * (img_size//8) * (img_size//8), 128),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.5),
            torch.nn.Linear(128, 1),
            torch.nn.Sigmoid()
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x

# Initialize leaf verification model
leaf_img_size = 128
leaf_transform = transforms.Compose([
    transforms.Resize((leaf_img_size, leaf_img_size)),
    transforms.ToTensor()
])

leaf_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
leaf_model = CNNModel(img_size=leaf_img_size).to(leaf_device)

# Try to load leaf verification model
leaf_model_paths = [
    "/content/drive/MyDrive/Plant_Dataset/image_classification/leaf_classifier.pth",
    "models/leaf_classifier.pth",
    "leaf_classifier.pth"
]

leaf_model_loaded = False
for leaf_model_path in leaf_model_paths:
    if os.path.exists(leaf_model_path):
        try:
            leaf_model.load_state_dict(torch.load(leaf_model_path, map_location=leaf_device))
            leaf_model.to(leaf_device)
            leaf_model.eval()
            leaf_model_loaded = True
            print(f"Leaf verification model loaded from: {leaf_model_path}")
            break
        except Exception as e:
            print(f"Failed to load leaf model from {leaf_model_path}: {e}")
            continue

if not leaf_model_loaded:
    print("Warning: Could not load leaf verification model weights.")

# --- Load Plant Disease Model ---
# Load config with fallback values
config_path = "models/model_config.json" if os.path.exists("models/model_config.json") else "model_config.json"
try:
    with open(config_path, "r") as f:
        config = json.load(f)
except:
    config = {}

# Load class names with fallback paths
class_names_paths = [
    config.get("class_names_path"),
    "class_names.json",
    "models/class_names.json"
]
class_names = ["Unknown Class"]
for path in class_names_paths:
    if path and os.path.exists(path):
        try:
            with open(path, "r") as f:
                class_names = json.load(f)
            print(f"Loaded class names from: {path}")
            break
        except:
            continue

# Load label encoder with fallback paths
label_encoder_paths = [
    config.get("label_encoder_path"),
    "label_encoder.pkl",
    "models/label_encoder.pkl"
]
label_encoder = None
for path in label_encoder_paths:
    if path and os.path.exists(path):
        try:
            with open(path, "rb") as f:
                label_encoder = pickle.load(f)
            print(f"Loaded label encoder from: {path}")
            break
        except:
            continue

# If label encoder still not loaded, create a dummy one
if label_encoder is None:
    from sklearn.preprocessing import LabelEncoder
    label_encoder = LabelEncoder()
    label_encoder.fit(class_names)
    print("Created dummy label encoder")

# Image transform for disease detection
disease_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Initialize disease model
disease_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
disease_model = PlantDiseaseModel(num_classes=len(class_names))

# Try to load disease model with fallback paths
disease_model_paths = [
    config.get("model_path"),
    "best_model.pth",
    "models/best_model.pth",
    "final_model.pth",
    "models/final_model.pth"
]

disease_model_loaded = False
for disease_model_path in disease_model_paths:
    if disease_model_path and os.path.exists(disease_model_path):
        try:
            disease_model.load_state_dict(torch.load(disease_model_path, map_location=disease_device))
            disease_model.to(disease_device)
            disease_model.eval()
            disease_model_loaded = True
            print(f"Disease model loaded from: {disease_model_path}")
            break
        except Exception as e:
            print(f"Failed to load disease model from {disease_model_path}: {e}")
            continue

if not disease_model_loaded:
    print("Warning: Could not load disease model weights. Using untrained model.")

# --- Leaf Verification Function ---
def verify_leaf_image(image_path):
    """
    Use the trained CNN model to verify if an image contains a leaf.
    Returns True if the image is likely a leaf, False otherwise.
    """
    try:
        if not leaf_model_loaded:
            return True, "Leaf verification model not available, skipping verification"
            
        image = Image.open(image_path).convert('RGB')
        image_tensor = leaf_transform(image).unsqueeze(0).to(leaf_device)
        
        with torch.no_grad():
            output = leaf_model(image_tensor)
            confidence = output.item()
            
        print(f"DEBUG: Raw confidence score: {confidence}")
        
        # Try both interpretations and see which one makes sense
        # Interpretation 1: confidence > 0.5 means leaf
        is_leaf_interpretation1 = confidence > 0.5
        # Interpretation 2: confidence < 0.5 means leaf (reversed)
        is_leaf_interpretation2 = confidence < 0.5
        
        print(f"DEBUG: Interpretation 1 (conf>0.5=leaf): {is_leaf_interpretation1}")
        print(f"DEBUG: Interpretation 2 (conf<0.5=leaf): {is_leaf_interpretation2}")
        
        # For now, let's use interpretation 2 since you mentioned it might be reversed
        is_leaf = is_leaf_interpretation2
        leaf_confidence = 1 - confidence if is_leaf_interpretation2 else confidence
        
        return is_leaf, f"Leaf verification confidence: {leaf_confidence:.4f} (raw: {confidence:.4f})"
        
    except Exception as e:
        print(f"Error in leaf verification: {e}")
        return False, f"Error in leaf verification: {str(e)}"

# --- Chatbot Endpoint ---
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        query = data.get("query", "")
        if not query:
            return jsonify({"error": "No query provided"}), 400

        reply = ask_groq(query)
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Plant Disease Prediction Endpoint ---
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    temp_path = "temp_upload.jpg"
    file.save(temp_path)

    try:
        # First verify if the image is a leaf using the CNN model
        is_leaf, verification_message = verify_leaf_image(temp_path)
        print(f"DEBUG: Leaf verification result - is_leaf: {is_leaf}, message: {verification_message}")
        
        if not is_leaf:
            os.remove(temp_path)
            return jsonify({
                "error": "The uploaded image does not appear to be a plant leaf. Please upload a clear image of a plant leaf for disease detection.",
                "is_leaf": False,
                "verification_message": verification_message
            }), 400

        # If it's a leaf, proceed with disease detection
        class_name, confidence, all_probs = predict_image(disease_model, temp_path, disease_transform, disease_device, label_encoder)
        os.remove(temp_path)

        # Top 5 predictions
        top_indices = np.argsort(all_probs)[::-1][:5]
        top_classes = [label_encoder.inverse_transform([i])[0] for i in top_indices]
        top_probs = [float(all_probs[i]) for i in top_indices]

        return jsonify({
            "prediction": class_name,
            "confidence": float(confidence),
            "top_classes": top_classes,
            "top_probabilities": top_probs,
            "is_leaf": True,
            "verification_message": verification_message
        })
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

# --- Indoor Plant Recommendations Endpoint ---
@app.route("/indoor-plants/recommend", methods=["POST"])
def indoor_plants_recommend():
    try:
        data = request.get_json()
        
        # Extract parameters from the request
        plant_type = data.get("plant_type", "")
        light_condition = data.get("light_condition", "")
        experience_level = data.get("experience_level", "")
        space_available = data.get("space_available", "")
        
        # Get your OpenRouter API key from environment variable
        openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")
        if not openrouter_api_key:
            return jsonify({"error": "OpenRouter API key not configured"}), 500
        
        # Prepare the prompt for OpenRouter
        prompt = f"""
        Provide indoor plant growing technique recommendations based on these parameters:
        - Plant Type: {plant_type}
        - Light Condition: {light_condition}
        - Experience Level: {experience_level}
        - Space Available: {space_available}
        
        Please provide 3-4 specific techniques with:
        1. Technique name
        2. Brief description
        3. Key benefits (3-4 bullet points)
        4. Best use cases
        
        Format the response as a JSON object with this structure:
        {{
          "recommendations": [
            {{
              "technique": "Technique name",
              "description": "Brief description",
              "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
              "bestFor": "Best use cases",
              "image": "relevant emoji"
            }}
          ]
        }}
        """
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openrouter_api_key}"
        }
        
        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert horticulturist specializing in indoor planting techniques. Provide clear, practical advice in JSON format."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            return jsonify({"error": "Failed to get recommendations from AI service"}), 500
        
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        try:
            recommendations = json.loads(content)
            return jsonify(recommendations)
        except json.JSONDecodeError:
            return jsonify({
                "recommendations": [
                    {
                        "technique": "AI Service Response",
                        "description": content,
                        "benefits": ["Please check the API response format"],
                        "bestFor": "Debugging",
                        "image": "⚠️"
                    }
                ]
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/test-leaf", methods=["POST"])
def test_leaf_verification():
    """Endpoint to test leaf verification without disease detection"""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    temp_path = "test_leaf.jpg"
    file.save(temp_path)

    try:
        is_leaf, verification_message = verify_leaf_image(temp_path)
        os.remove(temp_path)
        
        return jsonify({
            "is_leaf": is_leaf,
            "verification_message": verification_message,
            "note": "This is just for testing leaf verification"
        })
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

# --- Home Route ---
@app.route("/", methods=["GET"])
def home():
    return "🌱 Welcome to CropCure Backend! Use /chat for chatbot, /predict for plant disease detection, and /indoor-plants/recommend for indoor plant advice."

# Serve frontend static files in production (optional)
def setup_static_files():
    """Serve frontend build files if they exist"""
    frontend_build_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
    if os.path.exists(frontend_build_path):
        from flask import send_from_directory
        @app.route("/<path:path>")
        def serve_frontend(path):
            """Serve frontend static files"""
            if os.path.exists(os.path.join(frontend_build_path, path)):
                return send_from_directory(frontend_build_path, path)
            # For React Router - serve index.html for all non-API routes
            if not path.startswith("api/") and not path.startswith("chat") and not path.startswith("predict"):
                return send_from_directory(frontend_build_path, "index.html")
            return jsonify({"error": "Not found"}), 404
        
        @app.route("/")
        def serve_index():
            """Serve frontend index.html"""
            return send_from_directory(frontend_build_path, "index.html")
        
        print("Frontend static files will be served from backend")
        return True
    return False

# Setup static file serving if in production mode
if os.environ.get("FLASK_ENV") == "production":
    setup_static_files()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    print(f"CropCure Backend running on http://0.0.0.0:{port}")
    print("Available endpoints:")
    print("  - POST /chat : AI chatbot")
    print("  - POST /predict : Plant disease detection (with leaf verification)") 
    print("  - POST /test-leaf : Test leaf verification only")
    print("  - POST /indoor-plants/recommend : Indoor plant recommendations")
    print("  - GET / : Home page")
    
    app.run(host="0.0.0.0", port=port, debug=False)
