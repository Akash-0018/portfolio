from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ProjectBase(BaseModel):
    title: str
    description: str
    long_description: Optional[str] = None
    tech_stack: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    featured: bool = False
    order_index: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
