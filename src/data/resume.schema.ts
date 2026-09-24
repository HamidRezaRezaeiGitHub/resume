import { z } from 'zod'
import { skillConnections } from './skills.ts'

const text = z.string().trim().min(1)
const texts = z
  .array(text)
  .min(1)
  .refine(
    (items) => new Set(items).size === items.length,
    'List items must be unique',
  )
const anchorId = text
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, {
    error: 'Use a lowercase, hyphen-separated anchor ID',
  })
  .describe(
    'Stable lowercase ID, such as my-new-role. Keep it when editing copy so links continue to work.',
  )
const careerDate = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, {
    error: 'Use YYYY or YYYY-MM',
  })
  .describe(
    'Use YYYY-MM when the month is known, otherwise YYYY. Do not invent date precision.',
  )
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
const bullet = z.strictObject({ id: anchorId, text })
const bullets = z
  .array(bullet)
  .optional()
  .describe(
    'Optional details. A nonempty list makes the entry expandable, initially collapsed. Omit or leave empty for a simple entry.',
  )
const datedEntry = z.strictObject({
  id: anchorId,
  title: text,
  startDate: careerDate,
  endDate: z.union([careerDate, z.literal('present')]),
  bullets,
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
    $schema: z.literal('../../schema/resume.schema.json').optional(),
    navigation: z.array(z.strictObject({ label: text, sectionId })).length(5),
    profile: z
      .strictObject({
        name: text,
        monogram: text.describe(
          'Short navigation brand, without the decorative period. Example: hr',
        ),
        headline: text,
        summary: text,
        location: text,
        email: z.email(),
        links,
      })
      .describe(
        'Personal identity, headline, summary, contact details and profile links. Also supplies HTML metadata and the no-JavaScript contact fallback.',
      ),
    hero: z.strictObject({
      eyebrow: text,
      experienceLabel: text,
    }),
    downloads: z.strictObject({
      buttonLabel: text,
      title: text,
      closeLabel: text,
      options: z
        .array(
          z.strictObject({
            id: z.enum(['compact', 'long']),
            label: text,
            description: text,
            path: text.regex(/^\/resumes\/[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/),
          }),
        )
        .length(2)
        .refine(
          (options) =>
            new Set(options.map((option) => option.id)).size === 2 &&
            new Set(options.map((option) => option.path)).size === 2,
          'Provide distinct compact and long PDF downloads',
        ),
    }),
    sections: z.strictObject({
      experience: heading,
      projects: heading,
      skills: heading.extend({
        eyebrow: text,
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
          })
          .superRefine(validatePeriod),
      )
      .min(1)
      .describe(
        'Professional roles in display order, newest first. Copy an entry and give it and its bullets unique IDs; no React changes needed.',
      ),
    projects: z
      .array(
        datedEntry
          .extend({
            role: text,
            stage: text,
            links: links.optional(),
          })
          .superRefine(validatePeriod),
      )
      .min(1)
      .describe(
        'Personal projects in display order. Stage describes maturity; links are optional.',
      ),
    skillGroups: z
      .array(z.strictObject({ id: anchorId, title: text }))
      .min(1)
      .describe('Headings in the Skills list and printed resume.'),
    skillCategories: z
      .array(z.strictObject({ id: anchorId, title: text, groupId: anchorId }))
      .min(1)
      .describe(
        'Graph topic nodes. Each groupId references a skillGroups ID; several topics may share a printed group.',
      ),
    skillRelationships: z
      .array(z.strictObject({ source: anchorId, target: anchorId }))
      .describe(
        'Additional undirected edges between existing skill or topic IDs. Do not repeat category membership, reverse pairs or self-links.',
      ),
    skills: z
      .array(z.strictObject({ id: anchorId, label: text, categories: texts }))
      .min(1)
      .describe(
        'One entry per keyword. categories references skillCategories IDs and automatically creates those connections. Relationships and degree determine layout and size.',
      ),
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
      .min(1)
      .describe(
        'Degrees in display order. Dates follow the same rules as professional roles.',
      ),
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
        entry.bullets?.forEach((bullet, j) =>
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
    const categoryIds = new Set(
      content.skillCategories.map((category) => category.id),
    )
    const groupIds = new Set(content.skillGroups.map((group) => group.id))
    const groupTitles = new Set(
      content.skillGroups.map((group) => group.title.toLowerCase()),
    )
    if (
      groupIds.size !== content.skillGroups.length ||
      groupTitles.size !== content.skillGroups.length
    )
      context.addIssue({
        code: 'custom',
        message: 'Skill groups must have unique IDs and titles',
        path: ['skillGroups'],
      })
    for (const key of ['skillCategories', 'skills'] as const) {
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
    const edgeIds = new Set<string>()
    const membershipCount = content.skills.reduce(
      (count, skill) => count + skill.categories.length,
      0,
    )
    skillConnections(content.skills, content.skillRelationships).forEach(
      ({ source, target }, index) => {
        const key = [source, target].sort().join(':')
        if (
          !graphIds.has(source) ||
          !graphIds.has(target) ||
          source === target ||
          edgeIds.has(key)
        )
          context.addIssue({
            code: 'custom',
            message:
              'Relationships need distinct existing nodes and unique undirected pairs',
            path:
              index >= membershipCount
                ? ['skillRelationships', index - membershipCount]
                : ['skills'],
          })
        edgeIds.add(key)
      },
    )
    content.skillCategories.forEach((category, i) => {
      if (!groupIds.has(category.groupId))
        context.addIssue({
          code: 'custom',
          message: 'Unknown skill group',
          path: ['skillCategories', i, 'groupId'],
        })
      if (
        !content.skills.some((skill) => skill.categories.includes(category.id))
      )
        context.addIssue({
          code: 'custom',
          message: 'Skill categories must contain a skill',
          path: ['skillCategories', i],
        })
    })
    content.skillGroups.forEach((group, i) => {
      if (
        !content.skillCategories.some(
          (category) => category.groupId === group.id,
        )
      )
        context.addIssue({
          code: 'custom',
          message: 'Skill groups must contain a category',
          path: ['skillGroups', i],
        })
    })
  })

export type ResumeContent = z.infer<typeof resumeContentSchema>
export type ResumeBullet = z.infer<typeof bullet>
export type { CareerPeriod }
