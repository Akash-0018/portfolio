import { motion } from 'framer-motion'

const STACK_GROUPS = [
  {
    title: 'Core AI & Agentic Systems',
    skills: ['LangGraph Orchestration', 'Multi-Agent Systems', 'Model Context Protocol (MCP)', 'RAG Pipelines', 'Fine-Tuning & Quantization', 'Dense Vector Search'],
  },
  {
    title: 'Backend Architecture',
    skills: ['Python / AsyncIO', 'FastAPI & SQLAlchemy', 'Django Enterprise', 'Redis Caching', 'PostgreSQL / pgvector', 'Docker Microservices'],
  },
  {
    title: 'AI Models & Vector DBs',
    skills: ['OpenAI / Anthropic APIs', 'Google Gemini Pro', 'Ollama Local LLMs', 'ChromaDB', 'Pinecone / Qdrant', 'HuggingFace Transformers'],
  },
  {
    title: 'Product & Frontend Integration',
    skills: ['React.js / Next.js', 'TypeScript', 'REST & WebSockets', 'Tailwind CSS', 'System Performance Tuning', 'CI/CD Pipelines'],
  },
]

export default function Skills() {
  return (
    <section
      id="section-2"
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
            <span>◈</span> Technology Stack & Capability Graph
          </div>

          <h2 className="headline-section" style={{ marginBottom: '2.5rem' }}>
            Production-proven <span className="identity-champagne">engineering stack</span>.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {STACK_GROUPS.map((group, gi) => (
              <motion.div
                key={group.title}
                className="card-minimal"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: gi * 0.1 }}
              >
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <span className="identity-champagne" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                    0{gi + 1}
                  </span>
                  {group.title}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05, borderColor: '#B8FF4F', color: '#B8FF4F' }}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.78rem',
                        cursor: 'default',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
