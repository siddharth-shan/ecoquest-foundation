import { describe, expect, it } from 'vitest'
import { awarenessDays } from '@/data/awarenessDays'
import { activityFor, nextAwarenessDays, rotation, weekIndex, weeklyPick } from './planetCalendar'

// Local noon unless an hour is given; tests run with TZ=America/Los_Angeles.
const d = (y: number, m: number, day: number, h = 12) => new Date(y, m - 1, day, h)

describe('awarenessDays data', () => {
  it('every entry is a real date with an https link and a known activity', () => {
    for (const a of awarenessDays) {
      const date = new Date(2027, a.month - 1, a.day)
      expect(date.getMonth(), a.name).toBe(a.month - 1)
      expect(date.getDate(), a.name).toBe(a.day)
      expect(a.url, a.name).toMatch(/^https:\/\//)
      expect(() => activityFor(a.activity), a.name).not.toThrow()
    }
  })

  it('has no two observances on the same date', () => {
    const keys = awarenessDays.map((a) => `${a.month}-${a.day}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('activityFor', () => {
  it('throws on an unknown key', () => {
    expect(() => activityFor('nope')).toThrow('Unknown planet activity: nope')
  })
})

describe('nextAwarenessDays', () => {
  it('returns the next n observances in date order', () => {
    const next = nextAwarenessDays(d(2026, 10, 27), 3)
    expect(next.map((x) => x.day.name)).toEqual([
      'World Cities Day',
      'World Soil Day',
      'International Day of Clean Energy',
    ])
    expect(next.map((x) => x.daysAway)).toEqual([4, 39, 91])
  })

  it('wraps from December into next year', () => {
    const [first] = nextAwarenessDays(d(2026, 12, 28), 1)
    expect(first.day.name).toBe('International Day of Clean Energy')
    expect(first.date.getFullYear()).toBe(2027)
    expect(first.daysAway).toBe(29)
  })

  it('still counts the day itself late in the evening', () => {
    const [first] = nextAwarenessDays(d(2026, 10, 31, 23), 1)
    expect(first.day.name).toBe('World Cities Day')
    expect(first.daysAway).toBe(0)
  })

  it('counts whole days across the March DST change', () => {
    // US clocks spring forward on Sun Mar 14, 2027.
    const [first] = nextAwarenessDays(d(2027, 3, 4, 0), 1)
    expect(first.day.name).toBe('International Day of Forests')
    expect(first.daysAway).toBe(17)
  })
})

describe('weekIndex', () => {
  it('is 0 from Monday Jan 1, 2024 through Sunday, then 1', () => {
    expect(weekIndex(d(2024, 1, 1))).toBe(0)
    expect(weekIndex(d(2024, 1, 7, 23))).toBe(0)
    expect(weekIndex(d(2024, 1, 8, 0))).toBe(1)
  })

  it('stays on Monday boundaries across DST', () => {
    // Mon Mar 11, 2024 is the day after US clocks sprang forward.
    expect(weekIndex(d(2024, 3, 11, 0))).toBe(10)
  })
})

describe('weeklyPick', () => {
  it('features the paired activity when an observance is 0–6 days away', () => {
    const pick = weeklyPick(d(2027, 3, 16))
    expect(pick.because?.day.name).toBe('International Day of Forests')
    expect(pick.because?.daysAway).toBe(5)
    expect(pick.activity.key).toBe('bioblitz')
  })

  it('does not override at exactly 7 days away', () => {
    expect(weeklyPick(d(2027, 3, 14)).because).toBeUndefined()
  })

  it('lets the earliest observance win when several are close', () => {
    expect(weeklyPick(d(2027, 3, 20)).because?.day.name).toBe('International Day of Forests')
  })

  it('features cleanups for World Cleanup Day, though they never rotate', () => {
    expect(weeklyPick(d(2027, 9, 18)).activity.key).toBe('cleanup')
    expect(rotation.some((a) => a.key === 'cleanup')).toBe(false)
  })

  // Jul–Aug 2027 has no observance within 7 days (Jun 8 → Sep 7).
  it('is stable within a week and changes the next Monday', () => {
    const monday = weeklyPick(d(2027, 7, 5))
    expect(monday.because).toBeUndefined()
    expect(weeklyPick(d(2027, 7, 11, 23)).activity.key).toBe(monday.activity.key)
    expect(weeklyPick(d(2027, 7, 12)).activity.key).not.toBe(monday.activity.key)
  })

  it('cycles through every activity in the rotation', () => {
    const keys = new Set<string>()
    for (let w = 0; w < rotation.length; w++) keys.add(weeklyPick(d(2027, 7, 5 + 7 * w)).activity.key)
    expect(keys.size).toBe(rotation.length)
  })
})
