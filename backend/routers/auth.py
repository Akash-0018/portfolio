from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from config import settings
from auth import create_access_token, get_current_admin

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    print(f"--> LOGIN ATTEMPT: username='{request.username}', password='{request.password}'")
    print(f"--> ALLOWED USERS: {settings.ADMIN_USERNAMES}")
    print(f"--> TARGET PASSWORD: '{settings.ADMIN_PASSWORD}'")
    
    valid_username = any(
        request.username.strip().lower() == allowed.strip().lower() for allowed in settings.ADMIN_USERNAMES
    )
    if not valid_username or request.password.strip() != settings.ADMIN_PASSWORD.strip():
        print("--> LOGIN FAILED: Username or password mismatch!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
        )
    print("--> LOGIN SUCCESSFUL! Generating JWT token.")
    access_token = create_access_token(data={"sub": request.username.strip()})
    return {"access_token": access_token, "token_type": "bearer", "username": request.username.strip()}


@router.get("/verify")
def verify_admin_status(current_admin: str = Depends(get_current_admin)):
    return {"status": "authenticated", "user": current_admin}
