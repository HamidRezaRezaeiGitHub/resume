import { describe, expect, it } from 'vitest'
import rawResumeContent from '@/data/resume.json'
import { resumeContentSchema } from '@/data/resume.schema'
const editableCopy = () =>
  resumeContentSchema.parse(structuredClone(rawResumeContent))

describe('unified resume content', () => {
  it('accepts the published resume document', () => {
    expect(resumeContentSchema.safeParse(rawResumeContent).success).toBe(true)
  })
  it('rejects duplicate record identifiers', () => {
    const content = editableCopy()
    content.timeline[1].id = content.timeline[0].id
    const result = resumeContentSchema.safeParse(content)
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: `Duplicate id: ${content.timeline[0].id}`,
          path: ['timeline', 1, 'id'],
        }),
      )
  })
  it('keeps achievement anchors unique across different roles', () => {
    const content = editableCopy()
    content.timeline[1].highlights![0].id =
      content.timeline[0].highlights![0].id
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('rejects entry IDs that collide with generated heading anchors', () => {
    const content = editableCopy()
    content.timeline[1].id = `${content.timeline[0].id}-title`
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it.each(['skills-title', 'mobile-navigation', 'skill-cloud'])(
    'reserves the page anchor %s',
    (id) => {
      const content = editableCopy()
      content.timeline[0].highlights![0].id = id
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it('rejects anchors that cannot be used consistently in fragment selectors', () => {
    const content = editableCopy()
    content.timeline[1].id = 'role with spaces#fragment'
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
      content.timeline[0].startDate = date
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it.each([undefined, 'present'])(
    'requires a chapter start date when the end date is %s',
    (endDate) => {
      const content = editableCopy()
      Reflect.deleteProperty(content.timeline[1], 'startDate')
      content.timeline[1].endDate = endDate
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it('rejects periods that end before they start', () => {
    const content = editableCopy()
    content.timeline[0].endDate = '2024-06'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('allows year-only end dates without inventing a month', () => {
    const content = editableCopy()
    content.timeline[1].endDate = '2025'
    expect(resumeContentSchema.safeParse(content).success).toBe(true)
  })
  it.each(['missing-role', 'buildean', 'hsbc-data-service-layer'])(
    'rejects %s as the current professional role',
    (id) => {
      const content = editableCopy()
      content.currentRoleId = id
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it('requires a readable qualification alongside achievement metrics', () => {
    const content = editableCopy()
    const metric = content.timeline
      .flatMap((entry) => entry.highlights ?? [])
      .find((item) => item.metric)!.metric!
    metric.label = ''
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('validates milestone dates with the same precision as timeline entries', () => {
    const content = editableCopy()
    content.timeline[0].highlights![0].date = '2025-13'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
    content.timeline[0].highlights![0].date = '2025-06'
    expect(resumeContentSchema.safeParse(content).success).toBe(true)
  })
  it('rejects duplicate navigation destinations', () => {
    const content = editableCopy()
    content.navigation[1].sectionId = content.navigation[0].sectionId
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('keeps overview skills in the editable skill groups', () => {
    const content = editableCopy()
    content.skillOverview[0] = 'Unlisted skill'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it.each(['Backend', 'Overview'])(
    'rejects ambiguous skill filter title %s',
    (title) => {
      const content = editableCopy()
      content.skillGroups[1].title = title
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it('rejects repeated skills within a filter', () => {
    const content = editableCopy()
    content.skillGroups[0].skills.push(content.skillGroups[0].skills[0])
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
})
