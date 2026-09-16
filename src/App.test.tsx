import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('App', () => {
  it('renders the profile name in the hero', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /hamid reza rezaei/i, level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders the timeline section with all category labels', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /^timeline$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByText(/professional experience/i).length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText(/personal projects/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/education/i).length).toBeGreaterThan(0)
  })
})
