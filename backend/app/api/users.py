from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Badge, User, UserBadge
from ..schemas import ApiResponse, JourneyOut, UserBadgeOut, UserCreate, UserOut, ok

router = APIRouter(prefix="/api/users", tags=["users"])


def _user_out(user: User) -> UserOut:
    return UserOut.model_validate(user)


def _user_badge_out(user_badge: UserBadge) -> UserBadgeOut:
    badge = user_badge.badge
    return UserBadgeOut(
        id=badge.id,
        code=badge.code,
        name=badge.name_json,
        detail=badge.detail_json,
        kind=badge.kind,
        accent=badge.accent,
        progress=user_badge.progress,
        earned_at=user_badge.earned_at,
    )


@router.post("", response_model=ApiResponse)
def create_or_get_user(payload: UserCreate, db: Session = Depends(get_db)) -> ApiResponse:
    user = db.scalar(select(User).where(User.client_key == payload.client_key))
    if not user:
        user = User(
            client_key=payload.client_key,
            nickname=payload.nickname,
            country=payload.country,
            locale=payload.locale,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return ok(_user_out(user), message="user ready")


@router.get("/{user_id}", response_model=ApiResponse)
def get_user(user_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return ok(_user_out(user))


@router.get("/{user_id}/journey", response_model=ApiResponse)
def get_journey(user_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_badges = list(
        db.scalars(
            select(UserBadge)
            .options(selectinload(UserBadge.badge))
            .where(UserBadge.user_id == user_id)
            .order_by(UserBadge.earned_at)
        )
    )
    journey = JourneyOut(
        user=_user_out(user),
        visited_places=user.visited_places,
        visited_target=8,
        badges=[_user_badge_out(item) for item in user_badges],
    )
    return ok(journey)


@router.get("/{user_id}/badges", response_model=ApiResponse)
def list_user_badges(user_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    if not db.get(User, user_id):
        raise HTTPException(status_code=404, detail="User not found")
    items = db.scalars(
        select(UserBadge)
        .options(selectinload(UserBadge.badge))
        .where(UserBadge.user_id == user_id)
    )
    return ok([_user_badge_out(item) for item in items])


@router.post("/{user_id}/badges/{badge_id}/earn", response_model=ApiResponse)
def earn_badge(user_id: int, badge_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    if not db.get(User, user_id):
        raise HTTPException(status_code=404, detail="User not found")
    if not db.get(Badge, badge_id):
        raise HTTPException(status_code=404, detail="Badge not found")
    user_badge = db.scalar(
        select(UserBadge).where(UserBadge.user_id == user_id, UserBadge.badge_id == badge_id)
    )
    if user_badge:
        user_badge.progress = 100
    else:
        user_badge = UserBadge(user_id=user_id, badge_id=badge_id, progress=100)
        db.add(user_badge)
    db.commit()
    db.refresh(user_badge)
    return ok(_user_badge_out(user_badge), message="badge earned")
