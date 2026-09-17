import { useEffect, useState, type RefObject } from 'react'
import { layoutTimelineDeck, type DeckFrame } from '@/lib/timeline-deck'

type DeckLayout = {
  frames: DeckFrame[]
  height: number
  viewport: number
}

export function useTimelineDeck(
  listRef: RefObject<HTMLUListElement | null>,
  headingRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  const [layout, setLayout] = useState<DeckLayout | null>(null)

  useEffect(() => {
    const list = listRef.current
    const heading = headingRef.current
    if (!list || !heading || typeof ResizeObserver === 'undefined') return

    let anchorPositions = new Map<string, number>()
    let firstMeasurement = true
    const restoreAnchor = () => {
      const offset = anchorPositions.get(window.location.hash.slice(1))
      if (offset === undefined) return
      // Native fragment scrolling sees the card's sticky position. Target its
      // original position so returning to a faded card restores its full copy.
      window.scrollTo({
        top: list.getBoundingClientRect().top + window.scrollY + offset,
        behavior: 'instant',
      })
    }

    const measure = () => {
      if (reducedMotion || window.innerHeight <= 600) {
        anchorPositions.clear()
        setLayout(null)
        return
      }
      const headingTop = Number.parseFloat(getComputedStyle(heading).top)
      const stacked = window.matchMedia('(max-width: 800px)').matches
      const preferredTop =
        headingTop + (stacked ? heading.offsetHeight + 16 : 0)
      const cards = Array.from(list.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      )
      const next = {
        frames: layoutTimelineDeck(
          cards.map((card) => card.offsetHeight),
          Number.parseFloat(getComputedStyle(list).rowGap),
          preferredTop,
          window.innerHeight,
        ),
        height: list.offsetHeight,
        viewport: window.innerHeight,
      }
      anchorPositions = new Map(
        cards.map((card, index) => [
          card.id,
          next.frames[index].start + next.frames[index].top - preferredTop,
        ]),
      )
      setLayout((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      )
      if (firstMeasurement) restoreAnchor()
      firstMeasurement = false
    }

    const observer = new ResizeObserver(measure)
    observer.observe(list)
    observer.observe(heading)
    for (const card of list.children) observer.observe(card)
    window.addEventListener('resize', measure)
    window.addEventListener('hashchange', restoreAnchor)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('hashchange', restoreAnchor)
    }
  }, [headingRef, listRef, reducedMotion])

  return reducedMotion ? null : layout
}
