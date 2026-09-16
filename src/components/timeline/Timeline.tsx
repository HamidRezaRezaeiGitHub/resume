import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'
import { resume } from '@/data/resume'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { formatCareerPeriod } from '@/lib/dates'
import { Reveal } from '@/components/Reveal'

export function Timeline() {
  const entries = [...resume.timeline].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  )
  const [activeId, setActiveId] = useState(entries[0].id)
  const active = entries.find((entry) => entry.id === activeId) ?? entries[0]
  const railRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start center', 'end center'],
  })
  return (
    <section
      id="experience"
      className="section journey-section"
      aria-labelledby="experience-title"
    >
      <div className="container journey-grid">
        <aside className="journey-aside">
          <div className="journey-sticky">
            <Reveal>
              <p className="eyebrow">{resume.sections.timeline.eyebrow}</p>
              <h2 id="experience-title" tabIndex={-1}>
                {resume.sections.timeline.title}
              </h2>
              <p className="section-description">
                {resume.sections.timeline.description}
              </p>
            </Reveal>
            <div className="career-clock" aria-hidden="true">
              <span className="eyebrow">The chapter</span>
              <div className="career-year" key={active.startDate}>
                {active.startDate.slice(0, 4)}
                <span>↘</span>
              </div>
              <span className="mono">
                {formatCareerPeriod(active.startDate, active.endDate)}
              </span>
            </div>
            <p className="career-note">{resume.careerNote}</p>
            <a className="text-link" href="#work">
              See the work behind the roles <ArrowDownRight size={18} />
            </a>
          </div>
        </aside>
        <div ref={railRef} className="journey-content">
          <div className="journey-mobile-index" aria-hidden="true">
            <span className="eyebrow">The chapter</span>
            <span className="mono">
              {formatCareerPeriod(active.startDate, active.endDate)}
            </span>
          </div>
          <div className="timeline-rail" aria-hidden="true">
            <motion.div
              className="timeline-fill"
              style={{ scaleY: reduced ? 1 : scrollYProgress }}
            />
          </div>
          <ol className="timeline-list">
            {entries.map((entry, index) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                index={index}
                active={activeId === entry.id}
                onEnter={() => setActiveId(entry.id)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
