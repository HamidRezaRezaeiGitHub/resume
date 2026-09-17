import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

class MotionPreference extends EventTarget implements MediaQueryList {
  matches = false
  media = '(prefers-reduced-motion: reduce)'
  onchange: MediaQueryList['onchange'] = null
  addListener = vi.fn()
  removeListener = vi.fn()
}

afterEach(() => vi.restoreAllMocks())

it('follows live motion preference changes and removes its subscription on unmount', () => {
  const media = new MotionPreference()
  const unsubscribe = vi.spyOn(media, 'removeEventListener')
  vi.spyOn(window, 'matchMedia').mockReturnValue(media)
  const { result, unmount } = renderHook(useReducedMotionPreference)
  expect(result.current).toBe(false)
  act(() => {
    media.matches = true
    media.dispatchEvent(new Event('change'))
  })
  expect(result.current).toBe(true)
  act(() => {
    media.matches = false
    media.dispatchEvent(new Event('change'))
  })
  expect(result.current).toBe(false)
  unmount()
  expect(unsubscribe).toHaveBeenCalledWith('change', expect.any(Function))
})
