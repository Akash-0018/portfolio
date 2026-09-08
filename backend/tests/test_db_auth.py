"""Check that the admin row exists and its hash matches the configured password.

Credentials come from the environment - never hardcode them here.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import settings
from core.database import SessionLocal
from models.user import User
from utils.auth import verify_password

db = SessionLocal()
try:
    user_by_name = db.query(User).filter(User.username.ilike(settings.ADMIN_USERNAME)).first()
    print("User by username:", user_by_name.username if user_by_name else "None")

    user_by_email = db.query(User).filter(User.email.ilike(settings.ADMIN_EMAIL)).first()
    print("User by email:", user_by_email.email if user_by_email else "None")

    if user_by_name and settings.ADMIN_PASSWORD:
        print(
            "Password verification:",
            verify_password(settings.ADMIN_PASSWORD, user_by_name.hashed_password),
        )
    elif not settings.ADMIN_PASSWORD:
        print("Password verification: skipped (ADMIN_PASSWORD not set)")
finally:
    db.close()
