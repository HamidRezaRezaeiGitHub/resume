import rawResumeContent from '@/data/resume.json'
import type { ResumeContent } from '@/data/resume.schema'

// Validation runs before development and builds; Zod stays out of the browser.
export const resume = rawResumeContent as ResumeContent

export type {
  ResumeContent,
  ResumeBullet,
  CareerPeriod,
} from '@/data/resume.schema'
