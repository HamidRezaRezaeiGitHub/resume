import { describe, expect, it } from 'vitest'
import { resume } from './resume'
import { skillsForGroup } from './skills'

describe('graph topics and printed groups', () => {
  it('keeps Observability and Analytics separate in the graph but together in the list', () => {
    const observability = resume.skills
      .filter((skill) => skill.categories.includes('observability'))
      .map((skill) => skill.label)
    const analytics = resume.skills
      .filter((skill) => skill.categories.includes('analytics'))
      .map((skill) => skill.label)
    expect(observability).toEqual(['Grafana', 'Geneos'])
    expect(analytics).toEqual(['SQL', 'BigQuery', 'Looker Studio', 'R'])
    expect(
      skillsForGroup(
        'observability',
        resume.skillCategories,
        resume.skills,
      ).map((skill) => skill.label),
    ).toEqual(['SQL', 'BigQuery', 'Looker Studio', 'Grafana', 'Geneos', 'R'])
  })
  it('lists tools just once even when several topics belong to the same PDF group', () => {
    const backend = skillsForGroup(
      'backend',
      resume.skillCategories,
      resume.skills,
    )
    expect(backend.filter((skill) => skill.id === 'spring-mvc')).toHaveLength(1)
    expect(backend.map((skill) => skill.id)).toContain('jwt')
    const allListed = new Set(
      resume.skillGroups.flatMap((group) =>
        skillsForGroup(group.id, resume.skillCategories, resume.skills).map(
          (skill) => skill.id,
        ),
      ),
    )
    expect(allListed.size).toBe(resume.skills.length)
  })
})
