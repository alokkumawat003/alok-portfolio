"""Security and behavior regression tests for the portfolio health API."""

from fastapi.testclient import TestClient

from server import app


client = TestClient(app)


def test_health_endpoint_returns_ok() -> None:
    response = client.get("/api/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_removed_status_routes_are_not_available() -> None:
    assert client.get("/api/status").status_code == 404
    assert client.post("/api/status", json={"client_name": "test"}).status_code == 404


def test_cross_origin_response_has_no_cors_headers() -> None:
    response = client.get("/api/", headers={"Origin": "https://evil.example.com"})

    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers
    assert "access-control-allow-credentials" not in response.headers


def test_interactive_api_documentation_is_disabled() -> None:
    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404
    assert client.get("/openapi.json").status_code == 404
