from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import settings

_connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    connect_args=_connect_args,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields one database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(seed: bool = True) -> None:
    """Create tables and, optionally, load the demo dataset."""
    from . import models  # noqa: F401  (register models on Base.metadata)
    from .seed import seed_demo

    models.Base.metadata.create_all(bind=engine)
    if seed:
        with SessionLocal() as db:
            seed_demo(db)
