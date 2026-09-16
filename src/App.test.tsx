import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { resume } from '@/data/resume'

const heading = (text: string) => (name: string) =>
  name.replace(/\s+/g, ' ') === text.replace(/\s+/g, ' ')

describe('resume experience', () => {
  it('makes the identity, headline, and every navigation destination available', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        name: resume.hero.title.join(' '),
        level: 1,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(resume.profile.headline)).toBeInTheDocument()
    expect(document.querySelector('.hero-intro')).not.toHaveTextContent('HSBC')
    expect(
      screen.queryByText(/Joined HSBC through FDM/),
    ).not.toBeInTheDocument()
    for (const { sectionId } of resume.navigation)
      expect(document.getElementById(sectionId)).toBeInTheDocument()
    for (const section of [resume.sections.timeline, resume.sections.skills])
      expect(
        screen.getByRole('heading', { name: heading(section.title), level: 2 }),
      ).toBeInTheDocument()
  })

  it('shows each career entry once and preserves date precision', () => {
    render(<App />)
    const journey = screen.getByRole('region', {
      name: heading(resume.sections.timeline.title),
    })
    expect(within(journey).getAllByRole('article')).toHaveLength(
      resume.timeline.length,
    )
    expect(document.querySelector('.career-timeline > li')).toHaveAttribute(
      'id',
      resume.currentRoleId,
    )
    expect(document.querySelector('.chapter-current')).toHaveTextContent(
      'Current',
    )
    expect(document.querySelectorAll('.chapter-current')).toHaveLength(1)
    expect(
      document.querySelector(`#${resume.currentRoleId} .chapter-date`),
    ).toHaveTextContent('Jun 2025 — Present')
    const education = document.getElementById('edu-western')!
    expect(
      within(education).getByText('Jan 2019', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2019-01')
    expect(
      within(education).getByText('Dec 2019', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2019-12')
    expect(
      within(document.getElementById('teaching')!).getByText('2013', {
        selector: 'time',
      }),
    ).toHaveAttribute('datetime', '2013')
    expect(
      within(document.getElementById('hsbc-data-service-layer')!).getByText(
        'Jun 2023',
        { selector: 'time' },
      ),
    ).toBeInTheDocument()
  })

  it('shows only selected projects and nests platform work under the current role', () => {
    render(<App />)
    expect(
      Array.from(
        document.querySelectorAll('.timeline-chapter.category-project'),
      )
        .map((entry) => entry.id)
        .sort(),
    ).toEqual(['buildean', 'buy-or-rent', 'man-agent-ment'])
    for (const id of ['platform-poc', 'ai-assistant', 'ai-enablement'])
      expect(document.getElementById(resume.currentRoleId)).toContainElement(
        document.getElementById(id),
      )
    expect(document.getElementById('hsbc-platform-ai')).not.toBeInTheDocument()
    expect(
      screen.queryByText('From repository history'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Date not listed')).not.toBeInTheDocument()
    for (const chapter of document.querySelectorAll('.timeline-chapter'))
      expect(chapter.querySelector('.chapter-date time')).toHaveAttribute(
        'datetime',
      )
    expect(
      within(document.getElementById('buy-or-rent')!).getByText(
        /The Flutter frontend is in progress/,
      ),
    ).toBeInTheDocument()
  })

  it('keeps every category and all achievements on one timeline', () => {
    render(<App />)
    expect(
      Array.from(document.querySelectorAll('main > section')).map(
        (section) => section.id,
      ),
    ).toEqual(['top', 'experience', 'skills', 'contact'])
    const timeline = document.getElementById('experience')!
    for (const entry of resume.timeline) {
      expect(timeline).toContainElement(document.getElementById(entry.id))
      for (const item of entry.highlights ?? []) {
        expect(document.getElementById(entry.id)).toContainElement(
          document.getElementById(item.id),
        )
        expect(
          screen.getByRole('heading', { name: item.title, level: 4 }),
        ).toBeInTheDocument()
        if (item.date)
          expect(document.querySelector(`#${item.id} time`)).toHaveAttribute(
            'datetime',
            item.date,
          )
      }
    }
    expect(document.querySelectorAll('details')).toHaveLength(0)
  })

  it('opens the mobile navigation and restores focus on Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('filters the skill field without navigating away', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'AI engineering' }))
    const skills = screen.getByRole('list', { name: 'AI engineering skills' })
    expect(within(skills).getByText('Spring AI')).toBeInTheDocument()
    expect(within(skills).queryByText('Docker')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'AI engineering' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('lets readers pause decorative motion', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(
      screen.getByRole('button', { name: 'Pause decorative motion' }),
    )
    expect(
      screen.getByRole('button', { name: 'Resume decorative motion' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(document.querySelector('.site')).toHaveClass('motion-paused')
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
})
