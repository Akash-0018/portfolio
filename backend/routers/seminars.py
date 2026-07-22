from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.seminar import Seminar
from schemas.seminar import SeminarCreate, SeminarUpdate, SeminarResponse
from auth import get_current_admin

router = APIRouter(prefix="/seminars", tags=["seminars"])


@router.get("/", response_model=List[SeminarResponse])
def get_all_seminars(db: Session = Depends(get_db)):
    return db.query(Seminar).order_by(Seminar.order_index.asc(), Seminar.created_at.desc()).all()


@router.post("/", response_model=SeminarResponse, status_code=status.HTTP_201_CREATED)
def create_seminar(
    seminar_data: SeminarCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    seminar = Seminar(**seminar_data.model_dump())
    db.add(seminar)
    db.commit()
    db.refresh(seminar)
    return seminar


@router.put("/{seminar_id}", response_model=SeminarResponse)
def update_seminar(
    seminar_id: int,
    seminar_data: SeminarUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    seminar = db.query(Seminar).filter(Seminar.id == seminar_id).first()
    if not seminar:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seminar not found")

    update_data = seminar_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(seminar, field, value)

    db.commit()
    db.refresh(seminar)
    return seminar


@router.delete("/{seminar_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seminar(
    seminar_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    seminar = db.query(Seminar).filter(Seminar.id == seminar_id).first()
    if not seminar:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seminar not found")

    db.delete(seminar)
    db.commit()
    return None
