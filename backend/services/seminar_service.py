from typing import Sequence

from sqlalchemy.orm import Session

from models.seminar import Seminar
from repositories.seminar_repository import SeminarRepository
from schemas.seminar import SeminarCreate, SeminarUpdate
from services.exceptions import NotFoundError


class SeminarService:
    def __init__(self, db: Session):
        self.seminars = SeminarRepository(db)

    def list_all(self) -> Sequence[Seminar]:
        return self.seminars.list_ordered()

    def get(self, seminar_id: int) -> Seminar:
        seminar = self.seminars.get(seminar_id)
        if not seminar:
            raise NotFoundError("Seminar not found")
        return seminar

    def create(self, data: SeminarCreate) -> Seminar:
        return self.seminars.add(Seminar(**data.model_dump()))

    def update(self, seminar_id: int, data: SeminarUpdate) -> Seminar:
        seminar = self.get(seminar_id)
        return self.seminars.apply(seminar, data.model_dump(exclude_unset=True))

    def delete(self, seminar_id: int) -> None:
        self.seminars.delete(self.get(seminar_id))

    def seed_default(self, **fields) -> bool:
        """Insert a starter seminar when the table is empty."""
        if self.seminars.count() > 0:
            return False
        self.seminars.add(Seminar(**fields))
        return True
