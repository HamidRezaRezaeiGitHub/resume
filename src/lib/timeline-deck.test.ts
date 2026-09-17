import { describe, expect, it } from 'vitest'
import { layoutTimelineDeck } from '@/lib/timeline-deck'

describe('timeline reading positions', () => {
  it('keeps short cards below the chapter heading', () => {
    const frames = layoutTimelineDeck([280, 360], 20, 250, 844)
    expect(frames.every((frame) => frame.top === 250)).toBe(true)
    expect(frames[0].start + frames[0].travel).toBe(frames[1].start)
  })

  it('lets a long card expose its bottom before its exit begins', () => {
    const [frame] = layoutTimelineDeck([900], 20, 250, 740)
    expect(frame.top + 900).toBe(740 - 24)
    expect(frame.start).toBeGreaterThan(0)
  })

  it('preserves a forward reading interval across alternating tall and short cards', () => {
    const heights = [900, 220, 620, 300]
    const frames = layoutTimelineDeck(heights, 20, 250, 740)
    frames.forEach((frame, index) => {
      expect(frame.travel).toBeGreaterThan(0)
      expect(frame.top + heights[index]).toBeLessThanOrEqual(740 - 24)
      const next = frames[index + 1]
      if (next) expect(frame.start + frame.travel).toBe(next.start)
    })
  })

  it('uses content length for the last card rather than an extra viewport', () => {
    const [frame] = layoutTimelineDeck([240], 20, 106, 900)
    expect(frame.travel).toBe(260)
  })

  it('adapts the reading position when a narrower viewport makes copy taller', () => {
    const [desktop] = layoutTimelineDeck([360], 20, 106, 900)
    const [phone] = layoutTimelineDeck([650], 20, 280, 740)
    expect(desktop.top).toBe(106)
    expect(phone.top).toBeLessThan(280)
    expect(phone.top + 650).toBe(716)
  })
})
