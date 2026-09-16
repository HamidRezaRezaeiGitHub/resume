import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { resume } from '@/data/resume'
import { CategoryLegend } from '@/components/CategoryLegend'
import { TimelineItem } from '@/components/timeline/TimelineItem'

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  const entries = [...resume.timeline].sort((a, b) => b.startYear - a.startYear)

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          {resume.sections.timeline.eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {resume.sections.timeline.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          {resume.sections.timeline.description}
        </p>
        <CategoryLegend className="mt-6" />
      </div>

      <div ref={containerRef} className="relative">
        {/* Rail track */}
        <div className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-border md:left-1/2" />
        {/* Scroll-linked progress rail */}
        <motion.div
          style={{ scaleY }}
          className="absolute left-4 top-0 h-full w-px origin-top -translate-x-1/2 bg-foreground md:left-1/2"
        />

        <ol className="space-y-16">
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              index={index}
              side={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}
