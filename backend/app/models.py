from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_key: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    nickname: Mapped[str] = mapped_column(String(80))
    country: Mapped[str | None] = mapped_column(String(80), nullable=True)
    locale: Mapped[str] = mapped_column(String(8), default="en")
    avatar_color: Mapped[str | None] = mapped_column(String(16), nullable=True)
    visited_places: Mapped[int] = mapped_column(Integer, default=0)

    posts: Mapped[list["CommunityPost"]] = relationship(back_populates="author_user")
    user_badges: Mapped[list["UserBadge"]] = relationship(back_populates="user")


class Place(TimestampMixin, Base):
    __tablename__ = "places"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(24), index=True)
    region: Mapped[str] = mapped_column(String(24))
    distance_km: Mapped[float] = mapped_column(Float, default=0)
    walk_minutes: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, default=4.5)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    image_url: Mapped[str] = mapped_column(String(300), default="")
    audio_minutes: Mapped[int] = mapped_column(Integer, default=20)

    translations: Mapped[list["PlaceTranslation"]] = relationship(
        back_populates="place", cascade="all, delete-orphan"
    )
    guides: Mapped[list["Guide"]] = relationship(back_populates="place", cascade="all, delete-orphan")
    map_points: Mapped[list["MapPoint"]] = relationship(
        back_populates="place", cascade="all, delete-orphan"
    )


class PlaceTranslation(Base):
    __tablename__ = "place_translations"
    __table_args__ = (UniqueConstraint("place_id", "locale", name="uq_place_translation_locale"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    place_id: Mapped[int] = mapped_column(
        ForeignKey("places.id", ondelete="CASCADE"), index=True
    )
    locale: Mapped[str] = mapped_column(String(8), index=True)
    name: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    cultural_note: Mapped[str] = mapped_column(Text)
    open_hours_text: Mapped[str] = mapped_column(String(80))
    closed_day: Mapped[str | None] = mapped_column(String(40), nullable=True)

    place: Mapped[Place] = relationship(back_populates="translations")


class Guide(Base):
    __tablename__ = "guides"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    place_id: Mapped[int] = mapped_column(ForeignKey("places.id", ondelete="CASCADE"), index=True)
    guide_type: Mapped[str] = mapped_column(String(16), index=True)  # audio | video | story
    title_json: Mapped[dict[str, str]] = mapped_column(JSON)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    languages: Mapped[list[str]] = mapped_column(JSON)
    media_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    transcript_json: Mapped[dict[str, str]] = mapped_column(JSON, default=dict)
    reviewed: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    place: Mapped[Place] = relationship(back_populates="guides")


class MapPoint(Base):
    __tablename__ = "map_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    place_id: Mapped[int] = mapped_column(ForeignKey("places.id", ondelete="CASCADE"), index=True)
    point_type: Mapped[str] = mapped_column(String(24), index=True)  # room | service | door
    label_json: Mapped[dict[str, str]] = mapped_column(JSON)
    x: Mapped[float] = mapped_column(Float)
    y: Mapped[float] = mapped_column(Float)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    place: Mapped[Place] = relationship(back_populates="map_points")


class CommunityPost(TimestampMixin, Base):
    __tablename__ = "community_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    author_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    author_name: Mapped[str] = mapped_column(String(100))
    country: Mapped[str | None] = mapped_column(String(80), nullable=True)
    place_id: Mapped[int | None] = mapped_column(
        ForeignKey("places.id", ondelete="SET NULL"), nullable=True, index=True
    )
    kind: Mapped[str] = mapped_column(String(16), default="discover", index=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    language: Mapped[str] = mapped_column(String(8), default="en")
    likes_count: Mapped[int] = mapped_column(Integer, default=0)
    comments_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(16), default="published")

    author_user: Mapped[User | None] = relationship(back_populates="posts")
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )
    likes: Mapped[list["Like"]] = relationship(back_populates="post", cascade="all, delete-orphan")


class Comment(TimestampMixin, Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(
        ForeignKey("community_posts.id", ondelete="CASCADE"), index=True
    )
    author_name: Mapped[str] = mapped_column(String(100))
    body: Mapped[str] = mapped_column(Text)

    post: Mapped[CommunityPost] = relationship(back_populates="comments")


class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_post_user_like"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(
        ForeignKey("community_posts.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    post: Mapped[CommunityPost] = relationship(back_populates="likes")
    user: Mapped[User] = relationship()


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    name_json: Mapped[dict[str, str]] = mapped_column(JSON)
    detail_json: Mapped[dict[str, str]] = mapped_column(JSON)
    kind: Mapped[str] = mapped_column(String(24))
    accent: Mapped[str] = mapped_column(String(16), default="clay")

    user_badges: Mapped[list["UserBadge"]] = relationship(back_populates="badge")


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = (UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    badge_id: Mapped[int] = mapped_column(ForeignKey("badges.id", ondelete="CASCADE"), index=True)
    progress: Mapped[int] = mapped_column(Integer, default=100)
    earned_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped[User] = relationship(back_populates="user_badges")
    badge: Mapped[Badge] = relationship(back_populates="user_badges")


class Feedback(TimestampMixin, Base):
    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category: Mapped[str] = mapped_column(String(32), index=True)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    place_id: Mapped[int | None] = mapped_column(
        ForeignKey("places.id", ondelete="SET NULL"), nullable=True
    )
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    content: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(16), default="new")
