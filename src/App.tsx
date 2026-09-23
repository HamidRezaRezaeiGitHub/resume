import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Experiences } from '@/components/Experiences'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { Education } from '@/components/Education'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Experiences />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
export default App
