import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function OSNetworkBackground({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Very subtle AI network with extremely low opacity and slow movement
    const particles = []
    const particleCount = 18
    const maxDistance = 150

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08, // Slow, ambient movement
        vy: (Math.random() - 0.5) * 0.08,
        radius: Math.random() * 1.5 + 0.8,
        glow: Math.random() > 0.65, // Only some nodes glow
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw Connections first (below nodes)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)

          if (dist < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const alpha = (1 - dist / maxDistance) * (active ? 0.06 : 0.015)
            ctx.strokeStyle = `rgba(217, 200, 163, ${alpha})` // Subtle champagne connections
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw Nodes
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)

        if (p.glow) {
          // Subtle lime green glow for selected nodes
          const glowAlpha = active ? 0.28 : 0.05
          ctx.fillStyle = `rgba(184, 255, 79, ${glowAlpha})`
          ctx.shadowBlur = active ? 8 : 1
          ctx.shadowColor = '#B8FF4F'
        } else {
          // Monochrome muted node
          const dotAlpha = active ? 0.12 : 0.03
          ctx.fillStyle = `rgba(141, 148, 152, ${dotAlpha})`
          ctx.shadowBlur = 0
        }
        ctx.fill()
        ctx.shadowBlur = 0 // Reset shadow
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default function Footer() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.25 })

  const [status, setStatus] = useState('CONNECTING...')
  const [secureConnection, setSecureConnection] = useState('ESTABLISHING...')

  useEffect(() => {
    if (isInView) {
      const t1 = setTimeout(() => {
        setStatus('CONNECTED')
        setSecureConnection('SECURE HANDSHAKE')
      }, 900)

      const t2 = setTimeout(() => {
        setStatus('ONLINE')
        setSecureConnection('ESTABLISHED')
      }, 2000)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isInView])

  return (
    <footer
      ref={containerRef}
      className="os-footer"
      id="section-footer"
    >
      {/* Background AI connection network */}
      <OSNetworkBackground active={isInView} />

      {/* Top champagne line separating contact section and footer */}
      <div className={`os-footer-divider ${isInView ? 'active' : ''}`} style={{ marginBottom: '4rem' }} />

      <div className="os-footer-container">
        {/* Main Content Layout Grid */}
        <div className="os-footer-main">

          {/* ZONE 1: Large Closing Philosophy */}
          <div className="os-footer-zone1">
            <motion.h2
              className="os-footer-philosophy"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Intelligence isn't built by models.
              <br />
              It's built by systems.
            </motion.h2>

            <motion.p
              className="os-footer-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Every intelligent product begins with thoughtful engineering, elegant architecture, and relentless curiosity.
            </motion.p>
          </div>

          {/* ZONE 2: Technical Status Panel */}
          <motion.div
            className="os-footer-zone2"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="os-footer-panel-header">
              SYSTEM // AKASH
            </div>

            <div className="os-footer-panel-item">
              <span className="os-footer-panel-label">Status</span>
              <span className={`os-footer-panel-val ${status === 'ONLINE' ? 'lime-glow' : ''}`}>
                {status}
              </span>
            </div>

            <div className="os-footer-panel-item">
              <span className="os-footer-panel-label">Current Mission</span>
              <span className="os-footer-panel-val">Designing Intelligent Systems</span>
            </div>

            <div className="os-footer-panel-item">
              <span className="os-footer-panel-label">Research Areas</span>
              <div className="os-footer-panel-val">
                <ul>
                  <li>• Agentic AI</li>
                  <li>• Large Language Models</li>
                  <li>• Retrieval-Augmented Generation</li>
                  <li>• AI Infrastructure</li>
                </ul>
              </div>
            </div>

            <div className="os-footer-panel-item">
              <span className="os-footer-panel-label">Location</span>
              <span className="os-footer-panel-val">Coimbatore</span>
            </div>

            <div className="os-footer-panel-item">
              <span className="os-footer-panel-label">Secure Connection</span>
              <span className={`os-footer-panel-val ${secureConnection === 'ESTABLISHED' ? 'lime-glow' : ''}`}>
                {secureConnection}
              </span>
            </div>

            <div className="os-footer-panel-item" style={{ marginBottom: 0 }}>
              <span className="os-footer-panel-label">Availability</span>
              <span className="os-footer-panel-val lime-glow">
                OPEN FOR COLLABORATION
              </span>
            </div>
          </motion.div>
        </div>

        {/* Divider Line */}
        <div className={`os-footer-divider ${isInView ? 'active' : ''}`} />

        {/* ZONE 3: Final Signature */}
        <div className="os-footer-signature">
          <motion.div
            className="os-footer-sig-left"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="os-footer-sig-name">AKASH PG</div>
            <div>AI Engineer</div>
            <div>System Architect</div>
            <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary-os)' }}>Built with curiosity.</div>
          </motion.div>

          <motion.div
            className="os-footer-sig-right"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
          >
            <div>© 2026</div>
            <div>End of Transmission.</div>
            <div>Session Closed.</div>
            <div className="terminal-exit" style={{ marginTop: '0.5rem' }}>
              $ exit<span className="cursor-blink">_</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
