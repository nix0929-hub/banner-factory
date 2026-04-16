import type { AppStep } from '../../types/banner'

interface StepIndicatorProps {
  currentStep: AppStep
}

const STEPS: { step: AppStep; label: string }[] = [
  { step: 1, label: '레퍼런스' },
  { step: 2, label: '제품이미지' },
  { step: 3, label: '텍스트' },
  { step: 4, label: '결과' },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0',
    }}>
      {STEPS.map(({ step, label }, index) => {
        const isCompleted = currentStep > step
        const isCurrent = currentStep === step

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}>
              {/* Circle */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                backgroundColor: isCompleted
                  ? '#cbb7fb'
                  : isCurrent
                  ? 'transparent'
                  : 'transparent',
                border: isCompleted
                  ? '2px solid #cbb7fb'
                  : isCurrent
                  ? '2px solid #292827'
                  : '2px solid #dcd7d3',
                color: isCompleted
                  ? '#ffffff'
                  : isCurrent
                  ? '#292827'
                  : '#a09a94',
              }}>
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {/* Label */}
              <span style={{
                fontSize: '11px',
                fontWeight: isCurrent ? '600' : '400',
                color: isCompleted
                  ? '#cbb7fb'
                  : isCurrent
                  ? '#292827'
                  : '#a09a94',
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}>
                {label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div style={{
                width: '48px',
                height: '2px',
                backgroundColor: currentStep > step ? '#cbb7fb' : '#dcd7d3',
                marginBottom: '18px',
                transition: 'background-color 0.2s ease',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
