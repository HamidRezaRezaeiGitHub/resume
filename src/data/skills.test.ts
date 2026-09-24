import { describe, expect, it } from 'vitest'
import { resume } from './resume'
import { skillsForGroup } from './skills'

describe('graph topics and printed groups', () => {
  it('combines separate topics into one deduplicated list group', () => {
    const topics = [
      { id: 'observability', groupId: 'operations' },
      { id: 'analytics', groupId: 'operations' },
    ]
    const skills = [
      { id: 'logs', label: 'Log tool', categories: ['observability'] },
      { id: 'reports', label: 'Report tool', categories: ['analytics'] },
      {
        id: 'shared',
        label: 'Shared tool',
        categories: ['observability', 'analytics'],
      },
    ]
    expect(
      skillsForGroup('operations', topics, skills).map((skill) => skill.label),
    ).toEqual(['Log tool', 'Report tool', 'Shared tool'])
  })
  it('lists tools just once even when several topics belong to the same PDF group', () => {
    for (const group of resume.skillGroups) {
      const entries = skillsForGroup(
        group.id,
        resume.skillCategories,
        resume.skills,
      )
      expect(new Set(entries.map((skill) => skill.id)).size).toBe(
        entries.length,
      )
    }
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
