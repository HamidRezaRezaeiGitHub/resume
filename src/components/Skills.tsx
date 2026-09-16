import { useState } from 'react'
import { Asterisk } from 'lucide-react'
import { resume } from '@/data/resume'
import { Section } from '@/components/Section'

const skillOptions = [
  { title: 'Overview', skills: resume.skillOverview },
  ...resume.skillGroups,
]

export function Skills() {
  const [selected, setSelected] = useState(skillOptions[0])
  return (
    <Section id="skills" className="skills-section" {...resume.sections.skills}>
      <div
        className="skill-filters"
        role="group"
        aria-label="Filter skills by discipline"
      >
        {skillOptions.map((option) => (
          <button
            type="button"
            key={option.title}
            className={selected === option ? 'selected' : ''}
            aria-pressed={selected === option}
            aria-controls="skill-cloud"
            onClick={() => setSelected(option)}
          >
            {option.title}
          </button>
        ))}
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
          id="skill-cloud"
          aria-label={`${selected.title} skills`}
          aria-live="polite"
        >
          {selected.skills.map((skill, i) => (
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
    </Section>
  )
}
