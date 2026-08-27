import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchProfile, getImageUrl } from '../../services/api'

const CAPABILITIES_SHOWCASE = [
  {
    title: 'AGENTIC AI WORKFLOWS',
    detail: 'LangGraph, Multi-Agent Teams & MCP Tools',
  },
  {
    title: 'ENTERPRISE RAG PIPELINES',
    detail: 'Hybrid Dense/Sparse Search & pgvector',
  },
  {
    title: 'PRODUCTION AI BACKENDS',
    detail: 'Async FastAPI, SQLAlchemy & Microservices',
  },
]

export default function Hero() {
  const DEFAULT_PHOTO = getImageUrl('/api/uploads/61a1449aa7134424907e483975873ec1.png')
  const [photoUrl, setPhotoUrl] = useState(DEFAULT_PHOTO)

  useEffect(() => {
    fetchProfile()
      .then((res) => {
        if (res.data?.photo_url) setPhotoUrl(res.data.photo_url)
      })
      .catch(() => { })
  }, [])

  return (
    <section
      id="section-0"
      className="scroll-section"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 clamp(2rem, 6vw, 6rem)',
        minHeight: '100vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hero-grid"
        style={{
          maxWidth: '1100px',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Hero Copy & Capabilities */}
        <div>
          {/* Project Metadata Badge */}
          <div className="section-badge project-metadata">
            <span>◈</span> AI Engineer & System Architect
          </div>

          {/* Hero Name (Canela, Medium, 84px) */}
          <h1 className="hero-name" style={{ marginBottom: '0.6rem' }}>
            Akash <span className="identity-champagne">PG</span>
          </h1>

          {/* Hero Heading (Canela, Medium, 72px) */}
          <h2 className="hero-heading" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Building Intelligent AI Systems & Enterprise RAG
          </h2>

          {/* Hero Description (Akkurat, Regular, 20px) */}
          <p className="hero-description" style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
            I design and engineer production-grade AI applications, LLM orchestration runtimes,
            vector search pipelines, and autonomous multi-agent architectures built for real-world reliability and scale.
          </p>

          {/* Authentic Engineering Capability Highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '1.25rem',
              paddingBottom: '2rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {CAPABILITIES_SHOWCASE.map((item) => (
              <div key={item.title}>
                <div
                  className="identity-champagne project-metadata"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    marginBottom: '0.3rem',
                  }}
                >
                  ◈ {item.title}
                </div>
                <div className="skill-name" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons (Akkurat, Medium, 16px) */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#section-3"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('section-3')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore Systems <span className="btn-arrow">→</span>
            </a>
            <a
              href="#section-5"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('section-5')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right Column: Architectural Pill Portrait (Inspired by reference image layout) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Subtle Outer Champagne Accent Ring Line */}
          <div
            style={{
              position: 'absolute',
              inset: '-12px',
              borderRadius: '160px',
              border: '1px solid rgba(217, 200, 163, 0.25)',
              pointerEvents: 'none',
              transform: 'rotate(-4deg)',
            }}
          />

          {/* Architectural Pill-Shaped Container */}
          <div
            style={{
              width: '100%',
              aspectRatio: '3 / 4',
              maxHeight: '440px',
              borderRadius: '140px',
              overflow: 'hidden',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(217, 200, 163, 0.15)',
              position: 'relative',
            }}
          >
            <img
              src={getImageUrl(photoUrl)}
              alt="Akash PG Portrait"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.95) contrast(1.05)',
                transition: 'transform 0.5s ease',
              }}
              onError={(e) => { e.target.src = DEFAULT_PHOTO }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
