import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getImageUrl } from '../../services/api'

/**
 * Project detail overlay, shared by the featured grid and the full archive.
 * Previously duplicated across both, with the featured badge in only one copy.
 */
export default function ProjectModal({ project, onClose }) {
  // Close on Escape, and lock background scroll while the dialog is open.
  useEffect(() => {
    if (!project) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(18, 18, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          className="card-minimal"
          style={{ maxWidth: '640px', width: '100%', position: 'relative', borderColor: 'var(--champagne)', padding: '1.75rem' }}
        >
          <button
            onClick={onClose}
            aria-label="Close project details"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.25rem',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            &#10005;
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="identity-champagne project-metadata">
              &#9672; {project.category || 'SYSTEM ARCHITECTURE'}
            </span>
            {project.featured && (
              <span
                className="project-metadata"
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: 'rgba(184, 255, 79, 0.1)',
                  border: '1px solid var(--lime)',
                  color: 'var(--lime)',
                  fontSize: '11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                &#9733; FEATURED SYSTEM
              </span>
            )}
          </div>

          <h3 className="card-title" style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>
            {project.title}
          </h3>

          {project.image_url && (
            <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
              <img src={getImageUrl(project.image_url)} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <p className="card-description" style={{ marginBottom: '1.25rem', fontSize: '0.88rem', lineHeight: '1.45' }}>
            {project.long_description || project.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {project.tech_stack?.map((tech) => (
              <span key={tech} className="project-metadata" style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                {tech}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}>
                GitHub Repository &#8599;
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}>
                Live System &#8599;
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
