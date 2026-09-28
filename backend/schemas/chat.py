from typing import List, Literal

from pydantic import BaseModel, Field

# The widget keeps the transcript client-side and resends it each turn. These
# caps bound what one anonymous request can cost.
MAX_MESSAGE_CHARS = 1000
MAX_HISTORY_MESSAGES = 20


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(min_length=1, max_length=MAX_HISTORY_MESSAGES)


class ChatResponse(BaseModel):
    reply: str
