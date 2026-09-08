from __future__ import annotations

from .config import settings
from .models import Place, PlaceTranslation
from .schemas import GuideOut, MapPointOut, TranslationItem


def media_url(path: str | None) -> str | None:
    if not path:
        return path
    if path.startswith("/") and settings.public_base_url:
        return settings.public_base_url.rstrip("/") + path
    return path


def translation_item(translation: PlaceTranslation) -> TranslationItem:
    return TranslationItem.model_validate(translation)


def pick_translation(place: Place, locale: str) -> TranslationItem:
    translations = place.translations
    desired = next((t for t in translations if t.locale == locale), None)
    fallback = next((t for t in translations if t.locale == "en"), None)
    item = desired or fallback or translations[0]
    return translation_item(item)


def place_languages(place: Place) -> list[str]:
    return sorted({t.locale for t in place.translations})


def guide_out(guide) -> GuideOut:
    item = GuideOut(
        id=guide.id,
        place_id=guide.place_id,
        guide_type=guide.guide_type,
        title=guide.title_json,
        duration_seconds=guide.duration_seconds,
        languages=list(guide.languages or []),
        media_url=media_url(guide.media_url),
        transcript=guide.transcript_json,
        reviewed=guide.reviewed,
    )
    return item


def map_point_out(point) -> MapPointOut:
    return MapPointOut(
        id=point.id,
        place_id=point.place_id,
        point_type=point.point_type,
        label=point.label_json,
        x=point.x,
        y=point.y,
    )
