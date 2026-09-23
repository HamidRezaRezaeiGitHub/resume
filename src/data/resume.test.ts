import { describe, expect, it } from 'vitest'
import rawResumeContent from '@/data/resume.json'
import { resumeContentSchema } from '@/data/resume.schema'

const editableCopy = () =>
  resumeContentSchema.parse(structuredClone(rawResumeContent))

describe('section-based resume content', () => {
  it('accepts the published resume', () => {
    expect(resumeContentSchema.safeParse(rawResumeContent).success).toBe(true)
  })
  it('rejects obsolete timeline fields rather than silently ignoring content', () => {
    expect(
      resumeContentSchema.safeParse({ ...rawResumeContent, timeline: [] })
        .success,
    ).toBe(false)
  })
  it('keeps record anchors unique across sections', () => {
    const content = editableCopy()
    content.projects[0].id = content.experiences[0].id
    const result = resumeContentSchema.safeParse(content)
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: `Duplicate id: ${content.experiences[0].id}`,
          path: ['projects', 0, 'id'],
        }),
      )
  })
  it('keeps bullet anchors unique across roles and projects', () => {
    const content = editableCopy()
    content.projects[0].bullets[0].id = content.experiences[0].bullets[0].id
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('rejects entry IDs that collide with generated heading anchors', () => {
    const content = editableCopy()
    content.education[0].id = `${content.experiences[0].id}-title`
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it.each(['top', 'main', 'projects', 'education-title', 'contact-title'])(
    'reserves the page anchor %s',
    (id) => {
      const content = editableCopy()
      content.experiences[0].bullets[0].id = id
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it('rejects anchors unsafe for fragment selectors', () => {
    const content = editableCopy()
    content.experiences[1].id = 'role with spaces#fragment'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it.each([
    'javascript:alert(1)',
    'data:text/html,example',
    'ftp://example.com',
  ])('rejects non-web external link %s', (url) => {
    const content = editableCopy()
    content.profile.links[0].url = url
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it.each(['label', 'url'] as const)(
    'rejects repeated link %s values',
    (key) => {
      const content = editableCopy()
      content.profile.links[1][key] = content.profile.links[0][key]
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it.each(['2025-00', '2025-13', 'June 2025', '2025-06-01'])(
    'rejects unsupported date %s',
    (date) => {
      const content = editableCopy()
      content.experiences[0].startDate = date
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it.each(['experiences', 'projects', 'education'] as const)(
    'requires dates and validates chronology in %s',
    (key) => {
      const content = editableCopy()
      content[key][0].endDate = '2000'
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
      content[key][0].endDate = 'present'
      Reflect.deleteProperty(content[key][0], 'startDate')
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it('allows year-only dates without inventing a month', () => {
    const content = editableCopy()
    content.education[0].startDate = '2019'
    content.education[0].endDate = '2019'
    expect(resumeContentSchema.safeParse(content).success).toBe(true)
  })
  it('rejects duplicate navigation destinations', () => {
    const content = editableCopy()
    content.navigation[1].sectionId = content.navigation[0].sectionId
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('requires all five navigation destinations', () => {
    const content = editableCopy()
    content.navigation.pop()
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('rejects blank resume bullets', () => {
    const content = editableCopy()
    content.experiences[0].bullets[0].text = '  '
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('rejects ambiguous skill categories', () => {
    const content = editableCopy()
    content.skillGroups[1].title = content.skillGroups[0].title
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('rejects repeated skills within a category', () => {
    const content = editableCopy()
    content.skills[0].categories.push(content.skills[0].categories[0])
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it.each([
    'duplicate-id',
    'duplicate-label',
    'unknown-category',
    'empty-category',
    'empty-membership',
    'category-skill-collision',
  ])('rejects invalid network data: %s', (invalid) => {
    const content = editableCopy()
    if (invalid === 'duplicate-id') content.skills[1].id = content.skills[0].id
    if (invalid === 'duplicate-label')
      content.skills[1].label = content.skills[0].label.toUpperCase()
    if (invalid === 'unknown-category')
      content.skills[0].categories = ['missing']
    if (invalid === 'empty-category')
      content.skillGroups.push({ id: 'unused', title: 'Unused' })
    if (invalid === 'empty-membership') content.skills[0].categories = []
    if (invalid === 'category-skill-collision')
      content.skills[0].id = content.skillGroups[0].id
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
})
