import { useBannerStore } from '../../store/bannerStore'
import { BANNER_SIZES } from '../../types/banner'
import { useBannerGeneration } from '../../hooks/useBannerGeneration'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #dcd7d3',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#292827',
  backgroundColor: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  fontFamily: 'inherit',
  lineHeight: '1.5',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#292827',
  marginBottom: '6px',
}

export function TextInputForm() {
  const { textData, updateTextData, jobStatus } = useBannerStore()
  const { generate } = useBannerGeneration()

  const isGenerating = jobStatus === 'pending' || jobStatus === 'processing'
  const canGenerate = textData.headline.trim().length > 0 && !isGenerating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canGenerate) {
      generate()
    }
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
        배너 텍스트
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#a09a94',
        marginBottom: '20px',
        lineHeight: '1.5',
      }}>
        배너에 표시될 텍스트를 입력해주세요.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Headline - Required */}
          <div>
            <label style={labelStyle}>
              헤드라인
              <span style={{ color: '#cbb7fb', marginLeft: '4px' }}>*</span>
            </label>
            <input
              type="text"
              value={textData.headline}
              onChange={(e) => updateTextData({ headline: e.target.value })}
              placeholder="예: 지금 바로 시작하세요"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#cbb7fb' }}
              onBlur={(e) => { e.target.style.borderColor = '#dcd7d3' }}
            />
          </div>

          {/* Subtext - Optional */}
          <div>
            <label style={labelStyle}>
              서브텍스트
              <span style={{ color: '#a09a94', marginLeft: '4px', fontWeight: '400' }}>(선택)</span>
            </label>
            <input
              type="text"
              value={textData.subtext}
              onChange={(e) => updateTextData({ subtext: e.target.value })}
              placeholder="예: 최고의 품질로 만들어진 제품"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#cbb7fb' }}
              onBlur={(e) => { e.target.style.borderColor = '#dcd7d3' }}
            />
          </div>

          {/* CTA - Optional */}
          <div>
            <label style={labelStyle}>
              CTA 버튼 텍스트
              <span style={{ color: '#a09a94', marginLeft: '4px', fontWeight: '400' }}>(선택)</span>
            </label>
            <input
              type="text"
              value={textData.cta}
              onChange={(e) => updateTextData({ cta: e.target.value })}
              placeholder="예: 지금 구매하기"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#cbb7fb' }}
              onBlur={(e) => { e.target.style.borderColor = '#dcd7d3' }}
            />
          </div>

          {/* Banner Size */}
          <div>
            <label style={labelStyle}>배너 크기</label>
            <select
              value={textData.bannerSize}
              onChange={(e) => updateTextData({ bannerSize: e.target.value })}
              style={{
                ...inputStyle,
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a09a94' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                paddingRight: '36px',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#cbb7fb' }}
              onBlur={(e) => { e.target.style.borderColor = '#dcd7d3' }}
            >
              {BANNER_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canGenerate}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: canGenerate ? '#e9e5dd' : '#f0ede8',
              color: canGenerate ? '#292827' : '#a09a94',
              fontSize: '14px',
              fontWeight: '600',
              cursor: canGenerate ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              letterSpacing: '0.01em',
            }}
          >
            {isGenerating ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" stroke="#a09a94" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
                </svg>
                배너 생성 중...
              </span>
            ) : (
              '배너 생성하기'
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
