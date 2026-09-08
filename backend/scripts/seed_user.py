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
from services.auth_service import AuthService


def seed_user():
    if not settings.ADMIN_PASSWORD:
        raise SystemExit(
            "ADMIN_PASSWORD is not set. Set it in backend/.env (or as an "
            "environment variable) and re-run."
        )

    run_migrations()
    db = SessionLocal()
    try:
        created = AuthService(db).upsert_admin(
            settings.ADMIN_USERNAME, settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD
        )
        verb = "Created" if created else "Rotated credential for"
        print(f"{verb} admin user: {settings.ADMIN_USERNAME} / {settings.ADMIN_EMAIL}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_user()
