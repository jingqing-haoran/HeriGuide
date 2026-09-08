from fastapi import APIRouter

from ..config import settings
from ..schemas import ApiResponse, ok

router = APIRouter(tags=["system"])


@router.get("/api/health", response_model=ApiResponse)
def health() -> ApiResponse:
    return ok(
        {
            "name": settings.app_name,
            "version": settings.app_version,
            "status": "ok",
            "database": "connected" if settings.database_url else "unknown",
        },
        message="service is healthy",
    )
