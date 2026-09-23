import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import {
  fitCamera,
  initialCamera,
  pinchCamera,
  zoomCamera,
  type Camera,
  type GraphNode,
  type Point,
} from './graph'

export function useGraphCamera(nodes: GraphNode[]) {
  const surfaceRef = useRef<SVGSVGElement>(null)
  const [camera, setCamera] = useState<Camera>({ x: 450, y: 280, scale: 0.5 })
  const [exploring, setExploring] = useState(false)
  const size = useRef({ width: 900, height: 560 })
  const pointers = useRef(new Map<number, Point>())
  const dragged = useRef(false)
  const travel = useRef(0)
  const reset = () => setCamera(initialCamera(nodes, size.current))
  useEffect(() => {
    const element = surfaceRef.current
    if (!element) return
    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (!width || !height) return
      size.current = { width, height }
      setCamera(initialCamera(nodes, size.current))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    const wheel = (event: WheelEvent) => {
      // Plain wheel scrolling remains page scrolling, even over the graph.
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
  }, [nodes])
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
    event.currentTarget.setAttribute('data-dragging', 'true')
    pointers.current.set(event.pointerId, localPoint(event))
    const target = event.target as Element
    target.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) return
    const next = localPoint(event)
    const before = [...pointers.current.values()]
    pointers.current.set(event.pointerId, next)
    const after = [...pointers.current.values()]
    const dx = next.x - previous.x,
      dy = next.y - previous.y
    travel.current += Math.hypot(dx, dy)
    if (travel.current > 5) dragged.current = true
    if (after.length === 2) {
      dragged.current = true
      setCamera((current) =>
        pinchCamera(current, [before[0], before[1]], [after[0], after[1]]),
      )
    } else if (after.length === 1)
      setCamera((current) => ({
        ...current,
        x: current.x + dx,
        y: current.y + dy,
      }))
  }
  const release = (event: PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(event.pointerId)
    if (!pointers.current.size)
      event.currentTarget.removeAttribute('data-dragging')
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }
  const zoom = (factor: number) =>
    setCamera((current) =>
      zoomCamera(current, factor, {
        x: size.current.width / 2,
        y: size.current.height / 2,
      }),
    )
  const focus = (node: GraphNode) => {
    const neighbors = nodes.filter(
      (n) => n.id === node.id || node.connections.includes(n.id),
    )
    const fitted = fitCamera(neighbors, size.current, 1.1)
    const scale = Math.max(0.7, fitted.scale)
    setCamera(
      size.current.width < 600
        ? {
            scale,
            x: size.current.width / 2 - node.x * scale,
            y: size.current.height / 2 - node.y * scale,
          }
        : fitted,
    )
  }
  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') {
      setExploring(false)
      pointers.current.clear()
      event.currentTarget.removeAttribute('data-dragging')
      return
    }
    if (event.key === '+' || event.key === '=') zoom(1.2)
    else if (event.key === '-') zoom(1 / 1.2)
    else if (event.key === '0') reset()
    else if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      setCamera((current) => ({
        ...current,
        x:
          current.x +
          (event.key === 'ArrowLeft'
            ? 50
            : event.key === 'ArrowRight'
              ? -50
              : 0),
        y:
          current.y +
          (event.key === 'ArrowUp' ? 50 : event.key === 'ArrowDown' ? -50 : 0),
      }))
    } else return
    event.preventDefault()
  }
  return {
    surfaceRef,
    camera,
    exploring,
    setExploring,
    wasDragged: () => dragged.current,
    zoom,
    focus,
    reset,
    fit: () => setCamera(fitCamera(nodes, size.current)),
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: release,
      onPointerCancel: release,
      onLostPointerCapture: release,
      onKeyDown,
    },
  }
}
