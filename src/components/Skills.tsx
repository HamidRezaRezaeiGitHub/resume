import { useState } from 'react'
import { List, Network } from 'lucide-react'
import { resume } from '@/data/resume'
import { skillsForGroup } from '@/data/skills'
import { Section } from '@/components/Section'
import { SkillsNetwork } from '@/components/skills/SkillsNetwork'
import '@/components/skills/skills.css'

export function Skills() {
  const [view, setView] = useState<'network' | 'list'>('network')
  return (
    <Section
      id="skills"
      title={resume.sections.skills.title}
      className="skills-section"
    >
      <div className="skills-intro">
        <div>
          <p className="eyebrow">{resume.sections.skills.eyebrow}</p>
          <p>{resume.sections.skills.description}</p>
        </div>
        <div
          className="skills-view-switch"
          role="group"
          aria-label="Skills view"
        >
          <button
            aria-pressed={view === 'network'}
            onClick={() => setView('network')}
          >
            <Network size={16} />
            Network
          </button>
          <button
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
          >
            <List size={16} />
            List
          </button>
        </div>
      </div>
      {view === 'network' && <SkillsNetwork />}
      <dl
        className={`skill-categories skills-list${view === 'network' ? ' print-only' : ''}`}
      >
        {resume.skillGroups.map((group) => (
          <div className="skill-category" key={group.id}>
            <dt>{group.title}</dt>
            <dd>
              {skillsForGroup(group.id, resume.skillCategories, resume.skills)
                .map((skill) => skill.label)
                .join(', ')}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
