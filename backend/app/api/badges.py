from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Badge
from ..schemas import ApiResponse, BadgeOut, ok

router = APIRouter(prefix="/api/badges", tags=["badges"])


@router.get("", response_model=ApiResponse)
def list_badges(db: Session = Depends(get_db)) -> ApiResponse:
    badges = db.scalars(select(Badge).order_by(Badge.id))
    items = [
        BadgeOut(
            id=badge.id,
            code=badge.code,
            name=badge.name_json,
            detail=badge.detail_json,
            kind=badge.kind,
            accent=badge.accent,
        )
        for badge in badges
    ]
    return ok(items)
