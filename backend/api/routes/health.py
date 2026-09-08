from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    return {
        "status": "alive",
        "service": "Akash PG Portfolio API",
        "version": "1.0.0",
    }
