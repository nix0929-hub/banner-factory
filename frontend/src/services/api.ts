import axios from 'axios'
import type { BannerJobResponse } from '../types/banner'

const apiClient = axios.create({
  baseURL: '/api',
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
  const url = `/api/banner/download/${jobId}/${variantId}?format=${format}`
  const link = document.createElement('a')
  link.href = url
  link.download = `banner_${variantId}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
