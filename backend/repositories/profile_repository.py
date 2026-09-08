from models.profile import ProfileSetting
from repositories.base import BaseRepository


class ProfileRepository(BaseRepository[ProfileSetting]):
    model = ProfileSetting

    def get_singleton(self) -> ProfileSetting | None:
        """Profile settings are a single row; there is no id to address it by."""
        return self.db.query(ProfileSetting).first()
