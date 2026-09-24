import type { ResumeContent } from '@/data/resume'

// Small, deliberately fictional data keeps behavior tests independent of resume edits.
export const graphContent = {
  skillGroups: [
    { id: 'backend', title: 'Backend & APIs' },
    { id: 'frontend', title: 'Frontend' },
  ],
  skillCategories: [
    { id: 'backend', title: 'Backend', groupId: 'backend' },
    { id: 'frontend', title: 'Frontend', groupId: 'frontend' },
  ],
  skills: [
    { id: 'java', label: 'Java', categories: ['backend'] },
    {
      id: 'javascript',
      label: 'JavaScript',
      categories: ['backend', 'frontend'],
    },
    {
      id: 'typescript',
      label: 'TypeScript',
      categories: ['backend', 'frontend'],
    },
    { id: 'react', label: 'React', categories: ['frontend'] },
    { id: 'vitest', label: 'Vitest', categories: ['frontend'] },
  ],
  skillRelationships: [
    { source: 'typescript', target: 'react' },
    { source: 'typescript', target: 'javascript' },
    { source: 'react', target: 'vitest' },
  ],
} satisfies Pick<
  ResumeContent,
  'skills' | 'skillCategories' | 'skillGroups' | 'skillRelationships'
>

export const careerContent = {
  experiences: [
    {
      id: 'example-current-role',
      title: 'Software Engineer',
      organization: 'Example Company',
      team: 'Platform',
      location: 'Toronto',
      startDate: '2025-06',
      endDate: 'present',
      bullets: [
        { id: 'example-api', text: 'Built an API for a sample service.' },
        {
          id: 'example-delivery',
          text: 'Improved the sample delivery workflow.',
        },
      ],
    },
    {
      id: 'example-earlier-role',
      title: 'Developer',
      organization: 'Earlier Company',
      location: 'London',
      startDate: '2021',
      endDate: '2025-05',
      bullets: [
        { id: 'example-maintenance', text: 'Maintained a sample application.' },
      ],
    },
  ],
  projects: [
    {
      id: 'example-project',
      title: 'Example Project',
      role: 'Creator',
      stage: 'In progress',
      startDate: '2024',
      endDate: 'present',
      bullets: [
        { id: 'example-project-bullet', text: 'Designed a sample project.' },
      ],
      links: [{ label: 'Project source', url: 'https://example.com/project' }],
    },
  ],
  education: [
    {
      id: 'example-degree',
      title: 'Master of Engineering',
      field: 'Systems Engineering',
      organization: 'Example University',
      location: 'London',
      startDate: '2019-01',
      endDate: '2019-12',
    },
  ],
} satisfies Pick<ResumeContent, 'experiences' | 'projects' | 'education'>
