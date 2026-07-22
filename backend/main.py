from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from database import create_tables
from config import settings
from routers import projects, contact, auth, profile, upload, seminars
# Import models so SQLAlchemy registers them before create_all
from models import project, contact as contact_model, profile as profile_model, seminar as seminar_model  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — create tables if they don't exist
    create_tables()
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Seed default seminar if empty
    from database import SessionLocal
    from models.seminar import Seminar
    db = SessionLocal()
    try:
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static files
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
