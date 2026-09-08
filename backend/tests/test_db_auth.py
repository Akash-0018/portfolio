"""Check that the admin row exists and its hash matches the configured password.

Credentials come from the environment - never hardcode them here.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import settings
from core.database import SessionLocal
from core.security import verify_password
from repositories.user_repository import UserRepository

db = SessionLocal()
try:
    users = UserRepository(db)
    user = users.find_by_identity(settings.ADMIN_USERNAME)
    print("User by username:", user.username if user else "None")

    by_email = users.find_by_identity(settings.ADMIN_EMAIL)
    print("User by email:", by_email.email if by_email else "None")

    if user and settings.ADMIN_PASSWORD:
        print(
            "Password verification:",
            verify_password(settings.ADMIN_PASSWORD, user.hashed_password),
        )
    elif not settings.ADMIN_PASSWORD:
        print("Password verification: skipped (ADMIN_PASSWORD not set)")
finally:
    db.close()
