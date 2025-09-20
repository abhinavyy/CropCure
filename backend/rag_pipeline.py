from groq import Groq
import faiss
import json
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("🚨 Groq API key not found. Add it in .env file.")

# Initialize Groq client
client = Groq(api_key=api_key)

# Load embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Load knowledge base
with open(os.path.join(BASE_DIR, "data", "crop_data.json"), "r") as f:
    crop_data = json.load(f)

# Prepare corpus with all relevant info
corpus = [
    f"""
Crop: {item['crop']}
Disease: {item['disease']}
Symptoms: {item['symptoms']}
Treatment: {item['treatment']}
Prevention: {item.get('prevention', 'Not available')}
Farmer Count: {item.get('farmer_count', 'Not available')}
Schemes: {', '.join(item.get('schemes', []))}
Resources: {', '.join([res['link'] for res in item.get('resources', [])])}
Helpline: {item.get('helpline', 'Not available')}
"""
    for item in crop_data
]

corpus_embeddings = embedder.encode(corpus)


# Create FAISS index
dimension = corpus_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(corpus_embeddings)

def retrieve_context(query, top_k=2):
    query_embedding = embedder.encode([query])
    distances, indices = index.search(query_embedding, top_k)
    return [corpus[i] for i in indices[0]]

def ask_groq(query):
    context = retrieve_context(query)
    prompt = f"""
    You are an agriculture assistant. Answer based only on this context:
    {context}

    Question: {query}
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # or llama-3.1-8b-instant
        messages=[{"role": "user", "content": prompt}],
    )

    return completion.choices[0].message.content
