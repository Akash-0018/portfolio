from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from models.profile import ProfileSetting
from utils.auth import get_current_admin

router = APIRouter(prefix="/profile", tags=["profile"])


from typing import Optional

class ProfileUpdate(BaseModel):
    photo_url: Optional[str] = None
    show_seminar: Optional[bool] = None


@router.get("")
@router.get("/")
def get_profile(db: Session = Depends(get_db)):
    setting = db.query(ProfileSetting).first()
    default_photo = "/api/uploads/61a1449aa7134424907e483975873ec1.png"
    if not setting:
        # Create default record pointing to default photo in uploads
        setting = ProfileSetting(photo_url=default_photo, show_seminar=True)
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return {
        "photo_url": setting.photo_url,
        "show_seminar": setting.show_seminar if setting.show_seminar is not None else True,
    }


@router.put("", response_model=dict)
@router.put("/", response_model=dict)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    setting = db.query(ProfileSetting).first()
    if not setting:
        setting = ProfileSetting(
            photo_url=data.photo_url or "/api/uploads/61a1449aa7134424907e483975873ec1.png",
            show_seminar=data.show_seminar if data.show_seminar is not None else True,
        )
        db.add(setting)
    else:
        if data.photo_url is not None:
            setting.photo_url = data.photo_url
        if data.show_seminar is not None:
            setting.show_seminar = data.show_seminar
    db.commit()
    return {
        "photo_url": setting.photo_url,
        "show_seminar": setting.show_seminar if setting.show_seminar is not None else True,
    }

