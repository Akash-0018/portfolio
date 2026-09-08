from sqlalchemy.orm import Session

from core.security import (
    TokenError,
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from models.user import User
from repositories.user_repository import UserRepository
from services.exceptions import AuthenticationError


class AuthService:
    def __init__(self, db: Session):
        self.users = UserRepository(db)

    def authenticate(self, identity: str, password: str) -> tuple[User, str]:
        """Validate a credential and mint an access token."""
        user = self.users.find_by_identity(identity)

        # Deliberately the same message for "no such user" and "wrong password",
        # so the endpoint cannot be used to enumerate accounts.
        if not user or not verify_password(password.strip(), user.hashed_password):
            raise AuthenticationError("Incorrect username/email or password")

        return user, create_access_token(data={"sub": user.username})

    def resolve_token(self, token: str) -> User:
        """Turn a bearer token into the user it identifies."""
        try:
            payload = decode_access_token(token)
        except TokenError as exc:
            raise AuthenticationError(str(exc)) from exc

        subject = payload.get("sub")
        if not subject:
            raise AuthenticationError("Could not validate credentials")

        user = self.users.find_by_identity(subject)
        if not user:
            raise AuthenticationError("User not found or unauthorized")

        return user

    def ensure_admin_seeded(self, username: str, email: str, password: str) -> bool:
        """Create the first admin if the table is empty. True if one was created."""
        if self.users.count() > 0:
            return False

        self.users.add(
            User(
                username=username,
                email=email,
                hashed_password=get_password_hash(password),
            )
        )
        return True

    def upsert_admin(self, username: str, email: str, password: str) -> bool:
        """Create or rotate the admin credential. True if newly created."""
        existing = self.users.find_by_identity(username) or self.users.find_by_identity(email)
        hashed = get_password_hash(password)

        if existing is None:
            self.users.add(User(username=username, email=email, hashed_password=hashed))
            return True

        self.users.apply(
            existing,
            {"username": username, "email": email, "hashed_password": hashed},
        )
        return False
