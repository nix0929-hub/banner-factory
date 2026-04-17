import type { AppStep } from '../../types/banner'

interface StepIndicatorProps {
  currentStep: AppStep
}

const STEPS: { step: AppStep; label: string; desc: string }[] = [
  { step: 1, label: '레퍼런스', desc: '스타일 이미지' },
  { step: 2, label: '제품 이미지', desc: '배경 제거' },
  { step: 3, label: '텍스트', desc: '헤드라인 입력' },
  { step: 4, label: '결과', desc: '3종 배너' },
]

const C = {
  accent: '#1ed760',
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  surface: '#181818',
  interactive: '#1f1f1f',
  border: '#4d4d4d',
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {STEPS.map(({ step, label, desc }, index) => {
        const isCompleted = currentStep > step
        const isCurrent = currentStep === step

        return (
          <div key={step} style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              aria-current={isCurrent ? 'step' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: isCurrent ? C.surface : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              {/* Circle indicator */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                backgroundColor: isCompleted
                  ? C.accent
                  : isCurrent
                  ? 'transparent'
                  : 'transparent',
                border: isCompleted
                  ? `2px solid ${C.accent}`
                  : isCurrent
                  ? `2px solid ${C.textPrimary}`
                  : `2px solid ${C.border}`,
                color: isCompleted
                  ? '#000000'
                  : isCurrent
                  ? C.textPrimary
                  : C.textSecondary,
              }}>
                {isCompleted ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step
                )}
              </div>

              {/* Labels */}
              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: isCurrent ? '700' : '400',
                  color: isCompleted
                    ? C.accent
                    : isCurrent
                    ? C.textPrimary
                    : C.textSecondary,
                  lineHeight: '1.2',
                  transition: 'color 0.2s ease',
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: C.border,
                  marginTop: '2px',
                }}>
                  {desc}
                </div>
              </div>
            </div>

            {/* Vertical connector */}
            {index < STEPS.length - 1 && (
              <div style={{
                width: '2px',
                height: '12px',
                backgroundColor: currentStep > step ? C.accent : C.border,
                marginLeft: '23px',
                transition: 'background-color 0.2s ease',
                opacity: 0.5,
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
