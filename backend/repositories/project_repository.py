from typing import Sequence

from models.project import Project
from repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    model = Project

    def list_ordered(self) -> Sequence[Project]:
        return (
            self.db.query(Project)
            .order_by(Project.order_index.asc(), Project.created_at.desc())
            .all()
        )

    def list_featured(self, limit: int) -> Sequence[Project]:
        return (
            self.db.query(Project)
            .filter(Project.featured.is_(True))
            .order_by(Project.order_index.asc())
            .limit(limit)
            .all()
        )
