from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api import badges, community, feedback, health, places, translation, users
from .config import settings
from .database import init_db
from .schemas import ApiResponse, ok

logger = logging.getLogger("heriguide")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db(seed=settings.seed_demo)
    yield


app = FastAPI(
    title=settings.app_name,
    description=(
        "HeriGuide 文脉向导 backend — multilingual guide API for Wuhan revolutionary heritage. "
        "Unified response: {code, message, data}."
    ),
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.status_code, "message": str(exc.detail), "data": None},
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    first = exc.errors()[0] if exc.errors() else {}
    field = ".".join(str(part) for part in first.get("loc", []) if part != "body")
    message = f"Validation error: {field} {first.get('msg', 'invalid')}".strip()
    return JSONResponse(status_code=422, content={"code": 422, "message": message, "data": None})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={"code": 500, "message": "Internal server error", "data": None},
    )


app.include_router(health.router)
app.include_router(places.router)
app.include_router(translation.router)
app.include_router(community.router)
app.include_router(users.router)
app.include_router(badges.router)
app.include_router(feedback.router)


@app.get("/", response_model=ApiResponse)
def root() -> ApiResponse:
    return ok(
        {
            "name": settings.app_name,
            "version": settings.app_version,
            "docs": "/docs",
            "openapi": "/openapi.json",
            "note": "Demo dataset is seeded automatically on first startup.",
        }
    )
