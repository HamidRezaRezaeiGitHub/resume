import type { ResumeContent } from '../src/data/resume.schema.ts'
import { skillsForGroup } from '../src/data/skills.ts'
import { formatCareerPeriod } from '../src/lib/dates.ts'

// JSON copy is plain text, not authored Markdown or HTML.
function text(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[\\`*_[\]<>#!]/g, '\\$&')
    .replace(/^([-+])(?=\s)/, '\\$&')
    .replace(/^(\d+)([.)])(?=\s)/, '$1\\$2')
}

function link(label: string, url: string) {
  const destination = url.replace(/[<>\s\\]/g, (value) =>
    encodeURIComponent(value),
  )
  return `[${text(label)}](<${destination}>)`
}

function bullets(items: { text: string }[] = []) {
  return items.length
    ? ['\n', ...items.map((item) => `- ${text(item.text)}\n`)].join('')
    : ''
}

/** Complete public resume; no dependency on disclosure or graph UI state. */
export function renderResumeMarkdown(content: ResumeContent) {
  const { profile, sections } = content
  const blocks = [
    `# ${text(profile.name)}`,
    `${text(profile.headline)}\n\n${text(profile.location)}`,
    [
      link(profile.email, `mailto:${profile.email}`),
      ...profile.links.map((item) => link(item.label, item.url)),
    ].join(' · '),
    `## Summary\n\n${text(profile.summary)}`,
    `## ${text(sections.experience.title)}`,
    ...content.experiences.map(
      (entry) =>
        `### ${text(entry.title)} — ${text(entry.organization)}\n\n` +
        [
          entry.team,
          entry.location,
          formatCareerPeriod(entry.startDate, entry.endDate),
        ]
          .filter((value): value is string => Boolean(value))
          .map(text)
          .join(' · ') +
        '\n' +
        bullets(entry.bullets),
    ),
    `## ${text(sections.projects.title)}`,
    ...content.projects.map(
      (entry) =>
        `### ${text(entry.title)}\n\n` +
        [
          entry.role,
          entry.stage,
          formatCareerPeriod(entry.startDate, entry.endDate),
        ]
          .map(text)
          .join(' · ') +
        '\n' +
        bullets(entry.bullets) +
        (entry.links?.length
          ? `\n${entry.links.map((item) => link(item.label, item.url)).join(' · ')}\n`
          : ''),
    ),
    `## ${text(sections.skills.title)}`,
    ...content.skillGroups.map(
      (group) =>
        `### ${text(group.title)}\n\n` +
        skillsForGroup(group.id, content.skillCategories, content.skills)
          .map((skill) => text(skill.label))
          .join(', '),
    ),
    `## ${text(sections.education.title)}`,
    ...content.education.map(
      (entry) =>
        `### ${text(entry.title)} — ${text(entry.field)}\n\n` +
        [
          entry.organization,
          entry.location,
          formatCareerPeriod(entry.startDate, entry.endDate),
        ]
          .map(text)
          .join(' · ') +
        '\n' +
        bullets(entry.bullets),
    ),
    `## ${text(sections.contact.title)}\n\n${text(sections.contact.description)}\n\n` +
      link(profile.email, `mailto:${profile.email}`),
    '## PDF downloads\n\n' +
      content.downloads.options
        .map(
          (option) =>
            `- ${link(option.label, option.path)} — ${text(option.description)}`,
        )
        .join('\n'),
  ]
  return blocks.map((block) => block.trim()).join('\n\n') + '\n'
}

/** Keep discovery brief; the complete facts live in the generated resume. */
export function renderLlmsIndex(content: ResumeContent) {
  return (
    [
      `# ${text(content.profile.name)}`,
      `> ${text(content.profile.headline)}. ${text(content.profile.location)}.`,
      '## Resume',
      '- [Complete resume in Markdown](/resume.md): Summary, all experience and project details, skills, education, contact information and PDF links.',
    ].join('\n\n') + '\n'
  )
}
