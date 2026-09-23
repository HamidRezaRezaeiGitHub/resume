import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { resume } from '@/data/resume'
import { Section } from '@/components/Section'

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
    <Section
      id="contact"
      title={resume.sections.contact.title}
      className="contact-section"
    >
      <div className="contact-grid">
        <p className="contact-description">
          {resume.sections.contact.description}
        </p>
        <a className="contact-button" href={`mailto:${resume.profile.email}`}>
          {resume.sections.contact.emailLabel}
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
      <div className="email-row">
        <a href={`mailto:${resume.profile.email}`}>{resume.profile.email}</a>
        <button
          type="button"
          className="icon-button"
          onClick={copyEmail}
          aria-label="Copy email address"
        >
          {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <p className="copy-status" role="status">
        {copyState === 'copied'
          ? 'Email copied.'
          : copyState === 'failed'
            ? 'You can select the email address or tap it to get in touch.'
            : ''}
      </p>
      <div className="contact-socials">
        {resume.profile.links.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
            {link.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ))}
      </div>
    </Section>
  )
}
