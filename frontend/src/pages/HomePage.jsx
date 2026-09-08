import { useEffect } from 'react'
import { motion } from 'framer-motion'
import usePortfolioStore from '../store/portfolioStore'

import LoadingScreen from '../components/ui/LoadingScreen'
import CosmosMap from '../components/ui/CosmosMap'
import BackToTop from '../components/ui/BackToTop'

import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Seminar from '../components/sections/Seminar'
import Contact from '../components/sections/Contact'
import Footer from '../components/sections/Footer'

const SECTION_IDS = ['section-0', 'section-1', 'section-2', 'section-3', 'section-4', 'section-5']

export default function HomePage() {
  const isLoading = usePortfolioStore((s) => s.isLoading)
  const setIsLoading = usePortfolioStore((s) => s.setIsLoading)
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection)

  // Track which section is in view so the nav can highlight it.
  useEffect(() => {
    if (isLoading) return undefined

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
  }, [setActiveSection, isLoading])

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <CosmosMap />
        </motion.div>
      )}

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

      <BackToTop />
    </>
  )
}
