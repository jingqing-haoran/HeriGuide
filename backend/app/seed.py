from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import (
    Badge,
    Comment,
    CommunityPost,
    Guide,
    MapPoint,
    Place,
    PlaceTranslation,
    User,
    UserBadge,
)

LOCALES = ["zh", "en", "fr", "es"]


def _pick(mapping: dict[str, str], key: str, fallback_key: str = "en") -> str:
    return mapping.get(key) or mapping.get(fallback_key) or ""


def _fill(mapping: dict[str, str]) -> dict[str, str]:
    return {locale: _pick(mapping, locale) for locale in LOCALES}


PLACE_ROWS = [
    {
        "slug": "xinhai-museum",
        "category": "museum",
        "region": "Wuchang",
        "distance_km": 0.4,
        "walk_minutes": 5,
        "rating": 4.8,
        "featured": True,
        "audio_minutes": 28,
        "image": "20231125_Statue_of_Sun_Yat-sen_in_front_of_the_1911_Revolution_Museum.jpg",
        "names": {
            "zh": "辛亥革命博物院",
            "en": "Xinhai Revolution Museum",
            "fr": "Musée de la Révolution de Xinhai",
            "es": "Museo de la Revolución de Xinhai",
        },
        "summary": {
            "zh": "记录 1911 年改变中国的武昌起义，辛亥革命从这里开始。",
            "en": "The 1911 Revolution began here — the uprising that ended imperial rule.",
            "fr": "La révolution de 1911, qui mit fin à l’empire, a commencé ici.",
            "es": "Aquí empezó la Revolución de 1911, el levantamiento que acabó con el imperio.",
        },
        "description": {
            "zh": "辛亥革命博物院是武汉最具代表性的红色地标之一，系统讲述 1911 年武昌起义及其对近代中国的深远影响。",
            "en": "Wuhan’s most important heritage museum tells how the 1911 Wuchang Uprising overthrew imperial rule and shaped modern China.",
        },
        "cultural": {
            "zh": "“辛亥革命”的“辛亥”是干支纪年，代表 1911 年，而不是事件名称。",
            "en": "“Xinhai” is a year in the traditional sexagenary calendar — 1911 — not an event name.",
        },
        "languages": ["zh", "en", "fr", "es"],
    },
    {
        "slug": "honglou",
        "category": "historic",
        "region": "Wuchang",
        "distance_km": 0.6,
        "walk_minutes": 8,
        "rating": 4.7,
        "featured": True,
        "audio_minutes": 22,
        "image": "20240621_Site_of_the_Wuchang_Uprising_Military_Government_01.jpg",
        "names": {
            "zh": "武昌起义军政府旧址",
            "en": "Site of the Wuchang Uprising Government",
            "fr": "Ancien siège du gouvernement de Wuchang",
            "es": "Sede del Gobierno Insurgente de Wuchang",
        },
        "summary": {
            "zh": "红砖红楼——辛亥革命后第一个革命政权的诞生地。",
            "en": "The red-brick building where the first revolutionary government of the 1911 era was born.",
            "fr": "Le bâtiment de briques rouges où est né le premier gouvernement révolutionnaire.",
            "es": "El edificio de ladrillo rojo donde nació el primer gobierno revolucionario.",
        },
        "description": {
            "zh": "“红楼”在 1911 年 10 月 11 日成为湖北军政府的诞生地，是辛亥革命时期革命政权的象征。",
            "en": "Known as the Red Building, it was where revolutionaries proclaimed a new government in October 1911.",
        },
        "cultural": {
            "zh": "门前广场曾是清代阅兵场，同一片土地从旧王朝操练场变成共和起点。",
            "en": "The square outside was once an imperial parade ground — same land, two eras of Chinese history.",
        },
        "languages": ["zh", "en", "fr", "es"],
    },
    {
        "slug": "wuhan-revolution-museum",
        "category": "museum",
        "region": "Wuchang",
        "distance_km": 0.9,
        "walk_minutes": 11,
        "rating": 4.8,
        "featured": True,
        "audio_minutes": 45,
        "image": "武汉革命博物馆_5611.jpg",
        "names": {
            "zh": "武汉革命博物馆",
            "en": "Wuhan Revolution Museum",
            "fr": "Musée de la révolution de Wuhan",
            "es": "Museo de la Revolución de Wuhan",
        },
        "summary": {
            "zh": "都府堤红巷串联起农讲所、五大会址与毛泽东旧居，是 1927 年革命史的核心现场。",
            "en": "A red lane of 1927 history — peasant institute, Party congress site and Mao’s residence in one walk.",
            "fr": "Une rue-mémoire de 1927 reliant l’institut paysan, le Ve congrès et la résidence de Mao.",
            "es": "Un callejón de 1927 que une instituto campesino, congreso y residencia de Mao.",
        },
        "description": {
            "zh": "博物馆管理武昌农讲所旧址、毛泽东旧居与中共五大会址等场馆，是 1927 年“红色心脏”。",
            "en": "The museum district manages the Peasant Movement Institute, Mao’s residence and the Fifth Congress site — the heart of 1927.",
        },
        "cultural": {
            "zh": "“红巷”不是因为红墙，而是 1927 年这里曾是革命运动的中枢。",
            "en": "“Red Lane” was not painted red — the name comes from 1927 history, not paint.",
        },
        "languages": ["zh", "en", "fr", "es"],
    },
    {
        "slug": "august-7th",
        "category": "historic",
        "region": "Hankou",
        "distance_km": 1.2,
        "walk_minutes": 15,
        "rating": 4.7,
        "featured": True,
        "audio_minutes": 26,
        "image": "八七会议会址大门.jpg",
        "names": {
            "zh": "八七会议会址纪念馆",
            "en": "August 7th Meeting Memorial Hall",
            "fr": "Mémorial de la réunion du 7 août",
            "es": "Memorial de la Reunión del 7 de Agosto",
        },
        "summary": {
            "zh": "1927 年一次秘密召开的紧急会议，重新决定了中国革命的走向。",
            "en": "A secret emergency meeting in 1927 that redirected the Chinese revolution.",
            "fr": "Une réunion secrète de 1927 qui a redirigé la révolution chinoise.",
            "es": "Una reunión secreta de 1927 que cambió el rumbo de la revolución china.",
        },
        "description": {
            "zh": "1927 年 8 月 7 日，中共中央在汉口秘密召开“八七会议”，确定土地革命与武装斗争总方针。",
            "en": "On 7 August 1927 the CPC Central Committee met secretly in Hankou and set the course toward land revolution and armed struggle.",
        },
        "cultural": {
            "zh": "与会者夜里分头上楼，白天楼下有人以打麻将作掩护。",
            "en": "Delegates slipped in at night while mahjong downstairs covered the meeting.",
        },
        "languages": ["zh", "en", "fr", "es"],
    },
    {
        "slug": "fifth-congress",
        "category": "historic",
        "region": "Wuchang",
        "distance_km": 0.8,
        "walk_minutes": 10,
        "rating": 4.6,
        "featured": False,
        "audio_minutes": 24,
        "image": "中共五大会址.jpg",
        "names": {
            "zh": "中共五大会址纪念馆",
            "en": "Site of the Fifth National Congress Memorial",
            "fr": "Site mémorial du Ve congrès national du PCC",
            "es": "Memorial de la sede del V Congreso Nacional del PCCh",
        },
        "summary": {
            "zh": "1927 年 4–5 月，中国共产党第五次全国代表大会在此召开。",
            "en": "In April–May 1927 the Fifth National Congress of the CPC was held on this site.",
            "fr": "En avril–mai 1927, le Ve congrès national du PCC s’est tenu ici.",
            "es": "En abril-mayo de 1927 se celebró aquí el V Congreso Nacional del PCCh.",
        },
        "description": {
            "zh": "会址原为附小校园，中共五大在此首次提出建立中央监察委员会。",
            "en": "Held inside a former school campus, the congress created China’s first central discipline-inspection body.",
        },
        "cultural": {
            "zh": "制度建设的种子埋在危机之中：五大设立了中央监察委员会。",
            "en": "An institutional seed planted in the storm: the congress established the first central discipline body.",
        },
        "languages": ["zh", "en", "fr"],
    },
    {
        "slug": "peasant-institute",
        "category": "memorial",
        "region": "Wuchang",
        "distance_km": 0.9,
        "walk_minutes": 11,
        "rating": 4.7,
        "featured": False,
        "audio_minutes": 30,
        "image": "中央农民运动讲习所旧址纪念馆.jpg",
        "names": {
            "zh": "武昌农讲所旧址纪念馆",
            "en": "National Peasant Movement Institute",
            "fr": "Institut national du mouvement paysan",
            "es": "Instituto Nacional del Movimiento Campesino",
        },
        "summary": {
            "zh": "1927 年培养农民运动骨干的“大课堂”，青年毛泽东曾主持工作。",
            "en": "The 1927 school where revolutionary leaders were trained — Mao Zedong among its teachers.",
            "fr": "L’école de 1927 où se formèrent les cadres du mouvement paysan.",
            "es": "La escuela de 1927 donde se formaron los cuadros revolucionarios.",
        },
        "description": {
            "zh": "1927 年毛泽东在此主持中央农民运动讲习所，培养了大批农民运动骨干。",
            "en": "Mao and other leaders trained hundreds of young revolutionaries here in 1927.",
        },
        "cultural": {
            "zh": "学员不只听课，还要清晨操练、下乡调查、学会做群众工作。",
            "en": "Students drilled at dawn and investigated villages — the institute taught knowledge carried into fields.",
        },
        "languages": ["zh", "en", "es"],
    },
    {
        "slug": "mao-residence",
        "category": "historic",
        "region": "Wuchang",
        "distance_km": 1.0,
        "walk_minutes": 12,
        "rating": 4.6,
        "featured": False,
        "audio_minutes": 18,
        "image": "毛泽东旧居_20240218.jpg",
        "names": {
            "zh": "毛泽东旧居纪念馆",
            "en": "Mao Zedong’s Former Residence in Wuchang",
            "fr": "Ancienne résidence de Mao Zedong à Wuchang",
            "es": "Antigua residencia de Mao Zedong en Wuchang",
        },
        "summary": {
            "zh": "1927 年上半年，毛泽东在武汉写作《湖南农民运动考察报告》时的住处。",
            "en": "Where Mao Zedong lived while writing his famous 1927 investigation of China’s countryside.",
            "fr": "La maison où Mao a écrit son enquête sur le mouvement paysan en 1927.",
            "es": "La casa donde Mao escribió su investigación de 1927 sobre el campesinado.",
        },
        "description": {
            "zh": "1927 年上半年，毛泽东在此主持农讲所并写作《湖南农民运动考察报告》。",
            "en": "Mao lived here while running the Peasant Movement Institute and writing his celebrated 1927 report.",
        },
        "cultural": {
            "zh": "这里曾住过革命者家庭，历史人物在这里首先是父亲与丈夫。",
            "en": "Revolutionary families — including Mao’s own — shared this house.",
        },
        "languages": ["zh", "en", "fr"],
    },
    {
        "slug": "feb7-union",
        "category": "memorial",
        "region": "Hankou",
        "distance_km": 2.1,
        "walk_minutes": 26,
        "rating": 4.5,
        "featured": False,
        "audio_minutes": 21,
        "image": "京汉铁路总工会旧址.jpg",
        "names": {
            "zh": "京汉铁路总工会旧址",
            "en": "Beijing–Hankou Railway Workers’ Union Site",
            "fr": "Ancien siège du syndicat du chemin de fer Pékin–Hankou",
            "es": "Sede del Sindicato del Ferrocarril Pekín–Hankou",
        },
        "summary": {
            "zh": "1923 年“二七”大罢工中铁路工人运动的指挥中心。",
            "en": "The command post of the 1923 railway workers’ strike that shook the nation.",
            "fr": "Le poste de commandement de la grève ferroviaire de 1923.",
            "es": "El centro de mando de la huelga ferroviaria de 1923.",
        },
        "description": {
            "zh": "1923 年京汉铁路工人全线大罢工，总工会设在这座小楼里。",
            "en": "In February 1923 railway workers shut down the line and this small building was their headquarters.",
        },
        "cultural": {
            "zh": "罢工建立在夜校与互助会之上，工人争取的还有“人的组织权”。",
            "en": "The strike grew out of night schools — workers demanded the right to organise, not only wages.",
        },
        "languages": ["zh", "en"],
    },
]

MAP_LABELS = {
    "zh": "出口",
    "en": "Exit",
    "fr": "Sortie",
    "es": "Salida",
}


def _guide_rows(place: Place) -> list[Guide]:
    name = {t.locale: t.name for t in place.translations}
    summary = {t.locale: t.summary for t in place.translations}
    languages = sorted({t.locale for t in place.translations})
    return [
        Guide(
            place_id=place.id,
            guide_type="audio",
            title_json=_fill({"en": "Guided audio — the full story", "zh": "伴随讲解——完整故事"}),
            duration_seconds=place.audio_minutes * 60,
            languages=languages,
            transcript_json=summary,
            reviewed=True,
            sort_order=1,
        ),
        Guide(
            place_id=place.id,
            guide_type="video",
            title_json=_fill({"en": "Video guide", "zh": "视频导览"}),
            duration_seconds=192,
            languages=languages,
            media_url=None,
            transcript_json={"en": "Video guide — media pending venue approval."},
            reviewed=False,
            sort_order=2,
        ),
        Guide(
            place_id=place.id,
            guide_type="story",
            title_json=_fill({"en": "Cultural note — you may not know", "zh": "文化注释——你可能不知道"}),
            duration_seconds=90,
            languages=languages,
            transcript_json={t.locale: t.cultural_note for t in place.translations},
            reviewed=True,
            sort_order=3,
        ),
    ]


def _map_rows(place: Place) -> list[MapPoint]:
    def labels(en: str, zh: str, fr: str | None = None, es: str | None = None) -> dict[str, str]:
        values = {"zh": zh, "en": en}
        if fr:
            values["fr"] = fr
        if es:
            values["es"] = es
        return _fill(values)

    return [
        MapPoint(place_id=place.id, point_type="door", label_json=labels("Entrance", "入口", "Entrée", "Entrada"), x=18, y=86, sort_order=1),
        MapPoint(place_id=place.id, point_type="room", label_json=labels("Main hall", "主展厅", "Salle principale", "Sala principal"), x=46, y=38, sort_order=2),
        MapPoint(place_id=place.id, point_type="room", label_json=labels("Exhibition B", "展厅 B", "Exposition B", "Exposición B"), x=72, y=62, sort_order=3),
        MapPoint(place_id=place.id, point_type="service", label_json=labels("Restroom", "卫生间", "Toilettes", "Aseos"), x=88, y=24, sort_order=4),
        MapPoint(place_id=place.id, point_type="service", label_json=labels("AED", "AED", "AED", "AED"), x=16, y=30, sort_order=5),
        MapPoint(place_id=place.id, point_type="door", label_json=MAP_LABELS, x=82, y=88, sort_order=6),
    ]


POST_ROWS = [
    {
        "author": "Camille Laurent",
        "country": "France",
        "place_slug": "fifth-congress",
        "kind": "stories",
        "title": "I finally understand “1927”",
        "body": "Walking the red lane with the guide, the date turned into rooms and daily life.",
        "image": "中共五大会址.jpg",
        "likes": 128,
        "comments": [{"author": "Volunteer · CCNU", "body": "Thank you — this is exactly the understanding we hope visitors take home."}],
    },
    {
        "author": "Marco Ferrer",
        "country": "Spain",
        "place_slug": "xinhai-museum",
        "kind": "question",
        "title": "Was the 1911 Revolution taught outside China?",
        "body": "Back home we never studied it. How do other countries remember revolutions that changed the world?",
        "image": "20231125_Statue_of_Sun_Yat-sen_in_front_of_the_1911_Revolution_Museum.jpg",
        "likes": 47,
        "comments": [
            {"author": "Volunteer · CCNU", "body": "Great question — different textbooks frame it differently, and sharing those frames is what this community is for."}
        ],
    },
    {
        "author": "Yun He",
        "country": "China",
        "place_slug": "august-7th",
        "kind": "discover",
        "title": "The meeting room above the ordinary street",
        "body": "Seeing the restored mahjong table downstairs changed my picture of history.",
        "image": "八七会议会址大门.jpg",
        "likes": 93,
        "comments": [],
    },
    {
        "author": "Noor Ahmed",
        "country": "Egypt",
        "place_slug": "wuhan-revolution-museum",
        "kind": "question",
        "title": "A question about “red tourism”",
        "body": "Is red tourism like a pilgrimage, or something younger?",
        "image": "武汉革命博物馆_5611.jpg",
        "likes": 61,
        "comments": [],
    },
]

BADGE_ROWS = [
    {
        "code": "explorer",
        "name": {"zh": "红色文脉探索者", "en": "Red Heritage Explorer", "fr": "Explorateur du patrimoine rouge", "es": "Explorador del patrimonio rojo"},
        "detail": {"zh": "访问 3 处红色场馆并完成一条推荐路线。", "en": "Visit 3 heritage sites and complete a recommended route."},
        "kind": "place",
        "accent": "clay",
    },
    {
        "code": "storyteller",
        "name": {"zh": "红色故事讲述人", "en": "Storyteller", "fr": "Conteur", "es": "Narrador"},
        "detail": {"zh": "发布被 50 人点赞的优质体验分享。", "en": "Publish a quality story that earns 50 likes."},
        "kind": "share",
        "accent": "gold",
    },
    {
        "code": "language-bridge",
        "name": {"zh": "语桥", "en": "Language Bridge", "fr": "Pont de langues", "es": "Puente de idiomas"},
        "detail": {"zh": "在社区用非母语提出或解答一个问题。", "en": "Ask or answer a community question in another language."},
        "kind": "language",
        "accent": "ink",
    },
    {
        "code": "culture-discoverer",
        "name": {"zh": "文脉发现者", "en": "Culture Discoverer", "fr": "Découvreur culturel", "es": "Descubridor cultural"},
        "detail": {"zh": "解锁任意场馆的“你可能不知道”文化注释。", "en": "Unlock a cultural note at any site."},
        "kind": "place",
        "accent": "green",
    },
    {
        "code": "global-guide",
        "name": {"zh": "金牌译者", "en": "Global Guide", "fr": "Guide global", "es": "Guía global"},
        "detail": {"zh": "加入多语志愿者队伍并解答 10 个问题。", "en": "Join our multilingual volunteer team and answer 10 questions."},
        "kind": "volunteer",
        "accent": "clay",
    },
]


def seed_demo(db: Session) -> None:
    """Idempotently load demo content. Exits early when places already exist."""
    existing = db.scalar(select(func.count()).select_from(Place))
    if existing:
        return

    place_by_slug: dict[str, Place] = {}
    for row in PLACE_ROWS:
        place = Place(
            slug=row["slug"],
            category=row["category"],
            region=row["region"],
            distance_km=row["distance_km"],
            walk_minutes=row["walk_minutes"],
            rating=row["rating"],
            featured=row["featured"],
            image_url=f"/images/places/{row['image']}",
            audio_minutes=row["audio_minutes"],
        )
        db.add(place)
        db.flush()
        for locale in row["languages"]:
            db.add(
                PlaceTranslation(
                    place_id=place.id,
                    locale=locale,
                    name=_pick(row["names"], locale, "zh" if locale == "zh" else "en"),
                    summary=_pick(row["summary"], locale),
                    description=_pick(row["description"], locale, "en"),
                    cultural_note=_pick(row["cultural"], locale, "en"),
                    open_hours_text=_fill({"zh": "09:00–17:00", "en": "09:00–17:00", "fr": "09:00–17:00", "es": "09:00–17:00"})[locale],
                    closed_day="Monday",
                )
            )
        db.flush()
        db.add_all(_guide_rows(place))
        db.add_all(_map_rows(place))
        place_by_slug[place.slug] = place

    demo_user = User(
        client_key="demo-anna",
        nickname="Anna Meyer",
        country="Germany",
        locale="en",
        avatar_color="#a92e1f",
        visited_places=4,
    )
    db.add(demo_user)
    db.flush()

    badges_by_code: dict[str, Badge] = {}
    for badge_row in BADGE_ROWS:
        badge = Badge(
            code=badge_row["code"],
            name_json=badge_row["name"],
            detail_json=badge_row["detail"],
            kind=badge_row["kind"],
            accent=badge_row["accent"],
        )
        db.add(badge)
        db.flush()
        badges_by_code[badge.code] = badge

    db.add_all(
        [
            UserBadge(user_id=demo_user.id, badge_id=badges_by_code["explorer"].id, progress=100),
            UserBadge(user_id=demo_user.id, badge_id=badges_by_code["language-bridge"].id, progress=100),
        ]
    )

    for index, post_row in enumerate(POST_ROWS):
        place = place_by_slug.get(post_row["place_slug"] or "")
        post = CommunityPost(
            author_name=post_row["author"],
            country=post_row["country"],
            place_id=place.id if place else None,
            kind=post_row["kind"],
            title=post_row["title"],
            body=post_row["body"],
            image_url=f"/images/places/{post_row['image']}" if post_row.get("image") else None,
            language="en",
            likes_count=post_row["likes"],
            comments_count=len(post_row["comments"]),
            status="published",
        )
        db.add(post)
        db.flush()
        for comment_row in post_row["comments"]:
            db.add(Comment(post_id=post.id, author_name=comment_row["author"], body=comment_row["body"]))

    db.commit()
