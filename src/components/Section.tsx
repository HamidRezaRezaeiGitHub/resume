import type { ReactNode } from 'react'
import { Reveal } from '@/components/Reveal'

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
}: {
  id: string
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="container">
        <Reveal className="section-heading">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 tabIndex={-1} id={`${id}-title`}>
            {title}
          </h2>
          {description && <p className="section-description">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
