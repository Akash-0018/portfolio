from typing import List

from fastapi import APIRouter, Depends, status

from routes.deps import get_current_admin, get_seminar_service
from schemas.seminar import SeminarCreate, SeminarResponse, SeminarUpdate
from services.seminar_service import SeminarService

router = APIRouter(prefix="/seminars", tags=["seminars"])


@router.get("", response_model=List[SeminarResponse])
@router.get("/", response_model=List[SeminarResponse])
def get_all_seminars(seminars: SeminarService = Depends(get_seminar_service)):
    return seminars.list_all()


@router.post("/", response_model=SeminarResponse, status_code=status.HTTP_201_CREATED)
def create_seminar(
    seminar_data: SeminarCreate,
    seminars: SeminarService = Depends(get_seminar_service),
    admin: str = Depends(get_current_admin),
):
    return seminars.create(seminar_data)


@router.put("/{seminar_id}", response_model=SeminarResponse)
def update_seminar(
    seminar_id: int,
    seminar_data: SeminarUpdate,
    seminars: SeminarService = Depends(get_seminar_service),
    admin: str = Depends(get_current_admin),
):
    return seminars.update(seminar_id, seminar_data)


@router.delete("/{seminar_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seminar(
    seminar_id: int,
    seminars: SeminarService = Depends(get_seminar_service),
    admin: str = Depends(get_current_admin),
):
    seminars.delete(seminar_id)
    return None
