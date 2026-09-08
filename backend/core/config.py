from pydantic import model_validator
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./app.db"
    CORS_ORIGINS: str = (
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,"
        "https://akash-aiportfolio.netlify.app"
    )

    # Secrets - must be supplied via environment / .env. There is deliberately no
    # usable default: a committed signing key means anyone with the repo can forge
    # admin tokens.
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Admin bootstrap - used once, to seed the first user into an empty database.
    # If ADMIN_PASSWORD is empty the seeder is skipped rather than falling back to
    # a hardcoded credential.
    ADMIN_USERNAME: str = "Akash"
    ADMIN_PASSWORD: str = ""

    # SMTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    ADMIN_EMAIL: str = "akashcse018@gmail.com"

    @model_validator(mode="after")
    def require_secret_key(self) -> "Settings":
        if not self.SECRET_KEY.strip():
            raise RuntimeError(
                "SECRET_KEY is not set. Generate one with:\n"
                "    python -c \"import secrets; print(secrets.token_urlsafe(48))\"\n"
                "and set it in backend/.env (local) or as an environment variable "
                "(Docker / Render)."
            )
        return self

    @property
    def database_url_corrected(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            return url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return url

    @property
    def cors_origins_list(self) -> List[str]:
        origins = []
        for origin in self.CORS_ORIGINS.split(","):
            cleaned = origin.strip()
            if cleaned.endswith("/"):
                cleaned = cleaned[:-1]
            if cleaned:
                origins.append(cleaned)
        return origins

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
