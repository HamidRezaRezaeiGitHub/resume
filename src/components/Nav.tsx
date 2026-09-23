import { resume } from '@/data/resume'
import { ThemeToggle } from '@/components/ThemeToggle'

function focusSection(id: string) {
  document.getElementById(id)?.focus({ preventScroll: true })
}

export function Nav() {
  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <a
          className="brand"
          href="#top"
          aria-label={`${resume.profile.name} — home`}
          onClick={() => focusSection('top')}
        >
          hr<span>.</span>
        </a>
        <div className="section-links">
          {resume.navigation
            .filter((link) => link.sectionId !== 'contact')
            .map((link) => (
              <a
                key={link.sectionId}
                href={`#${link.sectionId}`}
                onClick={() => focusSection(link.sectionId)}
              >
                {link.label}
              </a>
            ))}
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          {resume.navigation
            .filter((link) => link.sectionId === 'contact')
            .map((link) => (
              <a
                key={link.sectionId}
                className="nav-contact"
                href="#contact"
                onClick={() => focusSection('contact')}
              >
                {link.label}
              </a>
            ))}
        </div>
      </nav>
    </header>
  )
}
