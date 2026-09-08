from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Feedback, Place, User
from ..schemas import ApiResponse, FeedbackCreate, FeedbackOut, ok

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("", response_model=ApiResponse)
def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)) -> ApiResponse:
    place_id = None
    if payload.place_slug:
        place = db.scalar(select(Place).where(Place.slug == payload.place_slug))
        place_id = place.id if place else None
    if payload.user_id is not None and not db.get(User, payload.user_id):
        raise HTTPException(status_code=404, detail="User not found")
    feedback = Feedback(
        category=payload.category,
        user_id=payload.user_id,
        place_id=place_id,
        rating=payload.rating,
        content=payload.content,
        status="new",
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return ok(FeedbackOut.model_validate(feedback), message="feedback received")


@router.get("", response_model=ApiResponse)
def list_feedback(db: Session = Depends(get_db)) -> ApiResponse:
    rows = db.scalars(select(Feedback).order_by(Feedback.created_at.desc()).limit(100))
    return ok([FeedbackOut.model_validate(item) for item in rows])
