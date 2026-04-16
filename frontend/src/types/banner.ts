export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type AppStep = 1 | 2 | 3 | 4

export interface BannerVariant {
  variant_id: string
  image_base64: string
  style_summary: string
}

export interface BannerJobResponse {
  job_id: string
  status: JobStatus
  banners?: BannerVariant[]
  error?: string
}

export interface TextData {
  headline: string
  subtext: string
  cta: string
  bannerSize: string
}

// Backend BANNER_SIZES 키와 일치 (backend/app/models/request.py 참조)
export const BANNER_SIZES = [
  { value: 'og_image', label: '웹 배너 (1200×628)' },
  { value: 'instagram_post', label: '인스타그램 정방형 (1080×1080)' },
  { value: 'instagram_story', label: '인스타그램 스토리 (1080×1920)' },
  { value: 'facebook_cover', label: '페이스북 커버 (851×315)' },
] as const

export type BannerSizeKey = typeof BANNER_SIZES[number]['value']

// variant_id → 한국어 레이블
export const VARIANT_LABELS: Record<string, string> = {
  layout: '레이아웃',
  color: '컬러',
  minimal: '미니멀',
}
