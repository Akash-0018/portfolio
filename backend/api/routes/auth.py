from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from api.deps import get_auth_service, get_current_admin
from services.auth_service import AuthService
from services.exceptions import AuthenticationError

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


@router.post("/login", response_model=TokenResponse)
@router.post("/login/", response_model=TokenResponse)
def login(request: LoginRequest, auth: AuthService = Depends(get_auth_service)):
    try:
        user, token = auth.authenticate(request.username, request.password)
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=exc.message
        ) from exc

    return {"access_token": token, "token_type": "bearer", "username": user.username}


@router.get("/verify")
@router.get("/verify/")
def verify_admin_status(current_admin: str = Depends(get_current_admin)):
    return {"status": "authenticated", "user": current_admin}
