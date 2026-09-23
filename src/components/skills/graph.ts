import {
  forceCollide,
  forceLink,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'
import type { ResumeContent } from '@/data/resume'

export interface GraphNode {
  id: string
  label: string
  kind: 'category' | 'skill'
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
export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 2

// Labels are measured conservatively in world units, before any camera zoom.
function node(
  id: string,
  label: string,
  kind: GraphNode['kind'],
  connections: string[],
  x: number,
  y: number,
): GraphNode {
  const fontSize = 18 + 4 * Math.log2(connections.length + 1)
  return {
    id,
    label,
    kind,
    connections,
    fontSize,
    width: label.length * fontSize * 0.59 + 32,
    height: fontSize + 26,
    x,
    y,
  }
}

export function buildSkillsGraph(
  groups: ResumeContent['skillGroups'],
  skills: ResumeContent['skills'],
): SkillsGraph {
  const hubs = groups.map((group, i) => {
    const angle = (i * Math.PI * 2) / groups.length - Math.PI / 2
    return node(
      group.id,
      group.title,
      'category',
      skills
        .filter((skill) => skill.categories.includes(group.id))
        .map((skill) => skill.id),
      Math.cos(angle) * 630,
      Math.sin(angle) * 230,
    )
  })
  const tools = skills.map((skill, i) => {
    const categories = hubs.filter((hub) => skill.categories.includes(hub.id))
    const x =
      categories.reduce((sum, hub) => sum + hub.x, 0) / categories.length
    const y =
      categories.reduce((sum, hub) => sum + hub.y, 0) / categories.length
    return node(
      skill.id,
      skill.label,
      'skill',
      [...skill.categories],
      x + Math.cos(i * 2.4) * 100,
      y + Math.sin(i * 2.4) * 100,
    )
  })
  const nodes = [...hubs, ...tools]
  const links = skills.flatMap((skill) =>
    skill.categories.map((category) => ({
      source: category,
      target: skill.id,
    })),
  )
  const anchors = new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }]))
  // D3 owns only these new layout objects, never the editable resume data.
  forceSimulation(nodes)
    .stop()
    .force(
      'links',
      forceLink<GraphNode, GraphLink>(links.map((link) => ({ ...link })))
        .id((n) => n.id)
        .distance(140)
        .strength(0.12),
    )
    .force(
      'x',
      forceX<GraphNode>((n) => anchors.get(n.id)!.x).strength((n) =>
        n.kind === 'category' ? 0.8 : 0.12,
      ),
    )
    .force(
      'y',
      forceY<GraphNode>((n) => anchors.get(n.id)!.y).strength((n) =>
        n.kind === 'category' ? 0.8 : 0.12,
      ),
    )
    .force(
      'collision',
      forceCollide<GraphNode>((n) => n.height / 2 + 8),
    )
    .tick(300)
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
  const scale = Math.max(
    MIN_ZOOM,
    Math.min(
      maxScale,
      size.width / (right - left),
      size.height / (bottom - top),
    ),
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

export function initialCamera(nodes: GraphNode[], size: Size): Camera {
  if (size.width >= 600) return fitCamera(nodes, size)
  const tools = nodes.filter((node) => node.kind === 'skill')
  const center = tools.reduce(
    (best, node) =>
      node.connections.length > best.connections.length ? node : best,
    tools[0] ?? nodes[0],
  )
  const scale = 0.8
  return {
    scale,
    x: size.width / 2 - center.x * scale,
    y: size.height / 2 - center.y * scale,
  }
}
