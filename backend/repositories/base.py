"""Shared data-access behaviour.

Repositories are the only layer that talks to SQLAlchemy. They know nothing
about HTTP: no HTTPException, no status codes. Services translate their results
into domain outcomes, and the API layer translates those into responses.
"""
from typing import Any, Generic, Sequence, TypeVar

from sqlalchemy.orm import Session

from core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    model: type[ModelType]

    def __init__(self, db: Session):
        self.db = db

    def get(self, entity_id: int) -> ModelType | None:
        return self.db.query(self.model).filter(self.model.id == entity_id).first()

    def list(self) -> Sequence[ModelType]:
        return self.db.query(self.model).all()

    def count(self) -> int:
        return self.db.query(self.model).count()

    def add(self, entity: ModelType) -> ModelType:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def apply(self, entity: ModelType, changes: dict[str, Any]) -> ModelType:
        for field, value in changes.items():
            setattr(entity, field, value)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def delete(self, entity: ModelType) -> None:
        self.db.delete(entity)
        self.db.commit()
