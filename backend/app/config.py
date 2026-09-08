from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables or backend/.env."""

    app_name: str = "HeriGuide API"
    app_version: str = "0.1.0"
    debug: bool = False
    database_url: str = f"sqlite:///{(PROJECT_DIR / 'heriguide.db').as_posix()}"
    cors_origins: str = "*"
    seed_demo: bool = True
    public_base_url: str = "http://localhost:5173"
    amap_key: str | None = None
    translation_api_key: str | None = None
    translation_api_url: str | None = None

    model_config = SettingsConfigDict(
        env_prefix="HERIGUIDE_",
        env_file=PROJECT_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        if self.cors_origins.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
