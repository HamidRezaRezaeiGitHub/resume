import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import {
  fitCamera,
  pinchCamera,
  zoomCamera,
  type Camera,
  type GraphNode,
  type Point,
} from './graph'

interface TrackedPointer {
  point: Point
  target: Element
}
interface NodeDrag {
  id: string
  origin: Point
  pointerOrigin: Point
  scale: number
}

export function useGraphInteraction(initialNodes: GraphNode[]) {
  const surfaceRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState(initialNodes)
  const [camera, setCamera] = useState<Camera>(() =>
    fitCamera(initialNodes, { width: 900, height: 600 }),
  )
  const [exploring, setExploring] = useState(false)
  const size = useRef({ width: 900, height: 600 })
  const pointers = useRef(new Map<number, TrackedPointer>())
  const nodeDrag = useRef<NodeDrag | null>(null)
  const dragged = useRef(false)
  const travel = useRef(0)
  // Only an actual viewport resize should refit, never a dragged-node update.
  const onResize = useEffectEvent((width: number, height: number) => {
    size.current = { width, height }
    setCamera(fitCamera(nodes, size.current))
  })
  useEffect(() => {
    const element = surfaceRef.current
    if (!element) return
    let previousWidth = 0,
      previousHeight = 0
    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (
        !width ||
        !height ||
        (width === previousWidth && height === previousHeight)
      )
        return
      previousWidth = width
      previousHeight = height
      onResize(width, height)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const bounds = element.getBoundingClientRect()
      setCamera((current) =>
        zoomCamera(current, Math.exp(-event.deltaY * 0.008), {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        }),
      )
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => {
      observer.disconnect()
      element.removeEventListener('wheel', wheel)
    }
  }, [])

  const localPoint = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }
  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (pointers.current.size === 0) {
      dragged.current = false
      travel.current = 0
    }
    if (event.button !== 0 || (event.pointerType === 'touch' && !exploring))
      return
    const point = localPoint(event),
      target = event.target as Element
    if (pointers.current.size === 0) {
      const id = target.closest('[data-node-id]')?.getAttribute('data-node-id')
      const node = nodes.find((n) => n.id === id)
      nodeDrag.current = node
        ? {
            id: node.id,
            origin: { x: node.x, y: node.y },
            pointerOrigin: point,
            scale: camera.scale,
          }
        : null
    } else {
      nodeDrag.current = null
      dragged.current = true
    }
    pointers.current.set(event.pointerId, { point, target })
    event.currentTarget.setAttribute('data-dragging', 'true')
    target.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) return
    const next = localPoint(event)
    const before = [...pointers.current.values()].map(
      (pointer) => pointer.point,
    )
    pointers.current.set(event.pointerId, { ...previous, point: next })
    const after = [...pointers.current.values()].map((pointer) => pointer.point)
    const dx = next.x - previous.point.x,
      dy = next.y - previous.point.y
    travel.current += Math.hypot(dx, dy)
    if (travel.current > 5) dragged.current = true
    if (after.length === 2) {
      setCamera((current) =>
        pinchCamera(current, [before[0], before[1]], [after[0], after[1]]),
      )
    } else if (after.length === 1 && dragged.current) {
      const drag = nodeDrag.current
      if (drag)
        setNodes((current) =>
          current.map((node) =>
            node.id === drag.id
              ? {
                  ...node,
                  x:
                    drag.origin.x +
                    (next.x - drag.pointerOrigin.x) / drag.scale,
                  y:
                    drag.origin.y +
                    (next.y - drag.pointerOrigin.y) / drag.scale,
                }
              : node,
          ),
        )
      else
        setCamera((current) => ({
          ...current,
          x: current.x + dx,
          y: current.y + dy,
        }))
    }
  }
  const release = (event: PointerEvent<SVGSVGElement>) => {
    const pointer = pointers.current.get(event.pointerId)
    pointers.current.delete(event.pointerId)
    // Once a pinch ends, the remaining finger pans; it never grabs the old node.
    nodeDrag.current = null
    if (!pointers.current.size)
      event.currentTarget.removeAttribute('data-dragging')
    if (pointer?.target.hasPointerCapture(event.pointerId))
      pointer.target.releasePointerCapture(event.pointerId)
  }
  const cancel = (event: PointerEvent<SVGSVGElement>) => {
    if (pointers.current.has(event.pointerId)) dragged.current = true
    release(event)
  }
  const stopExploring = () => {
    setExploring(false)
    const captured = [...pointers.current.entries()]
    pointers.current.clear()
    nodeDrag.current = null
    surfaceRef.current?.removeAttribute('data-dragging')
    captured.forEach(([id, pointer]) => {
      if (pointer.target.hasPointerCapture(id))
        pointer.target.releasePointerCapture(id)
    })
  }
  const zoom = (factor: number) =>
    setCamera((current) =>
      zoomCamera(current, factor, {
        x: size.current.width / 2,
        y: size.current.height / 2,
      }),
    )
  const fit = () => setCamera(fitCamera(nodes, size.current))
  const reset = () => {
    setNodes(initialNodes)
    setCamera(fitCamera(initialNodes, size.current))
  }
  const focus = (node: GraphNode) => {
    const neighbors = nodes.filter(
      (n) => n.id === node.id || node.connections.includes(n.id),
    )
    setCamera(fitCamera(neighbors, size.current, 1.1))
  }
  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') {
      stopExploring()
      return
    }
    if (event.key === '+' || event.key === '=') zoom(1.2)
    else if (event.key === '-') zoom(1 / 1.2)
    else if (event.key === '0') reset()
    else if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      const dx =
        event.key === 'ArrowLeft' ? -30 : event.key === 'ArrowRight' ? 30 : 0
      const dy =
        event.key === 'ArrowUp' ? -30 : event.key === 'ArrowDown' ? 30 : 0
      const id = event.shiftKey
        ? (event.target as Element)
            .closest('[data-node-id]')
            ?.getAttribute('data-node-id')
        : null
      if (id)
        setNodes((current) =>
          current.map((node) =>
            node.id === id
              ? {
                  ...node,
                  x: node.x + dx / camera.scale,
                  y: node.y + dy / camera.scale,
                }
              : node,
          ),
        )
      else
        setCamera((current) => ({
          ...current,
          x: current.x - dx,
          y: current.y - dy,
        }))
    } else return
    event.preventDefault()
  }
  return {
    surfaceRef,
    nodes,
    camera,
    exploring,
    toggleExploring: () => (exploring ? stopExploring() : setExploring(true)),
    wasDragged: () => dragged.current,
    zoom,
    focus,
    fit,
    reset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: release,
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
      onKeyDown,
    },
  }
}
