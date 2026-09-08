from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Comment, CommunityPost, Like, Place, User
from ..schemas import (
    ApiResponse,
    CommentCreate,
    CommentOut,
    LikeResult,
    PageData,
    PageMeta,
    PostCreate,
    PostOut,
    ok,
)
from ..serializers import media_url

router = APIRouter(prefix="/api/community", tags=["community"])


def _post_out(post: CommunityPost, liked_user_id: int | None = None) -> PostOut:
    liked = False
    if liked_user_id is not None:
        liked = any(like.user_id == liked_user_id for like in post.likes)
    return PostOut(
        id=post.id,
        author_name=post.author_name,
        country=post.country,
        place_id=post.place_id,
        kind=post.kind,
        title=post.title,
        body=post.body,
        image_url=media_url(post.image_url),
        language=post.language,
        likes_count=post.likes_count,
        comments_count=post.comments_count,
        created_at=post.created_at,
        liked_by_me=liked,
    )


@router.get("/posts", response_model=ApiResponse)
def list_posts(
    kind: str | None = Query(None, pattern="^(discover|stories|question)$"),
    language: str | None = Query(None, max_length=8),
    country: str | None = None,
    place_slug: str | None = None,
    user_id: int | None = None,
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
) -> ApiResponse:
    stmt = (
        select(CommunityPost)
        .options(selectinload(CommunityPost.likes))
        .where(CommunityPost.status == "published")
        .order_by(CommunityPost.created_at.desc())
    )
    count_stmt = (
        select(func.count())
        .select_from(CommunityPost)
        .where(CommunityPost.status == "published")
    )
    if kind:
        stmt = stmt.where(CommunityPost.kind == kind)
        count_stmt = count_stmt.where(CommunityPost.kind == kind)
    if language:
        stmt = stmt.where(CommunityPost.language == language)
        count_stmt = count_stmt.where(CommunityPost.language == language)
    if country:
        stmt = stmt.where(CommunityPost.country == country)
        count_stmt = count_stmt.where(CommunityPost.country == country)
    if place_slug:
        place = db.scalar(select(Place).where(Place.slug == place_slug))
        if place:
            stmt = stmt.where(CommunityPost.place_id == place.id)
            count_stmt = count_stmt.where(CommunityPost.place_id == place.id)
    total = db.scalar(count_stmt) or 0
    posts = list(db.scalars(stmt.offset(offset).limit(limit)).unique())
    items = [_post_out(post, user_id) for post in posts]
    return ok(PageData(items=items, meta=PageMeta(total=total, offset=offset, limit=limit)))


@router.post("/posts", response_model=ApiResponse)
def create_post(payload: PostCreate, db: Session = Depends(get_db)) -> ApiResponse:
    place_id = None
    if payload.place_slug:
        place = db.scalar(select(Place).where(Place.slug == payload.place_slug))
        place_id = place.id if place else None
    if payload.user_id is not None:
        user = db.get(User, payload.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    post = CommunityPost(
        author_user_id=payload.user_id,
        author_name=payload.author_name,
        country=payload.country,
        place_id=place_id,
        kind="story" if payload.kind == "stories" else payload.kind,
        title=payload.title,
        body=payload.body,
        image_url=payload.image_url,
        language=payload.language,
        status="published",
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return ok(_post_out(post), message="post created")


@router.get("/posts/{post_id}/comments", response_model=ApiResponse)
def list_comments(post_id: int, db: Session = Depends(get_db)) -> ApiResponse:
    post = db.get(CommunityPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    comments = db.scalars(
        select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at)
    )
    return ok([CommentOut.model_validate(comment) for comment in comments])


@router.post("/posts/{post_id}/comments", response_model=ApiResponse)
def create_comment(post_id: int, payload: CommentCreate, db: Session = Depends(get_db)) -> ApiResponse:
    post = db.get(CommunityPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    comment = Comment(post_id=post_id, author_name=payload.author_name, body=payload.body)
    post.comments_count = (post.comments_count or 0) + 1
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return ok(CommentOut.model_validate(comment), message="comment created")


@router.post("/posts/{post_id}/like", response_model=ApiResponse)
def toggle_like(
    post_id: int,
    user_id: int = Query(..., ge=1),
    db: Session = Depends(get_db),
) -> ApiResponse:
    post = db.get(CommunityPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not db.get(User, user_id):
        raise HTTPException(status_code=404, detail="User not found")
    existing = db.scalar(
        select(Like).where(Like.post_id == post_id, Like.user_id == user_id)
    )
    if existing:
        db.delete(existing)
        post.likes_count = max(0, (post.likes_count or 1) - 1)
        liked = False
    else:
        db.add(Like(post_id=post_id, user_id=user_id))
        post.likes_count = (post.likes_count or 0) + 1
        liked = True
    db.commit()
    db.refresh(post)
    return ok(LikeResult(post_id=post_id, liked=liked, likes_count=post.likes_count))
