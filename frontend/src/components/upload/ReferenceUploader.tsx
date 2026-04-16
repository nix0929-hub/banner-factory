import { useBannerStore } from '../../store/bannerStore'
import { ImageDropzone } from '../common/ImageDropzone'

export function ReferenceUploader() {
  const { referenceImage, setReferenceImage } = useBannerStore()

  const handleFilesSelected = (files: File[]) => {
    if (files[0]) {
      setReferenceImage(files[0])
    }
  }

  const handleRemove = () => {
    setReferenceImage(null)
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #dcd7d3',
      borderRadius: '16px',
      padding: '24px',
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#292827',
        marginBottom: '6px',
        lineHeight: '1.0',
      }}>
        레퍼런스 이미지
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#a09a94',
        marginBottom: '16px',
        lineHeight: '1.5',
      }}>
        원하는 배너 스타일의 레퍼런스 이미지를 업로드해주세요.
      </p>

      {referenceImage ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            border: '1px solid #dcd7d3',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'inline-block',
          }}>
            <img
              src={URL.createObjectURL(referenceImage)}
              alt="레퍼런스 이미지 미리보기"
              style={{
                width: '200px',
                height: '150px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <button
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#292827',
              border: 'none',
              color: '#ffffff',
              fontSize: '14px',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="이미지 제거"
          >
            ×
          </button>
          <p style={{
            fontSize: '12px',
            color: '#a09a94',
            marginTop: '8px',
          }}>
            {referenceImage.name}
          </p>
        </div>
      ) : (
        <ImageDropzone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          multiple={false}
          maxFiles={1}
          label="레퍼런스 이미지를 드래그하거나 클릭해서 업로드"
        />
      )}
    </div>
  )
}
