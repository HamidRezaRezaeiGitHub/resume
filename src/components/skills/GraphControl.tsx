import { useEffect, useId, useState, type ReactNode } from 'react'

export function GraphControl({
  label,
  hint,
  disabled,
  onClick,
  children,
}: {
  label: string
  hint: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [open])
  return (
    <span
      className="network-control"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setOpen(true)
      }}
      onPointerLeave={() => setOpen(false)}
    >
      <button
        aria-label={label}
        aria-describedby={open ? id : undefined}
        disabled={disabled}
        onClick={onClick}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
        }}
      >
        {children}
      </button>
      {open && (
        <span className="network-tooltip" id={id} role="tooltip">
          {hint}
        </span>
      )}
    </span>
  )
}
