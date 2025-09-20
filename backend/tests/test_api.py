import requests
from rag_pipeline import ask_groq

url = "http://127.0.0.1:5000/chat"   # backend must be running
payload = {"query": "My tomato leaves have yellow spots"}

res = requests.post(url, json=payload)

print("Status Code:", res.status_code)
print("Raw Response:", res.text)

try:
    print("JSON Response:", res.json())
except Exception as e:
    print("Failed to parse JSON:", e)
