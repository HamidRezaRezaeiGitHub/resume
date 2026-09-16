import { ArrowUp } from 'lucide-react'
import { resume } from '@/data/resume'
export function Footer() {
  return (
    <footer className="site-footer dark-section">
      <div className="container">
        <p>
          © {new Date().getFullYear()} {resume.profile.name}
        </p>
        <span className="mono">THOUGHTFULLY ENGINEERED.</span>
        <a href="#top" className="text-link">
          Back to top
          <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  )
}
