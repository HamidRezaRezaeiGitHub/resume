import { ArrowUpRight } from 'lucide-react'
import { resume } from '@/data/resume'

export function Hero() {
  return (
    <section
      id="top"
      tabIndex={-1}
      className="hero container"
      aria-labelledby="hero-title"
    >
      <p className="hero-location">{resume.profile.location}</p>
      <h1 id="hero-title" tabIndex={-1}>
        {resume.profile.name}
      </h1>
      <p className="hero-headline">{resume.profile.headline}</p>
      <p className="hero-summary">{resume.profile.summary}</p>
      <div className="hero-links">
        {resume.profile.links.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            {link.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  )
}
