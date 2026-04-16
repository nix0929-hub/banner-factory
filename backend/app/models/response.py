"""
배너 생성 API 응답 관련 데이터 모델
"""
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel


class JobStatus(str, Enum):
    """배너 생성 작업의 처리 상태"""
    pending = "pending"          # 대기 중 (백그라운드 태스크 시작 전)
    processing = "processing"    # 처리 중
    completed = "completed"      # 완료
    failed = "failed"            # 실패


class BannerVariant(BaseModel):
    """생성된 배너 단일 변형 (레이아웃/스타일 하나)"""
    variant_id: str              # 변형 식별자 (예: "layout_a", "layout_b")
    image_base64: str            # base64 인코딩된 PNG 이미지
    style_summary: str           # 적용된 스타일 요약 설명


class BannerJobResponse(BaseModel):
    """배너 생성 작업 전체 응답"""
    job_id: str                              # 작업 UUID
    status: JobStatus                        # 현재 처리 상태
    banners: Optional[List[BannerVariant]] = None   # 완료 시 배너 목록
    error: Optional[str] = None             # 실패 시 오류 메시지


class HealthResponse(BaseModel):
    """서버 상태 확인 응답"""
    status: str                    # 서버 상태 (예: "ok")
    version: str                   # API 버전
    google_api_ready: bool         # Google Generative AI 키 설정 여부
    anthropic_api_ready: bool      # Anthropic API 키 설정 여부
