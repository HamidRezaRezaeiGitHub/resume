import { useState } from 'react'
import { MotionConfig } from 'motion/react'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Timeline } from '@/components/timeline/Timeline'
import { CaseStudies } from '@/components/CaseStudies'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

function App() {
  const [paused, setPaused] = useState(false)
  return (
    <MotionConfig reducedMotion="user">
      <div className={paused ? 'site motion-paused' : 'site'}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollProgress />
        <Nav paused={paused} onToggleMotion={() => setPaused(!paused)} />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Timeline />
          <CaseStudies />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
export default App
