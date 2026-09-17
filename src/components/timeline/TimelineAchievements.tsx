import { useRef, type RefObject } from 'react'
import { useScroll, useTransform } from 'motion/react'
import type { TimelineHighlight } from '@/data/resume'
import { useTimelineDeck } from '@/hooks/useTimelineDeck'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { TimelineAchievement } from '@/components/timeline/TimelineAchievement'

export function TimelineAchievements({
  items,
  label,
  headingRef,
}: {
  items: TimelineHighlight[]
  label: string
  headingRef: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotionPreference()
  const layout = useTimelineDeck(ref, headingRef, reduced)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Measure normal flow, not the sticky/animated children's positions.
  const distance = useTransform(
    scrollYProgress,
    (progress) =>
      progress * ((layout?.height ?? 0) + (layout?.viewport ?? 0)) -
      (layout?.viewport ?? 0),
  )

  return (
    <ul
      ref={ref}
      className={`chapter-achievements${layout ? ' story-deck' : ''}`}
      aria-label={label}
    >
      {items.map((item, index) => (
        <TimelineAchievement
          key={item.id}
          item={item}
          index={index}
          count={items.length}
          distance={distance}
          frame={layout?.frames[index]}
        />
      ))}
    </ul>
  )
}
