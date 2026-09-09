import os

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from fastapi.responses import FileResponse

from routes.deps import get_current_admin, get_upload_service
from services.exceptions import NotFoundError
from services.upload_service import UploadService

# Two prefixes' worth of routes live here: the admin write endpoint (/upload)
# and the public read endpoint (/uploads). They share one service.
router = APIRouter(tags=["uploads"])

LEGACY_UPLOAD_DIR = "uploads"


@router.post("/upload/", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    uploads: UploadService = Depends(get_upload_service),
    admin: str = Depends(get_current_admin),
):
    try:
        content = await file.read()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to read the uploaded file.",
        ) from exc

    return {"url": uploads.store(file.filename, content, file.content_type)}


@router.get("/uploads/{filename}")
def serve_upload(filename: str, uploads: UploadService = Depends(get_upload_service)):
    try:
        stored = uploads.get_blob(filename)
    except NotFoundError:
        # Fall back to the handful of images that predate DB-backed uploads.
        legacy_root = os.path.realpath(LEGACY_UPLOAD_DIR)
        candidate = os.path.realpath(os.path.join(legacy_root, filename))
        if candidate.startswith(legacy_root + os.sep) and os.path.isfile(candidate):
            return FileResponse(candidate)
        raise

    return Response(content=stored.data, media_type=stored.mime_type)
