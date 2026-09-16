import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('App', () => {
  it('renders the profile name in the hero', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /hamid r\. rezaei/i, level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders the main resume sections', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /experience & education/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /professional case studies/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /skills & technologies/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /personal & open-source/i }),
    ).toBeInTheDocument()
  })
})
