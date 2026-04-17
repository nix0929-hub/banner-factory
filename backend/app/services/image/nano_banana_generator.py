"""
배너 생성 서비스 — Google Gemini(Nano Banana 2) 이미지 생성 API로 배너 변형 3종을 생성한다.

google-genai 신규 SDK 사용 (from google import genai)
각 variant는 레퍼런스 분석 결과를 기반으로 다른 스타일 방향으로 생성된다.
"""
import base64
import logging
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# 변형(variant) 설정 — 3가지 스타일 방향
# ──────────────────────────────────────────────
VARIANT_CONFIGS: Dict[str, Dict[str, Any]] = {
    "layout": {
        "description": "제품 위치를 반전하고 레이아웃을 변형한 버전",
        "flip_product": True,
        "use_complementary": False,
        "bg_color": None,
        "center_product": False,
    },
    "color": {
        "description": "색상 대비를 강조한 버전",
        "flip_product": False,
        "use_complementary": True,
        "bg_color": None,
        "center_product": False,
    },
    "minimal": {
        "description": "미니멀하고 깔끔한 버전",
        "flip_product": False,
        "use_complementary": False,
        "bg_color": "#F8F8F5",
        "center_product": True,
    },
}

# Gemini 이미지 생성 모델명
GEMINI_IMAGE_MODEL = "gemini-3.1-flash-image-preview"


def _build_prompt(
    analysis: Dict[str, Any],
    text_data: Dict[str, str],
    banner_size: Tuple[int, int],
    config: Dict[str, Any],
) -> str:
    """
    레퍼런스 분석 결과와 variant 설정을 기반으로 배너 생성 프롬프트를 빌드한다.

    Args:
        analysis: reference_analyzer에서 반환된 디자인 분석 dict
        text_data: {"headline": str, "subtext": str, "cta": str}
        banner_size: (width, height) 픽셀 단위
        config: VARIANT_CONFIGS의 특정 variant 설정

    Returns:
        Gemini에게 전달할 자연어 프롬프트 문자열
    """
    width, height = banner_size
    colors = analysis.get("colors", {})
    layout = analysis.get("layout", {})
    typography = analysis.get("typography", {})
    background = analysis.get("background", {})
    style_keywords = analysis.get("style_keywords", [])
    shadow_style = analysis.get("shadow_style", "soft")

    # 배경색 결정
    if config.get("bg_color"):
        bg_color = config["bg_color"]
    elif config.get("use_complementary"):
        # 보색 강조: primary 색상을 배경으로 사용
        bg_color = colors.get("primary", "#1A1A1A")
    else:
        bg_color = colors.get("background", "#FFFFFF")

    # 레이아웃 방향 결정
    if config.get("flip_product"):
        product_position = "right" if layout.get("product_position") == "left" else "left"
        text_position = "left" if layout.get("text_position") == "right" else "right"
    elif config.get("center_product"):
        product_position = "center"
        text_position = "overlay"
    else:
        product_position = layout.get("product_position", "right")
        text_position = layout.get("text_position", "left")

    # 텍스트 콘텐츠
    headline = text_data.get("headline", "")
    subtext = text_data.get("subtext", "")
    cta = text_data.get("cta", "")

    # f-string 안에서 백슬래시 사용 불가(Python <3.12) — 미리 조립
    subtext_line = ('- Subtext: "' + subtext + '"') if subtext else ""
    subtext_style = "  * Style: regular weight, smaller than headline" if subtext else ""
    subtext_color = ("  * Color: " + colors.get("secondary", "#666666")) if subtext else ""
    cta_line = ('- CTA button: "' + cta + '"') if cta else ""
    cta_bg = ("  * Background: " + colors.get("primary", "#1A1A1A")) if cta else ""
    cta_fg = ("  * Text color: " + colors.get("background", "#FFFFFF")) if cta else ""
    cta_style = "  * Rounded corners, prominent placement" if cta else ""

    # 배경 타입 설명
    bg_type = background.get("type", "solid")
    if bg_type == "gradient" and background.get("gradient_start") and background.get("gradient_end"):
        bg_description = (
            f"{background.get('gradient_direction', 'horizontal')} gradient "
            f"from {background.get('gradient_start')} to {background.get('gradient_end')}"
        )
    else:
        bg_description = f"solid color {bg_color}"

    # 스타일 키워드 문자열
    style_str = ", ".join(style_keywords) if style_keywords else "modern, clean"

    # 텍스트 색상 결정 (배경과 대비)
    if config.get("use_complementary"):
        text_color = colors.get("background", "#FFFFFF")  # 배경이 어두우면 텍스트는 밝게
    else:
        text_color = colors.get("text_primary", "#1A1A1A")

    prompt = f"""Create a professional advertising banner image with the following specifications:

CANVAS:
- Size: {width}x{height} pixels
- Aspect ratio: {width/height:.2f}:1

BACKGROUND:
- Style: {bg_description}
- Color: {bg_color}

LAYOUT:
- Product image position: {product_position} side of the banner
- Text block position: {text_position}
- Layout style: {layout.get('type', 'left-aligned')}

PRODUCT:
- Place the provided product image (PNG with transparent background) at the {product_position}
- Apply {shadow_style} drop shadow to the product
- Product should occupy approximately 40-50% of the banner width
- Keep product proportions intact

TEXT CONTENT (render exactly as provided, Korean text must be rendered correctly):
- Headline: "{headline}"
  * Style: {typography.get('headline_style', 'bold')} {typography.get('font_category', 'sans-serif')}
  * Color: {text_color}
  * Alignment: {typography.get('text_alignment', 'left')}
  * Font size: large, prominent
{subtext_line}
{subtext_style}
{subtext_color}
{cta_line}
{cta_bg}
{cta_fg}
{cta_style}

STYLE:
- Keywords: {style_str}
- Overall mood: {colors.get('palette_mood', 'modern')}
- Primary accent color: {colors.get('primary', '#1A1A1A')}
- Secondary color: {colors.get('secondary', '#666666')}

REQUIREMENTS:
- High-quality, commercial-grade advertising banner
- Clean, professional composition
- All Korean text must be correctly rendered with proper font rendering
- No watermarks, no placeholder text
- Photorealistic product rendering with proper lighting
"""

    return prompt.strip()


async def generate_banner_variants(
    reference_analysis: Dict[str, Any],
    product_images_bytes: List[bytes],
    text_data: Dict[str, str],
    banner_size: Tuple[int, int],
    api_key: str,
) -> List[Dict[str, Any]]:
    """
    Gemini 이미지 생성 API로 3가지 변형 배너를 생성한다.

    Args:
        reference_analysis: reference_analyzer.analyze_reference() 반환값
        product_images_bytes: 배경 제거된 RGBA PNG bytes 리스트
        text_data: {"headline": str, "subtext": str, "cta": str}
        banner_size: (width, height) 픽셀 단위
        api_key: Google Gemini API 키

    Returns:
        [
            {
                "variant_id": str,        # "layout" | "color" | "minimal"
                "image_base64": str,      # base64 인코딩된 PNG
                "style_summary": str,     # 스타일 요약 설명
            },
            ...
        ]
    """
    try:
        from google import genai
        from google.genai import types
    except ImportError as e:
        logger.error("google-genai SDK가 설치되지 않았습니다: %s", e)
        raise ImportError(
            "google-genai 패키지가 필요합니다. 'pip install google-genai'를 실행하세요."
        ) from e

    client = genai.Client(api_key=api_key)
    results: List[Dict[str, Any]] = []

    for variant_id, config in VARIANT_CONFIGS.items():
        logger.info("배너 변형 생성 중: %s (%s)", variant_id, config["description"])

        try:
            # 프롬프트 빌드
            prompt = _build_prompt(reference_analysis, text_data, banner_size, config)
            logger.debug("생성 프롬프트 (variant=%s): %s...", variant_id, prompt[:100])

            # 이미지 파트 구성 — 제품 이미지를 Part로 첨부
            content_parts = [prompt]  # 텍스트 프롬프트 먼저

            for i, img_bytes in enumerate(product_images_bytes):
                part = types.Part.from_bytes(data=img_bytes, mime_type="image/png")
                content_parts.append(part)
                logger.debug("제품 이미지 %d 첨부 (크기: %d bytes)", i + 1, len(img_bytes))

            # Gemini 이미지 생성 API 호출 — 최대 2회 시도 (타임아웃 재시도)
            import asyncio
            response = None
            last_exc: Optional[Exception] = None
            for attempt in range(2):
                try:
                    response = await asyncio.wait_for(
                        asyncio.to_thread(
                            client.models.generate_content,
                            model=GEMINI_IMAGE_MODEL,
                            contents=content_parts,
                            config=types.GenerateContentConfig(
                                response_modalities=["IMAGE", "TEXT"],
                            ),
                        ),
                        timeout=180.0,
                    )
                    break
                except asyncio.TimeoutError as exc:
                    last_exc = exc
                    logger.warning("variant '%s' 시도 %d 타임아웃, 재시도...", variant_id, attempt + 1)
            if response is None:
                raise last_exc  # type: ignore[misc]

            # 응답에서 이미지 파트 추출
            image_bytes_result: Optional[bytes] = None
            for part in response.candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data is not None:
                    mime = part.inline_data.mime_type or ""
                    if mime.startswith("image/"):
                        image_bytes_result = part.inline_data.data
                        logger.debug(
                            "이미지 파트 추출 완료 (mime=%s, 크기=%d bytes)",
                            mime,
                            len(image_bytes_result),
                        )
                        break

            if image_bytes_result is None:
                logger.warning("variant '%s': 응답에서 이미지 파트를 찾을 수 없습니다.", variant_id)
                # 빈 결과를 추가하고 계속 진행
                results.append(
                    {
                        "variant_id": variant_id,
                        "image_base64": "",
                        "style_summary": f"{config['description']} (생성 실패)",
                    }
                )
                continue

            # base64 인코딩
            image_b64 = base64.standard_b64encode(image_bytes_result).decode("utf-8")

            results.append(
                {
                    "variant_id": variant_id,
                    "image_base64": image_b64,
                    "style_summary": config["description"],
                }
            )
            logger.info("배너 변형 생성 완료: %s", variant_id)

        except Exception as e:
            logger.error("배너 변형 '%s' 생성 실패: %s", variant_id, e, exc_info=True)
            # 단일 variant 실패 시 빈 결과 추가 후 계속 (전체 파이프라인 중단 방지)
            results.append(
                {
                    "variant_id": variant_id,
                    "image_base64": "",
                    "style_summary": f"{config['description']} (오류: {str(e)[:50]})",
                }
            )

    logger.info("배너 변형 생성 완료: %d/%d개 성공", sum(1 for r in results if r["image_base64"]), len(VARIANT_CONFIGS))
    return results
