from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from routes.deps import get_current_admin, get_profile_service
from services.profile_service import ProfileService

router = APIRouter(prefix="/profile", tags=["profile"])


class ProfileUpdate(BaseModel):
    photo_url: Optional[str] = None
    show_seminar: Optional[bool] = None


@router.get("")
@router.get("/")
def get_profile(profile: ProfileService = Depends(get_profile_service)):
    return ProfileService.as_dict(profile.get_or_create())


@router.put("", response_model=dict)
@router.put("/", response_model=dict)
def update_profile(
    data: ProfileUpdate,
    profile: ProfileService = Depends(get_profile_service),
    admin: str = Depends(get_current_admin),
):
    setting = profile.update(photo_url=data.photo_url, show_seminar=data.show_seminar)
    return ProfileService.as_dict(setting)
