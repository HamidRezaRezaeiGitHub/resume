import { resume } from '@/data/resume'
import { Section } from '@/components/Section'
import { ResumeEntry } from '@/components/ResumeEntry'

export function Education() {
  return (
    <Section id="education" title={resume.sections.education.title}>
      {resume.education.map((entry) => (
        <ResumeEntry
          key={entry.id}
          {...entry}
          title={`${entry.title} in ${entry.field}`}
          subtitle={entry.organization}
        />
      ))}
    </Section>
  )
}
