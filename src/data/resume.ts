import rawResumeContent from '@/data/resume.json'
import type { Category, ResumeContent } from '@/data/resume.schema'

/**
 * The content contract runs before local development and production builds,
 * and as part of CI. This cast keeps build-only validation code out of the
 * browser bundle.
 */
export const resume = rawResumeContent as unknown as ResumeContent

export const categories = Object.fromEntries(
  resume.categories.map((category) => [category.id, category]),
) as Record<Category, { id: Category; label: string }>

export type {
  Category,
  ResumeContent,
  TimelineEntry,
} from '@/data/resume.schema'
