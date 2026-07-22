from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SeminarBase(BaseModel):
    title: str
    organizer: str
    description: str
    tag: str
    order_index: int = 0


class SeminarCreate(SeminarBase):
    pass


class SeminarUpdate(BaseModel):
    title: Optional[str] = None
    organizer: Optional[str] = None
    description: Optional[str] = None
    tag: Optional[str] = None
    order_index: Optional[int] = None


class SeminarResponse(SeminarBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
