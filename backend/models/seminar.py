from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from core.database import Base


class Seminar(Base):
    __tablename__ = "seminars"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    organizer = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tag = Column(String(50), nullable=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
