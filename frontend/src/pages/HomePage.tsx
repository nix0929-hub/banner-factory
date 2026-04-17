import { useBannerStore } from '../store/bannerStore'
import { StepIndicator } from '../components/common/StepIndicator'
import { ReferenceUploader } from '../components/upload/ReferenceUploader'
import { ProductUploader } from '../components/upload/ProductUploader'
import { TextInputForm } from '../components/form/TextInputForm'
import { BannerPreviewGrid } from '../components/preview/BannerPreviewGrid'
import { useBannerGeneration } from '../hooks/useBannerGeneration'
import { BANNER_SIZES } from '../types/banner'
import type { AppStep } from '../types/banner'

// ─── Spotify Dark Tokens ───────────────────────────────────────
const C = {
  base: '#121212',
  surface: '#181818',
  interactive: '#1f1f1f',
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  accent: '#1ed760',
  accentHover: '#1fdf64',
  border: '#4d4d4d',
  error: '#f3727f',
}

export function HomePage() {
  const {
    currentStep,
    setStep,
    referenceImage,
    productImages,
    textData,
    updateTextData,
    jobStatus,
    reset,
  } = useBannerStore()

  const { generate } = useBannerGeneration()

  const canProceedStep1 = !!referenceImage
  const canProceedStep2 = productImages.length > 0
  const isGenerating = jobStatus === 'pending' || jobStatus === 'processing'
  const canGenerate =
    !!referenceImage &&
    productImages.length > 0 &&
    textData.headline.trim().length > 0 &&
    !isGenerating

  const handleNext = () => {
    if (currentStep < 4) setStep((currentStep + 1) as AppStep)
  }
  const handlePrev = () => {
    if (currentStep > 1) setStep((currentStep - 1) as AppStep)
  }

  const canGoNext = () => {
    if (currentStep === 1) return canProceedStep1
    if (currentStep === 2) return canProceedStep2
    return false
  }

  const stepTitles: Record<number, { title: string; sub: string }> = {
    1: { title: '레퍼런스 이미지', sub: '원하는 배너 스타일의 이미지를 업로드하세요.' },
    2: { title: '제품 이미지', sub: '배너에 사용할 제품 이미지를 업로드하세요.' },
    3: { title: '배너 텍스트', sub: '헤드라인과 문구를 입력하면 AI가 배너를 생성합니다.' },
    4: { title: '생성된 배너', sub: '3가지 스타일로 제작된 배너를 확인하고 다운로드하세요.' },
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: C.base,
      color: C.textPrimary,
      fontFamily: "'Circular', 'Helvetica Neue', helvetica, arial, sans-serif",
    }}>
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside style={{
        width: '280px',
        minWidth: '280px',
        backgroundColor: C.base,
        borderRight: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: C.accent,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="10" rx="2" stroke="#121212" strokeWidth="1.5" />
              <line x1="5" y1="15" x2="13" y2="15" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="12" x2="9" y2="15" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontSize: '16px',
            fontWeight: '700',
            color: C.textPrimary,
            letterSpacing: '-0.02em',
          }}>
            Banner Factory
          </span>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Banner Size Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '700',
            color: C.textSecondary,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            배너 크기
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={textData.bannerSize}
              onChange={(e) => updateTextData({ bannerSize: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 36px 10px 14px',
                backgroundColor: C.interactive,
                border: `1px solid ${C.border}`,
                borderRadius: '9999px',
                color: C.textPrimary,
                fontSize: '13px',
                fontWeight: '400',
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              {BANNER_SIZES.map((size) => (
                <option key={size.value} value={size.value} style={{ backgroundColor: C.interactive }}>
                  {size.label}
                </option>
              ))}
            </select>
            <div style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: C.textSecondary,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L1 3h10z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={!canGenerate}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: canGenerate ? C.accent : C.interactive,
            color: canGenerate ? '#000000' : C.textSecondary,
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            cursor: canGenerate ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s ease',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseOver={(e) => {
            if (canGenerate) (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.accentHover
          }}
          onMouseOut={(e) => {
            if (canGenerate) (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.accent
          }}
        >
          {isGenerating ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="7" cy="7" r="5" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeDasharray="24" strokeDashoffset="8" />
              </svg>
              생성 중...
            </>
          ) : 'Generate'}
        </button>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: C.base,
      }}>
        {/* Header */}
        <div style={{
          padding: '32px 40px 24px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: C.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            marginBottom: '6px',
          }}>
            {stepTitles[currentStep].title}
          </h1>
          <p style={{
            fontSize: '14px',
            color: C.textSecondary,
            lineHeight: '1.5',
          }}>
            {stepTitles[currentStep].sub}
          </p>
        </div>

        {/* Step Content */}
        <div style={{ flex: 1, padding: '32px 40px' }}>
          {currentStep === 1 && <ReferenceUploader />}
          {currentStep === 2 && <ProductUploader />}
          {currentStep === 3 && <TextInputForm />}
          {currentStep === 4 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button
                  onClick={() => {
                    if (window.confirm('처음부터 다시 시작하시겠습니까?')) reset()
                  }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    border: `1px solid ${C.border}`,
                    backgroundColor: 'transparent',
                    color: C.textSecondary,
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '1.4px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease, color 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.textSecondary
                    ;(e.currentTarget as HTMLButtonElement).style.color = C.textPrimary
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.border
                    ;(e.currentTarget as HTMLButtonElement).style.color = C.textSecondary
                  }}
                >
                  처음부터 다시
                </button>
              </div>
              <BannerPreviewGrid />
            </div>
          )}
        </div>

        {/* Bottom Navigation (steps 1–2) */}
        {currentStep < 3 && (
          <div style={{
            padding: '20px 40px',
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              style={{
                padding: '10px 24px',
                borderRadius: '9999px',
                border: `1px solid ${currentStep === 1 ? 'transparent' : C.border}`,
                backgroundColor: 'transparent',
                color: currentStep === 1 ? C.interactive : C.textPrimary,
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease',
              }}
            >
              이전
            </button>

            <span style={{ fontSize: '12px', color: C.textSecondary, letterSpacing: '0.5px' }}>
              {currentStep} / 3
            </span>

            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              style={{
                padding: '10px 24px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: canGoNext() ? C.textPrimary : C.interactive,
                color: canGoNext() ? '#000000' : C.textSecondary,
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                cursor: canGoNext() ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                transition: 'background-color 0.15s ease',
              }}
              onMouseOver={(e) => {
                if (canGoNext()) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e0e0e0'
              }}
              onMouseOut={(e) => {
                if (canGoNext()) (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.textPrimary
              }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 3 bottom nav — Generate is in sidebar, just show back */}
        {currentStep === 3 && (
          <div style={{
            padding: '20px 40px',
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
          }}>
            <button
              onClick={handlePrev}
              style={{
                padding: '10px 24px',
                borderRadius: '9999px',
                border: `1px solid ${C.border}`,
                backgroundColor: 'transparent',
                color: C.textPrimary,
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              이전
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
