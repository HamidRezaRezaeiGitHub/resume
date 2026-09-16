import { z } from 'zod'

const requiredText = z.string().trim().min(1)
const stringList = z.array(requiredText).min(1)
const careerDate = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, {
  error: 'Use YYYY or YYYY-MM; omit unknown months',
})

const linkSchema = z.strictObject({
  label: requiredText,
  url: z.url(),
})

export const categorySchema = z.enum([
  'experience',
  'project',
  'education',
  'other',
])

const sectionIdSchema = z.enum([
  'about',
  'experience',
  'work',
  'projects',
  'skills',
  'contact',
])

const categoryDefinitionSchema = z.strictObject({
  id: categorySchema,
  label: requiredText,
})

const sectionHeadingSchema = z.strictObject({
  eyebrow: requiredText,
  title: requiredText,
  description: requiredText,
})

const timelineEntrySchema = z.strictObject({
  id: requiredText,
  category: categorySchema,
  title: requiredText,
  organization: requiredText.optional(),
  location: requiredText.optional(),
  team: requiredText.optional(),
  startDate: careerDate,
  endDate: z.union([careerDate, z.literal('present')]).optional(),
  summary: requiredText,
  highlights: stringList.optional(),
  tags: stringList.optional(),
  link: linkSchema.optional(),
})

const caseStudySchema = z.strictObject({
  id: requiredText,
  title: requiredText,
  context: requiredText,
  preview: requiredText,
  outcome: requiredText.optional(),
  outcomeLabel: requiredText.optional(),
  description: requiredText,
  highlights: stringList.optional(),
  tags: stringList,
})

const projectSchema = z.strictObject({
  id: requiredText,
  name: requiredText,
  role: requiredText,
  description: requiredText,
  stage: requiredText.optional(),
  tags: stringList,
  links: z.array(linkSchema).min(1).optional(),
})

function requireUniqueValues(
  values: readonly string[],
  field: string,
  context: z.RefinementCtx,
) {
  const seen = new Set<string>()

  values.forEach((value, index) => {
    if (seen.has(value)) {
      context.addIssue({
        code: 'custom',
        message: `Duplicate ${field}: ${value}`,
        path: [index, field],
      })
    }
    seen.add(value)
  })
}

function requireUniqueIds(
  items: ReadonlyArray<{ id: string }>,
  context: z.RefinementCtx,
) {
  requireUniqueValues(
    items.map(({ id }) => id),
    'id',
    context,
  )
}

function requireUniqueSectionIds(
  items: ReadonlyArray<{ sectionId: string }>,
  context: z.RefinementCtx,
) {
  requireUniqueValues(
    items.map(({ sectionId }) => sectionId),
    'sectionId',
    context,
  )
}

export const resumeContentSchema = z
  .strictObject({
    navigation: z
      .array(
        z.strictObject({
          label: requiredText,
          sectionId: sectionIdSchema,
        }),
      )
      .length(sectionIdSchema.options.length)
      .superRefine(requireUniqueSectionIds),
    profile: z.strictObject({
      name: requiredText,
      headline: requiredText,
      tagline: requiredText,
      location: requiredText,
      email: z.email(),
      links: z.array(linkSchema).min(1),
    }),
    hero: z.strictObject({
      title: z.tuple([requiredText, requiredText]),
      kicker: requiredText,
      technologies: stringList,
      contactLabel: requiredText,
      scrollLabel: requiredText,
    }),
    careerNote: requiredText,
    impact: z
      .array(
        z.strictObject({
          value: requiredText,
          label: requiredText,
          detail: requiredText,
          targetId: requiredText,
        }),
      )
      .min(1),
    sections: z.strictObject({
      about: z.strictObject({
        eyebrow: requiredText,
        title: requiredText,
        intro: requiredText,
        themes: stringList,
      }),
      timeline: sectionHeadingSchema,
      caseStudies: sectionHeadingSchema,
      projects: sectionHeadingSchema,
      skills: sectionHeadingSchema,
      contact: sectionHeadingSchema.extend({
        emailLabel: requiredText,
      }),
    }),
    categories: z
      .array(categoryDefinitionSchema)
      .length(categorySchema.options.length)
      .superRefine(requireUniqueIds),
    timeline: z.array(timelineEntrySchema).min(1).superRefine(requireUniqueIds),
    caseStudies: z.array(caseStudySchema).min(1).superRefine(requireUniqueIds),
    projects: z.array(projectSchema).min(1).superRefine(requireUniqueIds),
    skillGroups: z
      .array(
        z.strictObject({
          title: requiredText,
          skills: stringList,
        }),
      )
      .min(1),
    footer: z.strictObject({
      builtWith: requiredText,
    }),
  })
  .superRefine((content, context) => {
    content.timeline.forEach((entry, index) => {
      if (
        entry.endDate &&
        entry.endDate !== 'present' &&
        entry.endDate < entry.startDate
      ) {
        context.addIssue({
          code: 'custom',
          message: 'End date must not precede start date',
          path: ['timeline', index, 'endDate'],
        })
      }
    })
    const targets = new Set([
      ...sectionIdSchema.options,
      ...content.caseStudies.map(({ id }) => id),
    ])
    content.impact.forEach((item, index) => {
      if (!targets.has(item.targetId)) {
        context.addIssue({
          code: 'custom',
          message: 'Impact target must reference a section or case study',
          path: ['impact', index, 'targetId'],
        })
      }
    })
    const configuredCategories = new Set(content.categories.map(({ id }) => id))

    for (const category of categorySchema.options) {
      if (!configuredCategories.has(category)) {
        context.addIssue({
          code: 'custom',
          message: `Missing category definition: ${category}`,
          path: ['categories'],
        })
      }
    }
  })

export type ResumeContent = z.infer<typeof resumeContentSchema>
export type Category = z.infer<typeof categorySchema>
export type TimelineEntry = ResumeContent['timeline'][number]
