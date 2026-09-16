import { resume } from '@/data/resume'
import { ThemeToggle } from '@/components/ThemeToggle'

/** Initials for the compact brand mark. */
const initials = resume.profile.name
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
          {resume.navigation.map((link) => (
            <li key={link.sectionId}>
              <a
                href={`#${link.sectionId}`}
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
