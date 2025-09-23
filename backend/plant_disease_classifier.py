import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import json
import pickle
import argparse
import os
import numpy as np

# Model Architecture
class PlantDiseaseModel(nn.Module):
    """Convolutional Neural Network for plant disease classification"""
    
    def __init__(self, num_classes, dropout_rate=0.5):
        super(PlantDiseaseModel, self).__init__()
        # Convolutional Block 1
        self.conv_block1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding="same"),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2)
        )
        # Convolutional Block 2
        self.conv_block2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, padding="same"),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2)
        )
        # Convolutional Block 3
        self.conv_block3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding="same"),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2)
        )
        # Convolutional Block 4
        self.conv_block4 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, padding="same"),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2)
        )
        # Global Average Pooling
        self.global_avg_pool = nn.AdaptiveAvgPool2d((1, 1))
        # Fully Connected Layers
        self.fc_block = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.conv_block1(x)
        x = self.conv_block2(x)
        x = self.conv_block3(x)
        x = self.conv_block4(x)
        x = self.global_avg_pool(x)
        x = self.fc_block(x)
        return x

class PlantDiseaseClassifier:
    def __init__(self, model_path="best_model.pth", config_path="model_config.json"):
        """Initialize the classifier with the saved model and configurations"""
        # Load model configuration
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Load label encoder
        with open(self.config.get("label_encoder_path", "label_encoder.pkl"), 'rb') as f:
            self.label_encoder = pickle.load(f)
        
        # Load class names
        with open(self.config.get("class_names_path", "class_names.json"), 'r') as f:
            self.class_names = json.load(f)
        
        # Create transformation (fallback if transform file doesn't exist)
        self.transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Try to load transformation if available
        try:
            with open(self.config.get("transform_path", "inference_transform.pkl"), 'rb') as f:
                self.transform = pickle.load(f)
        except:
            print("Using default transform")
        
        # Initialize model
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = PlantDiseaseModel(num_classes=len(self.class_names))
        
        # Load trained weights
        model_path = self.config.get("model_path", model_path)
        self.model.load_state_dict(torch.load(
            model_path, 
            map_location=self.device
        ))
        self.model.to(self.device)
        self.model.eval()
        
        print(f"Model loaded successfully on {self.device}")
        print(f"Number of classes: {len(self.class_names)}")
        print(f"Class names: {self.class_names}")
    
    def predict(self, image_path):
        """Make prediction on a single image"""
        # Load and preprocess image
        image = Image.open(image_path).convert("RGB")
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Make prediction
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        predicted_idx = predicted.item()
        confidence_value = confidence.item() * 100
        
        # Get class name
        predicted_class = self.label_encoder.inverse_transform([predicted_idx])[0]
        
        # Get all probabilities
        all_probabilities = probabilities[0].cpu().numpy()
        
        # Create results dictionary
        results = {
            'predicted_class': predicted_class,
            'confidence': confidence_value,
            'all_probabilities': all_probabilities,
            'class_names': self.class_names
        }
        
        return results

def predict_image(model, image_path, transform, device, label_encoder=None):
    """Make prediction on a single image (standalone function for Flask)"""
    model.eval()

    # Open and transform the image
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)

    # Make prediction
    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted = torch.max(outputs, 1)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)

    predicted_idx = predicted.item()
    confidence = probabilities[0][predicted_idx].item() * 100

    if label_encoder:
        predicted_class = label_encoder.inverse_transform([predicted_idx])[0]
        return predicted_class, confidence, probabilities[0].cpu().numpy()
    else:
        return predicted_idx, confidence, probabilities[0].cpu().numpy()

def main():
    parser = argparse.ArgumentParser(description='Plant Disease Classifier')
    parser.add_argument('--image', type=str, help='Path to image for prediction')
    parser.add_argument('--folder', type=str, help='Path to folder containing images for batch prediction')
    parser.add_argument('--config', type=str, default='model_config.json', help='Path to model config file')
    parser.add_argument('--model', type=str, default='best_model.pth', help='Path to model file')
    
    args = parser.parse_args()
    
    # Initialize classifier
    classifier = PlantDiseaseClassifier(model_path=args.model, config_path=args.config)
    
    # Make predictions based on input
    if args.image:
        # Single image prediction
        if os.path.exists(args.image):
            result = classifier.predict(args.image)
            print(f"\nPrediction for {args.image}:")
            print(f"Class: {result['predicted_class']}")
            print(f"Confidence: {result['confidence']:.2f}%")
            
            # Show top 3 predictions
            print("\nTop predictions:")
            probs = result['all_probabilities']
            sorted_indices = probs.argsort()[::-1]
            for i in range(min(3, len(probs))):
                idx = sorted_indices[i]
                class_name = classifier.label_encoder.inverse_transform([idx])[0]
                print(f"  {i+1}. {class_name}: {probs[idx]*100:.2f}%")
        else:
            print(f"Error: Image not found at {args.image}")
    
    elif args.folder:
        # Batch prediction
        if os.path.exists(args.folder):
            image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')
            image_paths = [
                os.path.join(args.folder, f) 
                for f in os.listdir(args.folder) 
                if f.lower().endswith(image_extensions)
            ]
            
            if not image_paths:
                print(f"No images found in {args.folder}")
                return
                
            print(f"Found {len(image_paths)} images for prediction")
            
            for image_path in image_paths:
                result = classifier.predict(image_path)
                print(f"\n{image_path}:")
                print(f"  Class: {result['predicted_class']}")
                print(f"  Confidence: {result['confidence']:.2f}%")
        else:
            print(f"Error: Folder not found at {args.folder}")
    
    else:
        print("Please provide either --image or --folder argument")
        print("Usage: python plant_disease_classifier.py --image path/to/image.jpg")
        print("Or: python plant_disease_classifier.py --folder path/to/images/")

if __name__ == "__main__":
    main()