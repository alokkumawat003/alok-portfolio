"""Security regression tests for portfolio backend.

Verifies:
- SEC-001: /api/status routes removed (no anon DB writes)
- SEC-002: CORS no longer sends allow-credentials: true
- Health endpoint still returns 200 ok
"""
import os
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL")
            or frontend_env.get("REACT_APP_BACKEND_URL"))
assert BASE_URL, "REACT_APP_BACKEND_URL missing"
BASE_URL = BASE_URL.rstrip("/")


# ---------- Health ----------
class TestHealth:
    def test_root_health_ok(self):
        r = requests.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}


# ---------- SEC-001: /status routes removed ----------
class TestStatusRoutesRemoved:
    def test_post_status_returns_404(self):
        r = requests.post(
            f"{BASE_URL}/api/status",
            json={"client_name": "TEST_hacker"},
            timeout=15,
        )
        assert r.status_code == 404, f"unexpected {r.status_code}: {r.text[:200]}"

    def test_get_status_returns_404(self):
        r = requests.get(f"{BASE_URL}/api/status", timeout=15)
        assert r.status_code == 404


# ---------- SEC-002: CORS no allow-credentials ----------
class TestCorsCredentialsDisabled:
    def test_cross_origin_get_no_allow_credentials(self):
        r = requests.get(
            f"{BASE_URL}/api/",
            headers={"Origin": "https://evil.example.com"},
            timeout=15,
        )
        assert r.status_code == 200
        # lower-cased header names in requests
        acac = r.headers.get("access-control-allow-credentials")
        assert acac is None or acac.lower() != "true", (
            f"allow-credentials must not be true, got: {acac}"
        )
