import { ArrowUpRight, Braces, Building2, Workflow } from 'lucide-react'
import { resume } from '@/data/resume'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'

const icons = [Workflow, Braces, Building2]
export function Projects() {
  return (
    <Section
      id="projects"
      className="projects-section"
      {...resume.sections.projects}
    >
      <div className="project-grid">
        {resume.projects.map((project, i) => {
          const Icon = icons[i % icons.length]
          return (
            <Reveal
              key={project.id}
              delay={i * 0.08}
              className="project-reveal"
            >
              <article className={`project-card project-${i}`}>
                <div className="project-art" aria-hidden="true">
                  <span className="mono project-number">BUILD / 0{i + 1}</span>
                  <Icon strokeWidth={1} />
                  <span className="project-art-label mono">
                    {project.tags.slice(0, 2).join(' + ')}
                  </span>
                  <span className="project-orbit" />
                </div>
                <div className="project-body">
                  <div className="project-name">
                    <h3>{project.name}</h3>
                    {project.stage && (
                      <span className="project-stage">{project.stage}</span>
                    )}
                  </div>
                  <p className="project-role mono">{project.role}</p>
                  <p className="project-description">{project.description}</p>
                  <ul className="inline-tags" aria-label="Technologies">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {project.links && (
                    <div className="project-links">
                      {project.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-link"
                          aria-label={`${project.name} — ${link.label}`}
                        >
                          {link.label}
                          <ArrowUpRight size={17} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
