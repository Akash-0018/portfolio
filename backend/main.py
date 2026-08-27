from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os
import urllib.parse
from core.database import create_tables, SessionLocal
from core.config import settings
from routers import projects, contact, auth, profile, upload, seminars
# Import models so SQLAlchemy registers them before create_all
from models import project, contact as contact_model, profile as profile_model, seminar as seminar_model, user as user_model  # noqa: F401
from models.user import User
from models.upload import Upload
from models.seminar import Seminar
from utils.auth import get_password_hash

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — create tables if they don't exist
    create_tables()
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    db = SessionLocal()
    try:
        # Seed default admin user in DB if empty
        if db.query(User).count() == 0:
            default_user = User(
                username="Akash",
                email="akashcse018@gmail.com",
                hashed_password=get_password_hash("Pydev@2602!")
            )
            db.add(default_user)
            db.commit()
            print("[OK] Admin user created in DB: Akash / akashcse018@gmail.com")
        if db.query(Seminar).count() == 0:
            default_seminar = Seminar(
                title='From ChatGPT to Autonomous AI Systems',
                organizer='ENTERPRISE AI FORUM',
                description='An advanced technical session focusing on shifting from simple chat prompts to stateful multi-agent systems. Explores LangGraph orchestration, state management, and loops.',
                tag='Seminar 01',
                order_index=1
            )
            db.add(default_seminar)
            db.commit()
    finally:
        db.close()
        
    yield


app = FastAPI(
    title="Akash PG — Portfolio API",
    description="Backend API for the AI Engineer portfolio site",
    version="1.0.0",
    lifespan=lifespan,
)

@app.middleware("http")
async def normalize_request_path(request, call_next):
    # Strip any stray prepended '/*' or '/%2A' from request scope path
    raw_path = request.scope.get("path", "")
    if raw_path.startswith("/*") or raw_path.startswith("/%2A"):
        cleaned = "/" + raw_path.lstrip("/*%2A")
        request.scope["path"] = cleaned
    response = await call_next(request)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/uploads/{filename}")
def serve_upload(filename: str):
    db = SessionLocal()
    try:
        # Check database first
        db_file = db.query(Upload).filter(Upload.filename == filename).first()
        if db_file:
            return Response(content=db_file.data, media_type=db_file.mime_type)
        
        # Fallback to local files (e.g. default tracked image)
        local_path = os.path.join("uploads", filename)
        if os.path.exists(local_path):
            return FileResponse(local_path)
            
        raise HTTPException(status_code=404, detail="File not found")
    finally:
        db.close()

os.makedirs("uploads", exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(projects.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(seminars.router, prefix="/api")




@app.get("/api/health")
def health_check():
    return {
        "status": "alive",
        "service": "Akash PG Portfolio API",
        "version": "1.0.0",
    }


# Mount built React frontend files in production/docker container if dist exists
FRONTEND_DIST_DIR = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(FRONTEND_DIST_DIR):
    FRONTEND_DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        clean_path = urllib.parse.unquote(full_path).lstrip("*/")
        # Allow requests to api/ or api/uploads to be handled by routers
        if clean_path.startswith("api/") or full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        file_path = os.path.join(FRONTEND_DIST_DIR, clean_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Fallback to index.html for client-side SPA routing
        index_file = os.path.join(FRONTEND_DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

