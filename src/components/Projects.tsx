import { resume } from '@/data/resume'
import { Section } from '@/components/Section'
import { ResumeEntry } from '@/components/ResumeEntry'

export function Projects() {
  return (
    <Section id="projects" title={resume.sections.projects.title}>
      {resume.projects.map((entry) => (
        <ResumeEntry key={entry.id} {...entry} subtitle={entry.role} />
      ))}
    </Section>
  )
}
