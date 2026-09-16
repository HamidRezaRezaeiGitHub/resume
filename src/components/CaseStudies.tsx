import { ArrowUpRight, Plus } from 'lucide-react'
import { resume } from '@/data/resume'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'

export function CaseStudies() {
  return (
    <Section
      id="work"
      className="work-section dark-section"
      {...resume.sections.caseStudies}
    >
      <div className="featured-work">
        {resume.caseStudies.slice(0, 3).map((study, i) => (
          <Reveal
            key={study.id}
            className={`work-reveal work-reveal-${i}`}
            delay={i * 0.05}
          >
            <article
              id={study.id}
              className={`work-card work-card-${i}`}
              aria-labelledby={`${study.id}-title`}
            >
              <div className="work-card-top">
                <span className="mono">
                  0{i + 1} / {study.context}
                </span>
                <ArrowUpRight size={23} aria-hidden="true" />
              </div>
              <div className="work-result">
                <strong>{study.outcome}</strong>
                <span className="mono">{study.outcomeLabel}</span>
              </div>
              <div className="work-copy">
                <h3 id={`${study.id}-title`}>{study.title}</h3>
                <p>{study.preview}</p>
                <ul className="inline-tags" aria-label="Technologies">
                  {study.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <details className="details">
                  <summary>
                    <span>
                      Behind the build
                      <span className="sr-only">: {study.title}</span>
                    </span>
                    <Plus size={18} />
                  </summary>
                  <div className="detail-content">
                    <p>{study.description}</p>
                    {study.highlights && (
                      <ul className="detail-bullets">
                        {study.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <div className="more-work">
        <p className="eyebrow">More problems. More possibilities.</p>
        {resume.caseStudies.slice(3).map((study, i) => (
          <Reveal key={study.id}>
            <details className="work-row" id={study.id}>
              <summary>
                <span className="mono">0{i + 4}</span>
                <span>
                  <strong>{study.title}</strong>
                  <span className="work-row-preview">{study.preview}</span>
                </span>
                <Plus size={21} />
              </summary>
              <div className="work-row-content">
                <p>{study.description}</p>
                {study.highlights && (
                  <ul className="detail-bullets">
                    {study.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <ul className="inline-tags" aria-label="Technologies">
                  {study.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
