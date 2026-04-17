import axios from 'axios'
import type { BannerJobResponse } from '../types/banner'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export async function generateBanners(formData: FormData): Promise<BannerJobResponse> {
  const response = await apiClient.post<BannerJobResponse>('/banner/generate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function pollJobStatus(jobId: string): Promise<BannerJobResponse> {
  const response = await apiClient.get<BannerJobResponse>(`/banner/status/${jobId}`)
  return response.data
}

export function downloadBanner(
  jobId: string,
  variantId: string,
  format: 'png' | 'jpg'
): void {
  const url = `${API_BASE}/banner/download/${jobId}/${variantId}?format=${format}`
  const link = document.createElement('a')
  link.href = url
  link.download = `banner_${variantId}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
