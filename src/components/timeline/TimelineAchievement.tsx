import { useRef } from 'react'
import { motion, useScroll, useReducedMotion, useTransform } from 'motion/react'
import type { TimelineHighlight } from '@/data/resume'
import { formatCareerDate } from '@/lib/dates'
import { TechnologyList } from '@/components/timeline/TechnologyList'

export function TimelineAchievement({
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
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [18, 0, 0, -12])
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
        {item.tags && <TechnologyList items={item.tags} />}
      </motion.div>
    </li>
  )
}
