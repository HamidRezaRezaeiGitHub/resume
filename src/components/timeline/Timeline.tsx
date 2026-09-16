import { BriefcaseBusiness, Code2, GraduationCap, BookOpen } from 'lucide-react'
import { resume } from '@/data/resume'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { sortTimeline } from '@/lib/timeline'

const categoryIcons = {
  experience: BriefcaseBusiness,
  project: Code2,
  education: GraduationCap,
  teaching: BookOpen,
}

export function Timeline() {
  const entries = sortTimeline(resume.timeline, resume.currentRoleId)
  return (
    <section
      id="experience"
      className="timeline-section"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <div className="timeline-intro">
          <p className="eyebrow">{resume.sections.timeline.eyebrow}</p>
          <h2 id="experience-title" tabIndex={-1}>
            {resume.sections.timeline.title}
          </h2>
          <p className="section-description">
            {resume.sections.timeline.description}
          </p>
          <ul className="category-key" aria-label="Timeline categories">
            {resume.categories.map((category) => {
              const Icon = categoryIcons[category.id]
              return (
                <li key={category.id} className={`category-${category.id}`}>
                  <Icon size={16} aria-hidden="true" />
                  <span>{category.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <ol className="career-timeline">
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              index={index}
              isCurrent={entry.id === resume.currentRoleId}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}
