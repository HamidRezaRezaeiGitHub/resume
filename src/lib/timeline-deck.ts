export type DeckFrame = {
  top: number
  start: number
  travel: number
}

/** Positions are relative to the untransformed list, never a sticky card. */
export function layoutTimelineDeck(
  heights: number[],
  gap: number,
  preferredTop: number,
  viewportHeight: number,
): DeckFrame[] {
  let offset = 0
  const positions = heights.map((height) => {
    // A tall card must expose its bottom before it can pin and fade away.
    const top = Math.min(preferredTop, viewportHeight - height - 24)
    const position = { top, start: offset - top }
    offset += height + gap
    return position
  })
  return positions.map((position, index) => ({
    ...position,
    travel: Math.max(
      1,
      (positions[index + 1]?.start ?? position.start + heights[index] + gap) -
        position.start,
    ),
  }))
}
