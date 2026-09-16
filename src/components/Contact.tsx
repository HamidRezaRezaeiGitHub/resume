import { useState } from 'react'
import { ArrowUpRight, Check, Copy, MapPin } from 'lucide-react'
import { resume } from '@/data/resume'
import { Reveal } from '@/components/Reveal'

export function Contact() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  )
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(resume.profile.email)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }
  return (
    <section
      id="contact"
      className="contact-section dark-section"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <Reveal>
          <p className="eyebrow">{resume.sections.contact.eyebrow}</p>
          <h2 id="contact-title" tabIndex={-1}>
            {resume.sections.contact.title}
            <span className="contact-spark" aria-hidden="true">
              ↗
            </span>
          </h2>
        </Reveal>
        <div className="contact-grid">
          <Reveal>
            <p className="contact-description">
              {resume.sections.contact.description}
            </p>
            <p className="contact-location">
              <MapPin size={15} />
              {resume.profile.location}
            </p>
          </Reveal>
          <Reveal className="contact-actions">
            <a
              className="button button-lime"
              href={`mailto:${resume.profile.email}`}
            >
              {resume.sections.contact.emailLabel}
              <ArrowUpRight size={20} />
            </a>
            <div className="email-row">
              <a href={`mailto:${resume.profile.email}`}>
                {resume.profile.email}
              </a>
              <button
                type="button"
                className="icon-button"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copyState === 'copied' ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <p className="copy-status" role="status">
              {copyState === 'copied'
                ? 'Email copied.'
                : copyState === 'failed'
                  ? 'You can select the email address or tap it to get in touch.'
                  : ''}
            </p>
          </Reveal>
        </div>
        <div className="contact-socials">
          {resume.profile.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
