import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchProjects, getImageUrl } from '../services/api'
import Loader from '../components/ui/Loader'
import BackToTop from '../components/ui/BackToTop'

const FALLBACK_PROJECTS = [
  { id: 1, title: 'Enterprise RAG Document Intelligence', description: 'Production hybrid retrieval system with multi-format chunking, pgvector indexing, and reranking.', tech_stack: ['Python', 'FastAPI', 'pgvector', 'LangChain'], category: 'RAG Infrastructure', featured: true, order_index: 1 },
  { id: 2, title: 'Autonomous Multi-Agent Orchestrator', description: 'Stateful agent runtime built with LangGraph and Model Context Protocol (MCP) for complex workflows.', tech_stack: ['LangGraph', 'Python', 'MCP', 'FastAPI'], category: 'Agentic AI', featured: true, order_index: 2 },
  { id: 3, title: 'Low-Latency Streaming AI Platform', description: 'High-concurrency chat and inference proxy supporting streaming responses and model routing.', tech_stack: ['FastAPI', 'Redis', 'OpenAI', 'React.js'], category: 'LLM Systems', featured: true, order_index: 3 },
  { id: 4, title: 'Automated Code Review Engine', description: 'Agentic code analysis system providing multi-stage security, performance, and architecture audits.', tech_stack: ['Python', 'FastAPI', 'GitHub API', 'Docker'], category: 'AI Operations', featured: false, order_index: 4 },
  { id: 5, title: 'Vector DB Benchmarking Toolkit', description: 'Performance comparison framework for Chroma, Qdrant, Pinecone, and pgvector under peak load.', tech_stack: ['Python', 'pgvector', 'ChromaDB', 'Locust'], category: 'Data & Indexing', featured: false, order_index: 5 },
  { id: 6, title: 'Semantic Cache & Gateway Proxy', description: 'Sub-millisecond LLM response cache utilizing embedding similarity matching to reduce API costs.', tech_stack: ['FastAPI', 'Redis', 'SentenceTransformers'], category: 'LLM Systems', featured: false, order_index: 6 },
]

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="identity-champagne project-metadata">
              ◈ {project.category || 'SYSTEM ARCHITECTURE'}
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
                ★ FEATURED SYSTEM
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

export default function AllProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const startTime = Date.now()
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
      .finally(() => {
        const elapsed = Date.now() - startTime
        const delay = Math.max(0, 2500 - elapsed)
        setTimeout(() => setLoading(false), delay)
      })
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
        background: '#121212',
        color: '#FFFFFF',
        padding: '6rem clamp(1.5rem, 5vw, 6rem)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '2rem' }}>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              window.history.pushState({}, '', '/')
              window.dispatchEvent(new Event('popstate'))
            }}
            className="project-metadata identity-champagne"
            style={{ textDecoration: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ← Back to System Overview
          </a>
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
