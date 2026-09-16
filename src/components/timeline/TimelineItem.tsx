import { useRef } from 'react'
import { motion, useScroll, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import type { TimelineEntry } from '@/data/resume'
import { TimelineHeading } from '@/components/timeline/TimelineHeading'
import { TimelineAchievement } from '@/components/timeline/TimelineAchievement'
import { TechnologyList } from '@/components/timeline/TechnologyList'

export function TimelineItem({
  entry,
  index,
  isCurrent,
  categoryLabel,
}: {
  entry: TimelineEntry
  index: number
  isCurrent: boolean
  categoryLabel: string
}) {
  const ref = useRef<HTMLLIElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })
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
        <TimelineHeading
          entry={entry}
          index={index}
          isCurrent={isCurrent}
          categoryLabel={categoryLabel}
        />
        <div className="chapter-body">
          <div className="chapter-overview">
            <p>{entry.summary}</p>
            {entry.tags && <TechnologyList items={entry.tags} />}
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
                <TimelineAchievement item={item} index={i} key={item.id} />
              ))}
            </ul>
          )}
        </div>
      </article>
    </li>
  )
}
