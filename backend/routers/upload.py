import os
import uuid
import shutil
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from auth import get_current_admin

router = APIRouter(prefix="/upload", tags=["upload"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"}
UPLOAD_DIR = "uploads"

@router.post("/", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin)
):
    # Ensure directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Get extension
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    # Save the file
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    return {"url": f"/api/uploads/{filename}"}
