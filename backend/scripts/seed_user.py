"""Create or rotate the admin account.

Reads ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD from the environment (or
backend/.env). Run this after changing ADMIN_PASSWORD to rotate the credential on
an existing database - the startup seeder only ever creates the *first* user.

    python -m scripts.seed_user
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.config import settings
from core.database import SessionLocal
from core.migrations import run_migrations
from models.user import User
from utils.auth import get_password_hash


def seed_user():
    if not settings.ADMIN_PASSWORD:
        raise SystemExit(
            "ADMIN_PASSWORD is not set. Set it in backend/.env (or as an "
            "environment variable) and re-run."
        )

    run_migrations()
    db = SessionLocal()
    try:
        user = (
            db.query(User)
            .filter(
                (User.username.ilike(settings.ADMIN_USERNAME))
                | (User.email.ilike(settings.ADMIN_EMAIL))
            )
            .first()
        )
        if not user:
            user = User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            )
            db.add(user)
            db.commit()
            print(f"Created admin user: {settings.ADMIN_USERNAME} / {settings.ADMIN_EMAIL}")
        else:
            user.username = settings.ADMIN_USERNAME
            user.email = settings.ADMIN_EMAIL
            user.hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
            db.commit()
            print(f"Rotated admin credential for: {settings.ADMIN_USERNAME} / {settings.ADMIN_EMAIL}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_user()
