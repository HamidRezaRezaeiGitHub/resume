interface SkillMembership {
  id: string
  categories: string[]
}

// Membership and ecosystem relationships share one undirected graph.
export function skillConnections(
  skills: { id: string; categories: string[] }[],
  relationships: { source: string; target: string }[],
) {
  return [
    ...skills.flatMap((skill) =>
      skill.categories.map((source) => ({ source, target: skill.id })),
    ),
    ...relationships,
  ]
}

// A tool can belong to several graph topics within the same printed group.
export function skillsForGroup<T extends SkillMembership>(
  groupId: string,
  categories: { id: string; groupId: string }[],
  skills: T[],
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
