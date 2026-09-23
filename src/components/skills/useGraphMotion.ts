import { useEffect, useRef, type RefObject } from 'react'

// Animate one SVG layer directly; React only renders actual interaction changes.
export function useGraphMotion(
  surfaceRef: RefObject<SVGSVGElement | null>,
  paused: boolean,
) {
  const layer = useRef<SVGGElement>(null)
  useEffect(() => {
    const element = surfaceRef.current,
      group = layer.current
    if (!element || !group) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false,
      frame = 0,
      x = 0,
      y = 0
    const target = { x: 0, y: 0 }
    let startedAt = 0
    const animate = (time: number) => {
      startedAt ||= time
      const elapsed = (time - startedAt) / 1000
      x += (target.x - x) * 0.06
      y += (target.y - y) * 0.06
      group.setAttribute(
        'transform',
        `translate(${x + Math.sin(elapsed * 0.45) * 5} ${y + Math.cos(elapsed * 0.35) * 5})`,
      )
      frame = requestAnimationFrame(animate)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      const active =
        !paused && !preference.matches && visible && !document.hidden
      element.setAttribute('data-motion', active ? 'on' : 'off')
      if (active) frame = requestAnimationFrame(animate)
      else group.removeAttribute('transform')
    }
    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'touch' || event.buttons) return
      const bounds = element.getBoundingClientRect()
      target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 20
      target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 20
    }
    const leave = () => {
      target.x = 0
      target.y = 0
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      sync()
    })
    observer.observe(element)
    sync()
    preference.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      preference.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
      group.removeAttribute('transform')
    }
  }, [surfaceRef, paused])
  return layer
}
