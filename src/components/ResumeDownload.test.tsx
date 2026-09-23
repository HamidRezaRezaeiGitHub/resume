import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResumeDownload } from './ResumeDownload'
import { Hero } from './Hero'
import { Contact } from './Contact'
import { resume } from '@/data/resume'

// jsdom lacks dialog methods. Native focus trapping, Escape and focus return
// are checked in the real browser; these shims only expose lifecycle events.
beforeEach(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.open = true
      },
    },
    close: {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.open = false
        this.dispatchEvent(new Event('close'))
      },
    },
  })
})
afterEach(() => {
  cleanup()
  document.documentElement.style.overflow = ''
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
  vi.restoreAllMocks()
})

describe('resume downloads', () => {
  it('offers the same two direct downloads from the hero and contact section', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Hero />
        <Contact />
      </>,
    )
    for (const trigger of screen.getAllByRole('button', {
      name: resume.downloads.buttonLabel,
    })) {
      await user.click(trigger)
      const dialog = screen.getByRole('dialog', {
        name: resume.downloads.title,
      })
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(trigger).toHaveAttribute('aria-controls', dialog.id)
      expect(within(dialog).getAllByRole('link')).toHaveLength(2)
      for (const option of resume.downloads.options) {
        const link = within(dialog).getByRole('link', {
          name: `${option.label} ${option.description}`,
        })
        expect(link).toHaveAttribute('href', option.path)
        expect(link).toHaveAttribute('download', option.path.split('/').at(-1))
      }
      await user.click(
        within(dialog).getByRole('button', {
          name: resume.downloads.closeLabel,
        }),
      )
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    }
  })

  it('closes after choosing either PDF and restores the previous scroll setting', async () => {
    const user = userEvent.setup()
    document.documentElement.style.overflow = 'auto'
    render(<ResumeDownload />)
    for (const option of resume.downloads.options) {
      await user.click(
        screen.getByRole('button', { name: resume.downloads.buttonLabel }),
      )
      expect(document.documentElement.style.overflow).toBe('hidden')
      const link = screen.getByRole('link', {
        name: `${option.label} ${option.description}`,
      })
      link.addEventListener('click', (event) => event.preventDefault(), {
        once: true,
      })
      await user.click(link)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(document.documentElement.style.overflow).toBe('auto')
    }
    document.documentElement.style.overflow = ''
  })

  it('dismisses only a complete outside click, not a press that started inside', async () => {
    const user = userEvent.setup()
    render(<ResumeDownload />)
    await user.click(
      screen.getByRole('button', { name: resume.downloads.buttonLabel }),
    )
    const dialog = screen.getByRole('dialog')
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(20, 20, 360, 250),
    )
    fireEvent(
      dialog,
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 40,
        clientY: 40,
      }),
    )
    fireEvent.click(dialog, { clientX: 10, clientY: 10 })
    expect(dialog).toBeVisible()
    // MouseEvent supplies coordinates in jsdom, which lacks PointerEvent.
    fireEvent(
      dialog,
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 10,
        clientY: 10,
      }),
    )
    fireEvent.click(dialog, { clientX: 10, clientY: 10 })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('cleans up when the browser closes the dialog or the component unmounts', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ResumeDownload />)
    const trigger = screen.getByRole('button', {
      name: resume.downloads.buttonLabel,
    })
    await user.click(trigger)
    act(() => (screen.getByRole('dialog') as HTMLDialogElement).close())
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(document.documentElement.style.overflow).toBe('')
    await user.click(trigger)
    unmount()
    expect(document.documentElement.style.overflow).toBe('')
    expect(document.querySelector('dialog')).toBeNull()
  })
})
