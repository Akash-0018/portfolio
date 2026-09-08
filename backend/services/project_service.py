from typing import Sequence

from sqlalchemy.orm import Session

from models.project import Project
from repositories.project_repository import ProjectRepository
from schemas.project import ProjectCreate, ProjectUpdate
from services.exceptions import NotFoundError

FEATURED_LIMIT = 12


class ProjectService:
    def __init__(self, db: Session):
        self.projects = ProjectRepository(db)

    def list_all(self) -> Sequence[Project]:
        return self.projects.list_ordered()

    def list_featured(self) -> Sequence[Project]:
        return self.projects.list_featured(FEATURED_LIMIT)

    def get(self, project_id: int) -> Project:
        project = self.projects.get(project_id)
        if not project:
            raise NotFoundError("Project not found")
        return project

    def create(self, data: ProjectCreate) -> Project:
        return self.projects.add(Project(**data.model_dump()))

    def update(self, project_id: int, data: ProjectUpdate) -> Project:
        project = self.get(project_id)
        return self.projects.apply(project, data.model_dump(exclude_unset=True))

    def delete(self, project_id: int) -> None:
        self.projects.delete(self.get(project_id))
