import { useEffect, useRef } from 'react'
import { useBannerStore } from '../../store/bannerStore'
import { ImageDropzone } from '../common/ImageDropzone'

const C = { border: '#4d4d4d', textSecondary: '#b3b3b3', textPrimary: '#ffffff' }

export function ReferenceUploader() {
  const { referenceImage, setReferenceImage } = useBannerStore()
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (referenceImage) {
      // 이전 Object URL 해제 후 새 URL 생성
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = URL.createObjectURL(referenceImage)
    } else {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [referenceImage])

  return (
    <div style={{ maxWidth: '640px' }}>
      {referenceImage && objectUrlRef.current ? (
        <div>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            borderRadius: '12px',
            overflow: 'hidden',
            border: `1px solid ${C.border}`,
          }}>
            <img
              src={objectUrlRef.current}
              alt="레퍼런스 이미지 미리보기"
              style={{ width: '320px', height: '220px', objectFit: 'cover', display: 'block' }}
            />
            <button
              onClick={() => setReferenceImage(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.7)',
                border: `1px solid ${C.border}`,
                color: C.textPrimary,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
              aria-label="레퍼런스 이미지 제거"
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: '12px', color: C.textSecondary, marginTop: '10px' }}>
            {referenceImage.name}
          </p>
        </div>
      ) : (
        <ImageDropzone
          onFilesSelected={(files) => { if (files[0]) setReferenceImage(files[0]) }}
          accept="image/*"
          multiple={false}
          maxFiles={1}
          label="레퍼런스 이미지를 드래그하거나 클릭해서 업로드"
        />
      )}
    </div>
  )
}
