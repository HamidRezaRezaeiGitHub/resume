import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { resume } from '@/data/resume'

describe('resume sections', () => {
  it('presents the requested sections and keeps the summary about Hamid', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: resume.profile.name, level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText(resume.profile.headline)).toBeInTheDocument()
    expect(screen.getByText(resume.profile.summary)).not.toHaveTextContent(
      'HSBC',
    )
    expect(
      Array.from(document.querySelectorAll('main > section')).map(
        (section) => section.id,
      ),
    ).toEqual([
      'top',
      'experience',
      'projects',
      'skills',
      'education',
      'contact',
    ])
    expect(
      screen.queryByText(/Joined HSBC through FDM/),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('From repository history'),
    ).not.toBeInTheDocument()
  })

  it('keeps every top-bar link available and moves keyboard focus to its section', async () => {
    const user = userEvent.setup()
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    for (const { label, sectionId } of resume.navigation) {
      const link = within(nav).getByRole('link', { name: label })
      expect(link).toHaveAttribute('href', `#${sectionId}`)
      await user.click(link)
      expect(
        screen.getByRole('region', {
          name: resume.sections[sectionId].title,
        }),
      ).toHaveFocus()
    }
    await user.click(within(nav).getByRole('link', { name: /home/ }))
    expect(
      screen.getByRole('region', { name: resume.profile.name }),
    ).toHaveFocus()
  })

  it('preserves the PDF role breakdown and dates, with the current job first', () => {
    render(<App />)
    const experience = screen.getByRole('region', { name: 'Experiences' })
    const roles = within(experience).getAllByRole('article')
    expect(roles[0]).toHaveAttribute('id', 'hsbc-agency-lending')
    expect(
      roles.map((role) => within(role).getAllByRole('listitem').length),
    ).toEqual([7, 6, 5, 1])
    expect(
      within(roles[0]).getByText('Jun 2025', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2025-06')
    expect(
      within(roles[1]).getByText('Jun 2023', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2023-06')
    expect(
      within(roles[3]).getByText('Dec 2013', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2013-12')
    for (const id of ['platform-poc', 'ai-assistant', 'ai-enablement'])
      expect(roles[0]).toContainElement(document.getElementById(id))
    expect(within(roles[0]).getByText(/100% output parity/)).toHaveTextContent(
      'one selected trade type over a defined evaluation period',
    )
  })

  it('separates the three selected projects and keeps every bullet readable', () => {
    render(<App />)
    const projects = screen.getByRole('region', { name: 'Projects' })
    const entries = within(projects).getAllByRole('article')
    expect(entries.map((entry) => entry.id)).toEqual([
      'buildean',
      'buy-or-rent',
      'man-agent-ment',
    ])
    expect(
      entries.map((entry) => within(entry).getAllByRole('listitem').length),
    ).toEqual([3, 3, 2])
    expect(
      within(projects).getByText(/Flutter frontend in progress/),
    ).toBeInTheDocument()
    for (const entry of [...resume.experiences, ...resume.projects]) {
      for (const bullet of entry.bullets)
        expect(screen.getByText(bullet.text)).toBeVisible()
    }
  })

  it('shows all nine PDF skill categories without hiding skills behind filters', () => {
    render(<App />)
    const skills = screen.getByRole('region', { name: 'Skills' })
    expect(
      within(skills)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual([
      'Languages',
      'Backend & APIs',
      'Frontend',
      'Database & Storage',
      'Cloud & Infrastructure',
      'Build & Delivery',
      'Testing & Security',
      'Observability & Analytics',
      'Developer Workflow',
    ])
    for (const group of resume.skillGroups)
      expect(within(skills).getByText(group.skills.join(', '))).toBeVisible()
  })

  it('places degrees in Education and preserves their month precision', () => {
    render(<App />)
    const education = screen.getByRole('region', { name: 'Education' })
    const entries = within(education).getAllByRole('article')
    expect(entries).toHaveLength(2)
    expect(
      within(entries[0]).getByRole('heading', { level: 3 }),
    ).toHaveTextContent('Water Resources & Environmental Engineering')
    expect(
      within(entries[0]).getByText('Jan 2019', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2019-01')
    expect(
      within(entries[0]).getByText('Dec 2019', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2019-12')
  })

  it('copies the email and announces the result', async () => {
    const user = userEvent.setup()
    const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Copy email address' }))
    expect(copy).toHaveBeenCalledWith(resume.profile.email)
    expect(screen.getByRole('status')).toHaveTextContent('Email copied.')
    copy.mockRestore()
  })
  it('keeps contact usable when clipboard access is denied', async () => {
    const user = userEvent.setup()
    const copy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(new Error('Clipboard access denied'))
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Copy email address' }))
    expect(screen.getByRole('status')).toHaveTextContent(
      'You can select the email address or tap it to get in touch.',
    )
    expect(
      screen.getByRole('link', { name: resume.profile.email }),
    ).toHaveAttribute('href', `mailto:${resume.profile.email}`)
    copy.mockRestore()
  })
})
