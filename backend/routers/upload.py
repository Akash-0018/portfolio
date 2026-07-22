import os
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from auth import get_current_admin
from database import get_db
from models.upload import Upload

router = APIRouter(prefix="/upload", tags=["upload"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"}

@router.post("/", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    # Get extension
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension {ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    filename = f"{uuid.uuid4().hex}{ext}"
    
    # Read file content
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read file: {str(e)}"
        )
    
    # Save to database
    try:
        db_upload = Upload(
            filename=filename,
            data=content,
            mime_type=file.content_type or "application/octet-stream"
        )
        db.add(db_upload)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file to database: {str(e)}"
        )
    
    return {"url": f"/api/uploads/{filename}"}
