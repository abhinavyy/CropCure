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

app = Flask(__name__)
CORS(app)

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

# Image transform
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Initialize model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = PlantDiseaseModel(num_classes=len(class_names))

# Try to load model with fallback paths
model_paths_to_try = [
    config.get("model_path"),
    "best_model.pth",
    "models/best_model.pth",
    "final_model.pth",
    "models/final_model.pth"
]

model_loaded = False
for model_path in model_paths_to_try:
    if model_path and os.path.exists(model_path):
        try:
            model.load_state_dict(torch.load(model_path, map_location=device))
            model.to(device)
            model.eval()
            model_loaded = True
            print(f"Model loaded from: {model_path}")
            break
        except Exception as e:
            print(f"Failed to load model from {model_path}: {e}")
            continue

if not model_loaded:
    print("Warning: Could not load model weights. Using untrained model.")

# --- Advanced Leaf Detection Function ---
def is_leaf_image(image_path):
    """
    Determine if an image contains a leaf using multiple image processing techniques.
    Returns True if the image is likely a leaf, False otherwise.
    """
    try:
        # Read the image
        img = cv2.imread(image_path)
        if img is None:
            return False, "Failed to read image"
            
        # Convert to HSV color space for better color segmentation
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Define green color ranges in HSV (for different shades of green)
        lower_green1 = np.array([35, 40, 40])
        upper_green1 = np.array([85, 255, 255])
        lower_green2 = np.array([25, 40, 40])  # Some leaves have yellowish-green color
        upper_green2 = np.array([35, 255, 255])
        
        # Create masks for green regions
        mask1 = cv2.inRange(hsv, lower_green1, upper_green1)
        mask2 = cv2.inRange(hsv, lower_green2, upper_green2)
        green_mask = cv2.bitwise_or(mask1, mask2)
        
        # Calculate the percentage of green pixels
        green_percentage = np.sum(green_mask > 0) / (img.shape[0] * img.shape[1])
        
        # Additional check for leaf-like shapes using contour analysis
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Use adaptive thresholding
        thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                      cv2.THRESH_BINARY_INV, 11, 2)
        
        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter contours by area and shape
        leaf_contours = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 500:  # Minimum area threshold
                # Calculate contour properties
                perimeter = cv2.arcLength(contour, True)
                if perimeter > 0:
                    circularity = 4 * np.pi * area / (perimeter * perimeter)
                    # Leaves tend to have lower circularity (not perfect circles)
                    if 0.1 < circularity < 0.8:  # Reasonable range for leaf shapes
                        leaf_contours.append(contour)
        
        # Calculate the total area of potential leaf contours
        leaf_contour_area = sum(cv2.contourArea(c) for c in leaf_contours)
        total_contour_area = sum(cv2.contourArea(c) for c in contours if cv2.contourArea(c) > 500)
        
        # Calculate the ratio of leaf-like contour area to total contour area
        if total_contour_area > 0:
            leaf_contour_ratio = leaf_contour_area / total_contour_area
        else:
            leaf_contour_ratio = 0
        
        # Check multiple conditions to determine if it's a leaf
        is_green_enough = green_percentage > 0.15  # At least 15% green
        has_leaf_shapes = leaf_contour_ratio > 0.4  # At least 40% of contours are leaf-like
        
        # Calculate edge density for additional verification
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (img.shape[0] * img.shape[1])
        has_reasonable_edges = 0.01 < edge_density < 0.4  # Reasonable edge density
        
        # Final decision with confidence score
        conditions_met = sum([is_green_enough, has_leaf_shapes, has_reasonable_edges])
        confidence = conditions_met / 3.0
        
        # It's likely a leaf if at least 2 out of 3 conditions are met
        is_leaf = conditions_met >= 2
        
        return is_leaf, f"Leaf detection confidence: {confidence:.2f}. Green percentage: {green_percentage:.2f}, Leaf contour ratio: {leaf_contour_ratio:.2f}"
        
    except Exception as e:
        print(f"Error in leaf detection: {e}")
        return False, f"Error in leaf detection: {str(e)}"

# --- Chatbot Endpoint ---
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    reply = ask_groq(query)
    return jsonify({"reply": reply})

# --- Plant Disease Prediction Endpoint ---
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    temp_path = "temp_upload.jpg"
    file.save(temp_path)

    try:
        # First check if the image is a leaf
        is_leaf, detection_message = is_leaf_image(temp_path)
        if not is_leaf:
            os.remove(temp_path)
            return jsonify({
                "error": "The uploaded image does not appear to be a plant leaf. Please upload a clear image of a plant leaf for disease detection.",
                "is_leaf": False,
                "detection_message": detection_message
            }), 400

        # If it's a leaf, proceed with disease detection
        class_name, confidence, all_probs = predict_image(model, temp_path, transform, device, label_encoder)
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
            "detection_message": detection_message
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
        
        # Call OpenRouter API
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
        
        # Parse the JSON response
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

# --- Home Route ---
@app.route("/", methods=["GET"])
def home():
    return "🌱 Welcome to CropCure Backend! Use /chat for chatbot, /predict for plant disease detection, and /indoor-plants/recommend for indoor plant advice."

