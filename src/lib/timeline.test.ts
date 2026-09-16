import { describe, expect, it } from 'vitest'
import { sortTimeline } from '@/lib/timeline'
import type { TimelineEntry } from '@/data/resume'
const entry = (id: string, startDate?: string): TimelineEntry => ({
  id,
  category: 'project',
  title: id,
  summary: id,
  startDate,
})
describe('timeline ordering', () => {
  it('keeps the current job first while sorting overlapping projects by date', () => {
    const input = [
      entry('project-2026', '2026-08'),
      { ...entry('current-role', '2025-06'), category: 'experience' as const },
      entry('project-2025', '2025-09'),
      entry('older-role', '2023-06'),
      entry('undated'),
    ]
    expect(sortTimeline(input, 'current-role').map((item) => item.id)).toEqual([
      'current-role',
      'project-2026',
      'project-2025',
      'older-role',
      'undated',
    ])
    expect(input[0].id).toBe('project-2026')
  })
  it('sorts mixed categories by date and leaves unknown dates explicitly last', () => {
    const input = [
      entry('undated'),
      entry('older', '2021-04'),
      entry('recent', '2025-06'),
      entry('year-only', '2019'),
    ]
    expect(sortTimeline(input).map((item) => item.id)).toEqual([
      'recent',
      'older',
      'year-only',
      'undated',
    ])
    expect(input[0].id).toBe('undated')
  })
  it('preserves supplied order when dates have equal precision', () => {
    expect(
      sortTimeline([entry('teaching', '2013'), entry('education', '2013')]).map(
        (item) => item.id,
      ),
    ).toEqual(['teaching', 'education'])
  })
})
