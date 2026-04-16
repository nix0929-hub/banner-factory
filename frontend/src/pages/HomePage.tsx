import { useBannerStore } from '../store/bannerStore'
import { StepIndicator } from '../components/common/StepIndicator'
import { ReferenceUploader } from '../components/upload/ReferenceUploader'
import { ProductUploader } from '../components/upload/ProductUploader'
import { TextInputForm } from '../components/form/TextInputForm'
import { BannerPreviewGrid } from '../components/preview/BannerPreviewGrid'
import type { AppStep } from '../types/banner'

const navButtonBase: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: '1px solid #dcd7d3',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
}

export function HomePage() {
  const {
    currentStep,
    setStep,
    referenceImage,
    productImages,
    textData,
    reset,
  } = useBannerStore()

  const canProceedStep1 = !!referenceImage
  const canProceedStep2 = productImages.length > 0
  const canProceedStep3 = textData.headline.trim().length > 0

  const handleNext = () => {
    if (currentStep < 4) {
      setStep((currentStep + 1) as AppStep)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setStep((currentStep - 1) as AppStep)
    }
  }

  const canGoNext = () => {
    if (currentStep === 1) return canProceedStep1
    if (currentStep === 2) return canProceedStep2
    if (currentStep === 3) return canProceedStep3
    return false
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f5f2' }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#1b1938',
        padding: '48px 24px 40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {/* Logo / Title */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#cbb7fb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="10" rx="2" stroke="#1b1938" strokeWidth="1.5" />
                <line x1="5" y1="15" x2="13" y2="15" stroke="#1b1938" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9" y1="12" x2="9" y2="15" stroke="#1b1938" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.02em',
            }}>
              Banner Factory
            </span>
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: '1.0',
            letterSpacing: '-0.03em',
            marginBottom: '12px',
          }}>
            AI로 배너를 <br />
            <span style={{ color: '#cbb7fb' }}>즉시 제작</span>하세요
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.5',
            marginBottom: '32px',
          }}>
            레퍼런스 이미지와 제품 사진만 있으면 <br />
            전문가 수준의 배너를 3가지 버전으로 생성해 드립니다.
          </p>

          {/* Step Indicator */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '32px 24px 48px',
      }}>
        {/* Step Content */}
        {currentStep === 1 && <ReferenceUploader />}
        {currentStep === 2 && <ProductUploader />}
        {currentStep === 3 && <TextInputForm />}
        {currentStep === 4 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#292827',
                  lineHeight: '1.0',
                  marginBottom: '4px',
                }}>
                  생성된 배너
                </h2>
                <p style={{ fontSize: '13px', color: '#a09a94' }}>
                  3가지 버전으로 제작된 배너를 확인하세요.
                </p>
              </div>
              <button
                onClick={reset}
                style={{
                  ...navButtonBase,
                  backgroundColor: '#e9e5dd',
                  color: '#292827',
                }}
                onMouseOver={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#dcd7d3' }}
                onMouseOut={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#e9e5dd' }}
              >
                처음부터 다시
              </button>
            </div>
            <BannerPreviewGrid />
          </div>
        )}

        {/* Navigation */}
        {currentStep < 4 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
          }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              style={{
                ...navButtonBase,
                backgroundColor: currentStep === 1 ? '#f0ede8' : '#e9e5dd',
                color: currentStep === 1 ? '#a09a94' : '#292827',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              }}
              onMouseOver={(e) => {
                if (currentStep !== 1) (e.target as HTMLButtonElement).style.backgroundColor = '#dcd7d3'
              }}
              onMouseOut={(e) => {
                if (currentStep !== 1) (e.target as HTMLButtonElement).style.backgroundColor = '#e9e5dd'
              }}
            >
              이전
            </button>

            <span style={{ fontSize: '13px', color: '#a09a94' }}>
              {currentStep} / 3
            </span>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canGoNext()}
                style={{
                  ...navButtonBase,
                  backgroundColor: canGoNext() ? '#e9e5dd' : '#f0ede8',
                  color: canGoNext() ? '#292827' : '#a09a94',
                  cursor: canGoNext() ? 'pointer' : 'not-allowed',
                }}
                onMouseOver={(e) => {
                  if (canGoNext()) (e.target as HTMLButtonElement).style.backgroundColor = '#dcd7d3'
                }}
                onMouseOut={(e) => {
                  if (canGoNext()) (e.target as HTMLButtonElement).style.backgroundColor = '#e9e5dd'
                }}
              >
                다음
              </button>
            ) : (
              /* Step 3: "다음" 버튼 없음 - TextInputForm 내 "배너 생성하기" 버튼 사용 */
              <div style={{ width: '80px' }} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
