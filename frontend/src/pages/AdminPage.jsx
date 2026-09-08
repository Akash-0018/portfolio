import { useEffect, useState } from 'react'
import { verifyAuth } from '../services/api'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

/**
 * Gate for the admin area: verifies the stored token before deciding whether to
 * show the dashboard or the login form.
 */
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    const token = localStorage.getItem('admin_token')
    if (!token) {
      setIsAuthenticated(false)
      setAuthChecking(false)
      return () => {
        cancelled = true
      }
    }

    verifyAuth()
      .then(() => {
        if (!cancelled) setIsAuthenticated(true)
      })
      .catch(() => {
        if (!cancelled) setIsAuthenticated(false)
      })
      .finally(() => {
        if (!cancelled) setAuthChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
  }

  if (authChecking) {
    return (
      <div
        className="project-metadata"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          background: 'var(--bg-void)',
          position: 'relative',
          zIndex: 50,
        }}
      >
        Authenticating...
      </div>
    )
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  )
}
