"""
이미지 유틸리티 함수 모음
- PIL Image ↔ base64 문자열 변환
- bytes ↔ base64 문자열 변환
- 이미지 크기 제한
- MIME 타입 검증
"""
import base64
import io
from typing import Union

from PIL import Image


def image_to_base64(img: Image.Image) -> str:
    """
    PIL Image를 PNG 포맷의 base64 인코딩 문자열로 변환한다.

    Args:
        img: PIL Image 객체

    Returns:
        base64 인코딩된 문자열 (패딩 포함)
    """
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def base64_to_image(b64: str) -> Image.Image:
    """
    base64 인코딩 문자열을 PIL Image로 변환한다.

    Args:
        b64: base64 인코딩된 이미지 문자열

    Returns:
        PIL Image 객체
    """
    image_bytes = base64.b64decode(b64)
    return Image.open(io.BytesIO(image_bytes))


def resize_if_too_large(img: Image.Image, max_size: int = 2000) -> Image.Image:
    """
    이미지의 가로 또는 세로가 max_size를 초과하면 비율을 유지하며 축소한다.
    max_size 이하이면 원본을 그대로 반환한다.

    Args:
        img: PIL Image 객체
        max_size: 허용할 최대 픽셀 크기 (기본값: 2000)

    Returns:
        크기 조정된 (또는 원본) PIL Image 객체
    """
    width, height = img.size
    if width <= max_size and height <= max_size:
        return img

    # 긴 쪽 기준으로 비율 계산
    ratio = max_size / max(width, height)
    new_width = int(width * ratio)
    new_height = int(height * ratio)

    return img.resize((new_width, new_height), Image.LANCZOS)


def bytes_to_base64(data: bytes) -> str:
    """
    바이트 데이터를 base64 인코딩 문자열로 변환한다.

    Args:
        data: 원본 바이트 데이터

    Returns:
        base64 인코딩된 문자열
    """
    return base64.b64encode(data).decode("utf-8")


def base64_to_bytes(s: str) -> bytes:
    """
    base64 인코딩 문자열을 바이트 데이터로 디코딩한다.

    Args:
        s: base64 인코딩된 문자열

    Returns:
        디코딩된 바이트 데이터
    """
    return base64.b64decode(s)


# 지원하는 이미지 MIME 타입의 매직 바이트 시그니처
_MAGIC_BYTES: dict[bytes, str] = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"GIF87a": "image/gif",
    b"GIF89a": "image/gif",
    b"RIFF": "image/webp",  # RIFF....WEBP 형식 — 완전한 검증은 추가 확인 필요
    b"BM": "image/bmp",
}


def validate_image_bytes(data: bytes) -> bool:
    """
    바이트 데이터가 지원하는 이미지 포맷인지 MIME 타입(매직 바이트)으로 검증한다.

    Args:
        data: 검증할 바이트 데이터

    Returns:
        유효한 이미지이면 True, 그렇지 않으면 False
    """
    if not data:
        return False

    for magic, _ in _MAGIC_BYTES.items():
        if data.startswith(magic):
            return True

    # PIL을 통한 2차 검증 (매직 바이트 미포함 포맷 대응)
    try:
        Image.open(io.BytesIO(data)).verify()
        return True
    except Exception:
        return False
