import type { ReactNode } from 'react'

export function Section({
  id,
  title,
  children,
  className = '',
}: {
  id: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      className={`section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="container">
        <div className="section-heading">
          <h2 tabIndex={-1} id={`${id}-title`}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}
