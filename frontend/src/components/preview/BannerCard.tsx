import type { BannerVariant } from '../../types/banner'
import { VARIANT_LABELS } from '../../types/banner'
import { downloadBanner } from '../../services/api'
import { useBannerStore } from '../../store/bannerStore'

interface BannerCardProps {
  variant: BannerVariant
}

const downloadButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #dcd7d3',
  backgroundColor: '#e9e5dd',
  color: '#292827',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
}

export function BannerCard({ variant }: BannerCardProps) {
  const { jobId } = useBannerStore()

  const handleDownload = (format: 'png' | 'jpg') => {
    if (!jobId) return
    downloadBanner(jobId, variant.variant_id, format)
  }

  const label = VARIANT_LABELS[variant.variant_id] ?? variant.variant_id

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #dcd7d3',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Variant Label */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #dcd7d3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#292827',
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '11px',
          color: '#a09a94',
          backgroundColor: '#f7f5f2',
          padding: '2px 8px',
          borderRadius: '8px',
          border: '1px solid #dcd7d3',
          maxWidth: '140px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {variant.style_summary}
        </span>
      </div>

      {/* Image */}
      <div style={{
        backgroundColor: '#f7f5f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        minHeight: '160px',
      }}>
        <img
          src={`data:image/png;base64,${variant.image_base64}`}
          alt={label}
          style={{
            maxWidth: '100%',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '8px',
          }}
        />
      </div>

      {/* Download Buttons */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #dcd7d3',
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={() => handleDownload('png')}
          style={downloadButtonStyle}
          onMouseOver={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#dcd7d3' }}
          onMouseOut={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#e9e5dd' }}
        >
          PNG 다운로드
        </button>
        <button
          onClick={() => handleDownload('jpg')}
          style={downloadButtonStyle}
          onMouseOver={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#dcd7d3' }}
          onMouseOut={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#e9e5dd' }}
        >
          JPG 다운로드
        </button>
      </div>
    </div>
  )
}
