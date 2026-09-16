import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, Pause, Play, X } from 'lucide-react'
import { resume } from '@/data/resume'

export function Nav({
  paused,
  onToggleMotion,
}: {
  paused: boolean
  onToggleMotion: () => void
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )
    resume.navigation.forEach(({ sectionId }) => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })
    const top = document.getElementById('top')
    if (top) observer.observe(top)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open])
  const navigate = (id: string) => {
    setOpen(false)
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true })
  }
  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <a
          className="brand"
          href="#top"
          aria-label={`${resume.profile.name} — home`}
          onClick={() => setOpen(false)}
        >
          hr<span className="brand-dot">.</span>
        </a>
        <div className="desktop-links">
          {resume.navigation.slice(0, 5).map((link) => (
            <a
              key={link.sectionId}
              href={`#${link.sectionId}`}
              aria-current={active === link.sectionId ? 'location' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button
            className="icon-button motion-control"
            type="button"
            onClick={onToggleMotion}
            aria-label={
              paused ? 'Resume decorative motion' : 'Pause decorative motion'
            }
            aria-pressed={paused}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <a className="nav-contact" href="#contact">
            Let’s talk <ArrowUpRight size={16} />
          </a>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div
          className="mobile-navigation"
          id="mobile-navigation"
          hidden={!open}
        >
          <p className="eyebrow">Find your way</p>
          {resume.navigation.map((link, i) => (
            <a
              key={link.sectionId}
              href={`#${link.sectionId}`}
              aria-current={active === link.sectionId ? 'location' : undefined}
              onClick={() => navigate(link.sectionId)}
            >
              <span className="mono">0{i + 1}</span>
              {link.label}
              <ArrowUpRight size={20} />
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
