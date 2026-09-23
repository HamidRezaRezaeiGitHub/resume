import { ArrowDownRight, ArrowUpRight, MapPin } from 'lucide-react'
import { resume } from '@/data/resume'
import { ResumeDownload } from '@/components/ResumeDownload'

export function Hero() {
  return (
    <section
      id="top"
      tabIndex={-1}
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="container">
        <div className="hero-grid">
          <div className="hero-identity">
            <p className="hero-eyebrow">{resume.hero.eyebrow}</p>
            <h1 id="hero-title" tabIndex={-1}>
              {resume.profile.name}
            </h1>
          </div>
          <div className="hero-copy">
            <p className="hero-headline">{resume.profile.headline}</p>
            <p className="hero-summary">{resume.profile.summary}</p>
            <div className="hero-actions">
              <a className="hero-primary" href="#experience">
                {resume.hero.experienceLabel}
                <ArrowDownRight size={19} aria-hidden="true" />
              </a>
              <ResumeDownload />
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <p className="hero-location">
            <MapPin size={15} aria-hidden="true" />
            {resume.profile.location}
          </p>
          <div className="hero-links">
            {resume.profile.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
