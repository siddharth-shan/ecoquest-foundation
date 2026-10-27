# Homepage "This Week for the Planet" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-updating "This Week for the Planet" section (weekly mission + next 3 UN environmental days) to the homepage, put a real event photo in the hero, and remove the duplicated impact block.

**Architecture:** A static list of fixed-date UN observances (`src/data/awarenessDays.ts`) and pure date functions (`src/lib/planetCalendar.ts`) decide what to show from a `Date`. A client component renders them, starting from the build date (so server HTML and first client render match) and switching to the visitor's date in an effect. No network, no cron.

**Tech Stack:** Next.js 14 App Router (static export), React 18, TypeScript (strict, `moduleResolution: bundler`), Tailwind, Vitest 3.2.4 (new, dev only).

**Spec:** `docs/superpowers/specs/2026-10-27-homepage-this-week-design.md`

## Global Constraints

- No invented claims; UN days are labeled "UN observance" and link to the official page; EcoQuest's paired activity is offered as "Try: …", never as a partnership.
- US spelling in all copy.
- Fixed-date observances only; dates/URLs exactly as in the spec table (verified 2026-10-27).
- No network requests, cron jobs, or secrets for this feature.
- Override window: an awareness day with `daysAway` 0–6 (today inclusive, 7 days) takes over the weekly feature; `daysAway === 7` does not.
- `cleanup` is pairing-only and never appears in the weekly rotation.
- Match surrounding code: single quotes, no semicolons, 2-space indent, short explanatory header comments.

## Review Focus

1. **Visitor in a different time zone from the build server** (Vercel builds in UTC, visitors are mostly Pacific) — server HTML and first client render must be identical (no hydration warning). Pinned by passing `builtOn` as a `YYYY-MM-DD` string parsed to a *local* date (Task 3) and checked in the browser console (Task 5).
2. **DST transitions** — "days away" must stay a whole number across the March/November clock change. Pinned by a test in Task 1 and a weekIndex test in Task 2; tests run with `TZ=America/Los_Angeles`.
3. **Late evening on the day itself** (e.g. 11 PM on Oct 31) — the day must still show as "Today", not roll to next year. Pinned in Task 1.
4. **Data typo** (Feb 30, unknown activity key, duplicate date) — must fail tests, not crash the homepage. Pinned in Task 1.
5. **Several observances in the same week** (Mar 21, 22) — the earliest wins, deterministically. Pinned in Task 2.

---

### Task 1: Test tooling, awareness-days data, `nextAwarenessDays`

**Files:**
- Modify: `package.json` (devDependency + `test` script)
- Create: `vitest.config.ts`
- Create: `src/data/awarenessDays.ts`
- Create: `src/lib/planetCalendar.ts`
- Test: `src/lib/planetCalendar.test.ts`

**Interfaces:**
- Consumes: `ecoMissions` from `src/data/ecochallenges.ts` (`{ slug, title, summary, … }[]`, slugs `energy`, `zero-waste`, `water`).
- Produces:
  - `interface AwarenessDay { month: number; day: number; name: string; url: string; activity: string }`, `awarenessDays: AwarenessDay[]`
  - `interface PlanetActivity { key: string; kind: 'mission' | 'game' | 'event'; title: string; summary: string; img: string; cta: string; href: string }`
  - `rotation: PlanetActivity[]`, `activityFor(key: string): PlanetActivity` (throws on unknown key)
  - `interface UpcomingDay { day: AwarenessDay; date: Date; daysAway: number; activity: PlanetActivity }`
  - `nextAwarenessDays(today: Date, n: number, days?: AwarenessDay[]): UpcomingDay[]`

- [ ] **Step 1: Install Vitest and add the script**

```bash
npm install --save-dev --save-exact vitest@3.2.4
npm pkg set scripts.test="TZ=America/Los_Angeles vitest run"
```

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 2: Write the failing tests**

Create `src/lib/planetCalendar.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { awarenessDays } from '@/data/awarenessDays'
import { activityFor, nextAwarenessDays } from './planetCalendar'

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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `@/data/awarenessDays` / `./planetCalendar`.

- [ ] **Step 4: Create the data file**

Create `src/data/awarenessDays.ts`:

```ts
// UN-recognized environmental days with a fixed calendar date, each paired with
// the EcoQuest activity closest to its subject. Dates and links were checked
// against un.org/en/observances/list-days-weeks on 2026-10-27.
//
// Fixed dates only: the homepage works out what is next from the visitor's
// clock, so a day whose date moves each year (Arbor Day) would need a rule, not
// a date. The pairing is ours, not the UN's — the page labels the day "UN
// observance" and offers our activity as "Try: …".

export interface AwarenessDay {
  month: number
  day: number
  name: string
  /** The official observance page. */
  url: string
  /** Key of a PlanetActivity in src/lib/planetCalendar.ts. */
  activity: string
}

export const awarenessDays: AwarenessDay[] = [
  { month: 1, day: 26, name: 'International Day of Clean Energy', url: 'https://www.un.org/en/observances/clean-energy-day', activity: 'energy' },
  { month: 2, day: 2, name: 'World Wetlands Day', url: 'https://www.un.org/en/observances/world-wetlands-day', activity: 'storm-drain' },
  { month: 3, day: 3, name: 'World Wildlife Day', url: 'https://www.un.org/en/observances/world-wildlife-day', activity: 'bioblitz' },
  { month: 3, day: 21, name: 'International Day of Forests', url: 'https://www.fao.org/international-day-of-forests/en', activity: 'bioblitz' },
  { month: 3, day: 22, name: 'World Water Day', url: 'https://www.un.org/en/observances/water-day', activity: 'water' },
  { month: 3, day: 30, name: 'International Day of Zero Waste', url: 'https://www.un.org/en/observances/zero-waste-day', activity: 'zero-waste' },
  { month: 4, day: 22, name: 'International Mother Earth Day', url: 'https://www.un.org/en/observances/earth-day', activity: 'climate-record' },
  { month: 5, day: 22, name: 'International Day for Biological Diversity', url: 'https://www.un.org/en/observances/biological-diversity-day', activity: 'bioblitz' },
  { month: 6, day: 5, name: 'World Environment Day', url: 'https://www.un.org/en/observances/environment-day', activity: 'zero-waste' },
  { month: 6, day: 8, name: 'World Oceans Day', url: 'https://www.un.org/en/observances/oceans-day', activity: 'storm-drain' },
  { month: 9, day: 7, name: 'International Day of Clean Air for Blue Skies', url: 'https://www.cleanairblueskies.org/', activity: 'air-detective' },
  { month: 9, day: 16, name: 'International Day for the Preservation of the Ozone Layer', url: 'https://www.un.org/en/observances/ozone-day', activity: 'air-detective' },
  { month: 9, day: 20, name: 'World Cleanup Day', url: 'https://www.un.org/en/observances/cleanup-day', activity: 'cleanup' },
  { month: 9, day: 29, name: 'International Day of Awareness of Food Loss and Waste', url: 'https://www.fao.org/platform-food-loss-waste/flw-events/international-day-food-loss-and-waste/en', activity: 'zero-waste' },
  { month: 10, day: 31, name: 'World Cities Day', url: 'https://www.un.org/en/observances/cities-day', activity: 'storm-drain' },
  { month: 12, day: 5, name: 'World Soil Day', url: 'https://www.un.org/en/observances/world-soil-day', activity: 'bioblitz' },
]
```

- [ ] **Step 5: Create the calendar module**

Create `src/lib/planetCalendar.ts`:

```ts
// What the homepage's "This Week for the Planet" section shows, worked out from
// a date and nothing else — so it never needs editing and cannot go stale.
// All dates are the visitor's local calendar days.

import { awarenessDays as defaultDays, type AwarenessDay } from '@/data/awarenessDays'
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

/** The next n observances from today (inclusive), wrapping into next year. */
export function nextAwarenessDays(today: Date, n: number, days: AwarenessDay[] = defaultDays): UpcomingDay[] {
  const start = startOfDay(today)
  return days
    .map((day) => {
      let date = new Date(start.getFullYear(), day.month - 1, day.day)
      if (date < start) date = new Date(start.getFullYear() + 1, day.month - 1, day.day)
      return { day, date, daysAway: daysBetween(start, date), activity: activityFor(day.activity) }
    })
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, n)
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/data/awarenessDays.ts src/lib/planetCalendar.ts src/lib/planetCalendar.test.ts
git commit -m "feat(home): UN awareness-days calendar data and nextAwarenessDays

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: `weekIndex` and `weeklyPick`

**Files:**
- Modify: `src/lib/planetCalendar.ts` (append)
- Test: `src/lib/planetCalendar.test.ts` (append)

**Interfaces:**
- Consumes: `nextAwarenessDays`, `rotation`, `UpcomingDay`, `PlanetActivity` from Task 1.
- Produces:
  - `weekIndex(today: Date): number` — 0 for the week of Mon Jan 1, 2024
  - `OVERRIDE_WINDOW_DAYS = 7`
  - `interface WeeklyPick { activity: PlanetActivity; because?: UpcomingDay }`
  - `weeklyPick(today: Date, days?: AwarenessDay[]): WeeklyPick`

- [ ] **Step 1: Write the failing tests**

Change the import line at the top of `src/lib/planetCalendar.test.ts` to:

```ts
import { activityFor, nextAwarenessDays, rotation, weekIndex, weeklyPick } from './planetCalendar'
```

Append:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `weekIndex` / `weeklyPick` is not exported.

- [ ] **Step 3: Implement**

Append to `src/lib/planetCalendar.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 15 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/planetCalendar.ts src/lib/planetCalendar.test.ts
git commit -m "feat(home): weekly mission rotation with observance override

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: `ThisWeekForPlanet` component on the homepage

**Files:**
- Create: `src/components/home/ThisWeekForPlanet.tsx`
- Modify: `src/app/page.tsx` (import; insert after `<UpcomingEvents />`)

**Interfaces:**
- Consumes: `weeklyPick`, `nextAwarenessDays` from Tasks 1–2.
- Produces: default export `ThisWeekForPlanet({ builtOn }: { builtOn: string })`, where `builtOn` is `YYYY-MM-DD`.

- [ ] **Step 1: Create the component**

Create `src/components/home/ThisWeekForPlanet.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { nextAwarenessDays, weeklyPick } from '@/lib/planetCalendar'

// Both halves are worked out from the date alone, so nobody has to edit them.
// The first render uses the build date, so the static HTML is never empty and
// hydration matches; the effect then swaps in the visitor's own date, which
// keeps the section right between deploys.
//
// builtOn is a YYYY-MM-DD string parsed as a *local* date: an ISO timestamp
// would land on different calendar days on a UTC build server and a Pacific
// browser, and the two renders would disagree.

function localDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}

const longDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
const monthShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' })

export default function ThisWeekForPlanet({ builtOn }: { builtOn: string }) {
  const [today, setToday] = useState(() => localDate(builtOn))
  useEffect(() => setToday(new Date()), [])

  const { activity, because } = weeklyPick(today)
  const upcoming = nextAwarenessDays(today, 3)

  return (
    <section className="section-padding" aria-labelledby="this-week-heading">
      <div className="container-custom">
        <div className="section-header">
          <h2 id="this-week-heading" className="section-title">This Week for the Planet</h2>
          <div className="section-underline" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <article className="card overflow-hidden lg:col-span-3 flex flex-col">
            <img src={activity.img} alt="" className="w-full h-56 object-cover" />
            <div className="p-6 flex flex-col flex-1">
              <p className="text-sm font-semibold text-primary-blue mb-2">
                {because
                  ? `${because.day.name} is ${because.daysAway === 0 ? 'today' : longDate(because.date)} — so this week:`
                  : 'This week’s mission'}
              </p>
              <h3 className="font-heading font-bold text-2xl text-primary-green mb-3">{activity.title}</h3>
              <p className="text-gray-600 mb-6">{activity.summary}</p>
              <Link href={activity.href} className="btn btn-primary self-start mt-auto">
                {activity.cta} &rarr;
              </Link>
            </div>
          </article>

          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-xl text-gray-800 mb-4">Coming up for the planet</h3>
            <ul className="space-y-4">
              {upcoming.map(({ day, date, daysAway, activity: a }) => (
                <li key={day.name} className="card p-4 flex gap-4 items-start">
                  <div className="text-center min-w-[3.5rem]" aria-hidden="true">
                    <div className="text-xs uppercase font-semibold text-gray-500">{monthShort(date)}</div>
                    <div className="text-2xl font-bold text-primary-green leading-none">{date.getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{day.name}</span>
                      {daysAway === 0 && (
                        <span className="text-xs font-semibold bg-primary-green text-white rounded-full px-2 py-0.5">Today</span>
                      )}
                    </div>
                    <span className="sr-only">{longDate(date)}.</span>
                    <a
                      href={day.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${day.name} — UN observance page (opens in a new tab)`}
                      className="text-xs text-gray-500 hover:text-primary-green underline"
                    >
                      UN observance ↗
                    </a>
                    <div>
                      <Link href={a.href} className="text-sm font-semibold text-primary-blue hover:underline mt-2 inline-block">
                        Try: {a.title} &rarr;
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Mount it on the homepage**

In `src/app/page.tsx`, add after the `UpcomingEvents` import:

```tsx
import ThisWeekForPlanet from '@/components/home/ThisWeekForPlanet'
```

Replace:

```tsx
      <UpcomingEvents />
```

with:

```tsx
      <UpcomingEvents />

      {/* This Week for the Planet — worked out from the date, never edited by hand */}
      <ThisWeekForPlanet builtOn={new Date().toISOString().slice(0, 10)} />
```

- [ ] **Step 3: Check types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors (existing `<img>` warnings, if any, match the rest of the site).

- [ ] **Step 4: Commit**

```bash
git add src/components/home/ThisWeekForPlanet.tsx src/app/page.tsx
git commit -m "feat(home): This Week for the Planet section

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Hero photo and single impact block

**Files:**
- Modify: `src/app/page.tsx` (hero section; delete the static "Our Impact" section)

**Interfaces:**
- Consumes: nothing new. `ImpactDashboard` stays where it is.
- Produces: nothing other tasks use.

- [ ] **Step 1: Add the photo behind the hero**

Replace:

```tsx
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-eco text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
```

with:

```tsx
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-eco text-white overflow-hidden">
        {/* Volunteers at the Friendship Park cleanup, Oct 2026. Decorative — the
            headline carries the meaning — so alt is empty. */}
        <img
          src="/images/events/friendship-park-2026-3.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-eco opacity-70" />
        <div className="absolute inset-0 bg-black/30" />
```

- [ ] **Step 2: Delete the duplicated impact block**

Delete the whole block from `{/* Impact Section */}` through its closing `</section>` (the one containing `{ number: '4', label: 'Educational Games Built', … }` and `{ number: '8+', label: 'Community Cleanups', … }`), leaving `{/* Interactive Apps Section */}` directly after the Mission section's `</section>`.

- [ ] **Step 3: Check nothing else referenced it**

Run: `npx tsc --noEmit && npm run lint && grep -n "Our Impact" src/app/page.tsx`
Expected: no type/lint errors; grep prints nothing (the dashboard's "Our Impact So Far" heading lives in `ImpactDashboard.tsx`).

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): event photo in hero, drop duplicated impact block

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Build, browser check, deploy

**Files:** none changed unless a check fails.

- [ ] **Step 1: Full checks and static build**

Stop any `next dev` first (a build under a running dev server corrupts `.next`).

```bash
npm test && npm run lint && npx tsc --noEmit && rm -rf .next && npm run build
```

Expected: all pass; build lists `/` as static.

- [ ] **Step 2: Serve and inspect**

```bash
npx http-server out -p 8766 -s
```

Open http://localhost:8766/ and check:
- Hero shows the photo with white text readable over it.
- "This Week for the Planet" sits below Upcoming Events. On 2026-10-27 expect: left card "World Cities Day is Saturday, Oct 31 — so this week:" → Storm Drain Detective; right list World Cities Day (Oct 31), World Soil Day (Dec 5), International Day of Clean Energy (Jan 26).
- Only one impact block ("Our Impact So Far").
- Console: no hydration warnings or errors.
- Repeat at 390px width: columns stack, no horizontal scroll.
- Server HTML matches what the browser shows (the build-date path):
  `curl -s localhost:8766/ | grep -o "World Cities Day is[^<]*"` prints the same line as the card.

- [ ] **Step 3: Stop the server, push, verify live**

```bash
lsof -ti:8766 | xargs kill
git push origin main
```

After ~60 s: `curl -s https://www.ecoquestfoundation.org/ | grep -c "This Week for the Planet"` returns ≥ 1, and `grep -c "Our Impact</h2>"` returns 0.
