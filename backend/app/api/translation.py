from __future__ import annotations

from fastapi import APIRouter

from ..schemas import ApiResponse, TranslationRequest, TranslationResult, ok
from ..services.translation_service import translate

router = APIRouter(prefix="/api/translation", tags=["translation"])


@router.post("", response_model=ApiResponse)
def translate_text(payload: TranslationRequest) -> ApiResponse:
    result = translate(payload)
    return ok(TranslationResult.model_validate(result), message="translation completed")
