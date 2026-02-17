from groq import Groq
import faiss
import json
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = None
embedder = None
crop_data = []
index = None

# Initialize Groq client (with error handling)
if api_key:
    try:
        client = Groq(api_key=api_key)
    except Exception as e:
        print(f"Warning: Failed to initialize Groq client: {e}")
else:
    print("Warning: GROQ_API_KEY not found in environment. Chat feature will not work.")

# Load embedding model
try:
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    print(f"Warning: Failed to load embedding model: {e}")

# Load knowledge base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
crop_data_path = os.path.join(BASE_DIR, "data", "crop_data.json")
if os.path.exists(crop_data_path):
    try:
        with open(crop_data_path, "r") as f:
            crop_data = json.load(f)
    except Exception as e:
        print(f"Warning: Failed to load crop data: {e}")
        crop_data = []
else:
    print(f"Warning: Crop data file not found at {crop_data_path}")

# Prepare corpus with all relevant info
corpus = []
if crop_data and embedder:
    try:
        corpus = [
            f"""
Crop: {item.get('crop', 'Unknown')}
Disease: {item.get('disease', 'Unknown')}
Symptoms: {item.get('symptoms', 'Not available')}
Treatment: {item.get('treatment', 'Not available')}
Prevention: {item.get('prevention', 'Not available')}
Farmer Count: {item.get('farmer_count', 'Not available')}
Schemes: {', '.join(item.get('schemes', []))}
Resources: {', '.join([res.get('link', '') for res in item.get('resources', [])])}
Helpline: {item.get('helpline', 'Not available')}
"""
            for item in crop_data
        ]

        corpus_embeddings = embedder.encode(corpus)

        # Create FAISS index
        dimension = corpus_embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(corpus_embeddings)
    except Exception as e:
        print(f"Warning: Failed to create FAISS index: {e}")
        corpus = []

def retrieve_context(query, top_k=2):
    if not embedder or index is None or not corpus:
        return []
    try:
        query_embedding = embedder.encode([query])
        distances, indices = index.search(query_embedding, top_k)
        return [corpus[i] for i in indices[0]]
    except Exception as e:
        print(f"Error retrieving context: {e}")
        return []

def ask_groq(query):
    if not client:
        return "Sorry, the chat service is not available. Please configure GROQ_API_KEY in your .env file."
    
    if not embedder or index is None or not corpus:
        # If RAG system is not available, still try to answer with Groq
        prompt = f"""
        You are an agriculture assistant. Answer the following question about crops, plants, and agriculture:
        {query}
        """
    else:
        context = retrieve_context(query)
        prompt = f"""
        You are an agriculture assistant. Answer based only on this context:
        {context}

        Question: {query}
        """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # or llama-3.1-8b-instant
            messages=[{"role": "user", "content": prompt}],
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}. Please try again later."