import requests
import json

url = "http://127.0.0.1:8000/api/auth/login"
payload = {"username": "Akash", "password": "Pydev@2602!"}
headers = {"Content-Type": "application/json"}

try:
    res = requests.post(url, json=payload, timeout=5)
    print("STATUS CODE:", res.status_code)
    print("RESPONSE:", res.json())
except Exception as e:
    print("ERROR:", e)
