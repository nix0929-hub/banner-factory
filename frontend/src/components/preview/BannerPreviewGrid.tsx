import { useBannerStore } from '../../store/bannerStore'
import { BannerCard } from './BannerCard'

const C = {
  surface: '#181818',
  interactive: '#1f1f1f',
  border: '#4d4d4d',
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  accent: '#1ed760',
  error: '#f3727f',
}

function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ height: '13px', width: '60px', borderRadius: '4px', ...shimmerStyle }} />
        <div style={{ height: '20px', width: '80px', borderRadius: '9999px', ...shimmerStyle }} />
      </div>
      <div style={{ height: '200px', ...shimmerStyle }} />
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        gap: '8px',
      }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ flex: 1, height: '34px', borderRadius: '9999px', ...shimmerStyle }} />
        ))}
      </div>
    </div>
  )
}

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 50%, #1f1f1f 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

export function BannerPreviewGrid() {
  const { banners, jobStatus, error } = useBannerStore()
  const isLoading = jobStatus === 'pending' || jobStatus === 'processing'

  if (error) {
    return (
      <div style={{
        padding: '40px 24px',
        border: `1px solid ${C.error}`,
        borderRadius: '12px',
        backgroundColor: 'rgba(243,114,127,0.05)',
        textAlign: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.error} strokeWidth="1.5" style={{ marginBottom: '12px' }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={{ fontSize: '14px', color: C.textPrimary, fontWeight: '700', marginBottom: '6px' }}>
          오류가 발생했습니다
        </p>
        <p style={{ fontSize: '13px', color: C.textSecondary }}>{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: C.textPrimary, fontWeight: '700' }}>
            배너를 생성하고 있습니다...
          </p>
          <p style={{ fontSize: '13px', color: C.textSecondary, marginTop: '6px' }}>
            AI가 3가지 스타일의 배너를 만들고 있어요. 잠시만 기다려주세요.
          </p>
        </div>
        <div className="banner-grid">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      </>
    )
  }

  if (banners.length === 0) {
    return (
      <div style={{
        padding: '64px 24px',
        border: `2px dashed ${C.border}`,
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: C.textSecondary }}>
          배너가 생성되면 여기에 표시됩니다.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="banner-grid">
        {banners.map((variant) => (
          <BannerCard key={variant.variant_id} variant={variant} />
        ))}
      </div>
      <style>{`
        .banner-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @media (max-width: 900px) { .banner-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .banner-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
