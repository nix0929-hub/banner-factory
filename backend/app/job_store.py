"""
작업 저장소 — Redis 사용 가능 시 Redis, 불가 시 인메모리 dict로 폴백.

사용법:
  from app.job_store import job_store
  await job_store.set(job_id, response_obj)
  result = await job_store.get(job_id)

앱 lifespan에서 startup() / shutdown() 을 호출해야 한다.
"""
import logging
import time
from typing import Optional, Tuple

from app.models.response import BannerJobResponse

logger = logging.getLogger(__name__)

JOB_TTL_SECONDS = 86400  # 24시간


class JobStore:
    """
    비동기 작업 저장소.
    REDIS_URL이 설정되면 Redis를 사용하고, 그렇지 않으면 인메모리 dict를 사용한다.
    """

    def __init__(self) -> None:
        # (BannerJobResponse, expire_at) 튜플로 저장 — lazy TTL 만료 처리
        self._memory: dict = {}
        self._redis = None  # redis.asyncio.Redis | None

    async def startup(self, redis_url: Optional[str]) -> None:
        """앱 시작 시 호출. Redis 연결을 시도한다."""
        if not redis_url:
            logger.info("REDIS_URL 미설정 — 인메모리 job_store 사용")
            return
        try:
            import redis.asyncio as aioredis  # type: ignore[import]
            client = aioredis.from_url(redis_url, decode_responses=True)
            await client.ping()
            self._redis = client
            logger.info("Redis 연결 성공: %s", redis_url)
        except Exception as exc:
            logger.warning("Redis 연결 실패 (%s) — 인메모리로 폴백", exc)

    async def shutdown(self) -> None:
        """앱 종료 시 호출. Redis 연결을 닫는다."""
        if self._redis is not None:
            await self._redis.aclose()
            logger.info("Redis 연결 종료")

    async def set(self, job_id: str, job: BannerJobResponse) -> None:
        """job_id에 BannerJobResponse를 저장한다."""
        if self._redis is not None:
            await self._redis.set(
                f"job:{job_id}",
                job.model_dump_json(),
                ex=JOB_TTL_SECONDS,
            )
        else:
            self._memory[job_id] = (job, time.time() + JOB_TTL_SECONDS)

    async def get(self, job_id: str) -> Optional[BannerJobResponse]:
        """job_id로 BannerJobResponse를 조회한다. 없으면 None 반환."""
        if self._redis is not None:
            data = await self._redis.get(f"job:{job_id}")
            if data is None:
                return None
            return BannerJobResponse.model_validate_json(data)
        entry: Optional[Tuple] = self._memory.get(job_id)
        if entry is None:
            return None
        job, expire_at = entry
        if time.time() > expire_at:
            del self._memory[job_id]
            return None
        return job


# 앱 전체에서 공유하는 싱글턴 인스턴스
job_store = JobStore()
