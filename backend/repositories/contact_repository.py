from typing import Sequence

from models.contact import ContactMessage
from repositories.base import BaseRepository


class ContactRepository(BaseRepository[ContactMessage]):
    model = ContactMessage

    def list_newest_first(self) -> Sequence[ContactMessage]:
        return (
            self.db.query(ContactMessage)
            .order_by(ContactMessage.created_at.desc())
            .all()
        )
