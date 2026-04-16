"""
앱 전역 설정 — pydantic-settings BaseSettings를 사용해
환경 변수 또는 .env 파일에서 값을 자동으로 로드한다.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # AI API 키
    ANTHROPIC_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""

    # 파일 업로드 제한 (MB)
    MAX_FILE_SIZE_MB: int = 10

    # 임시 파일 디렉토리
    TEMP_DIR: str = "./temp"

    # 임시 파일 보관 시간 (시간 단위)
    TEMP_FILE_TTL_HOURS: int = 1

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


# 전역 싱글톤 — 모든 모듈에서 이 인스턴스를 임포트해 사용
settings = Settings()
