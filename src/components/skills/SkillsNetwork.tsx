import { useId, useState } from 'react'
import { Maximize, Minus, Move, Plus, RotateCcw } from 'lucide-react'
import { resume } from '@/data/resume'
import { buildSkillsGraph, MAX_ZOOM, MIN_ZOOM, type GraphNode } from './graph'
import { useGraphInteraction } from './useGraphInteraction'
import { GraphControl } from './GraphControl'

const graph = buildSkillsGraph(
  resume.skillCategories,
  resume.skills,
  resume.skillRelationships,
)

export function SkillsNetwork() {
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const { surfaceRef, ...controls } = useGraphInteraction(graph.nodes)
  const byId = new Map(controls.nodes.map((node) => [node.id, node]))
  const descriptionId = useId()
  const activeId = hovered ?? selected
  const active = activeId ? byId.get(activeId) : undefined
  const selection = selected ? byId.get(selected) : undefined
  const neighborhood = active
    ? new Set([active.id, ...active.connections])
    : null
  const clear = () => {
    setSelected(null)
    setHovered(null)
  }
  const select = (node: GraphNode, focus = false) => {
    setSelected(node.id)
    if (focus) controls.focus(node)
  }
  const reset = () => {
    clear()
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
                ? select(byId.get(event.target.value)!, true)
                : clear()
            }
          >
            <option value="">Explore the toolkit</option>
            {[...controls.nodes]
              .sort((a, b) => a.label.localeCompare(b.label, 'en'))
              .map((node) => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
          </select>
        </label>
        <div
          className="network-controls"
          role="group"
          aria-label="Graph controls"
        >
          <GraphControl
            label="Zoom out"
            hint="Zoom out (−)"
            disabled={controls.camera.scale <= MIN_ZOOM}
            onClick={() => controls.zoom(1 / 1.25)}
          >
            <Minus size={18} />
          </GraphControl>
          <span className="network-zoom" aria-label="Zoom level">
            {Math.round(controls.camera.scale * 100)}%
          </span>
          <GraphControl
            label="Zoom in"
            hint="Zoom in (+)"
            disabled={controls.camera.scale >= MAX_ZOOM}
            onClick={() => controls.zoom(1.25)}
          >
            <Plus size={18} />
          </GraphControl>
          <GraphControl
            label="Fit entire graph"
            hint="Fit all nodes in view"
            onClick={controls.fit}
          >
            <Maximize size={17} />
          </GraphControl>
          <GraphControl
            label="Reset graph"
            hint="Restore layout & zoom (0)"
            onClick={reset}
          >
            <RotateCcw size={17} />
          </GraphControl>
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
          onClick={(event) => {
            if (
              !(event.target as Element).closest('[data-node-id]') &&
              (event.detail === 0 || !controls.wasDragged())
            )
              clear()
          }}
          onPointerLeave={() => setHovered(null)}
          onKeyDown={(event) => {
            controls.handlers.onKeyDown(event)
            if (event.key === 'Escape' || event.key === '0') clear()
          }}
        >
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
                    data-source={from.id}
                    data-target={to.id}
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
            {controls.nodes.map((node) => (
              <g
                key={node.id}
                data-node-id={node.id}
                transform={`translate(${node.x} ${node.y})`}
                className={`network-node${active?.id === node.id ? ' is-highlighted' : ''}${neighborhood && !neighborhood.has(node.id) ? ' is-muted' : ''}`}
                role="button"
                aria-label={node.label}
                aria-pressed={selected === node.id}
                tabIndex={node.id === (selected ?? 'java') ? 0 : -1}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse' && !event.buttons)
                    setHovered(node.id)
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'mouse')
                    setHovered((current) =>
                      current === node.id ? null : current,
                    )
                }}
                onClick={(event) => {
                  if (event.detail === 0 || !controls.wasDragged()) select(node)
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
                  rx={8}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={node.fontSize}
                >
                  {node.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
        <div className="network-touch-control">
          <button
            aria-pressed={controls.exploring}
            onClick={controls.toggleExploring}
          >
            <Move size={16} />
            {controls.exploring ? 'Done exploring' : 'Explore graph'}
          </button>
        </div>
      </div>
      <div className="network-detail">
        <div className="network-selection" aria-live="polite">
          <span className="network-indicator" />
          <strong>
            {selection?.label ?? resume.sections.skills.idleTitle}
          </strong>
          {!selection && <span>{resume.sections.skills.idleDescription}</span>}
        </div>
        {selection && (
          <div
            className="network-neighbors"
            aria-label={`Connections for ${selection.label}`}
          >
            {selection.connections.map((id) => (
              <button key={id} onClick={() => select(byId.get(id)!, true)}>
                {byId.get(id)!.label}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        )}
        <p id={descriptionId} className="network-help">
          <span className="pointer-help">
            Hover to trace connections. Drag a node to move it; drag the
            background to pan. Ctrl/⌘ + scroll to zoom.{' '}
          </span>
          <span className="touch-help">
            Tap Explore graph to move nodes, pan, and pinch to zoom.{' '}
          </span>
          <span className="pointer-help">
            Arrow keys pan · Shift + arrows move a focused node · + / − zoom · 0
            resets.{' '}
          </span>
          {resume.sections.skills.legend}
        </p>
      </div>
    </div>
  )
}
