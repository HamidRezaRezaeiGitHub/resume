import { ArrowUp } from 'lucide-react'
import { resume } from '@/data/resume'
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} {resume.profile.name}
        </p>
        <a href="#top" className="text-link">
          Back to top
          <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  )
}
