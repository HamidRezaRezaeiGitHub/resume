import type { ResumeContent } from '../src/data/resume.schema.ts'

function escapeHtml(value: string) {
  const escapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return value.replace(/[&<>"']/g, (character) => escapes[character])
}

/** Keep personal metadata in the same content source as the visible resume. */
export function renderResumeHtml(
  html: string,
  profile: ResumeContent['profile'],
) {
  const values: Record<string, string> = {
    TITLE: `${profile.name} — ${profile.headline}`,
    SUMMARY: profile.summary,
    NAME: profile.name,
    EMAIL: profile.email,
  }
  return html.replace(
    /__RESUME_(TITLE|SUMMARY|NAME|EMAIL)__/g,
    (_, key: string) => escapeHtml(values[key]),
  )
}
