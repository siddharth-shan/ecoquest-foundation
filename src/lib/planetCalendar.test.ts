import { describe, expect, it } from 'vitest'
import { awarenessDays } from '@/data/awarenessDays'
import { activityFor, nextAwarenessDays, occurrence, rotation, weekIndex, weeklyPick } from './planetCalendar'

// Local noon unless an hour is given; tests run with TZ=America/Los_Angeles.
const d = (y: number, m: number, day: number, h = 12) => new Date(y, m - 1, day, h)
const ymd = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()]

describe('awarenessDays data', () => {
  it('every entry has a real date or rule, an https link, a source, a why line and a known activity', () => {
    for (const a of awarenessDays) {
      if ('day' in a.when) {
        const date = new Date(2027, a.when.month - 1, a.when.day)
        expect(date.getMonth(), a.name).toBe(a.when.month - 1)
        expect(date.getDate(), a.name).toBe(a.when.day)
      } else {
        expect(a.when.weekday, a.name).toBeGreaterThanOrEqual(0)
        expect(a.when.weekday, a.name).toBeLessThanOrEqual(6)
      }
      expect(a.url, a.name).toMatch(/^https:\/\//)
      expect(a.source, a.name).not.toBe('')
      expect(a.why, a.name).toMatch(/\.$/)
      expect(() => activityFor(a.activity), a.name).not.toThrow()
    }
  })

  it('has 31 observances with unique names', () => {
    const names = awarenessDays.map((a) => a.name)
    expect(names).toHaveLength(31)
    expect(new Set(names).size).toBe(names.length)
  })

  it('never names a current-era year, so no line goes out of date', () => {
    for (const a of awarenessDays) expect(a.why, a.name).not.toMatch(/\b20\d\d\b/)
  })

  it('copy is plain ASCII', () => {
    for (const a of awarenessDays) {
      expect(a.name, a.name).toMatch(/^[\x20-\x7E]+$/)
      expect(a.why, a.name).toMatch(/^[\x20-\x7E]+$/)
    }
  })
})

describe('activityFor', () => {
  it('throws on an unknown key', () => {
    expect(() => activityFor('nope')).toThrow('Unknown planet activity: nope')
  })
})

describe('occurrence', () => {
  it('returns a fixed date as-is', () => {
    expect(ymd(occurrence({ month: 10, day: 31 }, 2026))).toEqual([2026, 10, 31])
  })

  it('finds the nth weekday of a month', () => {
    expect(ymd(occurrence({ month: 9, weekday: 6, nth: 3 }, 2026))).toEqual([2026, 9, 19])
    expect(ymd(occurrence({ month: 9, weekday: 0, nth: 4 }, 2026))).toEqual([2026, 9, 27])
    expect(ymd(occurrence({ month: 5, weekday: 6, nth: 2 }, 2027))).toEqual([2027, 5, 8])
  })

  it('finds the last weekday of a month', () => {
    expect(ymd(occurrence({ month: 4, weekday: 5, nth: 'last' }, 2027))).toEqual([2027, 4, 30])
    expect(ymd(occurrence({ month: 4, weekday: 5, nth: 'last' }, 2026))).toEqual([2026, 4, 24])
  })
})

describe('nextAwarenessDays', () => {
  it('returns the next n observances in date order', () => {
    const next = nextAwarenessDays(d(2026, 10, 27), 4)
    expect(next.map((x) => x.day.name)).toEqual([
      'World Cities Day',
      'World Sustainable Transport Day',
      'World Soil Day',
      'International Day of Clean Energy',
    ])
    expect(next.map((x) => x.daysAway)).toEqual([4, 30, 39, 91])
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

  it('counts a rule day on its own date as today', () => {
    const [first] = nextAwarenessDays(d(2026, 9, 19, 23), 1)
    expect(first.day.name).toBe('California Coastal Cleanup Day')
    expect(first.daysAway).toBe(0)
  })

  it('recomputes a passed rule day for next year', () => {
    const cleanup = nextAwarenessDays(d(2026, 9, 20), 31).find((x) => x.day.name === 'California Coastal Cleanup Day')
    expect(cleanup && ymd(cleanup.date)).toEqual([2027, 9, 18])
  })

  it('keeps data order for observances on the same date', () => {
    const next = nextAwarenessDays(d(2027, 3, 21), 2)
    expect(next.map((x) => x.day.name)).toEqual(['International Day of Forests', 'World Day for Glaciers'])
    expect(next.map((x) => x.daysAway)).toEqual([0, 0])
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

  it('features cleanups for cleanup days, though they never rotate', () => {
    expect(weeklyPick(d(2027, 9, 18)).because?.day.name).toBe('California Coastal Cleanup Day')
    expect(weeklyPick(d(2027, 9, 18)).activity.key).toBe('cleanup')
    expect(weeklyPick(d(2027, 9, 19)).because?.day.name).toBe('World Cleanup Day')
    expect(weeklyPick(d(2027, 9, 19)).activity.key).toBe('cleanup')
    expect(rotation.some((a) => a.key === 'cleanup')).toBe(false)
  })

  // An empty calendar isolates the rotation from observance overrides.
  it('is stable within a week and changes the next Monday', () => {
    const monday = weeklyPick(d(2027, 7, 5), [])
    expect(monday.because).toBeUndefined()
    expect(weeklyPick(d(2027, 7, 11, 23), []).activity.key).toBe(monday.activity.key)
    expect(weeklyPick(d(2027, 7, 12), []).activity.key).not.toBe(monday.activity.key)
  })

  it('cycles through every activity in the rotation', () => {
    const keys = new Set<string>()
    for (let w = 0; w < rotation.length; w++) keys.add(weeklyPick(d(2027, 7, 5 + 7 * w), []).activity.key)
    expect(keys.size).toBe(rotation.length)
  })
})
