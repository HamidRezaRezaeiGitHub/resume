import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResumeEntry } from './ResumeEntry'
import { careerContent } from '@/test/contentFixtures'

const role = careerContent.experiences[0]
const project = careerContent.projects[0]

afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname)
  vi.restoreAllMocks()
})

describe('entry details', () => {
  it('starts collapsed and lets several entries stay open independently', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ResumeEntry {...role} subtitle={role.organization} />
        <ResumeEntry {...project} subtitle={project.role} />
      </>,
    )
    const roleToggle = screen.getByRole('button', { name: role.title })
    const projectToggle = screen.getByRole('button', { name: project.title })
    expect(roleToggle).toHaveAttribute('aria-expanded', 'false')
    expect(projectToggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Project source' })).toBeVisible()

    await user.click(roleToggle)
    await user.click(projectToggle)
    expect(screen.getAllByRole('list')).toHaveLength(2)
    expect(roleToggle).toHaveAttribute('aria-expanded', 'true')
    expect(projectToggle).toHaveAttribute('aria-expanded', 'true')
    expect(
      document.getElementById(roleToggle.getAttribute('aria-controls')!),
    ).toBeVisible()

    await user.click(roleToggle)
    expect(screen.getByText(role.bullets[0].text)).not.toBeVisible()
    expect(screen.getByText(project.bullets[0].text)).toBeVisible()
    expect(projectToggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('supports Tab, Enter and Space without removing heading semantics', async () => {
    const user = userEvent.setup()
    render(<ResumeEntry {...role} subtitle={role.organization} />)
    const heading = screen.getByRole('heading', { name: role.title, level: 3 })
    const toggle = within(heading).getByRole('button')
    await user.tab()
    expect(toggle).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('list')).toBeVisible()
    await user.keyboard(' ')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it.each([undefined, []])(
    'has no disclosure for missing or empty details (%s)',
    (bullets) => {
      render(
        <ResumeEntry
          {...role}
          bullets={bullets}
          subtitle={role.organization}
        />,
      )
      expect(screen.getByRole('heading', { name: role.title })).toBeVisible()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('list', { hidden: true }),
      ).not.toBeInTheDocument()
    },
  )

  it('opens only the entry targeted by an initial or changed bullet fragment', async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id)
    })
    const flushFrames = () =>
      act(() => {
        const pending = [...frames.values()]
        frames.clear()
        pending.forEach((callback) => callback(0))
      })
    window.history.replaceState(null, '', `#${role.bullets[0].id}`)
    const { unmount } = render(
      <>
        <ResumeEntry {...role} subtitle={role.organization} />
        <ResumeEntry {...project} subtitle={project.role} />
      </>,
    )
    const roleBullet = screen.getByText(role.bullets[0].text)
    const projectBullet = screen.getByText(project.bullets[0].text)
    const scrollRole = vi.fn()
    const scrollProject = vi.fn()
    roleBullet.scrollIntoView = scrollRole
    projectBullet.scrollIntoView = scrollProject
    flushFrames()
    expect(roleBullet).toBeVisible()
    expect(projectBullet).not.toBeVisible()
    flushFrames()
    expect(scrollRole).toHaveBeenCalledWith({
      block: 'start',
      behavior: 'instant',
    })

    act(() => {
      window.history.replaceState(null, '', `#${project.bullets[0].id}`)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(projectBullet).toBeVisible()
    expect(roleBullet).toBeVisible()
    flushFrames()
    expect(scrollProject).toHaveBeenCalledOnce()
    unmount()
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(frames.size).toBe(0)
  })
})
