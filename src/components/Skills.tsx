import { resume } from '@/data/resume'
import { Section } from '@/components/Section'

export function Skills() {
  return (
    <Section id="skills" title={resume.sections.skills.title}>
      <dl className="skill-categories">
        {resume.skillGroups.map((group) => (
          <div className="skill-category" key={group.title}>
            <dt>{group.title}</dt>
            <dd>{group.skills.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
