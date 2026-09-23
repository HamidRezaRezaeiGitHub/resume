import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'
import type { ResumeContent } from '@/data/resume'
import { skillConnections } from '@/data/skills'

export interface GraphNode {
  id: string
  label: string
  connections: string[]
  fontSize: number
  width: number
  height: number
  x: number
  y: number
}
export interface GraphLink {
  source: string
  target: string
}
export interface SkillsGraph {
  nodes: GraphNode[]
  links: GraphLink[]
}
export interface Camera {
  x: number
  y: number
  scale: number
}
export interface Point {
  x: number
  y: number
}
export interface Size {
  width: number
  height: number
}
export const MIN_ZOOM = 0.08
export const MAX_ZOOM = 2

// Labels are measured conservatively in world units, before any camera zoom.
function node(
  id: string,
  label: string,
  connections: string[],
  x: number,
  y: number,
): GraphNode {
  const fontSize = 16 + 7 * Math.sqrt(connections.length)
  return {
    id,
    label,
    connections,
    fontSize,
    width: label.length * fontSize * 0.59 + 32,
    height: fontSize + 26,
    x,
    y,
  }
}

export function buildSkillsGraph(
  groups: ResumeContent['skillCategories'],
  skills: ResumeContent['skills'],
  relationships: ResumeContent['skillRelationships'],
): SkillsGraph {
  const links = skillConnections(skills, relationships)
  const labels = [
    ...groups.map((group) => ({ id: group.id, label: group.title })),
    ...skills.map(({ id, label }) => ({ id, label })),
  ]
  const adjacency = new Map(labels.map(({ id }) => [id, new Set<string>()]))
  for (const { source, target } of links) {
    adjacency.get(source)!.add(target)
    adjacency.get(target)!.add(source)
  }
  // All nodes start with the same deterministic seed pattern. Relationships,
  // not topic anchors or hand-authored coordinates, shape the neighborhoods.
  const nodes = labels.map(({ id, label }, i) => {
    const angle = i * Math.PI * (3 - Math.sqrt(5))
    const radius = 55 * Math.sqrt(i + 1)
    return node(
      id,
      label,
      [...adjacency.get(id)!],
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
    )
  })
  // D3 owns only these new layout objects, never the editable resume data.
  forceSimulation(nodes)
    .stop()
    .force(
      'links',
      forceLink<GraphNode, GraphLink>(links.map((link) => ({ ...link })))
        .id((n) => n.id)
        .distance(150)
        .strength(0.35),
    )
    .force('charge', forceManyBody().strength(-650))
    .force('x', forceX(0).strength(0.015))
    .force('y', forceY(0).strength(0.06))
    .force(
      'collision',
      forceCollide<GraphNode>((n) => n.height / 2 + 12),
    )
    .tick(350)
  // Rectangular relaxation protects long labels without wasting a circular radius.
  for (let pass = 0; pass < 160; pass++) {
    let overlaps = 0
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j]
        const dx = b.x - a.x,
          dy = b.y - a.y
        const overlapX = (a.width + b.width) / 2 + 16 - Math.abs(dx)
        const overlapY = (a.height + b.height) / 2 + 16 - Math.abs(dy)
        if (overlapX <= 0 || overlapY <= 0) continue
        overlaps++
        if (overlapX < overlapY) {
          const shift = ((overlapX + 0.1) / 2) * (dx < 0 ? -1 : 1)
          a.x -= shift
          b.x += shift
        } else {
          const shift = ((overlapY + 0.1) / 2) * (dy < 0 ? -1 : 1)
          a.y -= shift
          b.y += shift
        }
      }
    if (!overlaps) break
  }
  return { nodes, links }
}

export function fitCamera(
  nodes: GraphNode[],
  size: Size,
  maxScale = 1,
): Camera {
  const left = Math.min(...nodes.map((n) => n.x - n.width / 2)) - 35
  const right = Math.max(...nodes.map((n) => n.x + n.width / 2)) + 35
  const top = Math.min(...nodes.map((n) => n.y - n.height / 2)) - 35
  const bottom = Math.max(...nodes.map((n) => n.y + n.height / 2)) + 35
  // Fit must include even a node dragged far beyond the original layout.
  const scale = Math.min(
    maxScale,
    size.width / (right - left),
    size.height / (bottom - top),
  )
  return {
    x: size.width / 2 - ((left + right) / 2) * scale,
    y: size.height / 2 - ((top + bottom) / 2) * scale,
    scale,
  }
}

export function zoomCamera(
  camera: Camera,
  factor: number,
  pivot: Point,
): Camera {
  const scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.scale * factor))
  const ratio = scale / camera.scale
  return {
    x: pivot.x - (pivot.x - camera.x) * ratio,
    y: pivot.y - (pivot.y - camera.y) * ratio,
    scale,
  }
}

export function pinchCamera(
  camera: Camera,
  previous: [Point, Point],
  next: [Point, Point],
): Camera {
  const center = (points: [Point, Point]) => ({
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2,
  })
  const distance = (points: [Point, Point]) =>
    Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
  const before = center(previous),
    after = center(next)
  const zoomed = zoomCamera(
    camera,
    distance(next) / Math.max(1, distance(previous)),
    before,
  )
  return {
    ...zoomed,
    x: zoomed.x + after.x - before.x,
    y: zoomed.y + after.y - before.y,
  }
}
