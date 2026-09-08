from __future__ import annotations

from uuid import uuid4

from ..config import settings
from ..schemas import GlossaryHit, TranslationRequest, TranslationResult

GLOSSARY: dict[str, dict[str, str]] = {
    "zh": {
        "八七会议": "The August 7th Meeting — an emergency CPC Central Committee session in Hankou on 7 August 1927.",
        "辛亥革命": "The Xinhai Revolution — named for the sexagenary year 1911; the revolution begun in Wuchang.",
        "农讲所": "National Peasant Movement Institute — the 1927 Wuchang school where rural revolution leaders were trained.",
        "红巷": "The Red Lane — a Wuchang street named for its central role in the 1927 revolution.",
        "卫生间": "Restroom — follow the blue signs.",
        "出口": "Exit — the south gate is wheelchair-accessible.",
    },
    "en": {
        "August 7th Meeting": "八七会议——1927 年 8 月 7 日在汉口召开的中共中央紧急会议。",
        "Xinhai Revolution": "辛亥革命——以干支纪年“辛亥”（1911 年）命名的武昌起义及后续革命。",
        "Red Lane": "红巷——1927 年革命时期武汉革命运动的集中街区。",
        "National Peasant Movement Institute": "中央农民运动讲习所——1927 年毛泽东参与创办的农民运动干部学校。",
    },
}


def _demo_translate(request: TranslationRequest) -> str:
    text = request.text.strip()
    source = request.source_language
    target = request.target_language
    if source == target:
        return text

    hits = [
        (term, note)
        for term, note in GLOSSARY.get(source, {}).items()
        if term.lower() in text.lower()
    ]
    if hits:
        term, _note = hits[0]
        return term if target == "zh" else GLOSSARY[source][term]

    # Keep the demo deterministic and honest: no third-party key, no fake "AI" claim.
    if target == "zh":
        return f"[HeriGuide Demo] {text}"
    return f"[HeriGuide Demo] {text}"


def translate(request: TranslationRequest) -> TranslationResult:
    translated_text = _demo_translate(request)
    source_hits = [
        GlossaryHit(term=term, note=note)
        for term, note in GLOSSARY.get(request.source_language, {}).items()
        if term.lower() in request.text.lower()
    ]
    return TranslationResult(
        request_id=uuid4().hex,
        source_language=request.source_language,
        target_language=request.target_language,
        translated_text=translated_text,
        glossary=source_hits,
        provider="heriguide-demo"
        if not settings.translation_api_url
        else "heriguide-remote",
        mode=request.mode,
    )
