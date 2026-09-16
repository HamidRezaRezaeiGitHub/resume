import { Mail, MapPin } from 'lucide-react'
import { profile } from '@/data/resume'
import { Section } from '@/components/Section'

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's talk"
      description="Open to backend, full-stack, and senior software engineering roles — hybrid, remote, or onsite."
    >
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              {profile.location}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-lg font-medium hover:text-cat-experience"
            >
              <Mail className="size-5" />
              {profile.email}
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="size-4" />
              Email me
            </a>
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
