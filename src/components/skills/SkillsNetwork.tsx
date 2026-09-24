import { useId, useMemo, useRef, useState } from 'react'
import { Maximize, Minus, Move, Plus, RotateCcw } from 'lucide-react'
import {
  graphBounds,
  MAX_ZOOM,
  MIN_ZOOM,
  type GraphNode,
  type SkillsGraph,
} from './graph'
import { useGraphInteraction } from './useGraphInteraction'
import { GraphControl } from './GraphControl'

export function SkillsNetwork({ graph }: { graph: SkillsGraph }) {
  const nodeOrder = useMemo(
    () =>
      [...graph.nodes]
        .sort((a, b) => a.label.localeCompare(b.label, 'en'))
        .map((node) => node.id),
    [graph],
  )
  const [selected, setSelected] = useState<string | null>(null)
  const [focused, setFocused] = useState(nodeOrder[0])
  const nodeRefs = useRef(new Map<string, SVGGElement>())
  const [hovered, setHovered] = useState<string | null>(null)
  const { surfaceRef, ...controls } = useGraphInteraction(graph.nodes)
  const byId = new Map(controls.nodes.map((node) => [node.id, node]))
  const descriptionId = useId()
  const maskId = useId()
  const bounds = graphBounds(controls.nodes)
  const activeId = hovered ?? selected
  const active = activeId ? byId.get(activeId) : undefined
  const neighborhood = active
    ? new Set([active.id, ...active.connections])
    : null
  const clear = () => {
    setSelected(null)
    setHovered(null)
  }
  const select = (node: GraphNode) => {
    setSelected(node.id)
    setFocused(node.id)
  }
  const reset = () => {
    clear()
    controls.reset()
  }
  return (
    <div className="skills-network">
      <div className="network-toolbar">
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
            {/* Keep edges clear of labels without painting a background. */}
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                x={bounds.left}
                y={bounds.top}
                width={bounds.right - bounds.left}
                height={bounds.bottom - bounds.top}
              >
                <rect
                  x={bounds.left}
                  y={bounds.top}
                  width={bounds.right - bounds.left}
                  height={bounds.bottom - bounds.top}
                  fill="white"
                />
                {controls.nodes.map((node) => (
                  <rect
                    key={node.id}
                    x={node.x - node.width / 2}
                    y={node.y - node.height / 2}
                    width={node.width}
                    height={node.height}
                    fill="black"
                  />
                ))}
              </mask>
            </defs>
            <g
              aria-hidden="true"
              className="network-edges"
              mask={`url(#${maskId})`}
            >
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
                ref={(element) => {
                  if (element) nodeRefs.current.set(node.id, element)
                  else nodeRefs.current.delete(node.id)
                }}
                data-node-id={node.id}
                transform={`translate(${node.x} ${node.y})`}
                className={`network-node${active?.id === node.id ? ' is-highlighted' : ''}${neighborhood && !neighborhood.has(node.id) ? ' is-muted' : ''}`}
                role="button"
                aria-label={node.label}
                aria-pressed={selected === node.id}
                tabIndex={node.id === focused ? 0 : -1}
                onFocus={() => {
                  setFocused(node.id)
                  setHovered(null)
                  controls.reveal(node)
                }}
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
                  if (
                    !event.shiftKey &&
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.altKey &&
                    [
                      'ArrowLeft',
                      'ArrowRight',
                      'ArrowUp',
                      'ArrowDown',
                      'Home',
                      'End',
                    ].includes(event.key)
                  ) {
                    event.preventDefault()
                    event.stopPropagation()
                    const index = nodeOrder.indexOf(node.id)
                    const backwards =
                      event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                    let next =
                      (index + (backwards ? -1 : 1) + nodeOrder.length) %
                      nodeOrder.length
                    if (event.key === 'Home') next = 0
                    if (event.key === 'End') next = nodeOrder.length - 1
                    nodeRefs.current
                      .get(nodeOrder[next])
                      ?.focus({ preventScroll: true })
                  } else if (event.key === 'Enter' || event.key === ' ') {
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
      <p id={descriptionId} className="network-help">
        Arrows browse nodes · Enter selects · Shift + arrows move · + / − zoom ·
        0 resets · Esc clears
      </p>
    </div>
  )
}
