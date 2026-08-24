"""Minimal read-only health API for the portfolio."""

from fastapi import FastAPI


app = FastAPI(
    title="Portfolio health API",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


@app.get("/api/")
async def health() -> dict[str, str]:
    """Return the service health without reading external systems."""
    return {"status": "ok"}
