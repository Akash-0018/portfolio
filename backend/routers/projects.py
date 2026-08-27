from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.project import Project
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from utils.auth import get_current_admin

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectResponse])
@router.get("/", response_model=List[ProjectResponse])
def get_all_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.order_index.asc(), Project.created_at.desc()).all()


@router.get("/featured", response_model=List[ProjectResponse])
@router.get("/featured/", response_model=List[ProjectResponse])
def get_featured_projects(db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.featured == True).order_by(Project.order_index.asc()).limit(12).all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    project = Project(**project_data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()
    return None
