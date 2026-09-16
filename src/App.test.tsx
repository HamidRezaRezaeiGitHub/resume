import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'
import { resume } from '@/data/resume'

describe('App', () => {
  it('renders the profile name in the hero', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: resume.profile.name, level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders the main resume sections', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', {
        name: resume.sections.timeline.title,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: resume.sections.caseStudies.title,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: resume.sections.skills.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: resume.sections.projects.title }),
    ).toBeInTheDocument()
  })
})
