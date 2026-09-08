import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 50,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--bg-void)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="identity-champagne project-metadata">
        &#9672; ROUTE NOT FOUND
      </div>
      <h1 className="headline-section" style={{ margin: 0 }}>
        404 &mdash; <span className="identity-champagne">no such system</span>.
      </h1>
      <p className="card-description" style={{ maxWidth: '420px' }}>
        The address you requested doesn&apos;t map to anything on this site.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to System Overview <span className="btn-arrow">&#8594;</span>
      </Link>
    </div>
  )
}
