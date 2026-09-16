import type { TimelineEntry } from '@/data/resume'

/** Lead with the current role, then reverse chronology. */
export function sortTimeline(
  entries: readonly TimelineEntry[],
  currentRoleId?: string,
) {
  return [...entries].sort((a, b) => {
    const priority =
      Number(b.id === currentRoleId) - Number(a.id === currentRoleId)
    return priority || b.startDate.localeCompare(a.startDate)
  })
}
