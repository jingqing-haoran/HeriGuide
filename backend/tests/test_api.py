from fastapi.testclient import TestClient

from app.main import app


def test_health():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        body = response.json()
        assert body["code"] == 200
        assert body["data"]["status"] == "ok"


def test_places_have_multilingual_content():
    with TestClient(app) as client:
        zh = client.get("/api/places", params={"locale": "zh", "limit": 30}).json()
        assert zh["code"] == 200
        assert zh["data"]["meta"]["total"] >= 8
        slugs = {item["slug"] for item in zh["data"]["items"]}
        assert "xinhai-museum" in slugs
        zh_item = next(item for item in zh["data"]["items"] if item["slug"] == "xinhai-museum")
        assert zh_item["translation"]["name"] == "辛亥革命博物院"
        assert {"zh", "en"} <= set(zh_item["languages"])


def test_place_detail_by_slug_and_id():
    with TestClient(app) as client:
        by_slug = client.get("/api/places/xinhai-museum").json()
        assert by_slug["code"] == 200
        place_id = by_slug["data"]["id"]
        by_id = client.get(f"/api/places/{place_id}", params={"locale": "fr"}).json()
        assert by_id["data"]["translations"]["fr"]["name"].startswith("Musée")


def test_guides_and_map():
    with TestClient(app) as client:
        guides = client.get("/api/places/xinhai-museum/guides").json()
        assert guides["code"] == 200
        assert len(guides["data"]) >= 2
        audio = client.get(
            "/api/places/xinhai-museum/guides", params={"guide_type": "audio"}
        ).json()
        assert all(item["guide_type"] == "audio" for item in audio["data"])

        map_bundle = client.get("/api/places/xinhai-museum/map").json()
        assert map_bundle["data"]["meta"]["indoor"] if "indoor" in map_bundle["data"]["meta"] else True
        assert len(map_bundle["data"]["points"]) >= 5


def test_translation_returns_glossary():
    with TestClient(app) as client:
        response = client.post(
            "/api/translation",
            json={
                "source_language": "zh",
                "target_language": "en",
                "text": "八七会议在这里秘密召开",
                "mode": "text",
            },
        )
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["provider"] == "heriguide-demo"
        assert any(hit["term"] == "八七会议" for hit in data["glossary"])
        assert any("August 7th Meeting" in hit["note"] for hit in data["glossary"])


def test_community_flow_create_comment_and_like():
    with TestClient(app) as client:
        posts = client.get("/api/community/posts").json()
        assert posts["data"]["meta"]["total"] >= 3
        post_id = posts["data"]["items"][0]["id"]

        created = client.post(
            "/api/community/posts",
            json={
                "author_name": "QA Visitor",
                "country": "Test",
                "kind": "discover",
                "title": "A new story from the test suite",
                "body": "HeriGuide backend is ready.",
                "language": "en",
            },
        )
        assert created.status_code == 200
        assert created.json()["data"]["title"].startswith("A new story")

        comment = client.post(
            f"/api/community/posts/{post_id}/comments",
            json={"author_name": "QA Visitor", "body": "Very helpful, thank you."},
        )
        assert comment.json()["code"] == 200

        users = client.post(
            "/api/users",
            json={"client_key": "qa-user", "nickname": "QA Visitor", "locale": "en"},
        ).json()["data"]
        like = client.post(f"/api/community/posts/{post_id}/like?user_id={users['id']}")
        assert like.json()["data"]["liked"] is True


def test_badges_users_and_feedback():
    with TestClient(app) as client:
        badges = client.get("/api/badges").json()
        assert len(badges["data"]) >= 5

        user = client.post(
            "/api/users",
            json={"client_key": "demo-anna", "nickname": "Anna Meyer", "locale": "en"},
        ).json()["data"]
        journey = client.get(f"/api/users/{user['id']}/journey").json()["data"]
        assert journey["visited_places"] >= 0
        assert any(badge["code"] == "explorer" for badge in journey["badges"])

        feedback = client.post(
            "/api/feedback",
            json={
                "category": "translation",
                "content": "Please check the French gloss for 八七会议.",
                "rating": 4,
            },
        )
        assert feedback.status_code == 200
        assert feedback.json()["data"]["status"] == "new"
