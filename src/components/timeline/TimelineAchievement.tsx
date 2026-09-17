import { motion, useTransform, type MotionValue } from 'motion/react'
import type { TimelineHighlight } from '@/data/resume'
import type { DeckFrame } from '@/lib/timeline-deck'
import { formatCareerDate } from '@/lib/dates'
import { TechnologyList } from '@/components/timeline/TechnologyList'

export function TimelineAchievement({
  item,
  index,
  count,
  distance,
  frame,
}: {
  item: TimelineHighlight
  index: number
  count: number
  distance: MotionValue<number>
  frame?: DeckFrame
}) {
  const progress = useTransform(distance, (value) =>
    frame ? (value - frame.start) / frame.travel : 0,
  )
  const opacity = useTransform(progress, [0, 0.35, 0.95], [1, 1, 0])
  const scale = useTransform(progress, [0, 1], [1, 0.9])
  const y = useTransform(progress, [0, 1], [0, -32])
  const rule = useTransform(progress, [0, 1], [1, 0])

  return (
    <li
      id={item.id}
      className="chapter-story"
      style={frame ? { top: frame.top } : undefined}
    >
      <motion.div
        className="story-content"
        style={frame ? { opacity, scale, y } : { opacity: 1, scale: 1, y: 0 }}
      >
        <motion.span
          className="story-rule"
          aria-hidden="true"
          style={{ scaleX: frame ? rule : 1 }}
        />
        <p className="story-number mono">
          <span aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
            <span className="story-count">
              {' '}
              / {String(count).padStart(2, '0')}
            </span>
          </span>
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
