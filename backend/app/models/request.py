"""
배너 생성 요청 관련 데이터 모델
"""
from pydantic import BaseModel

# 지원하는 배너 사이즈 목록 — (width, height) 픽셀 단위
BANNER_SIZES: dict[str, tuple[int, int]] = {
    "og_image": (1200, 628),           # Open Graph / SNS 링크 미리보기
    "instagram_post": (1080, 1080),    # 인스타그램 정방형 게시물
    "instagram_story": (1080, 1920),   # 인스타그램 스토리
    "facebook_cover": (851, 315),      # 페이스북 커버 이미지
}


class BannerTextData(BaseModel):
    """배너에 들어갈 텍스트 데이터"""
    headline: str                        # 메인 헤드라인 (필수)
    subtext: str = ""                    # 서브 문구 (선택)
    cta: str = ""                        # Call-to-Action 버튼 문구 (선택)
    banner_size: str = "og_image"        # 배너 사이즈 키 (BANNER_SIZES 참조)
