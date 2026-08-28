import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import usePortfolioStore from './store/portfolioStore'
import useMousePosition from './hooks/useMousePosition'
import { verifyAuth } from './services/api'

// Canvas
import NeuralCosmos from './components/canvas/NeuralCosmos'

// UI
import LoadingScreen from './components/ui/LoadingScreen'
import CustomCursor from './components/ui/CustomCursor'
import CosmosMap from './components/ui/CosmosMap'
import BackToTop from './components/ui/BackToTop'

// Sections
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Seminar from './components/sections/Seminar'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'

// Pages
import AllProjectsPage from './pages/AllProjectsPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

const SECTION_IDS = ['section-0', 'section-1', 'section-2', 'section-3', 'section-4', 'section-5']

export default function App() {
  const { isLoading, setIsLoading, setActiveSection } = usePortfolioStore()
  useMousePosition()

  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  const isAdminRoute = currentPath.startsWith('/admin') || currentPath.startsWith('/login')
  const isAllProjectsRoute = currentPath.startsWith('/projects')

  // Listen to path changes & secret keyboard shortcut (Ctrl + Alt + A)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        window.history.pushState({}, '', '/admin')
        setCurrentPath('/admin')
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Verify token when on admin route
  useEffect(() => {
    if (isAdminRoute) {
      setAuthChecking(true)
      const token = localStorage.getItem('admin_token')
      if (!token) {
        setIsAuthenticated(false)
        setAuthChecking(false)
        return
      }
      verifyAuth()
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false))
        .finally(() => setAuthChecking(false))
    }
  }, [isAdminRoute])

  // IntersectionObserver to detect active section for main portfolio
  useEffect(() => {
    if (isAdminRoute || isAllProjectsRoute) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id)
            if (idx !== -1) setActiveSection(idx)
          }
        })
      },
      { threshold: 0.4 }
    )

    const sections = document.querySelectorAll('[id^="section-"]')
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [setActiveSection, isAdminRoute, isAllProjectsRoute])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
  }

  // Render Admin View if navigating to /admin or /login
  if (isAdminRoute) {
    return (
      <>
        <CustomCursor />
        <div className="canvas-container">
          <Suspense fallback={null}>
            <NeuralCosmos />
          </Suspense>
        </div>
        {authChecking ? (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
            Authenticating...
          </div>
        ) : isAuthenticated ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
      </>
    )
  }

  // Render Standalone All Projects Page if navigating to /projects
  if (isAllProjectsRoute) {
    return (
      <>
        <CustomCursor />
        <div className="canvas-container">
          <Suspense fallback={null}>
            <NeuralCosmos />
          </Suspense>
        </div>
        <AllProjectsPage />
      </>
    )
  }

  // Render Main Portfolio
  return (
    <>
      <CustomCursor />

      {/* Three.js background canvas — fixed fullscreen */}
      <div className="canvas-container">
        <Suspense fallback={null}>
          <NeuralCosmos />
        </Suspense>
      </div>

      {/* Loading overlay */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Navigation dots */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <CosmosMap />
        </motion.div>
      )}

      {/* Scrollable content */}
      {!isLoading && (
        <main className="scroll-container">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Seminar />
          <Contact />
          <Footer />
        </main>
      )}

      {/* Floating Back to Top Widget */}
      <BackToTop />
    </>
  )
}
