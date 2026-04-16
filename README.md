# Banner Factory 🎨

AI 기반 디지털 배너 자동 제작 웹앱.
레퍼런스 이미지 + 제품 이미지 + 텍스트 입력 → 3가지 스타일 배너 자동 생성.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Vite + React + TypeScript + Tailwind CSS v4 + Zustand |
| Backend | Python FastAPI |
| AI 분석 | Claude Vision API (레퍼런스 스타일 분석) |
| 배경 제거 | rembg (로컬) |
| 이미지 생성 | Nano Banana 2 (`gemini-3.1-flash-image-preview`) |

## 빠른 시작

### 백엔드

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# .env에 API 키 입력
python run.py
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

## 환경변수 (.env)

```
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
MAX_FILE_SIZE_MB=10
TEMP_DIR=./temp
TEMP_FILE_TTL_HOURS=1
```

## 파이프라인

```
레퍼런스 이미지 업로드
        ↓
Claude Vision → 스타일 분석 (레이아웃/색상/타이포)
        ↓
rembg → 제품 배경 제거
        ↓
Nano Banana 2 → 배경생성 + 제품합성 + 텍스트 오버레이
        ↓
3가지 변형 출력 (layout / color / minimal)
        ↓
PNG / JPG 다운로드
```

## 디자인

Superhuman 스타일 — 딥퍼플 히어로(`#1b1938`), Warm Cream 버튼(`#e9e5dd`), Lavender 액센트(`#cbb7fb`)
