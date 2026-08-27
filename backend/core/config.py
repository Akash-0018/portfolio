from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./app.db"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://akash-aiportfolio.netlify.app"
    SECRET_KEY: str = "super-secret-portfolio-admin-jwt-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # SMTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    ADMIN_EMAIL: str = "akashcse018@gmail.com"

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
            origins.append(cleaned)
        return origins

    class Config:
        env_file = ".env"
        extra = "ignore"
settings = Settings()


