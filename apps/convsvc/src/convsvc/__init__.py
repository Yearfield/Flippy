"""Conversion service package."""

__all__ = ["get_health"]


def get_health() -> dict:
    """Return a static health payload for scaffolding tests."""
    return {
        "status": "ok",
        "tools": {
            "tesseract": None,
            "ghostscript": None,
            "libreoffice": None,
            "imagemagick": None,
        },
    }
