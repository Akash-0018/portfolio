import { useState } from 'react'
import { motion } from 'framer-motion'
import { submitContact, describeApiError } from '../../services/api'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/akashpg', icon: '◈' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/akashpg', icon: '◈' },
  { label: 'Email', href: 'mailto:akashcse018@gmail.com', icon: '◈' },
]



export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      // Surfaces the 429 from the rate limiter, not just a generic failure.
      setErrorMessage(describeApiError(err, 'Transmission failed. Please retry.'))
      setStatus('error')
    }
  }

  return (
    <section
      id="section-5"
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
            <span>◈</span> Direct Communication
          </div>

          <h2 className="headline-section" style={{ marginBottom: '2.5rem' }}>
            Initiate <span className="identity-champagne">System Contact</span>.
          </h2>

          <div className="contact-grid">
            {/* Direct Links */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-minimal"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.25rem 1.5rem',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="identity-champagne">{link.icon}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {link.label}
                      </span>
                    </div>
                    <span className="interactive-cta" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ↗
                    </span>
                  </a>
                ))}
              </div>

              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.8,
                }}
              >
                <div>LOCATION: COIMBATORE</div>
                <div>AVAILABILITY: OPEN TO CONSULTING</div>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="contact-inputs-row">
                <input
                  className="input-minimal"
                  name="name"
                  placeholder="IDENTITY / NAME"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="input-minimal"
                  name="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                className="input-minimal"
                name="subject"
                placeholder="SUBJECT / PURPOSE"
                value={form.subject}
                onChange={handleChange}
              />
              <textarea
                className="input-minimal"
                name="message"
                placeholder="TRANSMIT MESSAGE / REQUIREMENTS..."
                value={form.message}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'loading'}
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                {status === 'loading' ? 'Transmitting...' : status === 'success' ? '✓ Message Transmitted' : 'Send Message →'}
              </button>

              {status === 'error' && (
                <p style={{ color: 'var(--error)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                  {errorMessage || 'Transmission failed. Please retry.'}
                </p>
              )}
            </form>
          </div>


        </motion.div>
      </div>
    </section>
  )
}
