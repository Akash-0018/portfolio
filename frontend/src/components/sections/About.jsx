import { motion } from 'framer-motion'

const PILLARS = [
  { label: 'Autonomous Agent Orchestration', desc: 'Stateful multi-agent workflows built with LangGraph, MCP tools, and deterministic fail-safes.' },
  { label: 'Production-Grade RAG Infrastructure', desc: 'Hybrid dense & sparse vector retrieval with multi-stage reranking and sub-second execution.' },
  { label: 'High-Throughput Async Backend', desc: 'Fault-tolerant FastAPI / SQLAlchemy services engineered for heavy AI workload concurrency.' },
  { label: 'System Architecture & Operations', desc: 'Containerized microservices designed around zero-downtime deployments and observability.' },
]

export default function About() {
  return (
    <section
      id="section-1"
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
            <span>◈</span> System Architecture & Philosophy
          </div>

          <h2 className="headline-section" style={{ marginBottom: '2.5rem', maxWidth: '780px' }}>
            Engineering AI products that feel like <span className="identity-champagne">operating systems</span>.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                className="card-minimal"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div
                  className="identity-champagne project-metadata"
                  style={{
                    marginBottom: '0.85rem',
                  }}
                >
                  0{i + 1} // ARCHITECTURE PILLAR
                </div>
                <h3 className="card-title" style={{ marginBottom: '0.65rem' }}>
                  {pillar.label}
                </h3>
                <p className="card-description">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
