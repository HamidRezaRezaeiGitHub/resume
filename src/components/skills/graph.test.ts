import { describe, expect, it } from 'vitest'
import { resume } from '@/data/resume'
import {
  buildSkillsGraph,
  fitCamera,
  pinchCamera,
  zoomCamera,
  MAX_ZOOM,
  MIN_ZOOM,
} from './graph'

describe('skills graph', () => {
  const graph = buildSkillsGraph(resume.skillGroups, resume.skills)
  it('represents shared skills once with every category connection and degree-based sizing', () => {
    const ts = graph.nodes.filter((node) => node.id === 'typescript')
    expect(ts).toHaveLength(1)
    expect(ts[0].connections).toEqual(['languages', 'backend', 'frontend'])
    expect(
      graph.links
        .filter((link) => link.target === 'typescript')
        .map((link) => link.source),
    ).toEqual(ts[0].connections)
    expect(ts[0].fontSize).toBeGreaterThan(
      graph.nodes.find((node) => node.id === 'react')!.fontSize,
    )
    expect(
      graph.nodes.find((node) => node.id === 'backend')!.fontSize,
    ).toBeGreaterThan(ts[0].fontSize)
    for (const node of graph.nodes) {
      expect(
        graph.links.filter(
          (link) => link.source === node.id || link.target === node.id,
        ),
      ).toHaveLength(node.connections.length)
      expect(Number.isFinite(node.x) && Number.isFinite(node.y)).toBe(true)
    }
  })
  it('is deterministic, preserves input, and keeps label hit areas from overlapping', () => {
    const before = JSON.stringify(resume)
    const again = buildSkillsGraph(resume.skillGroups, resume.skills)
    expect(JSON.stringify(resume)).toBe(before)
    expect(again).toEqual(graph)
    for (let i = 0; i < graph.nodes.length; i++)
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const a = graph.nodes[i],
          b = graph.nodes[j]
        const overlapX = (a.width + b.width) / 2 - Math.abs(a.x - b.x)
        const overlapY = (a.height + b.height) / 2 - Math.abs(a.y - b.y)
        expect(
          overlapX <= 0 || overlapY <= 0,
          `${a.label} overlaps ${b.label}`,
        ).toBe(true)
      }
  })
  it('fits the desktop overview inside its viewport', () => {
    const camera = fitCamera(graph.nodes, { width: 1180, height: 600 })
    for (const node of graph.nodes) {
      expect(
        camera.x + (node.x - node.width / 2) * camera.scale,
      ).toBeGreaterThanOrEqual(0)
      expect(
        camera.x + (node.x + node.width / 2) * camera.scale,
      ).toBeLessThanOrEqual(1180)
      expect(
        camera.y + (node.y - node.height / 2) * camera.scale,
      ).toBeGreaterThanOrEqual(0)
      expect(
        camera.y + (node.y + node.height / 2) * camera.scale,
      ).toBeLessThanOrEqual(600)
    }
  })
})

describe('graph camera', () => {
  it('zooms around a stable world point, including at the limits', () => {
    const start = { x: 100, y: -40, scale: 0.8 },
      pivot = { x: 250, y: 160 }
    for (const factor of [1.25, 0.1, 100]) {
      const next = zoomCamera(start, factor, pivot)
      expect((pivot.x - next.x) / next.scale).toBeCloseTo(
        (pivot.x - start.x) / start.scale,
      )
      expect((pivot.y - next.y) / next.scale).toBeCloseTo(
        (pivot.y - start.y) / start.scale,
      )
      expect(next.scale).toBeGreaterThanOrEqual(MIN_ZOOM)
      expect(next.scale).toBeLessThanOrEqual(MAX_ZOOM)
    }
  })
  it('combines pinch zoom with a moving two-finger midpoint', () => {
    const result = pinchCamera(
      { x: 0, y: 0, scale: 1 },
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ],
      [
        { x: 10, y: 20 },
        { x: 210, y: 20 },
      ],
    )
    expect(result).toEqual({ x: 10, y: 20, scale: 2 })
  })
})
