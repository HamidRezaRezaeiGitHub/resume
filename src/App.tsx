import { ScrollProgress } from '@/components/ScrollProgress'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Hero } from '@/components/Hero'
import { Timeline } from '@/components/timeline/Timeline'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <>
      <ScrollProgress />
      <ThemeToggle className="fixed right-5 top-5 z-50" />
      <main>
        <Hero />
        <Timeline />
      </main>
      <Footer />
    </>
  )
}

export default App
