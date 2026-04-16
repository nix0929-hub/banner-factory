import { useBannerStore } from '../../store/bannerStore'
import { BannerCard } from './BannerCard'

function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #dcd7d3',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Label skeleton */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #dcd7d3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          height: '13px',
          width: '80px',
          borderRadius: '4px',
          background: 'linear-gradient(90deg, #dcd7d3 25%, rgba(203, 183, 251, 0.3) 50%, #dcd7d3 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }} />
        <div style={{
          height: '20px',
          width: '70px',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #dcd7d3 25%, rgba(203, 183, 251, 0.3) 50%, #dcd7d3 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }} />
      </div>

      {/* Image skeleton */}
      <div style={{
        height: '192px',
        background: 'linear-gradient(90deg, #f0ede8 25%, rgba(203, 183, 251, 0.15) 50%, #f0ede8 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }} />

      {/* Button skeleton */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #dcd7d3',
        display: 'flex',
        gap: '8px',
      }}>
        {[0, 1].map((i) => (
          <div key={i} style={{
            flex: 1,
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #dcd7d3 25%, rgba(203, 183, 251, 0.3) 50%, #dcd7d3 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        ))}
      </div>
    </div>
  )
}

export function BannerPreviewGrid() {
  const { banners, jobStatus, error } = useBannerStore()

  const isLoading = jobStatus === 'pending' || jobStatus === 'processing'

  if (error) {
    return (
      <div style={{
        padding: '24px',
        border: '1px solid #dcd7d3',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          margin: '0 auto 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a09a94" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p style={{ fontSize: '14px', color: '#292827', fontWeight: '500', marginBottom: '4px' }}>
          오류가 발생했습니다
        </p>
        <p style={{ fontSize: '13px', color: '#a09a94' }}>{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#292827', fontWeight: '500' }}>
            배너를 생성하고 있습니다...
          </p>
          <p style={{ fontSize: '13px', color: '#a09a94', marginTop: '4px' }}>
            AI가 최적의 배너 디자인을 만들고 있어요. 잠시만 기다려주세요.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </>
    )
  }

  if (banners.length === 0) {
    return (
      <div style={{
        padding: '48px 24px',
        border: '1px dashed #dcd7d3',
        borderRadius: '16px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: '#a09a94' }}>
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
        @media (max-width: 640px) {
          .banner-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .banner-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  )
}
