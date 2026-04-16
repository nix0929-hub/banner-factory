import { useBannerStore } from '../../store/bannerStore'
import { ImageDropzone } from '../common/ImageDropzone'

const MAX_PRODUCT_IMAGES = 3

export function ProductUploader() {
  const { productImages, addProductImage, removeProductImage } = useBannerStore()

  const handleFilesSelected = (files: File[]) => {
    const remaining = MAX_PRODUCT_IMAGES - productImages.length
    const filesToAdd = files.slice(0, remaining)
    filesToAdd.forEach((file) => addProductImage(file))
  }

  const isAtLimit = productImages.length >= MAX_PRODUCT_IMAGES

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
        제품 이미지
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#a09a94',
        marginBottom: '16px',
        lineHeight: '1.5',
      }}>
        배너에 사용할 제품 이미지를 업로드해주세요. (최대 {MAX_PRODUCT_IMAGES}개)
      </p>

      {/* Image Grid */}
      {productImages.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}>
          {productImages.map((file, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <div style={{
                border: '1px solid #dcd7d3',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`제품 이미지 ${index + 1}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <button
                onClick={() => removeProductImage(index)}
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
                aria-label={`이미지 ${index + 1} 제거`}
              >
                ×
              </button>
              <p style={{
                fontSize: '11px',
                color: '#a09a94',
                marginTop: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {file.name}
              </p>
            </div>
          ))}
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
          color: '#cbb7fb',
          textAlign: 'center',
          padding: '12px',
          border: '1px solid #dcd7d3',
          borderRadius: '8px',
        }}>
          최대 {MAX_PRODUCT_IMAGES}개까지 업로드 가능합니다.
        </p>
      )}
    </div>
  )
}
