import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchFeaturedProjects, getImageUrl } from '../../services/api'
import Loader from '../ui/Loader'

function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
          className="card-minimal"
          style={{ maxWidth: '640px', width: '100%', position: 'relative', borderColor: 'var(--champagne)', padding: '1.75rem' }}
        >
          <button
            onClick={onClose}
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
            ✕
          </button>

          <div className="identity-champagne project-metadata" style={{ marginBottom: '0.5rem' }}>
            ◈ {project.category || 'SYSTEM ARCHITECTURE'}
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
                GitHub Repository ↗
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}>
                Live System ↗
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ProjectCard({ project, index, onClick }) {
  return (
    <motion.div
      className="card-minimal"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onClick={() => onClick(project)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div>
        {project.image_url && (
          <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--border)' }}>
            <img src={getImageUrl(project.image_url)} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="identity-champagne project-metadata">
            ◈ {project.category || 'FEATURED SYSTEM'}
          </span>
        </div>

        <h3 className="card-title" style={{ marginBottom: '0.65rem' }}>
          {project.title}
        </h3>

        <p className="card-description" style={{ marginBottom: '1.25rem' }}>
          {project.description}
        </p>
      </div>

      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="project-metadata"
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--bg-surface)',
                color: 'var(--text-muted)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <span className="interactive-cta project-metadata" style={{ color: 'var(--text-muted)', transition: 'color 0.25s ease' }}>
            Architecture Preview →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProjects()
      .then((res) => setFeaturedProjects(res.data || []))
      .catch(() => {
        setFeaturedProjects([
          { id: 1, title: 'Enterprise RAG Document Intelligence', description: 'Production hybrid retrieval system with multi-format chunking, pgvector indexing, and reranking.', tech_stack: ['Python', 'FastAPI', 'pgvector', 'LangChain'], category: 'RAG Infrastructure', featured: true, order_index: 1 },
          { id: 2, title: 'Autonomous Multi-Agent Orchestrator', description: 'Stateful agent runtime built with LangGraph and Model Context Protocol (MCP) for complex workflows.', tech_stack: ['LangGraph', 'Python', 'MCP', 'FastAPI'], category: 'Agentic AI', featured: true, order_index: 2 },
          { id: 3, title: 'Low-Latency Streaming AI Platform', description: 'High-concurrency chat and inference proxy supporting streaming responses and model routing.', tech_stack: ['FastAPI', 'Redis', 'OpenAI', 'React.js'], category: 'LLM Systems', featured: true, order_index: 3 },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section
        id="section-3"
        className="scroll-section"
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <div style={{ maxWidth: '960px', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-badge project-metadata">
              <span>◈</span> Featured Systems Deployment (Max 12)
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <h2 className="headline-section" style={{ margin: 0 }}>
                Featured <span className="identity-champagne">AI Products</span>.
              </h2>
            </div>

            {loading ? (
              <Loader label="Fetching featured AI systems..." />
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem',
                  }}
                >
                  {featuredProjects.slice(0, 12).map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} onClick={setSelected} />
                  ))}
                </div>

                {/* Prominent "Explore All Projects" Call-to-Action Button Below Grid */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                  <a
                    href="/projects"
                    onClick={(e) => {
                      e.preventDefault()
                      window.history.pushState({}, '', '/projects')
                      window.dispatchEvent(new Event('popstate'))
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '1rem 2.5rem',
                      fontSize: '16px',
                    }}
                  >
                    Explore All Engineered Projects <span className="btn-arrow">→</span>
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
