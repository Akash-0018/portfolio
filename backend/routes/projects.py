from typing import List

from fastapi import APIRouter, Depends, status

from routes.deps import get_current_admin, get_project_service
from schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectResponse])
@router.get("/", response_model=List[ProjectResponse])
def get_all_projects(projects: ProjectService = Depends(get_project_service)):
    return projects.list_all()


@router.get("/featured", response_model=List[ProjectResponse])
@router.get("/featured/", response_model=List[ProjectResponse])
def get_featured_projects(projects: ProjectService = Depends(get_project_service)):
    return projects.list_featured()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, projects: ProjectService = Depends(get_project_service)):
    return projects.get(project_id)


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    projects: ProjectService = Depends(get_project_service),
    admin: str = Depends(get_current_admin),
):
    return projects.create(project_data)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    projects: ProjectService = Depends(get_project_service),
    admin: str = Depends(get_current_admin),
):
    return projects.update(project_id, project_data)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    projects: ProjectService = Depends(get_project_service),
    admin: str = Depends(get_current_admin),
):
    projects.delete(project_id)
    return None
