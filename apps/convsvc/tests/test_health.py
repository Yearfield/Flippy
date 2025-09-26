from convsvc import get_health


def test_health_payload_has_expected_shape():
    payload = get_health()
    assert payload["status"] == "ok"
    assert set(payload["tools"]) == {
        "tesseract",
        "ghostscript",
        "libreoffice",
        "imagemagick",
    }
