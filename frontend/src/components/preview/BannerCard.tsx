import type { BannerVariant } from '../../types/banner'
import { VARIANT_LABELS } from '../../types/banner'
import { downloadBanner } from '../../services/api'
import { useBannerStore } from '../../store/bannerStore'

const C = {
  surface: '#181818',
  interactive: '#1f1f1f',
  border: '#4d4d4d',
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  accent: '#1ed760',
}

interface BannerCardProps {
  variant: BannerVariant
}

export function BannerCard({ variant }: BannerCardProps) {
  const { jobId } = useBannerStore()
  const label = VARIANT_LABELS[variant.variant_id] ?? variant.variant_id

  const handleDownload = (format: 'png' | 'jpg') => {
    if (!jobId) return
    downloadBanner(jobId, variant.variant_id, format)
  }

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'border-color 0.15s ease',
    }}
      onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#7c7c7c' }}
      onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: C.textPrimary }}>
          {label}
        </span>
        <span style={{
          fontSize: '11px',
          color: C.textSecondary,
          backgroundColor: C.interactive,
          padding: '3px 10px',
          borderRadius: '9999px',
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {variant.style_summary}
        </span>
      </div>

      {/* Image */}
      <div style={{
        backgroundColor: C.interactive,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        minHeight: '180px',
      }}>
        <img
          src={`data:image/png;base64,${variant.image_base64}`}
          alt={label}
          style={{
            maxWidth: '100%',
            maxHeight: '220px',
            objectFit: 'contain',
            borderRadius: '6px',
          }}
        />
      </div>

      {/* Download Buttons */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        gap: '8px',
      }}>
        {(['png', 'jpg'] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => handleDownload(fmt)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '9999px',
              border: `1px solid ${C.border}`,
              backgroundColor: 'transparent',
              color: C.textSecondary,
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, color 0.15s ease',
              fontFamily: 'inherit',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent
              ;(e.currentTarget as HTMLButtonElement).style.color = C.accent
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.border
              ;(e.currentTarget as HTMLButtonElement).style.color = C.textSecondary
            }}
          >
            {fmt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
