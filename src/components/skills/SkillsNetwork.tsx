import { useId, useState } from 'react'
import {
  Maximize,
  Minus,
  Move,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { resume } from '@/data/resume'
import { buildSkillsGraph, MAX_ZOOM, MIN_ZOOM, type GraphNode } from './graph'
import { useGraphCamera } from './useGraphCamera'
import { useGraphMotion } from './useGraphMotion'

const graph = buildSkillsGraph(resume.skillGroups, resume.skills)
const byId = new Map(graph.nodes.map((node) => [node.id, node]))

export function SkillsNetwork() {
  const [selected, setSelected] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const { surfaceRef, ...controls } = useGraphCamera(graph.nodes)
  const layer = useGraphMotion(surfaceRef, paused || controls.exploring)
  const descriptionId = useId()
  const active = selected ? byId.get(selected) : undefined
  const neighborhood = active
    ? new Set([active.id, ...active.connections])
    : null
  const select = (node: GraphNode) => {
    setSelected(node.id)
    controls.focus(node)
  }
  const reset = () => {
    setSelected(null)
    controls.reset()
  }
  return (
    <div className="skills-network">
      <div className="network-toolbar">
        <label className="network-picker">
          <span>Follow a connection</span>
          <select
            value={selected ?? ''}
            onChange={(event) =>
              event.target.value
                ? select(byId.get(event.target.value)!)
                : reset()
            }
          >
            <option value="">Explore the toolkit</option>
            <optgroup label="Categories">
              {graph.nodes
                .filter((n) => n.kind === 'category')
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Technologies & tools">
              {graph.nodes
                .filter((n) => n.kind === 'skill')
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
            </optgroup>
          </select>
        </label>
        <div
          className="network-controls"
          role="group"
          aria-label="Graph controls"
        >
          <button
            aria-label="Zoom out"
            title="Zoom out"
            disabled={controls.camera.scale <= MIN_ZOOM}
            onClick={() => controls.zoom(1 / 1.25)}
          >
            <Minus size={18} />
          </button>
          <span className="network-zoom" aria-label="Zoom level">
            {Math.round(controls.camera.scale * 100)}%
          </span>
          <button
            aria-label="Zoom in"
            title="Zoom in"
            disabled={controls.camera.scale >= MAX_ZOOM}
            onClick={() => controls.zoom(1.25)}
          >
            <Plus size={18} />
          </button>
          <button
            aria-label="Fit entire graph"
            title="Fit entire graph"
            onClick={controls.fit}
          >
            <Maximize size={17} />
          </button>
          <button aria-label="Reset graph" title="Reset graph" onClick={reset}>
            <RotateCcw size={17} />
          </button>
          <button
            aria-label={paused ? 'Resume graph motion' : 'Pause graph motion'}
            title={paused ? 'Resume graph motion' : 'Pause graph motion'}
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
        </div>
      </div>
      <div className="network-canvas">
        <svg
          ref={surfaceRef}
          className="network-svg"
          data-exploring={controls.exploring}
          role="group"
          aria-label="Interactive skills network"
          aria-describedby={descriptionId}
          tabIndex={0}
          {...controls.handlers}
        >
          <g ref={layer}>
            <g
              transform={`translate(${controls.camera.x} ${controls.camera.y}) scale(${controls.camera.scale})`}
              className="network-camera"
            >
              <g aria-hidden="true" className="network-edges">
                {graph.links.map((link) => {
                  const from = byId.get(link.source)!,
                    to = byId.get(link.target)!
                  const highlighted =
                    active && (active.id === from.id || active.id === to.id)
                  return (
                    <line
                      key={`${from.id}-${to.id}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={
                        highlighted ? 'is-connected' : active ? 'is-muted' : ''
                      }
                    />
                  )
                })}
              </g>
              {graph.nodes.map((node) => (
                <g
                  key={node.id}
                  transform={`translate(${node.x} ${node.y})`}
                  className={`network-node ${node.kind}${active?.id === node.id ? ' is-selected' : ''}${neighborhood && !neighborhood.has(node.id) ? ' is-muted' : ''}`}
                  role="button"
                  aria-label={`${node.label}, ${node.connections.length} ${node.connections.length === 1 ? 'connection' : 'connections'}`}
                  aria-pressed={selected === node.id}
                  tabIndex={node.id === (selected ?? 'typescript') ? 0 : -1}
                  onClick={() => {
                    if (!controls.wasDragged()) select(node)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      select(node)
                    }
                  }}
                >
                  <rect
                    x={-node.width / 2}
                    y={-node.height / 2}
                    width={node.width}
                    height={node.height}
                    rx={node.kind === 'category' ? node.height / 2 : 8}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={node.fontSize}
                  >
                    {node.label}
                  </text>
                  {node.kind === 'category' && (
                    <circle
                      cx={-node.width / 2 + 12}
                      cy={0}
                      r={3}
                      aria-hidden="true"
                    />
                  )}
                </g>
              ))}
            </g>
          </g>
        </svg>
        <div className="network-touch-control">
          <button
            aria-pressed={controls.exploring}
            onClick={() => controls.setExploring(!controls.exploring)}
          >
            <Move size={16} />
            {controls.exploring ? 'Done exploring' : 'Explore graph'}
          </button>
        </div>
        <span className="network-caption" aria-hidden="true">
          {resume.skills.length} tools · {resume.skillGroups.length} categories
        </span>
      </div>
      <div className="network-detail">
        <div className="network-selection" aria-live="polite">
          <span className="network-indicator" />
          <strong>{active?.label ?? resume.sections.skills.idleTitle}</strong>
          <span>
            {active
              ? `${active.connections.length} ${active.kind === 'category' ? 'tools' : 'categories'}`
              : resume.sections.skills.idleDescription}
          </span>
        </div>
        {active && (
          <div
            className="network-neighbors"
            aria-label={`Connections for ${active.label}`}
          >
            {active.connections.map((id) => (
              <button key={id} onClick={() => select(byId.get(id)!)}>
                {byId.get(id)!.label}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        )}
        <p id={descriptionId} className="network-help">
          <span className="pointer-help">
            Drag to move · Ctrl/⌘ + scroll to zoom.{' '}
          </span>
          <span className="touch-help">
            Tap Explore graph to drag and pinch.{' '}
          </span>
          <span className="pointer-help">
            Arrow keys move · + / − zoom · 0 resets.{' '}
          </span>
          {resume.sections.skills.legend}
        </p>
      </div>
    </div>
  )
}
