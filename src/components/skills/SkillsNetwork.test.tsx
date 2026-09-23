import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Skills } from '@/components/Skills'

const setup = () => {
  vi.spyOn(SVGElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 1000,
    height: 600,
    left: 0,
    top: 0,
    right: 1000,
    bottom: 600,
    x: 0,
    y: 0,
    toJSON() {},
  })
  render(<Skills />)
  return screen.getByRole('group', { name: 'Interactive skills network' })
}
afterEach(() => vi.restoreAllMocks())

describe('skills exploration', () => {
  it('explores shared connections from an accessible picker and returns to a complete list', async () => {
    const user = userEvent.setup()
    setup()
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Follow a connection' }),
      'typescript',
    )
    const connections = screen.getByLabelText('Connections for TypeScript')
    expect(
      within(connections)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['Languages↗', 'Backend & APIs↗', 'Frontend↗'])
    await user.click(
      within(connections).getByRole('button', { name: /Frontend/ }),
    )
    expect(screen.getByRole('combobox')).toHaveValue('frontend')
    await user.click(screen.getByRole('button', { name: 'List' }))
    expect(screen.getAllByRole('term')).toHaveLength(9)
    expect(screen.getByText(/Java, TypeScript, JavaScript, SQL/)).toBeVisible()
    expect(
      screen.queryByRole('group', { name: 'Interactive skills network' }),
    ).not.toBeInTheDocument()
  })
  it('supports keyboard pan, bounded zoom and reset without capturing normal wheel scrolling', async () => {
    const user = userEvent.setup()
    const graph = setup()
    const camera = graph.querySelector('.network-camera')!
    const initial = camera.getAttribute('transform')
    fireEvent.keyDown(graph, { key: 'ArrowRight' })
    expect(camera.getAttribute('transform')).not.toBe(initial)
    fireEvent.keyDown(graph, { key: '0' })
    expect(camera.getAttribute('transform')).toBe(initial)
    const normal = new WheelEvent('wheel', {
      deltaY: 100,
      cancelable: true,
      bubbles: true,
    })
    fireEvent(graph, normal)
    expect(normal.defaultPrevented).toBe(false)
    expect(camera.getAttribute('transform')).toBe(initial)
    const zoom = new WheelEvent('wheel', {
      deltaY: -60,
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    })
    fireEvent(graph, zoom)
    expect(zoom.defaultPrevented).toBe(true)
    expect(camera.getAttribute('transform')).not.toBe(initial)
    await user.click(screen.getByRole('button', { name: 'Reset graph' }))
    expect(camera.getAttribute('transform')).toBe(initial)
    for (let i = 0; i < 20; i++)
      await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled()
    expect(screen.getByLabelText('Zoom level')).toHaveTextContent('200%')
  })
  it('keeps touch capture opt-in and lets Escape leave exploration', async () => {
    const user = userEvent.setup()
    const graph = setup()
    expect(graph).toHaveAttribute('data-exploring', 'false')
    await user.click(screen.getByText('Explore graph'))
    expect(graph).toHaveAttribute('data-exploring', 'true')
    fireEvent.keyDown(graph, { key: 'Escape' })
    expect(graph).toHaveAttribute('data-exploring', 'false')
  })
  it('stops ambient motion when paused, offscreen, reduced-motion is requested, or unmounted', async () => {
    const user = userEvent.setup()
    let onVisibility: IntersectionObserverCallback = () => {}
    const disconnect = vi.fn()
    const originalObserver = window.IntersectionObserver
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          onVisibility = callback
        }
        observe() {}
        disconnect = disconnect
      },
    )
    const request = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(7)
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    let onPreference = () => {}
    const preference = {
      matches: false,
      addEventListener: (_: string, callback: () => void) => {
        onPreference = callback
      },
      removeEventListener: vi.fn(),
    }
    vi.spyOn(window, 'matchMedia').mockReturnValue(
      preference as unknown as MediaQueryList,
    )
    const { unmount } = render(<Skills />)
    const graph = screen.getByRole('group', {
      name: 'Interactive skills network',
    })
    const visible = (isIntersecting: boolean) =>
      act(() =>
        onVisibility(
          [{ isIntersecting } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      )
    visible(true)
    expect(request).toHaveBeenCalled()
    expect(graph).toHaveAttribute('data-motion', 'on')
    visible(false)
    expect(graph).toHaveAttribute('data-motion', 'off')
    visible(true)
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    expect(graph).toHaveAttribute('data-motion', 'off')
    hidden.mockReturnValue(false)
    fireEvent(document, new Event('visibilitychange'))
    expect(graph).toHaveAttribute('data-motion', 'on')
    preference.matches = true
    act(onPreference)
    expect(graph).toHaveAttribute('data-motion', 'off')
    preference.matches = false
    act(onPreference)
    await user.click(screen.getByRole('button', { name: 'Pause graph motion' }))
    visible(true)
    expect(graph).toHaveAttribute('data-motion', 'off')
    unmount()
    expect(cancel).toHaveBeenCalledWith(7)
    expect(disconnect).toHaveBeenCalled()
    expect(preference.removeEventListener).toHaveBeenCalled()
    vi.stubGlobal('IntersectionObserver', originalObserver)
  })
})
