import type { TimelineEntry } from '@/data/resume'

/** Unknown dates are explicitly undated, never treated as a recent start. */
export function sortTimeline(entries: readonly TimelineEntry[]) {
  return [...entries].sort((a, b) =>
    (b.startDate ?? '').localeCompare(a.startDate ?? ''),
  )
}
