from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from core.database import Base


class ProfileSetting(Base):
    __tablename__ = "profile_settings"

    id = Column(Integer, primary_key=True, index=True)
    photo_url = Column(String(500), nullable=False, default="/api/uploads/61a1449aa7134424907e483975873ec1.png")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
