"""
배너 생성 AI 파이프라인

백그라운드 태스크에서 실행되는 메인 파이프라인.
4단계 순서로 처리한다:
  Step 1: 제품 이미지 배경 제거 (rembg, asyncio.to_thread)
  Step 2: 레퍼런스 이미지 분석 (Claude Vision)
  Step 3: 배너 변형 생성 (Gemini 이미지 생성)
  Step 4: 결과를 job_store에 저장

각 단계는 독립적으로 try/except로 감싸 상세 오류를 로깅한다.
"""
import logging
from typing import Dict, List

from app.config import settings
from app.models.request import BANNER_SIZES
from app.models.response import BannerJobResponse, BannerVariant, JobStatus
from app.services.ai.background_remover import remove_backgrounds_batch
from app.services.ai.reference_analyzer import DEFAULT_ANALYSIS, analyze_reference
from app.services.image.nano_banana_generator import generate_banner_variants

logger = logging.getLogger(__name__)


async def run_pipeline(
    job_id: str,
    reference_bytes: bytes,
    product_bytes_list: List[bytes],
    text_data: Dict[str, str],
    banner_size: str,
    job_store: Dict[str, BannerJobResponse],
) -> None:
    """
    배너 생성 전체 파이프라인을 실행하고 결과를 job_store에 저장한다.

    Args:
        job_id: 작업 UUID (job_store 키)
        reference_bytes: 레퍼런스 이미지 bytes
        product_bytes_list: 제품 이미지 bytes 리스트 (최대 3개)
        text_data: {"headline": str, "subtext": str, "cta": str}
        banner_size: BANNER_SIZES의 키 (예: "og_image")
        job_store: BannerJobResponse를 저장하는 인메모리 dict (라우터에서 주입)
    """
    logger.info("파이프라인 시작: job_id=%s", job_id)

    # 작업 상태를 processing으로 업데이트
    job_store[job_id] = BannerJobResponse(job_id=job_id, status=JobStatus.processing)

    try:
        # ──────────────────────────────────────────────────
        # Step 1: 제품 이미지 배경 제거
        # ──────────────────────────────────────────────────
        logger.info("[Step 1/4] 배경 제거 시작: %d개 이미지", len(product_bytes_list))
        try:
            bg_removed_images = await remove_backgrounds_batch(product_bytes_list)
            logger.info("[Step 1/4] 배경 제거 완료")
        except Exception as e:
            logger.error("[Step 1/4] 배경 제거 실패: %s", e, exc_info=True)
            # 배경 제거 실패 시 원본 이미지로 폴백
            bg_removed_images = product_bytes_list
            logger.warning("[Step 1/4] 원본 이미지로 폴백")

        # ──────────────────────────────────────────────────
        # Step 2: 레퍼런스 이미지 분석 (Claude Vision)
        # ──────────────────────────────────────────────────
        logger.info("[Step 2/4] 레퍼런스 이미지 분석 시작")
        anthropic_api_key = settings.ANTHROPIC_API_KEY
        if not anthropic_api_key:
            logger.warning("[Step 2/4] ANTHROPIC_API_KEY가 설정되지 않았습니다. DEFAULT_ANALYSIS 사용.")

        try:
            reference_analysis = await analyze_reference(
                image_bytes=reference_bytes,
                api_key=anthropic_api_key,
            )
            logger.info("[Step 2/4] 레퍼런스 분석 완료: %s", reference_analysis.get("style_keywords"))
        except Exception as e:
            logger.error("[Step 2/4] 레퍼런스 분석 실패: %s", e, exc_info=True)
            reference_analysis = DEFAULT_ANALYSIS
            logger.warning("[Step 2/4] DEFAULT_ANALYSIS로 폴백")

        # ──────────────────────────────────────────────────
        # Step 3: 배너 변형 생성 (Gemini)
        # ──────────────────────────────────────────────────
        logger.info("[Step 3/4] 배너 변형 생성 시작")

        # 배너 사이즈 결정 — 존재하지 않는 키이면 og_image(1200x628) 사용
        banner_size_tuple = BANNER_SIZES.get(banner_size, BANNER_SIZES["og_image"])
        logger.info("[Step 3/4] 배너 사이즈: %s → %s", banner_size, banner_size_tuple)

        google_api_key = settings.GOOGLE_API_KEY
        if not google_api_key:
            raise ValueError("GOOGLE_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.")

        variants_raw = await generate_banner_variants(
            reference_analysis=reference_analysis,
            product_images_bytes=bg_removed_images,
            text_data=text_data,
            banner_size=banner_size_tuple,
            api_key=google_api_key,
        )
        logger.info("[Step 3/4] 배너 변형 생성 완료: %d개", len(variants_raw))

        # ──────────────────────────────────────────────────
        # Step 4: 결과를 job_store에 저장
        # ──────────────────────────────────────────────────
        logger.info("[Step 4/4] 결과 저장 중")

        # 성공적으로 생성된 변형만 포함 (image_base64가 비어있지 않은 것)
        banner_variants = [
            BannerVariant(
                variant_id=v["variant_id"],
                image_base64=v["image_base64"],
                style_summary=v["style_summary"],
            )
            for v in variants_raw
            if v.get("image_base64")
        ]

        if not banner_variants:
            raise RuntimeError("생성된 배너가 없습니다. 모든 variant 생성에 실패했습니다.")

        job_store[job_id] = BannerJobResponse(
            job_id=job_id,
            status=JobStatus.completed,
            banners=banner_variants,
        )
        logger.info(
            "파이프라인 완료: job_id=%s, 배너 %d개 생성",
            job_id,
            len(banner_variants),
        )

    except Exception as e:
        # 파이프라인 전체 실패 처리
        error_message = str(e)
        logger.error("파이프라인 실패: job_id=%s, 오류=%s", job_id, error_message, exc_info=True)

        job_store[job_id] = BannerJobResponse(
            job_id=job_id,
            status=JobStatus.failed,
            error=error_message,
        )
