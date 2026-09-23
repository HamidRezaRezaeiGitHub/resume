import { ArrowUpRight } from 'lucide-react'
import { formatCareerDate } from '@/lib/dates'
import type { CareerPeriod, ResumeBullet } from '@/data/resume'

type ResumeEntryProps = CareerPeriod & {
  id: string
  title: string
  subtitle: string
  location?: string
  stage?: string
  bullets?: ResumeBullet[]
  links?: { label: string; url: string }[]
}

export function ResumeEntry({
  id,
  title,
  subtitle,
  location,
  stage,
  startDate,
  endDate,
  bullets,
  links,
}: ResumeEntryProps) {
  return (
    <article id={id} className="resume-entry" aria-labelledby={`${id}-title`}>
      <header className="entry-header">
        <div className="entry-identity">
          <h3 id={`${id}-title`}>{title}</h3>
          <p className="entry-subtitle">{subtitle}</p>
          {location && <p className="entry-location">{location}</p>}
        </div>
        <p className="entry-date">
          <time dateTime={startDate}>{formatCareerDate(startDate)}</time>
          {' — '}
          {endDate === 'present' ? (
            'Present'
          ) : (
            <time dateTime={endDate}>{formatCareerDate(endDate)}</time>
          )}
        </p>
      </header>
      {stage && <p className="entry-stage">{stage}</p>}
      {bullets && (
        <ul className="entry-bullets">
          {bullets.map((bullet) => (
            <li key={bullet.id} id={bullet.id}>
              {bullet.text}
            </li>
          ))}
        </ul>
      )}
      {links && (
        <div className="entry-links">
          {links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </article>
  )
}
