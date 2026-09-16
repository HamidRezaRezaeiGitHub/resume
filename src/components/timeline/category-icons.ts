import {
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import type { Category } from '@/data/resume'

export const categoryIcons = {
  experience: BriefcaseBusiness,
  project: Code2,
  education: GraduationCap,
  teaching: BookOpen,
} satisfies Record<Category, LucideIcon>
