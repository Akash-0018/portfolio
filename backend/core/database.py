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

# Schema is owned by Alembic (see core/migrations.py and backend/migrations/).
# There is deliberately no create_all() here - two sources of truth for the
# schema is how the previous "ALTER TABLE ... except: pass" hack came about.
