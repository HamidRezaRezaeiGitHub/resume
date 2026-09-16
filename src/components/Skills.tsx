import { useState } from 'react'
import { Asterisk } from 'lucide-react'
import { resume } from '@/data/resume'
import { Section } from '@/components/Section'

export function Skills() {
  const [selected, setSelected] = useState('Overview')
  const overview = [
    'Java',
    'Spring Boot',
    'React',
    'TypeScript',
    'PostgreSQL',
    'GCP',
    'Docker',
    'Jenkins',
    'Spring AI',
    'MCP',
    'GitHub Actions',
    'BigQuery',
  ]
  const skills =
    selected === 'Overview'
      ? overview
      : resume.skillGroups.find((group) => group.title === selected)!.skills
  return (
    <Section id="skills" className="skills-section" {...resume.sections.skills}>
      <div
        className="skill-filters"
        role="group"
        aria-label="Filter skills by discipline"
      >
        {['Overview', ...resume.skillGroups.map((group) => group.title)].map(
          (title) => (
            <button
              type="button"
              key={title}
              className={selected === title ? 'selected' : ''}
              aria-pressed={selected === title}
              aria-controls="skill-cloud"
              onClick={() => setSelected(title)}
            >
              {title}
            </button>
          ),
        )}
      </div>
      <div className="skill-cloud-wrap">
        <span className="skill-cross skill-cross-top" aria-hidden="true">
          +
        </span>
        <span className="skill-cross skill-cross-bottom" aria-hidden="true">
          +
        </span>
        <ul
          className="skill-cloud"
          key={selected}
          id="skill-cloud"
          aria-label={`${selected} skills`}
          aria-live="polite"
        >
          {skills.map((skill, i) => (
            <li
              key={skill}
              className={`cloud-word cloud-word-${i % 5}`}
              style={{ animationDelay: `${i * -0.45}s` }}
            >
              {skill}
              {i === 1 && <Asterisk aria-hidden="true" />}
            </li>
          ))}
        </ul>
      </div>
      <p className="toolkit-note mono">THE RIGHT TOOL. THE WHOLE PICTURE.</p>
    </Section>
  )
}
