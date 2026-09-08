from sqlalchemy.orm import Session

from models.user import User
from repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def __init__(self, db: Session):
        super().__init__(db)

    def find_by_identity(self, identity: str) -> User | None:
        """Look a user up by username or email, case-insensitively."""
        cleaned = identity.strip()
        if not cleaned:
            return None
        return (
            self.db.query(User)
            .filter((User.username.ilike(cleaned)) | (User.email.ilike(cleaned)))
            .first()
        )
