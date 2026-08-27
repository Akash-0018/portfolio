from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from models.profile import ProfileSetting
from utils.auth import get_current_admin

router = APIRouter(prefix="/profile", tags=["profile"])


class ProfilePhotoUpdate(BaseModel):
    photo_url: str


@router.get("")
@router.get("/")
def get_profile(db: Session = Depends(get_db)):
    setting = db.query(ProfileSetting).first()
    default_photo = "/api/uploads/61a1449aa7134424907e483975873ec1.png"
    if not setting:
        # Create default record pointing to default photo in uploads
        setting = ProfileSetting(photo_url=default_photo)
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return {"photo_url": setting.photo_url}


@router.put("", response_model=dict)
@router.put("/", response_model=dict)
def update_profile_photo(
    data: ProfilePhotoUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    setting = db.query(ProfileSetting).first()
    if not setting:
        setting = ProfileSetting(photo_url=data.photo_url)
        db.add(setting)
    else:
        setting.photo_url = data.photo_url
    db.commit()
    return {"photo_url": setting.photo_url}

