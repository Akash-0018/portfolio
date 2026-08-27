from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session
from core.database import get_db
from models.contact import ContactMessage
from schemas.contact import ContactCreate, ContactResponse
from utils.email_utils import send_contact_notification

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(
    contact_data: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    message = ContactMessage(**contact_data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # Send email notification asynchronously in the background
    background_tasks.add_task(
        send_contact_notification,
        name=message.name,
        sender_email=message.email,
        subject=message.subject,
        message=message.message
    )
    
    return message

