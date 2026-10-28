import { describe, expect, it } from 'vitest'
import { seasons } from '@/data/seasons'
import { activityFor, countdown, seasonFor } from './planetCalendar'

const d = (y: number, m: number, day: number, h = 12) => new Date(y, m - 1, day, h)

describe('seasons data', () => {
  it('has exactly one entry per month', () => {
    expect(seasons.map((s) => s.month).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('every entry has a source link, a known activity and timeless copy', () => {
    for (const s of seasons) {
      expect(s.sourceUrl, s.heading).toMatch(/^https?:\/\//)
      expect(s.sourceLabel, s.heading).not.toBe('')
      expect(() => activityFor(s.activity), s.heading).not.toThrow()
      expect(`${s.heading} ${s.text}`, s.heading).not.toMatch(/\b20\d\d\b/)
      expect(s.heading.split(' ').length, s.heading).toBeLessThanOrEqual(6)
    }
  })
})

describe('seasonFor', () => {
  it('returns the entry for each month', () => {
    for (let m = 1; m <= 12; m++) expect(seasonFor(d(2027, m, 15)).month).toBe(m)
  })

  it("uses the visitor's local month late at night", () => {
    expect(seasonFor(d(2027, 1, 31, 23)).month).toBe(1)
    expect(seasonFor(d(2027, 2, 1, 0)).month).toBe(2)
  })

  it('throws when a month is missing', () => {
    expect(() => seasonFor(d(2027, 3, 1), [])).toThrow('No season for month 3')
  })
})

describe('countdown', () => {
  it('says Today, Tomorrow, or in N days', () => {
    expect(countdown(0)).toBe('Today')
    expect(countdown(1)).toBe('Tomorrow')
    expect(countdown(12)).toBe('in 12 days')
  })
})
