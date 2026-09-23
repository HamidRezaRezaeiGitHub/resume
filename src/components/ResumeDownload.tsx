import { useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, FileText, X } from 'lucide-react'
import { resume } from '@/data/resume'
import './resume-download.css'

export function ResumeDownload() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const outsidePress = useRef(false)
  const id = useId()
  const content = resume.downloads

  useLayoutEffect(() => {
    if (!open) return
    const dialog = dialogRef.current!
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    dialog.showModal()
    const position = () => {
      const trigger = triggerRef.current!.getBoundingClientRect()
      const { width, height } = dialog.getBoundingClientRect()
      const below = trigger.bottom + 12
      const top =
        below + height <= window.innerHeight - 16
          ? below
          : trigger.top - height - 12
      dialog.style.setProperty(
        '--download-left',
        `${Math.max(16, Math.min(trigger.left, window.innerWidth - width - 16))}px`,
      )
      dialog.style.setProperty(
        '--download-top',
        `${Math.max(16, Math.min(top, window.innerHeight - height - 16))}px`,
      )
    }
    position()
    window.addEventListener('resize', position)
    return () => {
      window.removeEventListener('resize', position)
      root.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [open])

  const outside = (x: number, y: number) => {
    const bounds = dialogRef.current!.getBoundingClientRect()
    return (
      x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom
    )
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="resume-download-button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(true)}
      >
        <Download size={17} aria-hidden="true" />
        {content.buttonLabel}
      </button>
      {createPortal(
        <dialog
          ref={dialogRef}
          id={id}
          className="resume-download-dialog"
          aria-labelledby={`${id}-title`}
          onClose={() => setOpen(false)}
          onPointerDown={(event) => {
            outsidePress.current = outside(event.clientX, event.clientY)
          }}
          onClick={(event) => {
            if (outsidePress.current && outside(event.clientX, event.clientY))
              dialogRef.current?.close()
            outsidePress.current = false
          }}
        >
          <div className="resume-download-heading">
            <h2 id={`${id}-title`}>{content.title}</h2>
            <button
              type="button"
              className="resume-download-close"
              aria-label={content.closeLabel}
              onClick={() => dialogRef.current?.close()}
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>
          <div className="resume-download-options">
            {content.options.map((option) => (
              <a
                key={option.id}
                href={option.path}
                download={option.path.split('/').at(-1)}
                className="resume-download-option"
                onClick={() => dialogRef.current?.close()}
              >
                <FileText size={22} aria-hidden="true" />
                <span>
                  <strong>{option.label}</strong>{' '}
                  <span>{option.description}</span>
                </span>
                <Download size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </dialog>,
        document.body,
      )}
    </>
  )
}
