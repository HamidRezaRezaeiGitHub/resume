import { ArrowDownRight, Asterisk } from 'lucide-react'
import { resume } from '@/data/resume'
import { Reveal } from '@/components/Reveal'

export function About() {
  return (
    <section
      id="about"
      className="section about-section"
      aria-labelledby="about-title"
    >
      <div className="container">
        <Reveal className="about-intro">
          <div>
            <p className="eyebrow">{resume.sections.about.eyebrow}</p>
            <h2 id="about-title" tabIndex={-1}>
              {resume.sections.about.title}
            </h2>
          </div>
          <p>{resume.sections.about.intro}</p>
        </Reveal>
        <div className="impact-grid">
          {resume.impact.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.07}>
              <a className="impact-item" href={`#${item.targetId}`}>
                <span className="eyebrow">
                  {item.label}
                  <ArrowDownRight size={18} />
                </span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="approach-line">
          {resume.sections.about.themes.map((theme) => (
            <span key={theme}>
              <Asterisk size={17} />
              {theme}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
