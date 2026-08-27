import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests

url = "http://127.0.0.1:8000/api/auth/login"
payload = {"username": "akashcse018@gmail.com", "password": "Pydev@2602!"}
headers = {"Content-Type": "application/json"}

try:
    res = requests.post(url, json=payload, timeout=5)
    print("STATUS CODE:", res.status_code)
    print("RESPONSE:", res.json())
except Exception as e:
    print("ERROR:", e)
