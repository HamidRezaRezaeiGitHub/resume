import { describe, expect, it } from 'vitest'
import rawResumeContent from '@/data/resume.json'
import { resumeContentSchema } from '@/data/resume.schema'

describe('resume content contract', () => {
  it('accepts the published resume document', () => {
    expect(resumeContentSchema.safeParse(rawResumeContent).success).toBe(true)
  })

  it('rejects duplicate record identifiers', () => {
    const invalidContent = structuredClone(rawResumeContent)
    invalidContent.timeline[1].id = invalidContent.timeline[0].id

    const result = resumeContentSchema.safeParse(invalidContent)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: `Duplicate id: ${invalidContent.timeline[0].id}`,
          path: ['timeline', 1, 'id'],
        }),
      )
    }
  })

  it.each(['2025-00', '2025-13', 'June 2025', '2025-06-01'])(
    'rejects unsupported career date %s',
    (date) => {
      const content = structuredClone(rawResumeContent)
      content.timeline[0].startDate = date
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )

  it('rejects a career period that ends before it starts', () => {
    const content = structuredClone(rawResumeContent)
    content.timeline[0].endDate = '2024-06'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })

  it('rejects impact links that would lead to missing content', () => {
    const content = structuredClone(rawResumeContent)
    content.impact[0].targetId = 'missing-story'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })

  it('accepts a year-only end when the starting month is in that year', () => {
    const content = structuredClone(rawResumeContent)
    content.timeline[0].endDate = '2025'
    expect(resumeContentSchema.safeParse(content).success).toBe(true)
  })

  it('keeps the skills overview grounded in the editable skill groups', () => {
    const content = structuredClone(rawResumeContent)
    content.skillOverview[0] = 'Unlisted skill'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })

  it('requires a qualification alongside featured outcomes', () => {
    const content = structuredClone(rawResumeContent)
    delete content.caseStudies[0].outcomeLabel
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
})
