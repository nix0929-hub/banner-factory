interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #dcd7d3',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px',
            backgroundColor: '#cbb7fb', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="10" rx="2" stroke="#1b1938" strokeWidth="1.5" />
              <line x1="5" y1="15" x2="13" y2="15" stroke="#1b1938" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="12" x2="9" y2="15" stroke="#1b1938" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#292827', letterSpacing: '-0.02em' }}>
            Banner Factory
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          style={{
            padding: '8px 18px', borderRadius: '8px',
            border: '1px solid #dcd7d3', backgroundColor: '#e9e5dd',
            color: '#292827', fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', letterSpacing: '0.01em',
            transition: 'background-color 0.15s ease',
          }}
          onMouseOver={e => { (e.target as HTMLElement).style.backgroundColor = '#dcd7d3' }}
          onMouseOut={e => { (e.target as HTMLElement).style.backgroundColor = '#e9e5dd' }}
        >
          지금 시작하기
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0f0d22 0%, #1b1938 50%, #231e42 100%)',
        padding: '96px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'rgba(203, 183, 251, 0.12)',
            border: '1px solid rgba(203, 183, 251, 0.25)',
            borderRadius: '8px', padding: '4px 12px',
            marginBottom: '28px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#cbb7fb' }} />
            <span style={{ fontSize: '12px', color: '#cbb7fb', fontWeight: '500', letterSpacing: '0.04em' }}>
              AI POWERED · NANO BANANA 2
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: '700',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: '0.96',
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}>
            광고 배너를<br />
            <span style={{ color: '#cbb7fb' }}>AI가 즉시</span> 만들어드립니다
          </h1>

          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.6', marginBottom: '40px', letterSpacing: '0px',
          }}>
            레퍼런스 이미지 하나면 충분합니다.<br />
            스타일을 분석하고 제품 사진을 합성해<br />
            3가지 버전의 배너를 자동으로 생성해 드립니다.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onStart}
              style={{
                padding: '14px 32px', borderRadius: '8px',
                border: 'none', backgroundColor: '#e9e5dd',
                color: '#292827', fontSize: '15px', fontWeight: '600',
                cursor: 'pointer', letterSpacing: '0.01em',
                transition: 'background-color 0.15s ease',
              }}
              onMouseOver={e => { (e.target as HTMLElement).style.backgroundColor = '#dcd7d3' }}
              onMouseOut={e => { (e.target as HTMLElement).style.backgroundColor = '#e9e5dd' }}
            >
              무료로 시작하기
            </button>
            <a
              href="#how-it-works"
              style={{
                padding: '14px 24px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: '500',
                cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseOver={e => {
                (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'
                ;(e.target as HTMLElement).style.color = 'rgba(255,255,255,1)'
              }}
              onMouseOut={e => {
                (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
                ;(e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
              }}
            >
              작동 방식 보기
            </a>
          </div>

          {/* Hero visual: mock banner preview */}
          <div style={{
            marginTop: '64px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {[
              { label: '레이아웃', color: 'rgba(203,183,251,0.15)', accent: '#cbb7fb' },
              { label: '컬러', color: 'rgba(113,76,182,0.2)', accent: '#9b7de8' },
              { label: '미니멀', color: 'rgba(255,255,255,0.06)', accent: 'rgba(255,255,255,0.4)' },
            ].map((v) => (
              <div key={v.label} style={{
                backgroundColor: v.color,
                border: `1px solid ${v.accent}33`,
                borderRadius: '8px',
                padding: '16px 12px',
                textAlign: 'center',
              }}>
                {/* Mock banner image area */}
                <div style={{
                  width: '100%', aspectRatio: '16/9',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '4px', marginBottom: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={v.accent} strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span style={{ fontSize: '11px', color: v.accent, fontWeight: '500', letterSpacing: '0.04em' }}>
                  {v.label}
                </span>
              </div>
            ))}
            <p style={{
              gridColumn: '1 / -1',
              fontSize: '12px', color: 'rgba(255,255,255,0.35)',
              marginTop: '4px', letterSpacing: '0.02em',
            }}>
              AI가 자동 생성한 3가지 배너 변형
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '40px', fontWeight: '700', color: '#292827',
              lineHeight: '0.96', letterSpacing: '-0.03em', marginBottom: '16px',
            }}>
              전문가 배너를 3분 안에
            </h2>
            <p style={{ fontSize: '16px', color: '#6b6560', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
              디자이너 없이도 브랜드에 맞는 고품질 배너를 즉시 생성할 수 있습니다.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbb7fb" strokeWidth="1.5">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
                title: '레퍼런스 스타일 분석',
                desc: 'Claude Vision이 레퍼런스 이미지에서 색상, 레이아웃, 분위기를 자동 추출합니다.',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbb7fb" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                  </svg>
                ),
                title: 'AI 자연 합성',
                desc: 'Nano Banana 2가 제품 배경을 자동 제거하고 배너 디자인에 자연스럽게 합성합니다.',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbb7fb" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                ),
                title: '3가지 버전 동시 생성',
                desc: '레이아웃 · 컬러 · 미니멀 — 세 가지 스타일 변형을 한 번에 비교하고 선택하세요.',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbb7fb" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
                title: 'PNG / JPG 즉시 다운로드',
                desc: '생성된 배너를 고해상도 PNG 또는 JPG로 바로 다운로드해서 사용하세요.',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbb7fb" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
                title: '5가지 배너 사이즈',
                desc: 'OG 이미지, 인스타그램 피드/스토리, 페이스북 커버까지 주요 포맷을 모두 지원합니다.',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbb7fb" strokeWidth="1.5">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                title: '비동기 빠른 처리',
                desc: '업로드 즉시 작업을 시작하고 백그라운드에서 처리합니다. 기다리는 동안 다른 작업을 하세요.',
              },
            ].map((f) => (
              <div key={f.title} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dcd7d3',
                borderRadius: '16px',
                padding: '28px 24px',
                transition: 'border-color 0.15s ease',
              }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#cbb7fb' }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#dcd7d3' }}
              >
                <div style={{
                  width: '40px', height: '40px',
                  backgroundColor: 'rgba(203,183,251,0.1)',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontSize: '16px', fontWeight: '600', color: '#292827',
                  lineHeight: '1.2', letterSpacing: '-0.01em', marginBottom: '8px',
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b6560', lineHeight: '1.6' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '96px 24px', backgroundColor: '#f7f5f2' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '40px', fontWeight: '700', color: '#292827',
              lineHeight: '0.96', letterSpacing: '-0.03em', marginBottom: '16px',
            }}>
              4단계로 완성
            </h2>
            <p style={{ fontSize: '16px', color: '#6b6560', lineHeight: '1.6' }}>
              복잡한 디자인 툴 없이, 누구나 쉽게 시작할 수 있습니다.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                step: '01',
                title: '레퍼런스 이미지 업로드',
                desc: '만들고 싶은 배너 스타일의 레퍼런스 이미지를 업로드하세요. 광고, 포스터, 웹 배너 무엇이든 가능합니다.',
                accent: '#cbb7fb',
              },
              {
                step: '02',
                title: '제품 이미지 추가',
                desc: '배너에 넣을 제품 사진을 최대 3장까지 업로드하세요. AI가 자동으로 배경을 제거합니다.',
                accent: '#cbb7fb',
              },
              {
                step: '03',
                title: '텍스트 입력',
                desc: '헤드라인, 서브텍스트, CTA 버튼 문구를 입력하세요. 배너 사이즈도 선택할 수 있습니다.',
                accent: '#cbb7fb',
              },
              {
                step: '04',
                title: '3가지 배너 다운로드',
                desc: 'AI가 레이아웃 · 컬러 · 미니멀 세 가지 스타일로 배너를 생성합니다. 마음에 드는 것을 다운로드하세요.',
                accent: '#cbb7fb',
              },
            ].map((s, i, arr) => (
              <div key={s.step} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                {/* Step number + connector line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1b1938',
                    border: '2px solid #cbb7fb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#cbb7fb' }}>{s.step}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{
                      width: '2px', flex: 1, minHeight: '32px',
                      backgroundColor: '#dcd7d3', margin: '4px 0',
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingBottom: i < arr.length - 1 ? '32px' : '0', paddingTop: '8px' }}>
                  <h3 style={{
                    fontSize: '17px', fontWeight: '600', color: '#292827',
                    lineHeight: '1.2', letterSpacing: '-0.01em', marginBottom: '8px',
                  }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b6560', lineHeight: '1.6' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: '64px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #dcd7d3' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#a09a94', letterSpacing: '0.08em', marginBottom: '24px', fontWeight: '500' }}>
            POWERED BY
          </p>
          <div style={{
            display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center',
          }}>
            {[
              { name: 'Nano Banana 2', sub: 'Gemini Image Generation' },
              { name: 'Claude Vision', sub: 'Style Analysis' },
              { name: 'rembg', sub: 'Background Removal' },
              { name: 'FastAPI', sub: 'Async Backend' },
            ].map((t) => (
              <div key={t.name} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#292827', marginBottom: '2px' }}>{t.name}</p>
                <p style={{ fontSize: '11px', color: '#a09a94' }}>{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{
        background: 'linear-gradient(160deg, #0f0d22 0%, #1b1938 60%, #231e42 100%)',
        padding: '96px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '700',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: '0.96', letterSpacing: '-0.03em', marginBottom: '20px',
          }}>
            지금 바로<br />
            <span style={{ color: '#cbb7fb' }}>첫 배너</span>를 만들어보세요
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.6', marginBottom: '36px',
          }}>
            설치 없이, 회원가입 없이.<br />
            레퍼런스 이미지 하나만 있으면 시작할 수 있습니다.
          </p>
          <button
            onClick={onStart}
            style={{
              padding: '16px 40px', borderRadius: '8px',
              border: 'none', backgroundColor: '#e9e5dd',
              color: '#292827', fontSize: '16px', fontWeight: '600',
              cursor: 'pointer', letterSpacing: '0.01em',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={e => { (e.target as HTMLElement).style.backgroundColor = '#dcd7d3' }}
            onMouseOut={e => { (e.target as HTMLElement).style.backgroundColor = '#e9e5dd' }}
          >
            배너 만들기 시작 →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #dcd7d3', padding: '24px',
        textAlign: 'center', backgroundColor: '#ffffff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '20px', height: '20px', backgroundColor: '#cbb7fb',
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="10" rx="2" stroke="#1b1938" strokeWidth="1.5" />
              <line x1="5" y1="15" x2="13" y2="15" stroke="#1b1938" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="12" x2="9" y2="15" stroke="#1b1938" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#292827' }}>Banner Factory</span>
        </div>
        <p style={{ fontSize: '12px', color: '#a09a94' }}>
          AI-powered banner creation · Built with Nano Banana 2 + Claude Vision
        </p>
      </footer>

    </div>
  )
}
