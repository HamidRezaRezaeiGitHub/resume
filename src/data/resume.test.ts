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
  it.each(['2025-00', '2025-13', 'June 2025', '2025-06-01'])(
    'rejects unsupported date %s',
    (date) => {
      const content = editableCopy()
      content.timeline[0].startDate = date
      expect(resumeContentSchema.safeParse(content).success).toBe(false)
    },
  )
  it('allows an unknown date without assigning one', () => {
    const content = editableCopy()
    delete content.timeline[1].startDate
    delete content.timeline[1].endDate
    expect(
      resumeContentSchema.parse(content).timeline[1].startDate,
    ).toBeUndefined()
  })
  it('requires a start date if an end date is supplied', () => {
    const content = editableCopy()
    delete content.timeline[0].startDate
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
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
  it('requires a dated project for repository date provenance', () => {
    const content = editableCopy()
    const project = content.timeline.find(
      (entry) => entry.category === 'project',
    )!
    delete project.startDate
    delete project.endDate
    project.dateBasis = 'repository'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
    project.startDate = '2025-09'
    expect(resumeContentSchema.safeParse(content).success).toBe(true)
    content.timeline[0].dateBasis = 'repository'
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
  })
  it('requires a readable qualification alongside achievement metrics', () => {
    const content = editableCopy()
    const metric = content.timeline
      .flatMap((entry) => entry.highlights ?? [])
      .find((item) => item.metric)!.metric!
    metric.label = ''
    expect(resumeContentSchema.safeParse(content).success).toBe(false)
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
})
