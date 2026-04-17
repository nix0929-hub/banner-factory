"""
배너 생성 라우터
- POST /api/banner/generate : 배너 생성 작업 시작 (비동기 백그라운드)
- GET  /api/banner/status/{job_id} : 작업 상태 조회
- GET  /api/banner/download/{job_id}/{variant_id} : 완료된 배너 이미지 다운로드
"""
import base64
import io
from typing import List, Literal
from uuid import uuid4

from typing import Optional
from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app.models.response import BannerJobResponse, BannerVariant, JobStatus
from app.services.pipeline import run_pipeline

router = APIRouter()

# 인메모리 작업 저장소 — job_id(str) → BannerJobResponse
# uvicorn --workers 1 전제: 멀티프로세스 환경에서는 Redis 등으로 교체 필요
job_store: dict[str, BannerJobResponse] = {}

# 제품 이미지 최대 업로드 수
MAX_PRODUCT_IMAGES = 3

# 파일 크기 제한 (10 MB)
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

# 허용 다운로드 포맷
ALLOWED_FORMATS: set[str] = {"png", "jpg", "jpeg"}


def _validate_image_upload(file_bytes: bytes, filename: str, content_type: Optional[str]) -> None:
    """업로드 이미지 크기 및 MIME 타입 검증."""
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"'{filename}' 파일 크기가 10MB를 초과합니다.",
        )
    if content_type and not content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"'{filename}'은 이미지 파일이 아닙니다. (content_type: {content_type})",
        )


@router.post("/banner/generate", response_model=BannerJobResponse)
async def generate_banner(
    background_tasks: BackgroundTasks,
    reference_image: UploadFile = File(..., description="레퍼런스 이미지 (디자인 스타일 참고용)"),
    product_images: List[UploadFile] = File(..., description="제품 이미지 (최대 3개)"),
    headline: str = Form(..., description="메인 헤드라인"),
    subtext: str = Form("", description="서브 문구"),
    cta: str = Form("", description="CTA 버튼 문구"),
    banner_size: str = Form("og_image", description="배너 사이즈 키"),
) -> BannerJobResponse:
    """
    배너 생성 작업을 시작한다.
    이미지 파일을 읽어 bytes로 변환 후 백그라운드 태스크에 전달하고,
    즉시 job_id와 pending 상태를 반환한다.
    """
    # 제품 이미지 개수 검증
    if len(product_images) > MAX_PRODUCT_IMAGES:
        raise HTTPException(
            status_code=400,
            detail=f"제품 이미지는 최대 {MAX_PRODUCT_IMAGES}개까지 업로드 가능합니다.",
        )

    # 파일 내용을 bytes로 읽기 (UploadFile은 비동기 read 지원)
    reference_bytes = await reference_image.read()
    product_bytes_list = [await img.read() for img in product_images]

    # 파일 크기 및 MIME 타입 검증
    _validate_image_upload(reference_bytes, reference_image.filename or "reference", reference_image.content_type)
    for i, (img, img_bytes) in enumerate(zip(product_images, product_bytes_list)):
        _validate_image_upload(img_bytes, img.filename or f"product_{i+1}", img.content_type)

    # 텍스트 데이터 dict 구성
    text_data = {
        "headline": headline,
        "subtext": subtext,
        "cta": cta,
    }

    # 새 작업 ID 생성 및 job_store 초기화
    job_id = str(uuid4())
    job_store[job_id] = BannerJobResponse(job_id=job_id, status=JobStatus.pending)

    # 파이프라인을 백그라운드 태스크로 등록
    background_tasks.add_task(
        run_pipeline,
        job_id,
        reference_bytes,
        product_bytes_list,
        text_data,
        banner_size,
        job_store,
    )

    return job_store[job_id]


@router.get("/banner/status/{job_id}", response_model=BannerJobResponse)
async def get_banner_status(job_id: str) -> BannerJobResponse:
    """
    job_id로 작업 상태를 조회한다.
    존재하지 않는 job_id이면 404를 반환한다.
    """
    job = job_store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail=f"job_id '{job_id}'를 찾을 수 없습니다.")
    return job


@router.get("/banner/download/{job_id}/{variant_id}")
async def download_banner(
    job_id: str,
    variant_id: str,
    format: str = "png",
) -> StreamingResponse:
    """
    완료된 배너 작업에서 특정 variant를 이미지 파일로 다운로드한다.
    - format 쿼리 파라미터: "png" | "jpg" (기본값: "png")
    """
    # format 파라미터 whitelist 검증
    fmt = format.lower()
    if fmt not in ALLOWED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 포맷입니다: '{format}'. 허용: {sorted(ALLOWED_FORMATS)}",
        )

    job = job_store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail=f"job_id '{job_id}'를 찾을 수 없습니다.")

    if job.status != JobStatus.completed:
        raise HTTPException(
            status_code=400,
            detail=f"작업이 아직 완료되지 않았습니다. 현재 상태: {job.status}",
        )

    if not job.banners:
        raise HTTPException(status_code=404, detail="생성된 배너가 없습니다.")

    # variant_id로 해당 배너 변형 탐색
    variant: Optional[BannerVariant] = next(
        (b for b in job.banners if b.variant_id == variant_id), None
    )
    if variant is None:
        raise HTTPException(
            status_code=404,
            detail=f"variant_id '{variant_id}'를 찾을 수 없습니다.",
        )

    # 빈 image_base64 방어
    if not variant.image_base64:
        raise HTTPException(
            status_code=404,
            detail=f"variant '{variant_id}' 이미지가 생성되지 않았습니다.",
        )

    # base64 디코딩 후 StreamingResponse로 반환
    image_bytes = base64.b64decode(variant.image_base64)
    media_type = "image/jpeg" if fmt in ("jpg", "jpeg") else "image/png"
    ext = "jpg" if fmt in ("jpg", "jpeg") else "png"

    return StreamingResponse(
        content=io.BytesIO(image_bytes),
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="banner_{variant_id}.{ext}"'
        },
    )
