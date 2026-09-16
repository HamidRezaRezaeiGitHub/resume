import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom does not implement matchMedia; stub it for components that read it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

// jsdom does not implement IntersectionObserver; Motion's whileInView needs it.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly scrollMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  disconnect = vi.fn()
  observe = vi.fn()
  unobserve = vi.fn()
  takeRecords = vi.fn(() => [])
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})
