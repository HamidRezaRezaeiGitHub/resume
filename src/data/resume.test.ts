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
})
