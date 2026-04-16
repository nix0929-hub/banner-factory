"""
FastAPI 애플리케이션 진입점

lifespan:
  - 서버 시작 시 temp/ 디렉토리 생성
  - 서버 종료 시 별도 처리 없음 (추후 정리 로직 추가 가능)

CORS:
  - Vite 개발 서버(5173)와 일반 개발 서버(3000)를 허용
  - 프로덕션 배포 시 allow_origins를 실제 도메인으로 교체할 것
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import banner, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    서버 시작/종료 이벤트 처리.
    startup: temp 디렉토리가 없으면 생성한다.
    """
    # --- startup ---
    temp_dir = settings.TEMP_DIR
    os.makedirs(temp_dir, exist_ok=True)
    print(f"[startup] temp 디렉토리 확인/생성 완료: {temp_dir}")

    yield  # 애플리케이션 실행

    # --- shutdown ---
    # 필요 시 temp 파일 정리 로직 추가


# FastAPI 인스턴스 생성
app = FastAPI(
    title="Banner Factory API",
    description="AI 기반 광고 배너 자동 생성 서비스",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS 미들웨어 등록
# Vite 프록시는 개발 전용이므로 FastAPI 자체에도 CORS 허용 설정이 필요하다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 개발 서버
        "http://localhost:3000",  # 기타 개발 서버
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록 — 공통 prefix "/api" 적용
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(banner.router, prefix="/api", tags=["banner"])
