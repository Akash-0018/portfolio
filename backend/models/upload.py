from sqlalchemy import Column, Integer, String, LargeBinary
from database import Base


class Upload(Base):
    __tablename__ = "db_uploads"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), unique=True, index=True, nullable=False)
    data = Column(LargeBinary, nullable=False)
    mime_type = Column(String(100), nullable=False)
