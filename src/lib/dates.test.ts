import { describe, expect, it } from 'vitest'
import { formatCareerDate, formatCareerPeriod } from '@/lib/dates'

describe('career dates', () => {
  it('preserves supplied month precision without timezone conversion', () => {
    expect(formatCareerPeriod('2023-06', '2025-06')).toBe('Jun 2023 — Jun 2025')
    expect(formatCareerPeriod('2025-06', 'present')).toBe('Jun 2025 — Present')
  })

  it('does not invent months for year-only education and teaching records', () => {
    expect(formatCareerDate('2019')).toBe('2019')
    expect(formatCareerPeriod('2013', '2018')).toBe('2013 — 2018')
  })
})
