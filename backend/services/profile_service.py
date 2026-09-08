from sqlalchemy.orm import Session

from models.profile import ProfileSetting
from repositories.profile_repository import ProfileRepository

DEFAULT_PHOTO_URL = "/api/uploads/61a1449aa7134424907e483975873ec1.png"


class ProfileService:
    def __init__(self, db: Session):
        self.profiles = ProfileRepository(db)

    def get_or_create(self) -> ProfileSetting:
        setting = self.profiles.get_singleton()
        if setting:
            return setting
        return self.profiles.add(
            ProfileSetting(photo_url=DEFAULT_PHOTO_URL, show_seminar=True)
        )

    def update(self, photo_url: str | None, show_seminar: bool | None) -> ProfileSetting:
        setting = self.get_or_create()

        changes = {}
        if photo_url is not None:
            changes["photo_url"] = photo_url
        if show_seminar is not None:
            changes["show_seminar"] = show_seminar

        if not changes:
            return setting
        return self.profiles.apply(setting, changes)

    @staticmethod
    def as_dict(setting: ProfileSetting) -> dict:
        return {
            "photo_url": setting.photo_url,
            "show_seminar": (
                setting.show_seminar if setting.show_seminar is not None else True
            ),
        }
