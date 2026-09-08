"""Run Alembic migrations at startup.

Replaces the previous approach of Base.metadata.create_all() plus a raw
"ALTER TABLE ... ADD COLUMN" wrapped in try/except, which silently swallowed
every schema error and could not express a second change.

Databases that predate Alembic already contain the tables but have no
alembic_version row. Those are stamped at the baseline revision rather than
having the initial migration replayed over existing tables.
"""
import os

from alembic import command
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from sqlalchemy import inspect

from core.config import settings
from core.database import engine

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALEMBIC_INI = os.path.join(BACKEND_DIR, "alembic.ini")
BASELINE_REVISION = "0001_initial_schema"

# A table that any pre-Alembic database is guaranteed to have.
SENTINEL_TABLE = "projects"


def _alembic_config() -> Config:
    config = Config(ALEMBIC_INI)
    config.set_main_option("script_location", os.path.join(BACKEND_DIR, "migrations"))
    config.set_main_option("sqlalchemy.url", settings.database_url_corrected)
    return config


def run_migrations() -> None:
    config = _alembic_config()

    with engine.connect() as connection:
        current_revision = MigrationContext.configure(connection).get_current_revision()
        has_existing_tables = inspect(connection).has_table(SENTINEL_TABLE)

    if current_revision is None and has_existing_tables:
        # Pre-Alembic database: adopt it at the baseline so the initial
        # migration is not replayed against tables that already exist.
        command.stamp(config, BASELINE_REVISION)
        print(f"[OK] Adopted existing database at revision {BASELINE_REVISION}")

    command.upgrade(config, "head")
