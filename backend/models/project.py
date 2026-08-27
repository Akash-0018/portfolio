from sqlalchemy import Column, Integer, String, Boolean, JSON, Text, DateTime
from sqlalchemy.sql import func
from core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    long_description = Column(Text, nullable=True)
    tech_stack = Column(JSON, nullable=False, default=list)
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)  # e.g. "RAG", "Agentic AI", "Backend"
    featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
