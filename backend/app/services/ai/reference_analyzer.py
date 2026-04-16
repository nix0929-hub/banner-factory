"""
레퍼런스 이미지 분석 서비스 — Claude Vision API로 배너 디자인 요소를 추출한다.

Claude가 마크다운 코드블록(```json ... ```)을 포함해 응답할 수 있으므로
JSON 파싱 전 반드시 코드블록을 스트리핑한다.
파싱 실패 시 DEFAULT_ANALYSIS fallback을 반환해 파이프라인이 중단되지 않도록 한다.
"""
import base64
import json
import logging
import re
from typing import Any, Dict

import anthropic

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# Claude Vision 분석 프롬프트
# ──────────────────────────────────────────────
ANALYSIS_PROMPT = """
레퍼런스 배너 이미지를 분석해서 아래 JSON 형식으로만 응답해줘. 다른 텍스트 없이 JSON만.
{
  "layout": {
    "type": "left-aligned|center|right-aligned|split",
    "product_position": "left|right|center|background",
    "text_position": "top|bottom|left|right|overlay"
  },
  "colors": {
    "background": "#hex",
    "primary": "#hex",
    "secondary": "#hex",
    "text_primary": "#hex",
    "palette_mood": "vibrant|muted|dark|light|gradient"
  },
  "typography": {
    "headline_style": "bold|light|italic|condensed",
    "font_category": "sans-serif|serif|display",
    "text_alignment": "left|center|right"
  },
  "background": {
    "type": "solid|gradient|pattern",
    "gradient_direction": "horizontal|vertical|diagonal|null",
    "gradient_start": "#hex|null",
    "gradient_end": "#hex|null"
  },
  "shadow_style": "none|soft|hard|colored",
  "style_keywords": ["keyword1", "keyword2"]
}
"""

# ──────────────────────────────────────────────
# 파싱 실패 시 사용할 기본값 (fallback)
# ──────────────────────────────────────────────
DEFAULT_ANALYSIS: Dict[str, Any] = {
    "layout": {
        "type": "left-aligned",
        "product_position": "right",
        "text_position": "left",
    },
    "colors": {
        "background": "#FFFFFF",
        "primary": "#1A1A1A",
        "secondary": "#666666",
        "text_primary": "#1A1A1A",
        "palette_mood": "light",
    },
    "typography": {
        "headline_style": "bold",
        "font_category": "sans-serif",
        "text_alignment": "left",
    },
    "background": {
        "type": "solid",
        "gradient_direction": None,
        "gradient_start": None,
        "gradient_end": None,
    },
    "shadow_style": "soft",
    "style_keywords": ["clean", "modern", "professional"],
}


def _strip_markdown_json(text: str) -> str:
    """
    Claude 응답에서 ```json ... ``` 또는 ``` ... ``` 코드블록 내부의 JSON을 추출한다.

    코드블록이 없으면 원본 텍스트를 그대로 반환한다.

    Args:
        text: Claude 원본 응답 텍스트

    Returns:
        코드블록이 제거된 순수 JSON 문자열
    """
    # ```json ... ``` 패턴 우선 시도
    match = re.search(r"```json\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if match:
        return match.group(1).strip()

    # ``` ... ``` 패턴 시도 (언어 지정 없는 코드블록)
    match = re.search(r"```\s*([\s\S]*?)\s*```", text)
    if match:
        return match.group(1).strip()

    # 코드블록 없음 — 원본 반환 (이미 순수 JSON이거나 다른 형식)
    return text.strip()


async def analyze_reference(image_bytes: bytes, api_key: str) -> Dict[str, Any]:
    """
    Claude Vision API로 레퍼런스 배너 이미지를 분석해 디자인 요소를 추출한다.

    Args:
        image_bytes: 레퍼런스 이미지 bytes (JPEG, PNG 등)
        api_key: Anthropic API 키

    Returns:
        디자인 분석 결과 dict. 파싱 실패 시 DEFAULT_ANALYSIS 반환.
    """
    try:
        logger.info("레퍼런스 이미지 분석 시작 (크기: %d bytes)", len(image_bytes))

        # 이미지를 base64로 인코딩
        image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

        # 이미지 MIME 타입 추정 (PNG 시그니처 확인)
        if image_bytes[:8] == b"\x89PNG\r\n\x1a\n":
            media_type = "image/png"
        elif image_bytes[:3] == b"\xff\xd8\xff":
            media_type = "image/jpeg"
        elif image_bytes[:6] in (b"GIF87a", b"GIF89a"):
            media_type = "image/gif"
        else:
            media_type = "image/jpeg"  # 기본값

        # Claude AsyncAnthropic 클라이언트 초기화
        client = anthropic.AsyncAnthropic(api_key=api_key)

        # Vision API 호출
        message = await client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_b64,
                            },
                        },
                        {
                            "type": "text",
                            "text": ANALYSIS_PROMPT,
                        },
                    ],
                }
            ],
        )

        # 응답 텍스트 추출
        raw_text = message.content[0].text
        logger.debug("Claude 원본 응답: %s", raw_text[:200])

        # 마크다운 코드블록 스트리핑 후 JSON 파싱
        json_text = _strip_markdown_json(raw_text)
        analysis = json.loads(json_text)

        logger.info("레퍼런스 이미지 분석 완료: %s", analysis.get("style_keywords", []))
        return analysis

    except json.JSONDecodeError as e:
        logger.warning(
            "JSON 파싱 실패 (%s), DEFAULT_ANALYSIS 사용. 원본: %s",
            e,
            raw_text[:100] if "raw_text" in dir() else "N/A",
        )
        return DEFAULT_ANALYSIS

    except anthropic.APIError as e:
        logger.error("Claude API 오류: %s", e, exc_info=True)
        logger.warning("DEFAULT_ANALYSIS로 폴백")
        return DEFAULT_ANALYSIS

    except Exception as e:
        logger.error("레퍼런스 분석 중 예상치 못한 오류: %s", e, exc_info=True)
        logger.warning("DEFAULT_ANALYSIS로 폴백")
        return DEFAULT_ANALYSIS
