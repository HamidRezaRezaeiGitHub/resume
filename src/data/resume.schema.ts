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
const link = z.strictObject({
  label: text,
  url: z.url({ protocol: /^https?$/ }),
})
const links = z
  .array(link)
  .min(1)
  .refine(
    (items) =>
      new Set(items.map((item) => item.url)).size === items.length &&
      new Set(items.map((item) => item.label)).size === items.length,
    'Link labels and URLs must be unique within each list',
  )
const heading = z.strictObject({
  eyebrow: text,
  title: text,
  description: text,
})
export const categorySchema = z.enum([
  'experience',
  'project',
  'education',
  'teaching',
])
const sectionId = z.enum(['experience', 'skills', 'contact'])

const highlight = z.strictObject({
  id: anchorId,
  date: careerDate.optional(),
  title: text,
  body: text,
  metric: z.strictObject({ value: text, label: text }).optional(),
  details: texts.optional(),
  tags: texts.optional(),
})

const timelineEntry = z
  .strictObject({
    id: anchorId,
    category: categorySchema,
    title: text,
    organization: text.optional(),
    team: text.optional(),
    location: text.optional(),
    startDate: careerDate,
    endDate: z.union([careerDate, z.literal('present')]).optional(),
    stage: text.optional(),
    summary: text,
    highlights: z.array(highlight).min(1).optional(),
    tags: texts.optional(),
    links: links.optional(),
  })
  .superRefine((entry, context) => {
    if (entry.endDate && entry.endDate !== 'present') {
      const start =
        entry.startDate.length === 4 ? `${entry.startDate}-01` : entry.startDate
      const end =
        entry.endDate.length === 4 ? `${entry.endDate}-12` : entry.endDate
      if (end < start)
        context.addIssue({
          code: 'custom',
          message: 'End date must not precede start date',
          path: ['endDate'],
        })
    }
  })

export const resumeContentSchema = z
  .strictObject({
    navigation: z.array(z.strictObject({ label: text, sectionId })).length(3),
    profile: z.strictObject({
      name: text,
      headline: text,
      tagline: text,
      location: text,
      email: z.email(),
      links,
    }),
    hero: z.strictObject({
      title: z.tuple([text, text]),
      kicker: text,
      technologies: texts,
      contactLabel: text,
      scrollLabel: text,
    }),
    sections: z.strictObject({
      timeline: heading,
      skills: heading,
      contact: heading.extend({ emailLabel: text }),
    }),
    categories: z
      .array(z.strictObject({ id: categorySchema, label: text }))
      .length(4),
    timeline: z.array(timelineEntry).min(1),
    currentRoleId: anchorId,
    skillOverview: texts,
    skillGroups: z.array(z.strictObject({ title: text, skills: texts })).min(1),
    footer: z.strictObject({ builtWith: text }),
  })
  .superRefine((content, context) => {
    const currentRole = content.timeline.find(
      (entry) => entry.id === content.currentRoleId,
    )
    if (
      currentRole?.category !== 'experience' ||
      currentRole.endDate !== 'present'
    )
      context.addIssue({
        code: 'custom',
        message:
          'The current role must reference an ongoing professional experience',
        path: ['currentRoleId'],
      })
    const ids = new Set<string>([
      'top',
      'main',
      'experience',
      'skills',
      'contact',
      'hero-title',
      'experience-title',
      'skills-title',
      'contact-title',
      'mobile-navigation',
      'skill-cloud',
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
    content.timeline.forEach((entry, i) => {
      addId(entry.id, ['timeline', i, 'id'])
      addId(`${entry.id}-title`, ['timeline', i, 'id'])
      entry.highlights?.forEach((item, j) =>
        addId(item.id, ['timeline', i, 'highlights', j, 'id']),
      )
    })
    if (new Set(content.navigation.map((n) => n.sectionId)).size !== 3)
      context.addIssue({
        code: 'custom',
        message: 'Navigation must include every section exactly once',
        path: ['navigation'],
      })
    if (new Set(content.categories.map((c) => c.id)).size !== 4)
      context.addIssue({
        code: 'custom',
        message: 'Define each timeline category exactly once',
        path: ['categories'],
      })
    const skills = new Set(content.skillGroups.flatMap((group) => group.skills))
    const groupTitles = new Set(['Overview'])
    content.skillGroups.forEach((group, i) => {
      if (groupTitles.has(group.title))
        context.addIssue({
          code: 'custom',
          message: 'Skill group titles must be unique; Overview is reserved',
          path: ['skillGroups', i, 'title'],
        })
      groupTitles.add(group.title)
    })
    content.skillOverview.forEach((skill, i) => {
      if (!skills.has(skill))
        context.addIssue({
          code: 'custom',
          message: 'Overview skills must belong to a skill group',
          path: ['skillOverview', i],
        })
    })
  })

export type ResumeContent = z.infer<typeof resumeContentSchema>
export type Category = z.infer<typeof categorySchema>
export type TimelineEntry = ResumeContent['timeline'][number]
export type TimelineHighlight = z.infer<typeof highlight>
