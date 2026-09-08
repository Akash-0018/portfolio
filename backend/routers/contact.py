from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.contact import ContactMessage
from schemas.contact import ContactCreate, ContactResponse
from utils.auth import get_current_admin
from utils.email_utils import send_contact_notification
from utils.rate_limit import enforce_contact_rate_limit

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post(
    "/",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(enforce_contact_rate_limit)],
)
def submit_contact(
    contact_data: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    message = ContactMessage(**contact_data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)

    # Best-effort notification. The message is already persisted and readable in
    # the admin inbox, so a missing or failing SMTP config never loses it.
    background_tasks.add_task(
        send_contact_notification,
        name=message.name,
        sender_email=message.email,
        subject=message.subject,
        message=message.message,
    )

    return message


@router.get("", response_model=List[ContactResponse])
@router.get("/", response_model=List[ContactResponse])
def list_contact_messages(
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
        )

    db.delete(message)
    db.commit()
    return None
