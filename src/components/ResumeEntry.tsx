import { useEffect, useId, useState } from 'react'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
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
  const [expanded, setExpanded] = useState(false)
  const detailsId = useId()
  const hasDetails = Boolean(bullets?.length)

  useEffect(() => {
    if (!bullets?.length) return
    // Keep existing bullet URLs usable even when their entry starts collapsed.
    let frame = 0
    const revealFragment = () => {
      const bullet = bullets?.find(
        ({ id: bulletId }) => window.location.hash === `#${bulletId}`,
      )
      if (!bullet) return
      setExpanded(true)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        document.getElementById(bullet.id)?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        })
      })
    }
    frame = requestAnimationFrame(revealFragment)
    window.addEventListener('hashchange', revealFragment)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', revealFragment)
    }
  }, [bullets])

  return (
    <article id={id} className="resume-entry" aria-labelledby={`${id}-title`}>
      <header
        className={`entry-header${hasDetails ? ' entry-disclosure' : ''}`}
      >
        <div className="entry-identity">
          <h3 id={`${id}-title`}>
            {hasDetails ? (
              <button
                type="button"
                className="entry-toggle"
                aria-expanded={expanded}
                aria-controls={detailsId}
                onClick={() => setExpanded((value) => !value)}
              >
                {title}
                <span className="entry-toggle-icon" aria-hidden="true">
                  {expanded ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
            ) : (
              title
            )}
          </h3>
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
      {hasDetails && (
        <ul id={detailsId} className="entry-bullets" hidden={!expanded}>
          {bullets?.map((bullet) => (
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
