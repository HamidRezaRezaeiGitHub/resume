import { z } from 'zod'

const text = z.string().trim().min(1)
const texts = z
  .array(text)
  .min(1)
  .refine(
    (items) => new Set(items).size === items.length,
    'List items must be unique',
  )
const anchorId = text.regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, {
  error: 'Use a lowercase, hyphen-separated anchor ID',
})
const careerDate = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, {
  error: 'Use YYYY or YYYY-MM',
})
const links = z
  .array(
    z.strictObject({
      label: text,
      url: z.url({ protocol: /^https?$/ }),
    }),
  )
  .min(1)
  .refine(
    (items) =>
      new Set(items.map((item) => item.url)).size === items.length &&
      new Set(items.map((item) => item.label)).size === items.length,
    'Link labels and URLs must be unique within each list',
  )
const sectionId = z.enum([
  'experience',
  'projects',
  'skills',
  'education',
  'contact',
])
const heading = z.strictObject({ title: text })
const bullets = z.array(z.strictObject({ id: anchorId, text })).min(1)
const datedEntry = z.strictObject({
  id: anchorId,
  title: text,
  startDate: careerDate,
  endDate: z.union([careerDate, z.literal('present')]),
})
type CareerPeriod = Pick<z.infer<typeof datedEntry>, 'startDate' | 'endDate'>

function validatePeriod(entry: CareerPeriod, context: z.RefinementCtx) {
  if (entry.endDate === 'present') return
  const start =
    entry.startDate.length === 4 ? `${entry.startDate}-01` : entry.startDate
  const end = entry.endDate.length === 4 ? `${entry.endDate}-12` : entry.endDate
  if (end < start)
    context.addIssue({
      code: 'custom',
      message: 'End date must not precede start date',
      path: ['endDate'],
    })
}

export const resumeContentSchema = z
  .strictObject({
    navigation: z.array(z.strictObject({ label: text, sectionId })).length(5),
    profile: z.strictObject({
      name: text,
      headline: text,
      summary: text,
      location: text,
      email: z.email(),
      links,
    }),
    hero: z.strictObject({
      eyebrow: text,
      experienceLabel: text,
      contactLabel: text,
    }),
    sections: z.strictObject({
      experience: heading,
      projects: heading,
      skills: heading.extend({
        eyebrow: text,
        description: text,
        legend: text,
        idleTitle: text,
        idleDescription: text,
      }),
      education: heading,
      contact: heading.extend({
        eyebrow: text,
        description: text,
        emailLabel: text,
      }),
    }),
    experiences: z
      .array(
        datedEntry
          .extend({
            organization: text,
            team: text.optional(),
            location: text,
            bullets,
          })
          .superRefine(validatePeriod),
      )
      .min(1),
    projects: z
      .array(
        datedEntry
          .extend({
            role: text,
            stage: text,
            links: links.optional(),
            bullets,
          })
          .superRefine(validatePeriod),
      )
      .min(1),
    skillGroups: z.array(z.strictObject({ id: anchorId, title: text })).min(1),
    skills: z
      .array(z.strictObject({ id: anchorId, label: text, categories: texts }))
      .min(1),
    education: z
      .array(
        datedEntry
          .extend({
            field: text,
            organization: text,
            location: text,
          })
          .superRefine(validatePeriod),
      )
      .min(1),
  })
  .superRefine((content, context) => {
    const ids = new Set([
      'top',
      'main',
      'hero-title',
      ...sectionId.options,
      ...sectionId.options.map((id) => `${id}-title`),
    ])
    const addId = (id: string, path: (string | number)[]) => {
      if (ids.has(id))
        context.addIssue({
          code: 'custom',
          message: `Duplicate id: ${id}`,
          path,
        })
      ids.add(id)
    }
    for (const key of ['experiences', 'projects', 'education'] as const) {
      content[key].forEach((entry, i) => {
        addId(entry.id, [key, i, 'id'])
        addId(`${entry.id}-title`, [key, i, 'id'])
        if ('bullets' in entry)
          entry.bullets.forEach((bullet, j) =>
            addId(bullet.id, [key, i, 'bullets', j, 'id']),
          )
      })
    }
    if (
      new Set(content.navigation.map((link) => link.sectionId)).size !==
      sectionId.options.length
    )
      context.addIssue({
        code: 'custom',
        message: 'Navigation must include every section exactly once',
        path: ['navigation'],
      })
    const graphIds = new Set<string>()
    const labels = new Set<string>()
    const categoryIds = new Set(content.skillGroups.map((group) => group.id))
    for (const key of ['skillGroups', 'skills'] as const) {
      content[key].forEach((item, i) => {
        const label = 'title' in item ? item.title : item.label
        if (graphIds.has(item.id) || labels.has(label.toLowerCase()))
          context.addIssue({
            code: 'custom',
            message: 'Graph IDs and labels must be unique',
            path: [key, i],
          })
        graphIds.add(item.id)
        labels.add(label.toLowerCase())
      })
    }
    content.skills.forEach((skill, i) => {
      skill.categories.forEach((id, j) => {
        if (!categoryIds.has(id))
          context.addIssue({
            code: 'custom',
            message: `Unknown skill category: ${id}`,
            path: ['skills', i, 'categories', j],
          })
      })
    })
    content.skillGroups.forEach((group, i) => {
      if (!content.skills.some((skill) => skill.categories.includes(group.id)))
        context.addIssue({
          code: 'custom',
          message: 'Skill categories must contain a skill',
          path: ['skillGroups', i],
        })
    })
  })

export type ResumeContent = z.infer<typeof resumeContentSchema>
export type ResumeBullet =
  ResumeContent['experiences'][number]['bullets'][number]
export type { CareerPeriod }
