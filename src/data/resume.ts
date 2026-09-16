export type Category = 'experience' | 'project' | 'education' | 'other'

export interface CategoryMeta {
  id: Category
  label: string
  /** Tailwind text color class mapped to the category token. */
  textClass: string
  /** Tailwind background color class mapped to the category token. */
  bgClass: string
  /** Tailwind border color class mapped to the category token. */
  borderClass: string
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  experience: {
    id: 'experience',
    label: 'Professional Experience',
    textClass: 'text-cat-experience',
    bgClass: 'bg-cat-experience',
    borderClass: 'border-cat-experience',
  },
  project: {
    id: 'project',
    label: 'Personal Projects',
    textClass: 'text-cat-project',
    bgClass: 'bg-cat-project',
    borderClass: 'border-cat-project',
  },
  education: {
    id: 'education',
    label: 'Education',
    textClass: 'text-cat-education',
    bgClass: 'bg-cat-education',
    borderClass: 'border-cat-education',
  },
  other: {
    id: 'other',
    label: 'Other',
    textClass: 'text-cat-other',
    bgClass: 'bg-cat-other',
    borderClass: 'border-cat-other',
  },
}

export interface TimelineEntry {
  id: string
  category: Category
  title: string
  organization?: string
  location?: string
  /** Display string for the period, e.g. "2021 — Present". */
  period: string
  /** Sortable start year, newest first. */
  startYear: number
  summary: string
  highlights?: string[]
  tags?: string[]
  link?: { label: string; url: string }
}

export interface Profile {
  name: string
  headline: string
  tagline: string
  location?: string
  email?: string
  links: { label: string; url: string }[]
}

export const profile: Profile = {
  name: 'Hamid Reza Rezaei',
  headline: 'Software Engineer',
  tagline:
    'I build resilient, well-tested software and enjoy turning complex problems into simple, elegant solutions.',
  location: 'Canada',
  links: [
    { label: 'GitHub', url: 'https://github.com/HamidRezaRezaeiGitHub' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
  ],
}

// Sample data — replace with real content. Ordered newest-first by startYear.
export const timeline: TimelineEntry[] = [
  {
    id: 'exp-current',
    category: 'experience',
    title: 'Senior Software Engineer',
    organization: 'Company Name',
    location: 'Remote',
    period: '2023 — Present',
    startYear: 2023,
    summary:
      'Lead development of core platform services, focusing on reliability, performance, and developer experience.',
    highlights: [
      'Drove a major architecture migration with zero downtime.',
      'Mentored engineers and established testing best practices.',
    ],
    tags: ['TypeScript', 'React', 'Node.js', 'Cloud'],
  },
  {
    id: 'proj-resume',
    category: 'project',
    title: 'Animated Resume Website',
    period: '2025',
    startYear: 2025,
    summary:
      'A scroll-driven single-page resume built with React, Vite, Tailwind, and Motion, deployed on Cloudflare Pages.',
    highlights: ['Scroll-linked timeline animations.', 'Color-coded categories.'],
    tags: ['React', 'Vite', 'Tailwind', 'Motion'],
    link: {
      label: 'Source',
      url: 'https://github.com/HamidRezaRezaeiGitHub/resume',
    },
  },
  {
    id: 'exp-prev',
    category: 'experience',
    title: 'Software Engineer',
    organization: 'Previous Company',
    period: '2020 — 2023',
    startYear: 2020,
    summary:
      'Built and shipped customer-facing features across the stack in a fast-paced environment.',
    tags: ['Java', 'Spring', 'PostgreSQL'],
  },
  {
    id: 'edu-degree',
    category: 'education',
    title: 'B.Sc. in Computer Engineering',
    organization: 'University Name',
    period: '2014 — 2018',
    startYear: 2014,
    summary:
      'Focused on software engineering, algorithms, and distributed systems.',
    tags: ['Algorithms', 'Systems'],
  },
]
