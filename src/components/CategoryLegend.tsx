import { CATEGORIES, type Category } from '@/data/resume'
import { cn } from '@/lib/utils'

export function CategoryLegend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-6 gap-y-2',
        className,
      )}
    >
      {(Object.keys(CATEGORIES) as Category[]).map((key) => {
        const meta = CATEGORIES[key]
        return (
          <li key={key} className="flex items-center gap-2 text-sm">
            <span
              className={cn('size-3 rounded-full', meta.bgClass)}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{meta.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
