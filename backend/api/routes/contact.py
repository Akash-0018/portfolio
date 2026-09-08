from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, status

from api.deps import enforce_contact_rate_limit, get_contact_service, get_current_admin
from schemas.contact import ContactCreate, ContactResponse
from services.contact_service import ContactService
from utils.email_utils import send_contact_notification

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
    contact: ContactService = Depends(get_contact_service),
):
    message = contact.submit(contact_data)

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
    contact: ContactService = Depends(get_contact_service),
    admin: str = Depends(get_current_admin),
):
    return contact.list_all()


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(
    message_id: int,
    contact: ContactService = Depends(get_contact_service),
    admin: str = Depends(get_current_admin),
):
    contact.delete(message_id)
    return None
