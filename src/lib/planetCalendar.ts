// What the homepage's "This Week for the Planet" section shows, worked out from
// a date and nothing else — so it never needs editing and cannot go stale.
// All dates are the visitor's local calendar days.

import { awarenessDays as defaultDays, type AwarenessDay, type DateRule } from '@/data/awarenessDays'
import { seasons as defaultSeasons, type Season } from '@/data/seasons'
import { ecoMissions } from '@/data/ecochallenges'

export interface PlanetActivity {
  key: string
  kind: 'mission' | 'game' | 'event'
  title: string
  summary: string
  img: string
  cta: string
  href: string
}

const missions: PlanetActivity[] = ecoMissions.map((m) => ({
  key: m.slug,
  kind: 'mission',
  title: m.title,
  summary: m.summary,
  img: '/images/events/IMG_3250.webp',
  cta: 'Start this mission',
  href: `/ecochallenge/join/?challenge=${encodeURIComponent(m.title)}`,
}))

// Short versions of the descriptions on /games/, same screenshots.
const games: PlanetActivity[] = [
  {
    key: 'storm-drain',
    kind: 'game',
    title: 'Storm Drain Detective',
    summary: 'Guess where the water on your street ends up, then trace the real answer through the USGS river network.',
    img: '/images/games/storm-drain.png',
    cta: 'Play now',
    href: '/games/storm-drain/',
  },
  {
    key: 'bioblitz',
    kind: 'game',
    title: 'Backyard Bioblitz',
    summary: 'Learn to tell apart real plants and animals that people have recorded near your ZIP code.',
    img: '/images/games/bioblitz.jpg',
    cta: 'Play now',
    href: '/games/bioblitz/',
  },
  {
    key: 'air-detective',
    kind: 'game',
    title: 'Air Detective',
    summary: 'Read real hourly pollution data from your own area and work out what caused the spike.',
    img: '/images/games/air-detective.png',
    cta: 'Play now',
    href: '/games/air-detective/',
  },
  {
    key: 'climate-record',
    kind: 'game',
    title: 'Your Climate Record',
    summary: 'Guess how much your town has warmed since the 1950s, then meet the real 75-year record.',
    img: '/images/games/climate-record.png',
    cta: 'Play now',
    href: '/games/climate-record/',
  },
]

const cleanup: PlanetActivity = {
  key: 'cleanup',
  kind: 'event',
  title: 'Community Cleanups',
  summary: 'Beach and park cleanups across California, open to students, families, and community volunteers.',
  img: '/images/events/friendship-park-2026-3.webp',
  cta: 'See our cleanups',
  href: '/events/',
}

/** The weekly rotation. Cleanups are pairing-only: they need a date, not a week. */
export const rotation: PlanetActivity[] = [...missions, ...games]

const byKey = new Map([...rotation, cleanup].map((a) => [a.key, a]))

export function activityFor(key: string): PlanetActivity {
  const activity = byKey.get(key)
  if (!activity) throw new Error(`Unknown planet activity: ${key}`)
  return activity
}

const DAY_MS = 86_400_000

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Whole calendar days from a to b; rounding absorbs DST's 23- and 25-hour days. */
function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS)
}

export interface UpcomingDay {
  day: AwarenessDay
  date: Date
  /** 0 means today. */
  daysAway: number
  activity: PlanetActivity
}

/** Local midnight of a rule's date in a given year. */
export function occurrence(rule: DateRule, year: number): Date {
  if ('day' in rule) return new Date(year, rule.month - 1, rule.day)
  if (rule.nth === 'last') {
    const last = new Date(year, rule.month, 0) // day 0 of next month = last day of this one
    return new Date(year, rule.month - 1, last.getDate() - ((last.getDay() - rule.weekday + 7) % 7))
  }
  const first = new Date(year, rule.month - 1, 1)
  return new Date(year, rule.month - 1, 1 + ((rule.weekday - first.getDay() + 7) % 7) + 7 * (rule.nth - 1))
}

/**
 * The next n observances from today (inclusive), wrapping into next year. A
 * rule day that has passed is re-derived for next year, so its date can differ
 * from this year's. Same-date days keep data order (Array#sort is stable).
 */
export function nextAwarenessDays(today: Date, n: number, days: AwarenessDay[] = defaultDays): UpcomingDay[] {
  const start = startOfDay(today)
  return days
    .map((day) => {
      let date = occurrence(day.when, start.getFullYear())
      if (date < start) date = occurrence(day.when, start.getFullYear() + 1)
      return { day, date, daysAway: daysBetween(start, date), activity: activityFor(day.activity) }
    })
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, n)
}

/** Monday Jan 1, 2024. Any Monday would do; it only has to stay fixed. */
const EPOCH = new Date(2024, 0, 1)

/** Monday-based weeks since EPOCH, in local time. */
export function weekIndex(today: Date): number {
  return Math.floor(daysBetween(EPOCH, today) / 7)
}

/** An observance this many days out or fewer (0 = today) takes over the weekly feature. */
export const OVERRIDE_WINDOW_DAYS = 7

export interface WeeklyPick {
  activity: PlanetActivity
  /** Set when an upcoming observance chose the activity instead of the rotation. */
  because?: UpcomingDay
}

export function weeklyPick(today: Date, days: AwarenessDay[] = defaultDays): WeeklyPick {
  const [soonest] = nextAwarenessDays(today, 1, days)
  if (soonest && soonest.daysAway < OVERRIDE_WINDOW_DAYS) {
    return { activity: soonest.activity, because: soonest }
  }
  const n = rotation.length
  return { activity: rotation[((weekIndex(today) % n) + n) % n] }
}

/** This month's Southern California season card. */
export function seasonFor(today: Date, list: Season[] = defaultSeasons): Season {
  const month = today.getMonth() + 1
  const season = list.find((s) => s.month === month)
  if (!season) throw new Error(`No season for month ${month}`)
  return season
}

export function countdown(daysAway: number): string {
  if (daysAway === 0) return 'Today'
  if (daysAway === 1) return 'Tomorrow'
  return `in ${daysAway} days`
}
