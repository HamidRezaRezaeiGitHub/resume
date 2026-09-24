import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { resume } from '@/data/resume'
import { skillsForGroup } from '@/data/skills'

vi.mock('@/data/resume', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/data/resume')>()
  const { careerContent, graphContent } = await import('@/test/contentFixtures')
  return {
    ...original,
    resume: { ...original.resume, ...careerContent, ...graphContent },
  }
})

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
    const hero = screen.getByRole('region', { name: resume.profile.name })
    expect(
      within(hero).getByRole('link', { name: resume.hero.experienceLabel }),
    ).toHaveAttribute('href', '#experience')
    expect(
      within(hero).getByRole('button', { name: resume.downloads.buttonLabel }),
    ).toHaveAttribute('aria-haspopup', 'dialog')
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

  it('renders authored role order, optional teams, dates and every bullet', () => {
    render(<App />)
    const experience = screen.getByRole('region', { name: 'Experiences' })
    const roles = within(experience).getAllByRole('article')
    expect(roles.map((role) => role.id)).toEqual([
      'example-current-role',
      'example-earlier-role',
    ])
    expect(
      roles.map((role) => within(role).getAllByRole('listitem').length),
    ).toEqual([2, 1])
    expect(
      within(roles[0]).getByText('Jun 2025', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2025-06')
    expect(
      within(roles[1]).getByText('2021', { selector: 'time' }),
    ).toHaveAttribute('datetime', '2021')
    for (const id of ['example-api', 'example-delivery'])
      expect(roles[0]).toContainElement(document.getElementById(id))
    expect(
      within(roles[0]).getByText('Platform · Example Company'),
    ).toBeVisible()
    expect(within(roles[1]).getByText('Earlier Company')).toBeVisible()
    expect(
      within(roles[0]).getByText('Present', { exact: false }),
    ).toBeVisible()
  })

  it('renders project stages, links and all career bullets from content', () => {
    render(<App />)
    const projects = screen.getByRole('region', { name: 'Projects' })
    const entries = within(projects).getAllByRole('article')
    expect(entries.map((entry) => entry.id)).toEqual(['example-project'])
    expect(
      entries.map((entry) => within(entry).getAllByRole('listitem').length),
    ).toEqual([1])
    expect(within(projects).getByText('In progress')).toBeInTheDocument()
    expect(
      within(projects).getByRole('link', { name: 'Project source' }),
    ).toHaveAttribute('href', 'https://example.com/project')
    for (const entry of [...resume.experiences, ...resume.projects]) {
      for (const bullet of entry.bullets)
        expect(screen.getByText(bullet.text)).toBeVisible()
    }
  })

  it('makes every configured skill group available in the readable list', async () => {
    const user = userEvent.setup()
    render(<App />)
    const introduction = screen.getByText(resume.sections.skills.eyebrow)
    expect(
      screen.getByRole('group', { name: 'Interactive skills network' }),
    ).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'List' }))
    expect(introduction).toBeVisible()
    expect(
      screen.queryByRole('group', { name: 'Interactive skills network' }),
    ).not.toBeInTheDocument()
    const skills = screen.getByRole('region', { name: 'Skills' })
    expect(
      within(skills)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual(['Backend & APIs', 'Frontend'])
    for (const group of resume.skillGroups)
      expect(
        within(skills).getByText(
          skillsForGroup(group.id, resume.skillCategories, resume.skills)
            .map((skill) => skill.label)
            .join(', '),
        ),
      ).toBeVisible()
  })

  it('places degrees in Education and preserves their month precision', () => {
    render(<App />)
    const education = screen.getByRole('region', { name: 'Education' })
    const entries = within(education).getAllByRole('article')
    expect(entries).toHaveLength(1)
    expect(
      within(entries[0]).getByRole('heading', { level: 3 }),
    ).toHaveTextContent('Systems Engineering')
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
