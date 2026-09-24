import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SkillsNetwork } from './SkillsNetwork'
import { buildSkillsGraph, type SkillsGraph } from './graph'
import { graphContent } from '@/test/contentFixtures'

const testGraph = buildSkillsGraph(
  graphContent.skillCategories,
  graphContent.skills,
  graphContent.skillRelationships,
)

const setup = (model: SkillsGraph = testGraph) => {
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
  render(<SkillsNetwork graph={model} />)
  return screen.getByRole('group', { name: 'Interactive skills network' })
}
afterEach(() => vi.restoreAllMocks())

describe('skills exploration', () => {
  it('selects nodes directly and highlights only their connections', () => {
    const graph = setup()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByText('Find the connections.')).not.toBeInTheDocument()
    fireEvent.click(within(graph).getByRole('button', { name: 'TypeScript' }))
    expect(graph.querySelectorAll('line.is-connected')).toHaveLength(4)
    expect(
      within(graph).getByRole('button', { name: 'TypeScript' }),
    ).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(within(graph).getByRole('button', { name: 'Java' }))
    expect(graph.querySelectorAll('line.is-connected')).toHaveLength(1)
  })
  it('lets keyboard users reach every node, select it and leave without tabbing through every node', async () => {
    const user = userEvent.setup()
    const graph = setup()
    const first = within(graph).getByRole('button', { name: 'Backend' })
    for (let i = 0; i < 12 && document.activeElement !== first; i++)
      await user.tab()
    expect(first).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(
      within(graph).getByRole('button', { name: 'Frontend' }),
    ).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(document.activeElement).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard('{Home}')
    expect(within(graph).getByRole('button', { name: 'Backend' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(within(graph).getByRole('button', { name: 'Vitest' })).toHaveFocus()
    const visited = new Set<string | null>()
    const count = within(graph).getAllByRole('button').length
    for (let i = 0; i < count; i++) {
      await user.keyboard('{ArrowRight}')
      visited.add(document.activeElement!.getAttribute('data-node-id'))
    }
    expect(visited.size).toBe(count)
    expect(graph.querySelectorAll('[data-node-id][tabindex="0"]')).toHaveLength(
      1,
    )
    await user.keyboard('{Escape}')
    expect(graph.querySelector('[aria-pressed="true"]')).toBeNull()
    await user.tab()
    expect(graph.contains(document.activeElement)).toBe(false)
  })
  it('retains keyboard entry when Java is removed from the content', async () => {
    const user = userEvent.setup()
    const model = buildSkillsGraph(
      graphContent.skillCategories,
      graphContent.skills.filter((node) => node.id !== 'java'),
      graphContent.skillRelationships,
    )
    const graph = setup(model)
    const first = within(graph).getByRole('button', { name: 'Backend' })
    for (let i = 0; i < 12 && document.activeElement !== first; i++)
      await user.tab()
    expect(first).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(first).toHaveAttribute('aria-pressed', 'true')
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
  it('previews mouse hover without changing the selection or camera, then restores the selection', () => {
    const graph = setup()
    const ts = screen.getByRole('button', { name: 'TypeScript' })
    const react = screen.getByRole('button', { name: 'React' })
    const camera = graph
      .querySelector('.network-camera')!
      .getAttribute('transform')
    fireEvent.click(react)
    pointer(ts, 'pointerover', { pointerType: 'mouse' })
    expect(ts).toHaveClass('is-highlighted')
    expect(ts).toHaveAttribute('aria-pressed', 'false')
    expect(react).toHaveAttribute('aria-pressed', 'true')
    expect(graph.querySelectorAll('line.is-connected')).toHaveLength(4)
    expect(graph.querySelector('.network-camera')).toHaveAttribute(
      'transform',
      camera,
    )
    pointer(ts, 'pointerout', { pointerType: 'mouse' })
    expect(react).toHaveClass('is-highlighted')
    pointer(ts, 'pointerover', { pointerType: 'touch' })
    expect(ts).not.toHaveClass('is-highlighted')
    expect(react).toHaveClass('is-highlighted')
  })
  it('moves only the dragged node, including its edges, at the current zoom', async () => {
    const user = userEvent.setup()
    const graph = setup()
    const ts = screen.getByRole('button', { name: 'TypeScript' })
    const react = screen.getByRole('button', { name: 'React' })
    const original = ts.getAttribute('transform')
    const other = react.getAttribute('transform')
    const edge = graph.querySelector(
      'line[data-source="backend"][data-target="typescript"]',
    )!
    const oldX = Number(edge.getAttribute('x2')),
      oldY = Number(edge.getAttribute('y2'))
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    const camera = graph
      .querySelector('.network-camera')!
      .getAttribute('transform')!
    const scale = Number(camera.match(/scale\(([^)]+)\)/)![1])
    pointer(ts, 'pointerdown', { clientX: 300, clientY: 250 })
    pointer(ts, 'pointermove', { clientX: 360, clientY: 280 })
    pointer(ts, 'pointerup', { clientX: 360, clientY: 280 })
    fireEvent.click(ts, { detail: 1 })
    expect(ts.getAttribute('transform')).not.toBe(original)
    expect(Number(edge.getAttribute('x2'))).toBeCloseTo(oldX + 60 / scale)
    expect(Number(edge.getAttribute('y2'))).toBeCloseTo(oldY + 30 / scale)
    expect(react).toHaveAttribute('transform', other)
    expect(graph.querySelector('.network-camera')).toHaveAttribute(
      'transform',
      camera,
    )
    expect(ts).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', { name: 'Reset graph' }))
    expect(ts).toHaveAttribute('transform', original)
  })
  it('deselects on a blank click but preserves selection after a background drag', () => {
    const graph = setup()
    const ts = screen.getByRole('button', { name: 'TypeScript' })
    fireEvent.click(ts)
    const camera = graph
      .querySelector('.network-camera')!
      .getAttribute('transform')
    pointer(graph, 'pointerdown', { clientX: 50, clientY: 50 })
    pointer(graph, 'pointermove', { clientX: 100, clientY: 100 })
    pointer(graph, 'pointerup', { clientX: 100, clientY: 100 })
    fireEvent.click(graph, { detail: 1 })
    expect(ts).toHaveAttribute('aria-pressed', 'true')
    expect(
      graph.querySelector('.network-camera')!.getAttribute('transform'),
    ).not.toBe(camera)
    pointer(graph, 'pointerdown', { clientX: 100, clientY: 100 })
    pointer(graph, 'pointerup', { clientX: 100, clientY: 100 })
    fireEvent.click(graph, { detail: 1 })
    expect(ts).toHaveAttribute('aria-pressed', 'false')
    expect(graph.querySelectorAll('.is-muted')).toHaveLength(0)
  })
  it('does not move nodes with touch before opt-in, and handles pinch and cancellation after opt-in', async () => {
    const user = userEvent.setup()
    const graph = setup()
    const ts = screen.getByRole('button', { name: 'TypeScript' })
    const original = ts.getAttribute('transform')
    pointer(ts, 'pointerdown', {
      pointerType: 'touch',
      clientX: 200,
      clientY: 200,
    })
    pointer(ts, 'pointermove', {
      pointerType: 'touch',
      clientX: 240,
      clientY: 220,
    })
    pointer(ts, 'pointerup', { pointerType: 'touch' })
    expect(ts).toHaveAttribute('transform', original)
    await user.click(screen.getByText('Explore graph'))
    pointer(ts, 'pointerdown', {
      pointerType: 'touch',
      clientX: 200,
      clientY: 200,
    })
    pointer(ts, 'pointermove', {
      pointerType: 'touch',
      clientX: 240,
      clientY: 220,
    })
    const moved = ts.getAttribute('transform')
    expect(moved).not.toBe(original)
    const camera = graph
      .querySelector('.network-camera')!
      .getAttribute('transform')
    pointer(graph, 'pointerdown', {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 300,
      clientY: 220,
    })
    pointer(graph, 'pointermove', {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 360,
      clientY: 220,
    })
    expect(
      graph.querySelector('.network-camera')!.getAttribute('transform'),
    ).not.toBe(camera)
    expect(ts).toHaveAttribute('transform', moved)
    pointer(graph, 'pointercancel', { pointerId: 2, pointerType: 'touch' })
    pointer(ts, 'pointercancel', { pointerType: 'touch' })
    const after = graph
      .querySelector('.network-camera')!
      .getAttribute('transform')
    pointer(graph, 'pointermove', {
      pointerType: 'touch',
      clientX: 500,
      clientY: 500,
    })
    expect(graph.querySelector('.network-camera')).toHaveAttribute(
      'transform',
      after,
    )
    expect(graph).not.toHaveAttribute('data-dragging')
  })
  it('moves a focused node with Shift+arrows without changing the camera', () => {
    const graph = setup()
    const ts = screen.getByRole('button', { name: 'TypeScript' })
    const original = ts.getAttribute('transform')
    const camera = graph
      .querySelector('.network-camera')!
      .getAttribute('transform')
    fireEvent.keyDown(ts, { key: 'ArrowRight', shiftKey: true })
    expect(ts.getAttribute('transform')).not.toBe(original)
    expect(graph.querySelector('.network-camera')).toHaveAttribute(
      'transform',
      camera,
    )
  })
  it('shows control tooltips on hover and keyboard focus, and dismisses on Escape', async () => {
    const user = userEvent.setup()
    setup()
    const fit = screen.getByRole('button', { name: 'Fit entire graph' })
    pointer(fit, 'pointerover', { pointerType: 'mouse' })
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Fit all nodes in view',
    )
    pointer(fit, 'pointerout', { pointerType: 'mouse' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    for (let i = 0; i < 10 && document.activeElement !== fit; i++)
      await user.tab()
    expect(fit).toHaveFocus()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})

function pointer(
  element: Element,
  type: string,
  values: {
    pointerId?: number
    pointerType?: string
    clientX?: number
    clientY?: number
  } = {},
) {
  // jsdom lacks PointerEvent/capture. Preserve real React bubbling and handlers.
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    ...values,
  })
  Object.defineProperties(event, {
    pointerId: { value: values.pointerId ?? 1 },
    pointerType: { value: values.pointerType ?? 'mouse' },
  })
  Object.defineProperties(element, {
    setPointerCapture: { configurable: true, value: () => {} },
    hasPointerCapture: { configurable: true, value: () => false },
  })
  fireEvent(element, event)
}
