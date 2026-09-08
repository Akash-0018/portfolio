from typing import Sequence

from sqlalchemy.orm import Session

from models.contact import ContactMessage
from repositories.contact_repository import ContactRepository
from schemas.contact import ContactCreate
from services.exceptions import NotFoundError


class ContactService:
    def __init__(self, db: Session):
        self.messages = ContactRepository(db)

    def submit(self, data: ContactCreate) -> ContactMessage:
        return self.messages.add(ContactMessage(**data.model_dump()))

    def list_all(self) -> Sequence[ContactMessage]:
        return self.messages.list_newest_first()

    def delete(self, message_id: int) -> None:
        message = self.messages.get(message_id)
        if not message:
            raise NotFoundError("Message not found")
        self.messages.delete(message)
