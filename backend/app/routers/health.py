"""
헬스체크 라우터 — 서버 상태 및 API 키 설정 여부를 반환한다.
"""
from fastapi import APIRouter

from app.config import settings
from app.models.response import HealthResponse

router = APIRouter()

# API 버전 상수
API_VERSION = "0.1.0"


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    서버 상태 확인 엔드포인트.
    각 AI API 키가 환경 변수에 설정되어 있는지 여부를 함께 반환한다.
    """
    return HealthResponse(
        status="ok",
        version=API_VERSION,
        # 환경 변수에 실제 키 값이 존재하면 True
        google_api_ready=bool(settings.GOOGLE_API_KEY),
        anthropic_api_ready=bool(settings.ANTHROPIC_API_KEY),
    )
