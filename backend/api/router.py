"""The main routes file.

Every route module is registered here and nowhere else, so main.py includes a
single router and the full API surface can be read off one file. The /api prefix
is applied once, at inclusion time.
"""
from fastapi import APIRouter

from api.routes import auth, contact, health, profile, projects, seminars, uploads

api_router = APIRouter(prefix="/api")

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(seminars.router)
api_router.include_router(contact.router)
api_router.include_router(profile.router)
api_router.include_router(uploads.router)
