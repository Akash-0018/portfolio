from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from core.config import settings

class Base(DeclarativeBase):
    pass


db_url = settings.database_url_corrected
connect_args = {}
engine_kwargs = {}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(
    db_url,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
