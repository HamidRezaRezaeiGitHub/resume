import { describe, expect, it } from 'vitest'
import { resume } from '@/data/resume'
import {
  buildSkillsGraph,
  fitCamera,
  pinchCamera,
  zoomCamera,
  MAX_ZOOM,
  MIN_ZOOM,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  revealNode,
} from './graph'

describe('skills graph', () => {
  const graph = buildSkillsGraph(
    resume.skillCategories,
    resume.skills,
    resume.skillRelationships,
  )
  it('connects tool and topic peers in both directions, counting each neighbor once', () => {
    const byId = new Map(graph.nodes.map((node) => [node.id, node]))
    for (const [source, target] of [
      ['jenkins', 'groovy'],
      ['backend', 'apis'],
      ['java', 'spring'],
      ['java', 'junit'],
      ['spring-integration', 'solace'],
      ['bigquery', 'looker-studio'],
      ['ai', 'spring-ai'],
      ['ai', 'mcp'],
      ['ai', 'github-copilot'],
      ['ai', 'claude-code'],
      ['ai', 'codex'],
      ['agent-instructions', 'codex'],
      ['hooks', 'claude-code'],
      ['hooks', 'bash'],
      ['agent-skills', 'github-copilot'],
      ['agent-skills', 'claude-code'],
      ['agent-skills', 'codex'],
      ['agent-skills', 'jenkins'],
      ['context-engineering', 'agent-skills'],
      ['context-engineering', 'agent-instructions'],
      ['context-engineering', 'hooks'],
      ['mcp', 'github-copilot'],
      ['gcp', 'gcp-cloud-run'],
      ['gcp', 'cloud-sql'],
      ['gcp', 'bigquery'],
      ['gcp', 'firebase'],
      ['logs-explorer', 'gcp'],
      ['logs-explorer', 'observability'],
    ]) {
      expect(byId.get(source)!.connections).toContain(target)
      expect(byId.get(target)!.connections).toContain(source)
    }
    expect(graph.nodes.filter((node) => node.id === 'typescript')).toHaveLength(
      1,
    )
    expect(byId.get('java')!.connections).toHaveLength(15)
    for (const node of graph.nodes) {
      expect(new Set(node.connections).size).toBe(node.connections.length)
      expect(
        graph.links.filter(
          (link) => link.source === node.id || link.target === node.id,
        ),
      ).toHaveLength(node.connections.length)
      expect(Number.isFinite(node.x) && Number.isFinite(node.y)).toBe(true)
      for (const other of graph.nodes) {
        if (node.connections.length === other.connections.length)
          expect(node.fontSize).toBe(other.fontSize)
        else if (node.connections.length > other.connections.length)
          expect(node.fontSize).toBeGreaterThan(other.fontSize)
      }
    }
    expect(byId.get('java')!.fontSize).toBeGreaterThan(
      byId.get('typescript')!.fontSize,
    )
  })
  it('bounds the shared font scale while giving highly connected words more contrast', () => {
    const byId = new Map(graph.nodes.map((n) => [n.id, n]))
    expect(Math.min(...graph.nodes.map((n) => n.fontSize))).toBe(MIN_FONT_SIZE)
    expect(Math.max(...graph.nodes.map((n) => n.fontSize))).toBe(MAX_FONT_SIZE)
    expect(byId.get('java')!.fontSize).toBeGreaterThan(60)
    expect(
      byId.get('java')!.fontSize / byId.get('typescript')!.fontSize,
    ).toBeGreaterThan(1.5)
  })
  it('uses the actual connections to form neighborhoods without fixed topic positions', () => {
    const linked: number[] = [],
      unrelated: number[] = []
    for (let i = 0; i < graph.nodes.length; i++)
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const a = graph.nodes[i],
          b = graph.nodes[j]
        const distances = a.connections.includes(b.id) ? linked : unrelated
        distances.push(Math.hypot(a.x - b.x, a.y - b.y))
      }
    const mean = (values: number[]) =>
      values.reduce((sum, n) => sum + n, 0) / values.length
    expect(mean(linked)).toBeLessThan(mean(unrelated) * 0.75)
    const withoutRelationships = buildSkillsGraph(
      resume.skillCategories,
      resume.skills,
      [],
    )
    expect(
      withoutRelationships.nodes.find((node) => node.id === 'java')!.x,
    ).not.toBe(graph.nodes.find((node) => node.id === 'java')!.x)
  })
  it('is deterministic, preserves input, and keeps label hit areas from overlapping', () => {
    const before = JSON.stringify(resume)
    const again = buildSkillsGraph(
      resume.skillCategories,
      resume.skills,
      resume.skillRelationships,
    )
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
  it('fits a node dragged beyond the manual zoom range', () => {
    const moved = graph.nodes.map((node, i) =>
      i === 0 ? { ...node, x: 20000 } : node,
    )
    const camera = fitCamera(moved, { width: 278, height: 420 })
    for (const node of moved) {
      expect(
        camera.x + (node.x - node.width / 2) * camera.scale,
      ).toBeGreaterThanOrEqual(0)
      expect(
        camera.x + (node.x + node.width / 2) * camera.scale,
      ).toBeLessThanOrEqual(278)
    }
  })
  it.each([
    { width: 960, height: 600 },
    { width: 278, height: 420 },
    { width: 354, height: 450 },
  ])('fits every node in the viewport $width × $height', (size) => {
    const camera = fitCamera(graph.nodes, size)
    for (const node of graph.nodes) {
      expect(
        camera.x + (node.x - node.width / 2) * camera.scale,
      ).toBeGreaterThanOrEqual(0)
      expect(
        camera.x + (node.x + node.width / 2) * camera.scale,
      ).toBeLessThanOrEqual(size.width)
      expect(
        camera.y + (node.y - node.height / 2) * camera.scale,
      ).toBeGreaterThanOrEqual(0)
      expect(
        camera.y + (node.y + node.height / 2) * camera.scale,
      ).toBeLessThanOrEqual(size.height)
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
  it('reveals offscreen keyboard focus and preserves the camera for visible nodes', () => {
    const node = buildSkillsGraph(
      resume.skillCategories,
      resume.skills,
      resume.skillRelationships,
    ).nodes[0]
    const size = { width: 320, height: 420 }
    for (const start of [
      { x: -2000, y: 3000, scale: 0.5 },
      { x: 2000, y: -3000, scale: 2 },
    ]) {
      const shown = revealNode(start, node, size)
      expect(
        shown.x + (node.x - node.width / 2) * shown.scale,
      ).toBeGreaterThanOrEqual(0)
      expect(
        shown.x + (node.x + node.width / 2) * shown.scale,
      ).toBeLessThanOrEqual(size.width)
      expect(
        shown.y + (node.y - node.height / 2) * shown.scale,
      ).toBeGreaterThanOrEqual(0)
      expect(
        shown.y + (node.y + node.height / 2) * shown.scale,
      ).toBeLessThanOrEqual(size.height)
      expect(revealNode(shown, node, size)).toEqual(shown)
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
