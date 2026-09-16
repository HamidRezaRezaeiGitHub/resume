import type { TimelineEntry } from '@/data/resume'
import { formatCareerDate } from '@/lib/dates'
import { categoryIcons } from '@/components/timeline/category-icons'

type HeadingEntry = Pick<
  TimelineEntry,
  | 'id'
  | 'category'
  | 'startDate'
  | 'endDate'
  | 'stage'
  | 'organization'
  | 'title'
  | 'team'
  | 'location'
>

export function TimelineHeading({
  entry,
  index,
  isCurrent,
  categoryLabel,
}: {
  entry: HeadingEntry
  index: number
  isCurrent: boolean
  categoryLabel: string
}) {
  const Icon = categoryIcons[entry.category]
  const stage = isCurrent ? 'Current role' : entry.stage
  return (
    <header className="chapter-heading">
      <div className="chapter-date-row">
        <p className="chapter-date mono">
          <time dateTime={entry.startDate}>
            {formatCareerDate(entry.startDate)}
          </time>
          {entry.endDate && (
            <>
              <span aria-hidden="true"> — </span>
              {entry.endDate === 'present' ? (
                <span>Present</span>
              ) : (
                <time dateTime={entry.endDate}>
                  {formatCareerDate(entry.endDate)}
                </time>
              )}
            </>
          )}
        </p>
        <span className="chapter-index mono" aria-hidden="true">
          / {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <span
        className={`chapter-year${isCurrent ? ' chapter-current' : ''}`}
        aria-hidden="true"
      >
        {isCurrent ? 'Current' : entry.startDate.slice(0, 4)}
      </span>
      <div className="chapter-category">
        <span className="chapter-marker">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span>{categoryLabel}</span>
        {stage && <span className="chapter-stage">{stage}</span>}
      </div>
      {entry.organization && (
        <p className="chapter-organization">{entry.organization}</p>
      )}
      <h3 id={`${entry.id}-title`}>{entry.title}</h3>
      {entry.team && <p className="chapter-team">{entry.team}</p>}
      {entry.location && <p className="chapter-location">{entry.location}</p>}
    </header>
  )
}
