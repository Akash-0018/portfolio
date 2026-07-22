import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const raf = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x - 3}px, ${pos.current.y - 3}px, 0)`
      }
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.18
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px, 0)`
      }
      raf.current = requestAnimationFrame(loop)
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, [role="button"], .card-minimal, [data-cursor]')
      if (target && !target.classList.contains('secret-link')) {
        ringRef.current?.classList.add('hovering')
      } else {
        ringRef.current?.classList.remove('hovering')
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', handleMouseOver)
    raf.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
