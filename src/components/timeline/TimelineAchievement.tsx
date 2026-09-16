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
    [0, 0.28, 0.82, 1],
    [0.35, 1, 1, 0.5],
  )
  // Separate entrance windows make the heading lead the supporting copy.
  // The static li owns measurement so animated children cannot shift the range.
  const x = useTransform(scrollYProgress, [0, 0.3, 0.82, 1], [48, 0, 0, -16])
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.82, 1],
    [-9, 0, 0, 3],
  )
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.82, 1],
    [0.94, 1, 1, 0.98],
  )
  const headingY = useTransform(scrollYProgress, [0.03, 0.25], [35, 0])
  const detailY = useTransform(scrollYProgress, [0.08, 0.36], [28, 0])
  const detailOpacity = useTransform(scrollYProgress, [0.08, 0.34], [0.45, 1])
  const lineScale = useTransform(scrollYProgress, [0.03, 0.36], [0, 1])
  return (
    <li ref={ref} id={item.id} className="chapter-story">
      <motion.span
        className="story-rule"
        aria-hidden="true"
        style={reduced ? undefined : { scaleX: lineScale }}
      />
      <motion.div
        className="story-content"
        style={reduced ? undefined : { opacity, x, rotateY, scale }}
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
        <div className="story-title-reveal">
          <motion.h4 style={reduced ? undefined : { y: headingY }}>
            {item.title}
          </motion.h4>
        </div>
        <motion.div
          className="story-support"
          style={reduced ? undefined : { y: detailY, opacity: detailOpacity }}
        >
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
      </motion.div>
    </li>
  )
}
