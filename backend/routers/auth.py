from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from models.user import User
from utils.auth import create_access_token, verify_password, get_current_admin

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
def login(request: LoginRequest, db: Session = Depends(get_db)):
    identity = request.username.strip()

    # Dynamic DB user lookup by username OR email (case-insensitive)
    user = (
        db.query(User)
        .filter((User.username.ilike(identity)) | (User.email.ilike(identity)))
        .first()
    )

    if not user or not verify_password(request.password.strip(), user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
        )

    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
    }


@router.get("/verify")
@router.get("/verify/")
def verify_admin_status(current_admin: str = Depends(get_current_admin)):
    return {"status": "authenticated", "user": current_admin}
