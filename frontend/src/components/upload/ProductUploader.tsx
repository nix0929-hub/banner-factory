import { useEffect, useRef } from 'react'
import { useBannerStore } from '../../store/bannerStore'
import { ImageDropzone } from '../common/ImageDropzone'

const MAX_PRODUCT_IMAGES = 3
const C = { border: '#4d4d4d', textSecondary: '#b3b3b3', textPrimary: '#ffffff', accent: '#1ed760' }

export function ProductUploader() {
  const { productImages, addProductImage, removeProductImage } = useBannerStore()
  const objectUrlsRef = useRef<Map<string, string>>(new Map())
  const isAtLimit = productImages.length >= MAX_PRODUCT_IMAGES

  // 각 File에 대한 Object URL 관리
  useEffect(() => {
    const currentKeys = new Set(productImages.map((f) => `${f.name}-${f.lastModified}`))

    // 제거된 파일의 URL 해제
    objectUrlsRef.current.forEach((url, key) => {
      if (!currentKeys.has(key)) {
        URL.revokeObjectURL(url)
        objectUrlsRef.current.delete(key)
      }
    })

    // 새 파일의 URL 생성
    productImages.forEach((file) => {
      const key = `${file.name}-${file.lastModified}`
      if (!objectUrlsRef.current.has(key)) {
        objectUrlsRef.current.set(key, URL.createObjectURL(file))
      }
    })
  }, [productImages])

  // 언마운트 시 전체 해제
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      objectUrlsRef.current.clear()
    }
  }, [])

  const getObjectUrl = (file: File) => {
    const key = `${file.name}-${file.lastModified}`
    return objectUrlsRef.current.get(key) ?? ''
  }

  const handleFilesSelected = (files: File[]) => {
    const remaining = MAX_PRODUCT_IMAGES - productImages.length
    files.slice(0, remaining).forEach((file) => addProductImage(file))
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      {productImages.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {productImages.map((file, index) => {
            const key = `${file.name}-${file.lastModified}`
            const url = getObjectUrl(file)
            return (
              <div key={key} style={{ position: 'relative' }}>
                <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                  <img
                    src={url}
                    alt={`제품 이미지 ${index + 1}: ${file.name}`}
                    style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <button
                  onClick={() => removeProductImage(index)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    border: `1px solid ${C.border}`,
                    color: C.textPrimary,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                  aria-label={`${file.name} 제거`}
                >
                  ×
                </button>
                <p style={{
                  fontSize: '11px',
                  color: C.textSecondary,
                  marginTop: '6px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {!isAtLimit && (
        <ImageDropzone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          multiple={true}
          maxFiles={MAX_PRODUCT_IMAGES - productImages.length}
          label={
            productImages.length === 0
              ? '제품 이미지를 드래그하거나 클릭해서 업로드'
              : `이미지 추가 (${productImages.length}/${MAX_PRODUCT_IMAGES})`
          }
        />
      )}

      {isAtLimit && (
        <p style={{
          fontSize: '13px',
          color: C.accent,
          textAlign: 'center',
          padding: '12px',
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          backgroundColor: 'rgba(30,215,96,0.05)',
        }}>
          최대 {MAX_PRODUCT_IMAGES}개 업로드 완료
        </p>
      )}
    </div>
  )
}
