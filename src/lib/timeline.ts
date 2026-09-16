import type { TimelineEntry } from '@/data/resume'

/** Lead with the current role, then reverse chronology; unknown dates go last. */
export function sortTimeline(
  entries: readonly TimelineEntry[],
  currentRoleId?: string,
) {
  return [...entries].sort((a, b) => {
    if (a.id === currentRoleId) return -1
    if (b.id === currentRoleId) return 1
    return (b.startDate ?? '').localeCompare(a.startDate ?? '')
  })
}
