from typing import Sequence

from models.seminar import Seminar
from repositories.base import BaseRepository


class SeminarRepository(BaseRepository[Seminar]):
    model = Seminar

    def list_ordered(self) -> Sequence[Seminar]:
        return (
            self.db.query(Seminar)
            .order_by(Seminar.order_index.asc(), Seminar.created_at.desc())
            .all()
        )
