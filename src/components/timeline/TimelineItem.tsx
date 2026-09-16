import { useRef } from 'react'
import { motion, useScroll, useReducedMotion, useTransform } from 'motion/react'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  BookOpen,
} from 'lucide-react'
import { categories, type TimelineEntry } from '@/data/resume'
import type { TimelineHighlight } from '@/data/resume.schema'
import { formatCareerDate } from '@/lib/dates'

const icons = {
  experience: BriefcaseBusiness,
  project: Code2,
  education: GraduationCap,
  teaching: BookOpen,
}

function Achievement({
  item,
  index,
}: {
  item: TimelineHighlight
  index: number
}) {
  const ref = useRef<HTMLLIElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.72, 1],
    [0.3, 1, 1, 0.3],
  )
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [45, 0, 0, -25])
  return (
    <li ref={ref} id={item.id} className="chapter-story">
      <motion.div
        className="story-content"
        style={reduced ? undefined : { opacity, y }}
      >
        <p className="story-number mono">
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          {item.date && (
            <time dateTime={item.date}>{formatCareerDate(item.date)}</time>
          )}
        </p>
        {item.metric && (
          <div className="story-metric">
            <strong>{item.metric.value}</strong>
            <span>{item.metric.label}</span>
          </div>
        )}
        <h4>{item.title}</h4>
        <p className="story-body">{item.body}</p>
        {item.details && (
          <ul className="story-details">
            {item.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}
        {item.tags && (
          <ul className="inline-tags" aria-label="Technologies">
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </motion.div>
    </li>
  )
}

export function TimelineItem({
  entry,
  index,
}: {
  entry: TimelineEntry
  index: number
}) {
  const ref = useRef<HTMLLIElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })
  const Icon = icons[entry.category]
  return (
    <li
      ref={ref}
      id={entry.id}
      className={`timeline-chapter category-${entry.category} ${entry.highlights ? 'has-stories' : 'compact-chapter'}`}
    >
      <div className="chapter-rail" aria-hidden="true">
        <motion.div style={{ scaleY: reduced ? 1 : scrollYProgress }} />
      </div>
      <article className="chapter-grid" aria-labelledby={`${entry.id}-title`}>
        <header className="chapter-heading">
          <div className="chapter-date-row">
            <p className="chapter-date mono">
              <time dateTime={entry.startDate}>
                {formatCareerDate(entry.startDate)}
              </time>
              {entry.endDate && (
                <>
                  <span aria-hidden="true"> — </span>
                  {entry.endDate === 'present' ? (
                    <span>Present</span>
                  ) : (
                    <time dateTime={entry.endDate}>
                      {formatCareerDate(entry.endDate)}
                    </time>
                  )}
                </>
              )}
            </p>
            <span className="chapter-index mono" aria-hidden="true">
              / {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <span className="chapter-year" aria-hidden="true">
            {entry.startDate.slice(0, 4)}
          </span>
          <div className="chapter-category">
            <span className="chapter-marker">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>{categories[entry.category].label}</span>
            {entry.stage && (
              <span className="chapter-stage">{entry.stage}</span>
            )}
          </div>
          <p className="chapter-organization">{entry.organization}</p>
          <h3 id={`${entry.id}-title`}>{entry.title}</h3>
          {entry.team && <p className="chapter-team">{entry.team}</p>}
          {entry.location && (
            <p className="chapter-location">{entry.location}</p>
          )}
        </header>
        <div className="chapter-body">
          <div className="chapter-overview">
            <p>{entry.summary}</p>
            {entry.tags && (
              <ul className="inline-tags" aria-label="Technologies">
                {entry.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}
            {entry.links && (
              <div className="chapter-links">
                {entry.links.map((link) => (
                  <a
                    className="text-link"
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${entry.title} — ${link.label}`}
                  >
                    {link.label}
                    <ArrowUpRight size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>
          {entry.highlights && (
            <ul
              className="chapter-achievements"
              aria-label={`${entry.team ?? entry.title} achievements`}
            >
              {entry.highlights.map((item, i) => (
                <Achievement item={item} index={i} key={item.id} />
              ))}
            </ul>
          )}
        </div>
      </article>
    </li>
  )
}
