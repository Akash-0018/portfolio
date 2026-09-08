"""Smoke-check the login endpoint against a locally running server.

Credentials come from the environment - never hardcode them here.
    ADMIN_EMAIL=... ADMIN_PASSWORD=... python tests/test_login.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests

from core.config import settings

BASE_URL = os.environ.get("API_BASE_URL", "http://127.0.0.1:8000")

if not settings.ADMIN_PASSWORD:
    raise SystemExit("ADMIN_PASSWORD is not set; cannot run this smoke check.")

payload = {"username": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD}

try:
    res = requests.post(f"{BASE_URL}/api/auth/login", json=payload, timeout=5)
    print("STATUS CODE:", res.status_code)
    print("AUTHENTICATED:", res.status_code == 200)
except Exception as e:
    print("ERROR:", e)
