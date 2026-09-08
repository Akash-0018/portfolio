import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { loginAdmin } from '../services/api'

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginAdmin(username, password)
      if (res.data && res.data.access_token) {
        localStorage.setItem('admin_token', res.data.access_token)
        onLoginSuccess()
        window.location.reload()
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 50,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--bg-void)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-minimal"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          borderColor: 'var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="identity-champagne" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            ◈
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Admin Control Center
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            System Access Required
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(255, 95, 95, 0.1)',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              fontSize: '0.8rem',
              textAlign: 'center',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              IDENTITY / EMAIL
            </label>
            <input
              type="text"
              className="input-minimal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="akashcse018@gmail.com"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              SECRET ACCESS KEY
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-minimal"
                style={{ paddingRight: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.2rem',
                  transition: 'color 0.2s ease',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} style={{ color: 'var(--lime)' }} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            ← Return to Site
          </a>
        </div>
      </motion.div>
    </div>
  )
}
