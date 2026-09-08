from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator


# --------------------------------------------------------------------------
# Common envelope
# --------------------------------------------------------------------------
class ApiResponse(BaseModel):
    code: int = 200
    message: str = "success"
    data: Any = None


def ok(data: Any = None, message: str = "success") -> ApiResponse:
    return ApiResponse(code=200, message=message, data=data)


class PageMeta(BaseModel):
    total: int
    offset: int
    limit: int


class PageData(BaseModel):
    items: list[Any]
    meta: PageMeta


# --------------------------------------------------------------------------
# Places & translations
# --------------------------------------------------------------------------
class TranslationItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    locale: str
    name: str
    summary: str
    description: str
    cultural_note: str
    open_hours_text: str
    closed_day: str | None = None


class PlaceListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    category: str
    region: str
    distance_km: float
    walk_minutes: int
    rating: float
    featured: bool
    audio_minutes: int
    image_url: str
    languages: list[str]
    translation: TranslationItem


class PlaceDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    category: str
    region: str
    distance_km: float
    walk_minutes: int
    rating: float
    featured: bool
    audio_minutes: int
    image_url: str
    languages: list[str]
    translations: dict[str, TranslationItem]


class GuideOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    place_id: int
    guide_type: str
    title: dict[str, str]
    duration_seconds: int
    languages: list[str]
    media_url: str | None
    transcript: dict[str, str]
    reviewed: bool


class MapPointOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    place_id: int
    point_type: str
    label: dict[str, str]
    x: float
    y: float


class MapBundle(BaseModel):
    place_id: int
    meta: dict[str, Any]
    points: list[MapPointOut]


# --------------------------------------------------------------------------
# Translation
# --------------------------------------------------------------------------
TranslationMode = Literal["text", "photo", "voice"]


class TranslationRequest(BaseModel):
    source_language: str = "zh"
    target_language: str = "en"
    text: str = Field(min_length=1, max_length=2000)
    mode: TranslationMode = "text"

    @field_validator("source_language", "target_language")
    @classmethod
    def validate_locale(cls, value: str) -> str:
        value = value.lower()
        if value not in {"zh", "en", "fr", "es"}:
            raise ValueError("locale must be one of zh/en/fr/es")
        return value


class GlossaryHit(BaseModel):
    term: str
    note: str


class TranslationResult(BaseModel):
    request_id: str
    source_language: str
    target_language: str
    translated_text: str
    glossary: list[GlossaryHit] = []
    provider: str = "heriguide-demo"
    mode: TranslationMode = "text"


# --------------------------------------------------------------------------
# Community
# --------------------------------------------------------------------------
class PostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author_name: str
    country: str | None
    place_id: int | None
    kind: str
    title: str
    body: str
    image_url: str | None
    language: str
    likes_count: int
    comments_count: int
    created_at: datetime
    liked_by_me: bool = False


class PostCreate(BaseModel):
    author_name: str = Field(min_length=1, max_length=100)
    country: str | None = Field(default=None, max_length=80)
    place_slug: str | None = None
    kind: Literal["discover", "stories", "question"] = "discover"
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=5000)
    image_url: str | None = None
    language: str = "en"
    user_id: int | None = None


class CommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    post_id: int
    author_name: str
    body: str
    created_at: datetime


class CommentCreate(BaseModel):
    author_name: str = Field(min_length=1, max_length=100)
    body: str = Field(min_length=1, max_length=2000)
    user_id: int | None = None


class LikeResult(BaseModel):
    post_id: int
    liked: bool
    likes_count: int


# --------------------------------------------------------------------------
# Users, badges, feedback
# --------------------------------------------------------------------------
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    client_key: str
    nickname: str
    country: str | None
    locale: str
    avatar_color: str | None
    visited_places: int
    created_at: datetime


class UserCreate(BaseModel):
    client_key: str = Field(min_length=2, max_length=64)
    nickname: str = Field(min_length=1, max_length=80)
    country: str | None = None
    locale: str = "en"


class BadgeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: dict[str, str]
    detail: dict[str, str]
    kind: str
    accent: str


class UserBadgeOut(BadgeOut):
    progress: int
    earned_at: datetime | None = None


class JourneyOut(BaseModel):
    user: UserOut
    visited_places: int
    visited_target: int = 8
    badges: list[UserBadgeOut]


class FeedbackCreate(BaseModel):
    category: Literal["translation", "map", "audio", "community", "other"] = "other"
    content: str = Field(min_length=1, max_length=5000)
    user_id: int | None = None
    place_slug: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)


class FeedbackOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    rating: int | None
    content: str
    status: str
    created_at: datetime
