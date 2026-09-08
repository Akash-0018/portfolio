import os
import urllib.parse
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from api.router import api_router
from core.config import settings
from core.database import SessionLocal
from core.migrations import run_migrations
from services.auth_service import AuthService
from services.exceptions import (
    AuthenticationError,
    NotFoundError,
    ServiceError,
    ValidationError,
)
from services.seminar_service import SeminarService

# Importing the model modules registers them on Base.metadata.
from models import contact, profile, project, seminar, upload, user  # noqa: F401


def bootstrap_data() -> None:
    """Seed the first admin and a starter seminar into an empty database."""
    db = SessionLocal()
    try:
        auth = AuthService(db)
        if settings.ADMIN_PASSWORD:
            if auth.ensure_admin_seeded(
                settings.ADMIN_USERNAME, settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD
            ):
                print(
                    f"[OK] Admin user created: {settings.ADMIN_USERNAME} / {settings.ADMIN_EMAIL}"
                )
        else:
            print(
                "[WARN] ADMIN_PASSWORD is not set - skipping admin seed. Set it and "
                "restart, or run scripts/seed_user.py, to create the admin account."
            )

        SeminarService(db).seed_default(
            title="From ChatGPT to Autonomous AI Systems",
            organizer="ENTERPRISE AI FORUM",
            description=(
                "An advanced technical session focusing on shifting from simple chat "
                "prompts to stateful multi-agent systems. Explores LangGraph "
                "orchestration, state management, and loops."
            ),
            tag="Seminar 01",
            order_index=1,
        )
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    os.makedirs("uploads", exist_ok=True)
    bootstrap_data()
    yield


app = FastAPI(
    title="Akash PG - Portfolio API",
    description="Backend API for the AI Engineer portfolio site",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    # Development only: matches any loopback port so a shifted Vite port does
    # not silently break the browser's requests. None in production.
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Domain errors -> HTTP responses ----------------------------------------
# Services raise these; the mapping lives here so the service layer stays usable
# outside a request (scripts, tests) without importing FastAPI.
_STATUS_BY_ERROR = {
    NotFoundError: 404,
    AuthenticationError: 401,
    ValidationError: 400,
}


@app.exception_handler(ServiceError)
async def handle_service_error(request: Request, exc: ServiceError):
    status_code = next(
        (code for kind, code in _STATUS_BY_ERROR.items() if isinstance(exc, kind)),
        400,
    )
    headers = {"WWW-Authenticate": "Bearer"} if status_code == 401 else None
    return JSONResponse(
        status_code=status_code, content={"detail": exc.message}, headers=headers
    )


app.include_router(api_router)


# --- Built frontend ----------------------------------------------------------
FRONTEND_DIST_DIR = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(FRONTEND_DIST_DIR):
    FRONTEND_DIST_DIR = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
    )

if os.path.exists(FRONTEND_DIST_DIR):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")),
        name="assets",
    )

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        clean_path = urllib.parse.unquote(full_path).lstrip("/")
        # Anything under api/ is the routers' business; never fall back for it.
        if clean_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")

        # Resolve against the dist directory and refuse anything that escapes it
        # (e.g. "../../etc/passwd") before touching the filesystem.
        dist_root = os.path.realpath(FRONTEND_DIST_DIR)
        file_path = os.path.realpath(os.path.join(dist_root, clean_path))
        if (
            file_path == dist_root or file_path.startswith(dist_root + os.sep)
        ) and os.path.isfile(file_path):
            return FileResponse(file_path)

        index_file = os.path.join(dist_root, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
