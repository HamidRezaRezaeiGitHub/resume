import { motion } from 'motion/react'
import { CATEGORIES, type TimelineEntry } from '@/data/resume'
import { cn } from '@/lib/utils'

interface TimelineItemProps {
  entry: TimelineEntry
  /** Side of the center rail on desktop layouts. */
  side: 'left' | 'right'
  index: number
}

export function TimelineItem({ entry, side, index }: TimelineItemProps) {
  const meta = CATEGORIES[entry.category]

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={cn(
        'relative flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center',
      )}
    >
      {/* Left column (desktop) */}
      <div
        className={cn(
          'hidden md:block',
          side === 'left' ? 'md:pr-10 md:text-right' : 'md:col-start-3 md:pl-10',
        )}
      >
        <Card entry={entry} meta={meta} align={side === 'left' ? 'right' : 'left'} />
      </div>

      {/* Center node */}
      <div className="absolute left-4 top-1 md:static md:col-start-2 md:flex md:justify-center">
        <span className="relative flex size-4 items-center justify-center">
          <span
            className={cn(
              'absolute inline-flex size-full animate-ping rounded-full opacity-40',
              meta.bgClass,
            )}
          />
          <span
            className={cn(
              'relative inline-flex size-4 rounded-full border-2 border-background',
              meta.bgClass,
            )}
          />
        </span>
      </div>

      {/* Mobile card / right column (desktop) */}
      <div
        className={cn(
          'pl-12 md:pl-0',
          side === 'left' ? 'md:hidden' : 'md:hidden',
        )}
      >
        <Card entry={entry} meta={meta} align="left" />
      </div>
    </motion.li>
  )
}

function Card({
  entry,
  meta,
  align,
}: {
  entry: TimelineEntry
  meta: (typeof CATEGORIES)[keyof typeof CATEGORIES]
  align: 'left' | 'right'
}) {
  return (
    <article
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        'border-l-4',
        meta.borderClass,
        align === 'right' && 'md:border-l-0 md:border-r-4',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          align === 'right' && 'md:flex-row-reverse',
        )}
      >
        <span
          className={cn(
            'text-xs font-semibold uppercase tracking-wider',
            meta.textClass,
          )}
        >
          {meta.label}
        </span>
        <span className="text-xs text-muted-foreground">{entry.period}</span>
      </div>

      <h3 className="mt-2 text-lg font-semibold">{entry.title}</h3>
      {entry.organization && (
        <p className="text-sm font-medium text-muted-foreground">
          {entry.organization}
          {entry.location ? ` · ${entry.location}` : ''}
        </p>
      )}

      <p className="mt-3 text-sm text-muted-foreground">{entry.summary}</p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul
          className={cn(
            'mt-3 space-y-1 text-sm',
            align === 'right' ? 'md:text-right' : 'text-left',
          )}
        >
          {entry.highlights.map((h) => (
            <li key={h} className="text-muted-foreground">
              {h}
            </li>
          ))}
        </ul>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <div
          className={cn(
            'mt-4 flex flex-wrap gap-2',
            align === 'right' && 'md:justify-end',
          )}
        >
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {entry.link && (
        <a
          href={entry.link.url}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            'mt-4 inline-block text-sm font-medium underline underline-offset-4',
            meta.textClass,
          )}
        >
          {entry.link.label}
        </a>
      )}
    </article>
  )
}
