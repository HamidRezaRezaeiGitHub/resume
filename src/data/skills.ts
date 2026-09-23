import type { ResumeContent } from './resume'

// A tool can belong to several graph topics within the same printed group.
export function skillsForGroup(
  groupId: string,
  categories: ResumeContent['skillCategories'],
  skills: ResumeContent['skills'],
) {
  const topicIds = new Set(
    categories
      .filter((category) => category.groupId === groupId)
      .map((category) => category.id),
  )
  return skills.filter((skill) =>
    skill.categories.some((id) => topicIds.has(id)),
  )
}
