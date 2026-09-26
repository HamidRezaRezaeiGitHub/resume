import { describe, expect, it } from 'vitest'
import { resume } from '@/data/resume'
import type { ResumeContent } from '@/data/resume'
import { careerContent, graphContent } from './contentFixtures'
import {
  renderLlmsIndex,
  renderResumeMarkdown,
} from '../../scripts/resume-markdown'

function fixture(): ResumeContent {
  return structuredClone({
    ...resume,
    ...careerContent,
    ...graphContent,
    profile: {
      name: 'Alex Example',
      monogram: 'ae',
      headline: 'Software Engineer',
      summary: 'Builds reliable software.',
      location: 'Toronto',
      email: 'alex@example.com',
      links: [{ label: 'Profile', url: 'https://example.com/alex' }],
    },
  })
}

describe('Markdown resume', () => {
  it('includes the complete published content independently of UI disclosure state', () => {
    // Undo Markdown punctuation escapes to check the public copy, not its formatting.
    const markdown = renderResumeMarkdown(resume).replace(
      /\\([\p{P}\p{S}])/gu,
      '$1',
    )
    const entries = [
      ...resume.experiences,
      ...resume.projects,
      ...resume.education,
    ]
    for (const entry of entries) {
      expect(markdown).toContain(entry.title)
      for (const bullet of entry.bullets ?? [])
        expect(markdown).toContain(bullet.text)
    }
    for (const skill of resume.skills) expect(markdown).toContain(skill.label)
    for (const group of resume.skillGroups)
      expect(markdown).toContain(group.title)
    for (const item of [
      ...resume.profile.links,
      ...resume.projects.flatMap((entry) => entry.links ?? []),
    ])
      expect(markdown).toContain(item.url)
    for (const option of resume.downloads.options) {
      expect(markdown).toContain(option.path)
      expect(markdown).toContain(option.description)
    }
    expect(markdown).toContain(resume.profile.summary)
    expect(markdown).toContain(resume.profile.email)
    expect(markdown).not.toContain('skillRelationships')
  })

  it('preserves entry order, team, stage, location and date precision', () => {
    const content = fixture()
    const markdown = renderResumeMarkdown(content)
    expect(markdown).toContain('Platform · Toronto · Jun 2025 — Present')
    expect(markdown).toContain('London · 2021 — May 2025')
    expect(markdown).not.toContain('Jan 2021')
    expect(markdown).toContain('Creator · In progress · 2024 — Present')
    expect(markdown).toContain(
      '### Master of Engineering — Systems Engineering',
    )
    expect(markdown).toContain(
      'Example University · London · Jan 2019 — Dec 2019',
    )
    expect(markdown.indexOf('Example Company')).toBeLessThan(
      markdown.indexOf('Earlier Company'),
    )
    expect(markdown).toContain(
      '[Project source](<https://example.com/project>)',
    )
  })

  it('supports new optional details and missing details without empty bullets', () => {
    const content = fixture()
    content.experiences[0].bullets = []
    delete content.projects[0].bullets
    delete content.projects[0].links
    content.education[0].bullets = [
      { id: 'thesis', text: 'Completed a systems thesis.' },
    ]
    const markdown = renderResumeMarkdown(content)
    expect(markdown).toContain('- Completed a systems thesis.')
    expect(markdown).not.toContain('Built an API')
    expect(markdown).not.toMatch(/^-\s*$/m)
    expect(markdown).not.toContain('undefined')
  })

  it('deduplicates overlapping topics within each skill group and keeps shared skills in both groups', () => {
    const content = fixture()
    content.skillCategories.push({
      id: 'apis',
      title: 'APIs',
      groupId: 'backend',
    })
    content.skills
      .find((skill) => skill.id === 'typescript')!
      .categories.push('apis')
    const markdown = renderResumeMarkdown(content)
    expect(markdown).toContain(
      '### Backend & APIs\n\nJava, JavaScript, TypeScript',
    )
    expect(markdown).toContain(
      '### Frontend\n\nJavaScript, TypeScript, React, Vitest',
    )
    expect(markdown.match(/TypeScript/g)).toHaveLength(2)
  })

  it('treats copy as literal text and preserves links with parentheses safely', () => {
    const content = fixture()
    content.profile.name = 'Alex [Example]'
    content.profile.summary =
      '<script>alert("hello")</script>\n# not a heading *plain*'
    content.projects[0].links = [
      { label: 'Source [v2]', url: 'https://example.com/a_(b)?label=<test>' },
    ]
    content.experiences[0].bullets = [
      { id: 'literal', text: '1. Not a nested list' },
    ]
    const markdown = renderResumeMarkdown(content)
    expect(markdown).toContain('# Alex \\[Example\\]')
    expect(markdown).toContain(
      '\\<script\\>alert("hello")\\</script\\> \\# not a heading \\*plain\\*',
    )
    expect(markdown).toContain(
      '[Source \\[v2\\]](<https://example.com/a_(b)?label=%3Ctest%3E>)',
    )
    expect(markdown).toContain('- 1\\. Not a nested list')
    expect(markdown).not.toContain('<script>')
  })

  it('is deterministic and leaves the editable content unchanged', () => {
    const content = fixture()
    const original = structuredClone(content)
    expect(renderResumeMarkdown(content)).toBe(renderResumeMarkdown(content))
    expect(content).toEqual(original)
  })

  it('keeps the discovery index short, factual and relative to its environment', () => {
    const index = renderLlmsIndex(fixture())
    expect(index).toContain('# Alex Example')
    expect(index).toContain('> Software Engineer. Toronto.')
    expect(index).toContain('[Complete resume in Markdown](/resume.md)')
    expect(index).not.toContain('Built an API')
    expect(index).not.toContain('hamid-rezaei.com')
  })
})
