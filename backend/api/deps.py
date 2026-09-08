"""Request-scoped dependencies shared by the route modules.

Each service gets a factory so routes declare what they need rather than
constructing it, which keeps handlers thin and makes them trivial to override
in a test.
"""
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from core.database import get_db
from services.auth_service import AuthService
from services.contact_service import ContactService
from services.exceptions import AuthenticationError
from services.profile_service import ProfileService
from services.project_service import ProjectService
from services.seminar_service import SeminarService
from services.upload_service import UploadService
from utils.rate_limit import contact_limiter

security = HTTPBearer()


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


def get_project_service(db: Session = Depends(get_db)) -> ProjectService:
    return ProjectService(db)


def get_seminar_service(db: Session = Depends(get_db)) -> SeminarService:
    return SeminarService(db)


def get_contact_service(db: Session = Depends(get_db)) -> ContactService:
    return ContactService(db)


def get_profile_service(db: Session = Depends(get_db)) -> ProfileService:
    return ProfileService(db)


def get_upload_service(db: Session = Depends(get_db)) -> UploadService:
    return UploadService(db)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth: AuthService = Depends(get_auth_service),
) -> str:
    """Resolve the bearer token to an admin username, or reject the request."""
    try:
        return auth.resolve_token(credentials.credentials).username
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=exc.message,
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


def enforce_contact_rate_limit(request: Request) -> None:
    contact_limiter.check(request)
