import { useEffect, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import usePortfolioStore from './store/portfolioStore'
import useMousePosition from './hooks/useMousePosition'

import NeuralCosmos from './components/canvas/NeuralCosmos'
import CustomCursor from './components/ui/CustomCursor'

import HomePage from './pages/HomePage'
import AllProjectsPage from './pages/AllProjectsPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  // Select individually. `usePortfolioStore()` with no selector returns the whole
  // state object, which is replaced on every set() - including the setMouse call
  // fired on each mousemove - re-rendering this component and everything below it.
  const theme = usePortfolioStore((s) => s.theme)
  const navigate = useNavigate()
  useMousePosition()

  // Applied here rather than in ThemeSwitch so routes that don't render the
  // switch still honour the stored preference.
  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', theme === 'light')
  }, [theme])

  // Unadvertised admin shortcut: Ctrl/Cmd + Alt + A.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        navigate('/admin')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <>
      <CustomCursor />

      {/* Three.js background canvas - fixed fullscreen, behind every route */}
      <div className="canvas-container">
        <Suspense fallback={null}>
          <NeuralCosmos />
        </Suspense>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
