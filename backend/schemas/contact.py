from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ContactBase(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: str


class ContactCreate(ContactBase):
    pass


class ContactResponse(ContactBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
