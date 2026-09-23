import { useState } from 'react'
import { ArrowUpRight, Check, Copy, MapPin } from 'lucide-react'
import { resume } from '@/data/resume'

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
      tabIndex={-1}
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <p className="contact-eyebrow">{resume.sections.contact.eyebrow}</p>
        <div className="contact-grid">
          <h2 id="contact-title" tabIndex={-1}>
            {resume.sections.contact.title}
            <span aria-hidden="true">.</span>
          </h2>
          <div className="contact-copy">
            <p className="contact-description">
              {resume.sections.contact.description}
            </p>
            <a
              className="contact-button"
              href={`mailto:${resume.profile.email}`}
            >
              {resume.sections.contact.emailLabel}
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="contact-details">
          <div>
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
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
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
            <p className="contact-location">
              <MapPin size={14} aria-hidden="true" />
              {resume.profile.location}
            </p>
          </div>
          <div className="contact-socials">
            {resume.profile.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
