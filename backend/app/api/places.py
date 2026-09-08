from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Place
from ..schemas import (
    ApiResponse,
    GuideOut,
    MapBundle,
    MapPointOut,
    PageData,
    PageMeta,
    PlaceDetail,
    PlaceListItem,
    ok,
)
from ..serializers import guide_out, map_point_out, media_url, pick_translation, place_languages

router = APIRouter(prefix="/api/places", tags=["places"])


def _load_place(db: Session, place_id: int | str) -> Place:
    stmt = select(Place).options(selectinload(Place.translations))
    if isinstance(place_id, int):
        stmt = stmt.where(Place.id == place_id)
    else:
        stmt = stmt.where(Place.slug == place_id)
    place = db.scalar(stmt)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place


def _place_list_item(place: Place, locale: str) -> PlaceListItem:
    return PlaceListItem(
        id=place.id,
        slug=place.slug,
        category=place.category,
        region=place.region,
        distance_km=place.distance_km,
        walk_minutes=place.walk_minutes,
        rating=place.rating,
        featured=place.featured,
        audio_minutes=place.audio_minutes,
        image_url=media_url(place.image_url) or "",
        languages=place_languages(place),
        translation=pick_translation(place, locale),
    )


@router.get("", response_model=ApiResponse)
def list_places(
    locale: str = Query("en", pattern="^(zh|en|fr|es)$"),
    category: str | None = Query(None, pattern="^(museum|historic|memorial)$"),
    region: str | None = None,
    featured: bool | None = None,
    language: str | None = Query(None, pattern="^(zh|en|fr|es)$"),
    search: str | None = Query(None, max_length=120),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> ApiResponse:
    stmt = select(Place).options(selectinload(Place.translations)).order_by(Place.featured.desc(), Place.id)
    count_stmt = select(func.count()).select_from(Place)
    if category:
        stmt = stmt.where(Place.category == category)
        count_stmt = count_stmt.where(Place.category == category)
    if region:
        stmt = stmt.where(Place.region == region)
        count_stmt = count_stmt.where(Place.region == region)
    if featured is not None:
        stmt = stmt.where(Place.featured.is_(featured))
        count_stmt = count_stmt.where(Place.featured.is_(featured))
    if search:
        like = f"%{search.strip()}%"
        condition = or_(Place.slug.ilike(like), Place.region.ilike(like))
        stmt = stmt.where(condition)
        count_stmt = count_stmt.where(condition)

    places = list(db.scalars(stmt.offset(offset).limit(limit)).unique())
    if language:
        places = [p for p in places if language in place_languages(p)]

    total = db.scalar(count_stmt) or 0
    items = [_place_list_item(place, locale) for place in places]
    return ok(
        PageData(
            items=items,
            meta=PageMeta(total=total, offset=offset, limit=limit),
        )
    )


@router.get("/{place_id}", response_model=ApiResponse)
def get_place(place_id: str, locale: str = Query("en", pattern="^(zh|en|fr|es)$"), db: Session = Depends(get_db)) -> ApiResponse:
    try:
        key: int | str = int(place_id)
    except ValueError:
        key = place_id
    place = _load_place(db, key)
    translations = {t.locale: pick_translation(place, t.locale) for t in place.translations}
    detail = PlaceDetail(
        id=place.id,
        slug=place.slug,
        category=place.category,
        region=place.region,
        distance_km=place.distance_km,
        walk_minutes=place.walk_minutes,
        rating=place.rating,
        featured=place.featured,
        audio_minutes=place.audio_minutes,
        image_url=media_url(place.image_url) or "",
        languages=place_languages(place),
        translations=translations,
    )
    return ok(detail)


@router.get("/{place_id}/guides", response_model=ApiResponse)
def list_guides(
    place_id: str,
    guide_type: str | None = Query(None, pattern="^(audio|video|story)$"),
    db: Session = Depends(get_db),
) -> ApiResponse:
    try:
        key: int | str = int(place_id)
    except ValueError:
        key = place_id
    place = _load_place(db, key)
    from ..models import Guide

    stmt = select(Guide).where(Guide.place_id == place.id).order_by(Guide.sort_order)
    if guide_type:
        stmt = stmt.where(Guide.guide_type == guide_type)
    guides = list(db.scalars(stmt))
    return ok([guide_out(g) for g in guides])


@router.get("/{place_id}/map", response_model=ApiResponse)
def get_map(place_id: str, db: Session = Depends(get_db)) -> ApiResponse:
    try:
        key: int | str = int(place_id)
    except ValueError:
        key = place_id
    place = _load_place(db, key)
    bundle = MapBundle(
        place_id=place.id,
        meta={
            "surveyed_at": "2026-03",
            "scale": "indoor",
            "level": 1,
            "demo": True,
        },
        points=[map_point_out(p) for p in sorted(place.map_points, key=lambda item: item.sort_order)],
    )
    return ok(bundle)
