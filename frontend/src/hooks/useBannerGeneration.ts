import { useEffect, useRef } from 'react'
import { useBannerStore } from '../store/bannerStore'
import { generateBanners, pollJobStatus } from '../services/api'

export function useBannerGeneration() {
  const {
    referenceImage,
    productImages,
    textData,
    jobId,
    setJobId,
    setJobStatus,
    setBanners,
    setError,
    setStep,
  } = useBannerStore()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startPolling = (id: string) => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(async () => {
      try {
        const result = await pollJobStatus(id)
        setJobStatus(result.status)

        if (result.status === 'completed' && result.banners) {
          setBanners(result.banners)
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          setStep(4)
        } else if (result.status === 'failed') {
          setError(result.error ?? '배너 생성에 실패했습니다.')
          clearInterval(intervalRef.current!)
          intervalRef.current = null
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : '상태 확인 중 오류가 발생했습니다.'
        setError(message)
        clearInterval(intervalRef.current!)
        intervalRef.current = null
      }
    }, 2000)
  }

  const generate = async () => {
    if (!referenceImage) {
      setError('레퍼런스 이미지를 업로드해주세요.')
      return
    }
    if (productImages.length === 0) {
      setError('제품 이미지를 최소 1개 업로드해주세요.')
      return
    }
    if (!textData.headline.trim()) {
      setError('헤드라인을 입력해주세요.')
      return
    }

    try {
      setError(null)
      setJobStatus('pending')

      const formData = new FormData()
      formData.append('reference_image', referenceImage)
      productImages.forEach((img) => formData.append('product_images', img))
      formData.append('headline', textData.headline)
      formData.append('subtext', textData.subtext)
      formData.append('cta', textData.cta)
      formData.append('banner_size', textData.bannerSize)

      const result = await generateBanners(formData)
      setJobId(result.job_id)
      setJobStatus(result.status)

      startPolling(result.job_id)
    } catch (err) {
      const message = err instanceof Error ? err.message : '배너 생성 요청에 실패했습니다.'
      setError(message)
      setJobStatus('failed')
    }
  }

  const stopPolling = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return { generate, stopPolling, jobId }
}
