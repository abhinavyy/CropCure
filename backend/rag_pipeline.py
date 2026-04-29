from groq import Groq
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = None
crop_data = []

# Initialize Groq client (with error handling)
if api_key:
    try:
        client = Groq(api_key=api_key)
    except Exception as e:
        print(f"Warning: Failed to initialize Groq client: {e}")
else:
    print("Warning: GROQ_API_KEY not found in environment. Chat feature will not work.")

# Load knowledge base for context
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
crop_data_path = os.path.join(BASE_DIR, "data", "crop_data.json")
if os.path.exists(crop_data_path):
    try:
        with open(crop_data_path, "r") as f:
            crop_data = json.load(f)
        print(f"Loaded crop knowledge base with {len(crop_data)} entries")
    except Exception as e:
        print(f"Warning: Failed to load crop data: {e}")
        crop_data = []
else:
    print(f"Warning: Crop data file not found at {crop_data_path}")

# Build a simple text context from crop data (no embeddings needed)
context_text = ""
if crop_data:
    context_entries = []
    for item in crop_data:
        entry = f"Crop: {item.get('crop', 'Unknown')}, Disease: {item.get('disease', 'Unknown')}, " \
                f"Symptoms: {item.get('symptoms', 'N/A')}, Treatment: {item.get('treatment', 'N/A')}, " \
                f"Prevention: {item.get('prevention', 'N/A')}"
        context_entries.append(entry)
    context_text = "\n".join(context_entries)


def ask_groq(query):
    if not client:
        return "Sorry, the chat service is not available. Please configure GROQ_API_KEY in your .env file."

    if context_text:
        prompt = f"""You are an agriculture assistant. Use this knowledge base to answer:
{context_text}

Question: {query}

If the question is not related to the knowledge base, answer from your general agriculture knowledge."""
    else:
        prompt = f"""You are an agriculture assistant. Answer the following question about crops, plants, and agriculture:
{query}"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}. Please try again later."