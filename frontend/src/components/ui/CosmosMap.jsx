import usePortfolioStore from '../../store/portfolioStore'

const SECTIONS = ['Overview', 'About', 'Tech-Stack', 'Projects', 'Timeline', 'Contact']

export default function CosmosMap() {
  const activeSection = usePortfolioStore((s) => s.activeSection)

  const scrollToSection = (index) => {
    const el = document.getElementById(`section-${index}`)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '0.65rem 1.5rem',
        borderRadius: '999px',
        background: 'rgba(30, 30, 30, 0.75)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
      aria-label="Section navigation"
    >
      <div className="identity-champagne font-canela" style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
        Akash PG
      </div>

      <div style={{ width: '1px', height: '14px', background: 'var(--border)' }} />

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {SECTIONS.map((label, i) => {
          const isActive = activeSection === i
          return (
            <button
              key={label}
              onClick={() => scrollToSection(i)}
              className="nav-link"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: isActive ? '#FFFFFF' : '#8E8E8E',
                fontFamily: 'Akkurat, Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.25s ease',
                padding: '0.2rem 0',
              }}
            >
              <span>{label}</span>
              {isActive && (
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#B8FF4F',
                    boxShadow: '0 0 8px #B8FF4F',
                  }}
                />
              )}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
