export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type AppStep = 1 | 2 | 3 | 4

export interface BannerVariant {
  variant_id: string
  label: string
  width: number
  height: number
  image_base64: string
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

export const BANNER_SIZES = [
  { value: '1200x628', label: '웹 배너 (1200×628)' },
  { value: '1080x1080', label: '인스타그램 정방형 (1080×1080)' },
  { value: '1080x1920', label: '인스타그램 스토리 (1080×1920)' },
  { value: '728x90', label: '리더보드 (728×90)' },
  { value: '300x250', label: '미디엄 직사각형 (300×250)' },
] as const
