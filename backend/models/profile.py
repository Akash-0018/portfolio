from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class ProfileSetting(Base):
    __tablename__ = "profile_settings"

    id = Column(Integer, primary_key=True, index=True)
    photo_url = Column(String(500), nullable=False, default="/profile.png")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
