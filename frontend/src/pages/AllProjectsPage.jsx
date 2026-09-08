import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchProjects, getImageUrl } from '../services/api'
import FALLBACK_PROJECTS from '../constants/fallbackProjects'
import Loader from '../components/ui/Loader'
import BackToTop from '../components/ui/BackToTop'
import ThemeSwitch from '../components/ui/ThemeSwitch'
import ProjectModal from '../components/ui/ProjectModal'

export default function AllProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetchProjects()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProjects(res.data)
        } else {
          setProjects(FALLBACK_PROJECTS)
        }
      })
      .catch(() => {
        setProjects(FALLBACK_PROJECTS)
      })
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.tech_stack && p.tech_stack.some((t) => t.toLowerCase().includes(search.toLowerCase())))
    return matchesCategory && matchesSearch
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-void)',
        color: 'var(--text-primary)',
        padding: '6rem clamp(1.5rem, 5vw, 6rem)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Back Link + theme toggle */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <Link
            to="/"
            className="project-metadata identity-champagne"
            style={{ textDecoration: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ← Back to System Overview
          </Link>
          <ThemeSwitch />
        </div>

        <div className="section-badge project-metadata">
          <span>◈</span> Complete Engineering Archive
        </div>

        <h1 className="headline-section" style={{ marginBottom: '1rem' }}>
          All Engineered <span className="identity-champagne">AI Systems</span>.
        </h1>

        <p className="card-description" style={{ maxWidth: '640px', marginBottom: '3rem' }}>
          Comprehensive repository of production AI applications, agentic runtimes, vector search infrastructure, and microservices.
        </p>

        {/* Filter Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="btn btn-secondary"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '14px',
                  borderColor: activeCategory === cat ? 'var(--lime)' : 'var(--border)',
                  color: activeCategory === cat ? 'var(--lime)' : 'var(--text-secondary)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            className="input-minimal"
            style={{ maxWidth: '280px', fontSize: '14px', padding: '0.65rem 1rem' }}
            placeholder="Search systems or stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <Loader label="Loading complete AI project archive..." />
        ) : filteredProjects.length === 0 ? (
          <div className="project-metadata" style={{ color: 'var(--text-muted)', padding: '3rem 0' }}>
            No matching engineering systems found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                className="card-minimal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setSelected(project)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  {project.image_url && (
                    <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                      <img src={getImageUrl(project.image_url)} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span className="identity-champagne project-metadata">
                      ◈ {project.category || 'SYSTEM'}
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
                        ★ FEATURED
                      </span>
                    )}
                  </div>
                  <h3 className="card-title" style={{ fontSize: '22px', marginBottom: '0.5rem' }}>
                    {project.title}
                  </h3>
                  <p className="card-description" style={{ fontSize: '15px', marginBottom: '1.25rem' }}>
                    {project.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {project.tech_stack?.slice(0, 4).map((tech) => (
                      <span key={tech} className="project-metadata" style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <span className="interactive-cta project-metadata" style={{ color: 'var(--text-muted)' }}>
                      Architecture Specification →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
      <BackToTop />
    </div>
  )
}
