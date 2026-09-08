import os
import uuid

from sqlalchemy.orm import Session

from models.upload import Upload
from repositories.upload_repository import UploadRepository
from services.exceptions import NotFoundError, ValidationError

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB


class UploadService:
    def __init__(self, db: Session):
        self.uploads = UploadRepository(db)

    def store(self, filename: str, content: bytes, content_type: str | None) -> str:
        _, ext = os.path.splitext((filename or "").lower())
        if ext not in ALLOWED_EXTENSIONS:
            allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
            raise ValidationError(f"Invalid file extension. Allowed: {allowed}")
        if not content:
            raise ValidationError("Uploaded file is empty.")
        if len(content) > MAX_UPLOAD_BYTES:
            raise ValidationError(
                f"File is too large. Maximum is {MAX_UPLOAD_BYTES // 1024} KB."
            )

        stored_name = f"{uuid.uuid4().hex}{ext}"
        self.uploads.add(
            Upload(
                filename=stored_name,
                data=content,
                mime_type=content_type or "application/octet-stream",
            )
        )
        return f"/api/uploads/{stored_name}"

    def get_blob(self, filename: str) -> Upload:
        stored = self.uploads.find_by_filename(filename)
        if not stored:
            raise NotFoundError("File not found")
        return stored
