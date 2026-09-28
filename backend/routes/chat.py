from fastapi import APIRouter, Depends

from routes.deps import enforce_chat_rate_limit, get_chat_service
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post(
    "/",
    response_model=ChatResponse,
    dependencies=[Depends(enforce_chat_rate_limit)],
)
def chat(body: ChatRequest, chat: ChatService = Depends(get_chat_service)):
    return ChatResponse(reply=chat.reply(body.messages))
