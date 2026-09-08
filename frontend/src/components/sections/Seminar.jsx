import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchSeminars } from '../../services/api'
import usePortfolioStore from '../../store/portfolioStore'
import Loader from '../ui/Loader'

const DEFAULT_SEMINARS = [
  {
    title: 'From ChatGPT to Autonomous AI Systems',
    organizer: 'ENTERPRISE AI FORUM',
    description: 'An advanced technical session focusing on shifting from simple chat prompts to stateful multi-agent systems. Explores LangGraph orchestration, state management, and loops.',
    tag: 'Seminar 01',
  }
]

export default function Seminar() {
  const [seminars, setSeminars] = useState([])
  const [loading, setLoading] = useState(true)
  const profile = usePortfolioStore((s) => s.profile)
  const loadProfile = usePortfolioStore((s) => s.loadProfile)
  const visible = profile?.show_seminar !== false

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    fetchSeminars()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSeminars(res.data)
        } else {
          setSeminars(DEFAULT_SEMINARS)
        }
      })
      .catch(() => {
        setSeminars(DEFAULT_SEMINARS)
      })
      .finally(() => setLoading(false))
  }, [])

  if (!visible) return null

  return (
    <section
      id="section-4"
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
          <div className="section-badge">
            <span>◈</span> Industry Workshops & Seminars
          </div>

          <h2 className="headline-section" style={{ marginBottom: '3rem' }}>
            Technical <span className="identity-champagne">Seminars & Speaking</span>.
          </h2>

          {loading ? (
            <Loader label="Loading technical seminars..." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {seminars.map((m, i) => (
              <motion.div
                key={m.title}
                className="card-minimal"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}
              >
                <div style={{ maxWidth: '640px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span className="identity-champagne" style={{ fontSize: '0.8rem' }}>◈</span>
                    <span className="identity-champagne" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                      {m.organizer}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {m.description}
                  </p>
                </div>

                <span
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.75rem',
                  }}
                >
                  {m.tag}
                </span>
              </motion.div>
            ))}
          </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

