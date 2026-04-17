import { useBannerStore } from '../../store/bannerStore'

const C = {
  surface: '#181818',
  interactive: '#1f1f1f',
  border: '#4d4d4d',
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  accent: '#1ed760',
  error: '#f3727f',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: `1px solid ${C.border}`,
  borderRadius: '8px',
  fontSize: '14px',
  color: C.textPrimary,
  backgroundColor: C.interactive,
  outline: 'none',
  transition: 'border-color 0.15s ease',
  fontFamily: "'Circular', 'Helvetica Neue', helvetica, arial, sans-serif",
  lineHeight: '1.5',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  color: C.textSecondary,
  letterSpacing: '1.4px',
  textTransform: 'uppercase',
  marginBottom: '8px',
}

export function TextInputForm() {
  const { textData, updateTextData } = useBannerStore()

  return (
    <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Headline */}
      <div>
        <label htmlFor="banner-headline" style={labelStyle}>
          헤드라인 <span style={{ color: C.accent }}>*</span>
        </label>
        <input
          id="banner-headline"
          type="text"
          value={textData.headline}
          onChange={(e) => updateTextData({ headline: e.target.value })}
          placeholder="예: 지금 바로 시작하세요"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = C.accent }}
          onBlur={(e) => { e.target.style.borderColor = C.border }}
        />
      </div>

      {/* Subtext */}
      <div>
        <label htmlFor="banner-subtext" style={labelStyle}>
          서브텍스트{' '}
          <span style={{ color: C.border, textTransform: 'none', letterSpacing: '0', fontWeight: '400', fontSize: '11px' }}>(선택)</span>
        </label>
        <input
          id="banner-subtext"
          type="text"
          value={textData.subtext}
          onChange={(e) => updateTextData({ subtext: e.target.value })}
          placeholder="예: 최고의 품질로 만들어진 제품"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = C.accent }}
          onBlur={(e) => { e.target.style.borderColor = C.border }}
        />
      </div>

      {/* CTA */}
      <div>
        <label htmlFor="banner-cta" style={labelStyle}>
          CTA 버튼{' '}
          <span style={{ color: C.border, textTransform: 'none', letterSpacing: '0', fontWeight: '400', fontSize: '11px' }}>(선택)</span>
        </label>
        <input
          id="banner-cta"
          type="text"
          value={textData.cta}
          onChange={(e) => updateTextData({ cta: e.target.value })}
          placeholder="예: 지금 구매하기"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = C.accent }}
          onBlur={(e) => { e.target.style.borderColor = C.border }}
        />
      </div>

      <p style={{ fontSize: '12px', color: C.border, lineHeight: '1.5', marginTop: '4px' }}>
        헤드라인 입력 후 왼쪽 사이드바의 <span style={{ color: C.accent }}>Generate</span> 버튼을 눌러 배너를 생성하세요.
      </p>
    </div>
  )
}
