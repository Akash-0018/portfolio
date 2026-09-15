from sqlalchemy import func
from sqlalchemy.orm import Session

from models.user import User
from repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def __init__(self, db: Session):
        super().__init__(db)

    def find_by_identity(self, identity: str) -> User | None:
        """Look a user up by username or email, case-insensitively.

        Compared exactly rather than with ilike: ilike treats the supplied value
        as a LIKE *pattern*, so an identity of "%" matched whichever user came
        first and reduced login to the password alone. The wildcards are only
        meaningful to LIKE, so an equality test removes them entirely.
        """
        cleaned = identity.strip().lower()
        if not cleaned:
            return None
        return (
            self.db.query(User)
            .filter(
                (func.lower(User.username) == cleaned)
                | (func.lower(User.email) == cleaned)
            )
            .first()
        )
