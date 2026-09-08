import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchFeaturedProjects, getImageUrl } from '../../services/api'
import { FALLBACK_FEATURED_PROJECTS } from '../../constants/fallbackProjects'
import Loader from '../ui/Loader'
import ProjectModal from '../ui/ProjectModal'

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
      .catch(() => setFeaturedProjects(FALLBACK_FEATURED_PROJECTS))
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
                  <Link
                    to="/projects"
                    className="btn btn-primary"
                    style={{
                      padding: '1rem 2.5rem',
                      fontSize: '16px',
                    }}
                  >
                    Explore All Engineered Projects <span className="btn-arrow">→</span>
                  </Link>
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
