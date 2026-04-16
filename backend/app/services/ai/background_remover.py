"""
배경 제거 서비스 — rembg(u2net 모델)를 사용해 제품 이미지에서 배경을 제거한다.

CPU 블로킹 작업인 rembg.remove()는 asyncio.to_thread()로 비동기화한다.
싱글톤 세션을 유지해 모델 로딩 오버헤드를 첫 호출 1회로 제한한다.
"""
import asyncio
import io
import logging
from typing import List

from PIL import Image

logger = logging.getLogger(__name__)

# 싱글톤 rembg 세션 — 첫 호출 시 초기화 (u2net 모델)
_session = None


def _get_session():
    """rembg 세션 싱글톤 반환. 첫 호출 시 u2net 모델을 로드한다."""
    global _session
    if _session is None:
        from rembg import new_session
        logger.info("rembg u2net 모델 로딩 중...")
        _session = new_session("u2net")
        logger.info("rembg u2net 모델 로딩 완료")
    return _session


def _remove_bg_sync(image_bytes: bytes) -> bytes:
    """
    동기 배경 제거 함수 — asyncio.to_thread()에서 호출되는 CPU 바운드 작업.

    Args:
        image_bytes: 원본 이미지 bytes

    Returns:
        배경이 제거된 RGBA PNG bytes
    """
    from rembg import remove

    session = _get_session()

    # PIL Image로 변환
    input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

    # rembg로 배경 제거 (RGBA 결과)
    output_image: Image.Image = remove(input_image, session=session)

    # PNG bytes로 변환 후 반환
    output_buffer = io.BytesIO()
    output_image.save(output_buffer, format="PNG")
    return output_buffer.getvalue()


async def remove_background(image_bytes: bytes) -> bytes:
    """
    단일 이미지 배경 제거.

    rembg CPU 작업을 asyncio.to_thread()로 스레드 풀에 위임해
    이벤트 루프를 블로킹하지 않는다.

    Args:
        image_bytes: 원본 이미지 bytes (JPEG, PNG 등)

    Returns:
        배경이 제거된 RGBA PNG bytes

    Raises:
        Exception: rembg 처리 중 오류 발생 시
    """
    try:
        logger.debug("배경 제거 시작 (이미지 크기: %d bytes)", len(image_bytes))
        result = await asyncio.to_thread(_remove_bg_sync, image_bytes)
        logger.debug("배경 제거 완료 (결과 크기: %d bytes)", len(result))
        return result
    except Exception as e:
        logger.error("배경 제거 실패: %s", e, exc_info=True)
        raise


async def remove_backgrounds_batch(images_bytes: List[bytes]) -> List[bytes]:
    """
    여러 이미지 병렬 배경 제거.

    asyncio.gather()로 모든 이미지를 동시에 처리한다.
    각 이미지는 별도 스레드에서 처리되어 CPU를 효율적으로 사용한다.

    Args:
        images_bytes: 원본 이미지 bytes 리스트

    Returns:
        배경이 제거된 RGBA PNG bytes 리스트 (입력 순서 유지)
    """
    if not images_bytes:
        return []

    logger.info("배치 배경 제거 시작: %d개 이미지", len(images_bytes))

    tasks = [remove_background(img_bytes) for img_bytes in images_bytes]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # 예외 발생 항목 확인 및 로깅
    processed: List[bytes] = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.error("이미지 %d 배경 제거 실패: %s", i, result)
            # 실패한 경우 원본 이미지를 그대로 사용 (폴백)
            processed.append(images_bytes[i])
        else:
            processed.append(result)

    logger.info("배치 배경 제거 완료: %d/%d 성공", len(processed), len(images_bytes))
    return processed
