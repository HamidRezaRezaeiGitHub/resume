import { resume } from '@/data/resume'
import { Section } from '@/components/Section'
import { ResumeEntry } from '@/components/ResumeEntry'

export function Experiences() {
  return (
    <Section id="experience" title={resume.sections.experience.title}>
      {resume.experiences.map((entry) => (
        <ResumeEntry
          key={entry.id}
          {...entry}
          subtitle={[entry.team, entry.organization]
            .filter(Boolean)
            .join(' · ')}
        />
      ))}
    </Section>
  )
}
