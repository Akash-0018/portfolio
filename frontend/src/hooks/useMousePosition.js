import { useEffect, useRef } from 'react'
import usePortfolioStore from '../store/portfolioStore'

export function useMousePosition() {
  const setMouse = usePortfolioStore((s) => s.setMouse)
  const normalized = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      normalized.current = { x, y }
      setMouse(x, y)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [setMouse])

  return normalized
}

export default useMousePosition
