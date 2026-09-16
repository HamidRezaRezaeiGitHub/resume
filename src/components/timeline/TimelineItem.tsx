import { motion } from 'motion/react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { categories, type TimelineEntry } from '@/data/resume'
import { formatCareerPeriod } from '@/lib/dates'
import { Reveal } from '@/components/Reveal'

export function TimelineItem({
  entry,
  index,
  active,
  onEnter,
}: {
  entry: TimelineEntry
  index: number
  active: boolean
  onEnter: () => void
}) {
  return (
    <motion.li
      id={entry.id}
      className={`timeline-item ${active ? 'is-active' : ''} category-${entry.category}`}
      onViewportEnter={onEnter}
      viewport={{ margin: '-20% 0px -45% 0px' }}
    >
      <span className="timeline-node" aria-hidden="true" />
      <Reveal>
        <article aria-labelledby={`${entry.id}-title`}>
          <div className="timeline-meta">
            <p className="mono">
              <time dateTime={entry.startDate}>
                {formatCareerPeriod(entry.startDate, entry.endDate)}
              </time>
            </p>
            {entry.endDate === 'present' && (
              <span className="current-label">Current</span>
            )}
          </div>
          <p className="timeline-organization">
            {entry.organization}
            <span>{categories[entry.category].label}</span>
          </p>
          <h3 id={`${entry.id}-title`}>{entry.title}</h3>
          {entry.team && <p className="timeline-team">{entry.team}</p>}
          <p className="timeline-summary">{entry.summary}</p>
          {entry.tags && (
            <ul className="inline-tags" aria-label="Technologies">
              {entry.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          {entry.highlights && (
            <details className="details">
              <summary>
                <span>
                  Inside the role
                  <span className="sr-only">: {entry.team ?? entry.title}</span>
                </span>
                <Plus size={18} />
              </summary>
              <ul className="detail-bullets">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </details>
          )}
          {entry.link && (
            <a
              href={entry.link.url}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              {entry.link.label}
              <ArrowUpRight size={16} />
            </a>
          )}
          <span className="timeline-item-number mono" aria-hidden="true">
            / 0{index + 1}
          </span>
        </article>
      </Reveal>
    </motion.li>
  )
}
