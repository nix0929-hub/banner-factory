"""
개발 서버 실행 스크립트.
python run.py 로 직접 실행하거나 IDE에서 실행 가능.

주의: workers=1 고정 — job_store가 인메모리 dict이므로
멀티 워커 환경에서는 작업 상태 조회가 불일치할 수 있다.
프로덕션에서는 Redis 등 외부 스토어로 교체 후 workers 수를 늘릴 것.
"""
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,  # 인메모리 job_store 사용으로 반드시 1 고정
    )
