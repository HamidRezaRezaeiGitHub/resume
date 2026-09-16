import rawResumeContent from '@/data/resume.json'
import type { Category, ResumeContent } from '@/data/resume.schema'

/**
 * The content contract runs before local development and production builds,
 * and as part of CI. This cast keeps build-only validation code out of the
 * browser bundle.
 */
export const resume = rawResumeContent as unknown as ResumeContent

interface CategoryStyle {
  textClass: string
  bgClass: string
  borderClass: string
}

export interface CategoryMeta extends CategoryStyle {
  id: Category
  label: string
}

const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  experience: {
    textClass: 'text-cat-experience',
    bgClass: 'bg-cat-experience',
    borderClass: 'border-cat-experience',
  },
  project: {
    textClass: 'text-cat-project',
    bgClass: 'bg-cat-project',
    borderClass: 'border-cat-project',
  },
  education: {
    textClass: 'text-cat-education',
    bgClass: 'bg-cat-education',
    borderClass: 'border-cat-education',
  },
  other: {
    textClass: 'text-cat-other',
    bgClass: 'bg-cat-other',
    borderClass: 'border-cat-other',
  },
}

export const categories = Object.fromEntries(
  resume.categories.map(({ id, label }) => [
    id,
    { id, label, ...CATEGORY_STYLES[id] },
  ]),
) as Record<Category, CategoryMeta>

export type {
  Category,
  ResumeContent,
  TimelineEntry,
} from '@/data/resume.schema'
