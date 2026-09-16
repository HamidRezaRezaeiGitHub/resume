import { profile } from '@/data/resume'
import { ThemeToggle } from '@/components/ThemeToggle'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

/** Initials for the compact brand mark. */
const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 3)

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a href="#top" className="font-bold tracking-tight" aria-label="Home">
          {initials}
          <span className="text-cat-experience">.</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle className="size-9" />
      </nav>
    </header>
  )
}
