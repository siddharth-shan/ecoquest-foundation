# Winter Field Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Season 2 of the online series, the "EcoQuest Winter Field Lab": five
30-minute Zoom sessions running Nov 21, 2026 to Jan 23, 2027. Sign-up is a
Google Form that a Google Apps Script creates and runs, so nobody has to work
the form by hand.

**Architecture:**
- **Data:** `src/data/seminars.ts` stays the single source of truth, now with a
  `series` field, per-series helpers, and a sign-up link resolver. The Events
  page renders each series from it through one shared `SeminarCard` component.
  The homepage consumers switch to the resolver.
- **Sign-up form:** a plain-JS Apps Script under `scripts/signup-form/gas/`
  builds the form from a session list generated out of `seminars.ts`. It sends
  the welcome and reminder emails, and publishes the prefilled sign-up links as
  JSON. A small Node script copies those links back into `seminars.ts`.

**Tech Stack:**
- Site: Next.js 14 (static export), TypeScript, Tailwind 3.4, vitest 3.2.4,
  Node 24 (native TS type stripping).
- Sign-up form: Google Apps Script (V8), deployed with `@google/clasp` through
  `npx`.

**Spec:** `docs/superpowers/specs/2026-10-27-winter-field-lab-design.md`

## Global Constraints

- **Times:** Season 2 runs 11:00–11:30 AM PT, Saturdays Nov 21, Dec 5, Dec 19
  2026, and Jan 9, Jan 23 2027.
  - ISO offsets are `-08:00` (all of these dates are PST).
- **Cadence chip text, verbatim:** `Every other Saturday, 11:00–11:30 AM Pacific · holiday break Dec 26–Jan 2`
- **The Zoom join link must never appear in the repo, the site, page source, or
  a commit.** It lives only in the gitignored `scripts/signup-form/gas/config.js`.
- **No invented facts.**
  - Every outside claim must be in the Task 1 sources file. A date that can't
    be confirmed is replaced with "see the official page."
  - No recap is added for a session that was not held.
- **Copy rules:** US spelling. K-12-appropriate. No current-era years in body
  copy, except in the session dates themselves.
- **Scout troop:** never presented as a co-host. Not mentioned in Season 2 copy.
- **Recordings:** labeled "Recorded walkthrough" (existing default; don't change).
- **Season 1 stays as is:** keep its `eventbriteUrl` values, the "Register on
  Eventbrite" label in `UpcomingEvents`, and the "Reserve a spot" label in
  `getNextEvent`.
- **Season 2 labels:** "Sign up (Google Form)" on Events page cards, and
  "Sign up" in both homepage consumers.
- **"Past series" shows only sessions whose `endDateTime` has passed.**
- **Google account:** ecoquestfoundation@gmail.com.
- **Gates:** `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`
  all pass at every task's commit.
- **Branch and deploy:** work on branch `winter-field-lab`. Never push, merge, or
  deploy without the user's explicit approval. The user previews locally first.

## Review Focus

1. **Before Nov 7, both series are live.**
   - Expected: Winter Field Lab cards show on top, and Season 1's last session
     (Nov 7) still shows as upcoming in its own section.
   - It must never appear under "Past series" early.
   - Pinned by the `pastAt`/`upcomingIn` tests in Task 2.
2. **A session with no sign-up URL yet.**
   - Expected: the card falls back to `/events/register/?event=…`.
   - Schema.org points at `/events/`, never an empty string.
   - Pinned by the `seminarSignup` and `seminarPublicUrl` tests in Task 2.
3. **Session numbering across two series.**
   - Expected: "Session 1 of 5" for Nov 21, not "Session 6 of 10".
   - Pinned by the `sessionNumber` test in Task 2.
4. **Dates near month edges and outside Nov–Jan.**
   - Expected: the at-home challenge follows the Pacific month.
   - No challenge in Feb, or in Oct before Season 2 starts.
   - Pinned by the `winterChallengeFor` tests in Task 3.
5. **Reminder idempotency and day math across the DST change and the new year.**
   - Expected: a reminder goes exactly once, two Pacific calendar days before.
   - Pinned by the `dueForReminder` tests in Task 6.

---

### Task 1: Verify outside facts and write the sources file

No code. Its output is what every later copy string must agree with.

**Files:**
- Create: `docs/superpowers/specs/2026-10-27-winter-field-lab-sources.md`

**Interfaces:**
- Produces: confirmed URL and fact for each row below. If a fact differs from
  the copy drafted in Tasks 2 and 6, the controller rules on the change and
  amends those tasks' text before dispatching them.

- [ ] **Step 1: Open each official page and confirm** (use firecrawl scrape or WebFetch):

| Claim used in copy | Official page to check |
|---|---|
| Storm drains in LA County carry runoff to the ocean without treatment | LA County Public Works stormwater pages (e.g. https://dpw.lacounty.gov/ or https://pw.lacounty.gov/) |
| Health officials advise avoiding ocean contact after rain (and how long, if stated) | LA County Public Health beach advisories, or https://beachreportcard.org/ |
| Heal the Bay Beach Report Card exists and grades beaches | https://beachreportcard.org/ |
| USGS publishes stream-gauge data free | https://waterdata.usgs.gov/ |
| iNaturalist observations feed science; how to log an observation | https://www.inaturalist.org/ |
| World Soil Day is Dec 5 (FAO) | https://www.fao.org/world-soil-day/en/ |
| Christmas Bird Count window (expected Dec 14–Jan 5) and "longest-running" wording | https://www.audubon.org/conservation/science/christmas-bird-count |
| How to find a CBC circle near you (map URL) | same Audubon site |
| eBird accepts sightings any day | https://ebird.org/ |
| California King Tides Project, and whether January 2027 dates are posted | https://www.coastal.ca.gov/kingtides/ |
| NOAA tide predictions | https://tidesandcurrents.noaa.gov/ |
| Check Before You Burn season (expected Nov 1–end of Feb), how restrictions are decided, and alert sign-up | https://www.aqmd.gov/ (search "Check Before You Burn") |
| Cold-night inversions trap smoke near the ground | the same AQMD page, or EPA burn-wise pages |

- [ ] **Step 2: Write the sources file.**
  - One section per session, laid out like `docs/superpowers/specs/2026-10-27-this-week-v2-sources.md`.
  - For each claim, record the exact URL checked, a quoted sentence, and the
    date checked.
  - If a claim can't be confirmed, write `UNCONFIRMED — copy must say "see the official page"`.
- [ ] **Step 3: Commit.**

```bash
git add docs/superpowers/specs/2026-10-27-winter-field-lab-sources.md
git commit -m "docs: sources for Winter Field Lab outside facts"
```

---

### Task 2: Series-aware seminar data, Season 2 entries, consumers

**Files:**
- Modify: `src/data/seminars.ts`
- Modify: `src/components/shared/UpcomingEvents.tsx:49-62`
- Modify: `src/lib/nextEvent.ts:41-52`
- Create: `src/data/seminars.test.ts`

**Interfaces:**
- Produces, all exported from `@/data/seminars`:
  - `type SeriesId = 'fall-2026' | 'winter-2026'`
  - `interface SeminarSeries { id: SeriesId; name: string; cadence: string; pitch: string }`
  - `SERIES: Record<SeriesId, SeminarSeries>`
  - `Seminar` gains these fields:
    - `series: SeriesId`
    - `eventbriteUrl?: string`, which becomes optional
    - `signupUrl?: string`
    - `listing?: { name: string; url: string }`
    - `partner?: { name: string; url: string }`
    - `game?: { name: string; href: string }`
  - `hasEnded(s: Seminar, now?: number): boolean`
  - `seriesSessions(id: SeriesId): Seminar[]`
  - `sessionNumber(s: Seminar): number`
  - `upcomingIn(id: SeriesId, now?: number): Seminar[]`
  - `pastAt(now?: number): Seminar[]`
  - `seminarSignup(s: Seminar): { href: string; external: boolean; label: string; shortLabel: string }`
  - `seminarPublicUrl(s: Seminar, siteUrl: string): string`
  - `upcomingSeminars` and `pastSeminars` keep their names and meaning.
  - `SEMINAR_CADENCE` is **removed**. Task 4 replaces its one use.
- `seminars.ts` must keep **zero imports**. Task 7 imports it from plain Node.

- [ ] **Step 1: Write the failing tests** in `src/data/seminars.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  SERIES,
  pastAt,
  seminarPublicUrl,
  seminarSignup,
  seminars,
  seriesSessions,
  sessionNumber,
  upcomingIn,
  type Seminar,
} from './seminars'

const at = (iso: string) => Date.parse(iso)
const SITE = 'https://www.ecoquestfoundation.org'

function fake(over: Partial<Seminar>): Seminar {
  return {
    slug: 'x', title: 'A & B', shortTitle: 'x', series: 'winter-2026',
    startDateTime: '2026-11-21T11:00:00-08:00', endDateTime: '2026-11-21T11:30:00-08:00',
    displayDate: 'Saturday, November 21, 2026', displayTime: '11:00–11:30 AM PT',
    description: '', audience: '', builtOn: '', hasDeck: false, ...over,
  }
}

describe('series', () => {
  it('has five sessions in each series', () => {
    expect(seriesSessions('fall-2026')).toHaveLength(5)
    expect(seriesSessions('winter-2026')).toHaveLength(5)
  })

  it('numbers sessions within their own series', () => {
    const first = seriesSessions('winter-2026')[0]
    expect(first.slug).toBe('first-flush')
    expect(sessionNumber(first)).toBe(1)
    expect(sessionNumber(seriesSessions('fall-2026')[4])).toBe(5)
  })

  it('runs every Winter Field Lab session 11:00–11:30 Pacific', () => {
    for (const s of seriesSessions('winter-2026')) {
      expect(s.startDateTime).toMatch(/T11:00:00-08:00$/)
      expect(s.endDateTime).toMatch(/T11:30:00-08:00$/)
      expect(s.displayTime).toBe('11:00–11:30 AM PT')
    }
  })

  it('states the holiday break in the winter cadence', () => {
    expect(SERIES['winter-2026'].cadence).toBe(
      'Every other Saturday, 11:00–11:30 AM Pacific · holiday break Dec 26–Jan 2',
    )
  })

  it('keeps slugs unique across series', () => {
    expect(new Set(seminars.map((s) => s.slug)).size).toBe(seminars.length)
  })
})

describe('upcoming and past', () => {
  const beforeNov7End = at('2026-10-28T12:00:00-07:00')

  it('keeps Nov 7 upcoming, not past, before it ends', () => {
    expect(upcomingIn('fall-2026', beforeNov7End).map((s) => s.slug)).toEqual(['local-conservation'])
    expect(pastAt(beforeNov7End).map((s) => s.slug)).not.toContain('local-conservation')
    expect(upcomingIn('winter-2026', beforeNov7End)).toHaveLength(5)
  })

  it('moves a winter session to past once it ends, newest first', () => {
    const afterDec5 = at('2026-12-05T11:31:00-08:00')
    expect(pastAt(afterDec5).slice(0, 2).map((s) => s.slug)).toEqual(['winter-bioblitz', 'first-flush'])
    expect(upcomingIn('winter-2026', afterDec5)[0].slug).toBe('count-the-birds')
  })

  it('keeps a session upcoming during its own half hour', () => {
    const during = at('2026-11-21T11:15:00-08:00')
    expect(upcomingIn('winter-2026', during)[0].slug).toBe('first-flush')
  })
})

describe('seminarSignup', () => {
  it('uses Eventbrite for the fall series', () => {
    expect(seminarSignup(fake({ series: 'fall-2026', eventbriteUrl: 'https://eb/x' }))).toEqual({
      href: 'https://eb/x', external: true, label: 'Register on Eventbrite', shortLabel: 'Register on Eventbrite',
    })
  })

  it('uses the Google Form when one is set', () => {
    expect(seminarSignup(fake({ signupUrl: 'https://docs.google.com/forms/d/e/abc/viewform' }))).toEqual({
      href: 'https://docs.google.com/forms/d/e/abc/viewform', external: true,
      label: 'Sign up (Google Form)', shortLabel: 'Sign up',
    })
  })

  it('falls back to the on-site register page when empty', () => {
    expect(seminarSignup(fake({ signupUrl: '' }))).toEqual({
      href: '/events/register/?event=A%20%26%20B', external: false, label: 'Register Free', shortLabel: 'Register Free',
    })
  })
})

describe('seminarPublicUrl', () => {
  it('prefers an outside listing', () => {
    expect(seminarPublicUrl(fake({ signupUrl: 'https://f', listing: { name: 'Library', url: 'https://lib/e' } }), SITE)).toBe('https://lib/e')
  })
  it('then the sign-up form', () => {
    expect(seminarPublicUrl(fake({ signupUrl: 'https://f' }), SITE)).toBe('https://f')
  })
  it('never returns an empty string', () => {
    expect(seminarPublicUrl(fake({ signupUrl: '' }), SITE)).toBe(`${SITE}/events/`)
  })
})
```

- [ ] **Step 2: Run the tests and confirm they fail.** Run `npm test -- src/data/seminars.test.ts`.
  Expected: FAIL, because `SERIES` and `pastAt` are not exported and `first-flush` doesn't exist.

- [ ] **Step 3: Change `src/data/seminars.ts`.**

(a) Update the header comment's first line to: `// Single source of truth for EcoQuest's online series (Fall Seminar Series and Winter Field Lab).`

(b) Above `export interface Seminar`, add:

```ts
export type SeriesId = 'fall-2026' | 'winter-2026'

export interface SeminarSeries {
  id: SeriesId
  name: string
  /** Cadence chip on /events/. Keep in sync with the dates below. */
  cadence: string
  /** One line under the series heading on /events/. */
  pitch: string
}

export const SERIES: Record<SeriesId, SeminarSeries> = {
  'fall-2026': {
    id: 'fall-2026',
    name: 'Fall Online Seminar Series',
    cadence: 'Every other Saturday, 11:00–11:40 AM Pacific',
    pitch:
      'Free 40-minute sessions on Zoom, open to anyone. Each one is built on work EcoQuest has actually done — our apps, our cleanups, and our monthly challenges.',
  },
  'winter-2026': {
    id: 'winter-2026',
    name: 'EcoQuest Winter Field Lab',
    // Dec 19 to Jan 9 is three weeks, so plain "every other Saturday" would be untrue.
    cadence: 'Every other Saturday, 11:00–11:30 AM Pacific · holiday break Dec 26–Jan 2',
    pitch:
      'Free 30-minute sessions on Zoom, open to anyone. Each one is tied to a real winter community-science project you can join afterward.',
  },
}
```

(c) In `interface Seminar`:
- Add `series: SeriesId` with the doc comment `/** Which series this session belongs to. Numbering and headings are per series. */` directly after `slug`.
- Replace the `eventbriteUrl` field with these fields:

```ts
  /** Public Eventbrite listing. Fall series only. */
  eventbriteUrl?: string
  /**
   * Prefilled Google Form link for this session (Winter Field Lab). Written by
   * `node scripts/signup-form/sync-links.mjs` — do not hand-edit. Empty until the
   * form exists; the card then falls back to the on-site register page.
   */
  signupUrl?: string
  /**
   * An outside calendar (city, library) that lists this session. It is the
   * proof a stranger could have found it, so it becomes the schema.org url.
   */
  listing?: { name: string; url: string }
  /** The real outside project the session leads into, linked on the card. */
  partner?: { name: string; url: string }
  /** The EcoQuest game the session pairs with. */
  game?: { name: string; href: string }
```

(d) Delete the `SEMINAR_CADENCE` export and its comment.

(e) Add `series: 'fall-2026',` on the line after `slug: '…',` in each of the five existing entries.

(f) Append the five Season 2 entries to the end of the `seminars` array. Copy
must match the Task 1 sources file. Where the controller amended this text after
Task 1, use the amended text.

```ts
  // ── EcoQuest Winter Field Lab ─────────────────────────────────────────────
  // 30 minutes each. Every session ends on a real outside project the attendee
  // can join, named in `partner`. Facts are sourced in
  // docs/superpowers/specs/2026-10-27-winter-field-lab-sources.md.
  {
    slug: 'first-flush',
    series: 'winter-2026',
    title: 'First Rain, First Flush: Where Storm Water Goes',
    shortTitle: 'First Flush',
    startDateTime: '2026-11-21T11:00:00-08:00',
    endDateTime: '2026-11-21T11:30:00-08:00',
    displayDate: 'Saturday, November 21, 2026',
    displayTime: '11:00–11:30 AM PT',
    description:
      'The first big rains of the season wash litter, oil, and pet waste off streets and into storm drains, and here storm drains flow to the ocean without treatment. We read real stream-gauge data from the U.S. Geological Survey, learn why LA County health officials advise staying out of the ocean for three days after rain, and trace a storm drain from a street to the beach.',
    audience: 'Middle and high school students, families, and educators',
    builtOn: 'Storm Drain Detective, our game about where runoff goes',
    partner: { name: 'Heal the Bay Beach Report Card', url: 'https://beachreportcard.org/' },
    game: { name: 'Storm Drain Detective', href: '/games/storm-drain/' },
    signupUrl: '',
    hasDeck: true,
  },
  {
    slug: 'winter-bioblitz',
    series: 'winter-2026',
    title: 'Winter Bioblitz: Logging Life in the Cool Season',
    shortTitle: 'Winter Bioblitz',
    startDateTime: '2026-12-05T11:00:00-08:00',
    endDateTime: '2026-12-05T11:30:00-08:00',
    displayDate: 'Saturday, December 5, 2026',
    displayTime: '11:00–11:30 AM PT',
    description:
      'Winter is still a good time to find out what lives near you. On World Soil Day, we practice photographing living things and sharing them on iNaturalist, where observations can be used by scientists, and we look for life in the soil under your feet.',
    audience: 'Students of all ages, families, and educators',
    builtOn: 'Backyard Bioblitz and our California Biodiversity Challenge',
    partner: { name: 'iNaturalist', url: 'https://www.inaturalist.org/' },
    game: { name: 'Backyard Bioblitz', href: '/games/bioblitz/' },
    signupUrl: '',
    hasDeck: true,
  },
  {
    slug: 'count-the-birds',
    series: 'winter-2026',
    title: 'Count the Birds: The Christmas Bird Count and eBird',
    shortTitle: 'Count the Birds',
    startDateTime: '2026-12-19T11:00:00-08:00',
    endDateTime: '2026-12-19T11:30:00-08:00',
    displayDate: 'Saturday, December 19, 2026',
    displayTime: '11:00–11:30 AM PT',
    description:
      'Every winter, volunteers count birds for the National Audubon Society’s Christmas Bird Count, one of the world’s longest-running community science projects. We cover how to recognize common Southern California winter birds, how to join a count through Audubon’s official page, and how to report your own sightings on eBird.',
    audience: 'Students of all ages, families, and educators',
    builtOn: 'Backyard Bioblitz, our species-spotting game',
    partner: {
      name: 'Audubon Christmas Bird Count',
      url: 'https://www.audubon.org/community-science/christmas-bird-count/join-christmas-bird-count',
    },
    signupUrl: '',
    hasDeck: true,
  },
  {
    slug: 'king-tides',
    series: 'winter-2026',
    title: 'King Tides: A Glimpse of Future Sea Levels',
    shortTitle: 'King Tides',
    startDateTime: '2027-01-09T11:00:00-08:00',
    endDateTime: '2027-01-09T11:30:00-08:00',
    displayDate: 'Saturday, January 9, 2027',
    displayTime: '11:00–11:30 AM PT',
    description:
      'King tides are the highest tides of the year, and they show where water may reach more often as sea levels rise. We read NOAA tide predictions, learn how the California King Tides Project collects photos from the public, and find this winter’s king tide dates so you can plan to watch one from a safe spot.',
    audience: 'Middle and high school students, families, and educators',
    builtOn: 'Your Climate Record, our game on reading long-term climate data',
    partner: { name: 'California King Tides Project', url: 'https://www.coastal.ca.gov/kingtides/' },
    game: { name: 'Your Climate Record', href: '/games/climate-record/' },
    signupUrl: '',
    hasDeck: true,
  },
  {
    slug: 'smoke-fog-fireplaces',
    series: 'winter-2026',
    title: 'Smoke, Fog and Fireplaces: Winter Air Quality',
    shortTitle: 'Winter Air',
    startDateTime: '2027-01-23T11:00:00-08:00',
    endDateTime: '2027-01-23T11:30:00-08:00',
    displayDate: 'Saturday, January 23, 2027',
    displayTime: '11:00–11:30 AM PT',
    description:
      'Winter air can be worse than you might expect: when the weather is still and stagnant, smoke from wood fires builds up where people breathe. We read live air-quality data, learn how South Coast AQMD’s Check Before You Burn program decides when wood burning is restricted, and show how to sign up for its alerts.',
    audience: 'Middle and high school students, families, and educators',
    builtOn: 'Air Detective, our air-quality game',
    partner: {
      name: 'South Coast AQMD Check Before You Burn',
      url: 'https://www.aqmd.gov/home/programs/community/community-detail?title=check-before-you-burn',
    },
    game: { name: 'Air Detective', href: '/games/air-detective/' },
    signupUrl: '',
    hasDeck: true,
  },
```

Copy and URLs above were amended by the controller after Task 1 (see the sources file's findings); use them verbatim.

(g) Replace everything from the `hasEnded` doc comment through the `pastSeminars`
export with the code below. Keep `seminarTile`, `recordingUrl`, and `getSeminar`
unchanged; move them below this block if needed.

```ts
/**
 * Whether a session's scheduled end time has passed.
 *
 * The module-level lists below are evaluated when the site is built: this is a
 * static export, so a session only moves out of "Upcoming" on the next deploy.
 * The weekly rebuild and the HideAfter client guard keep that from going stale.
 * `now` is a parameter so tests can pin the clock.
 */
export function hasEnded(seminar: Seminar, now = Date.now()): boolean {
  return new Date(seminar.endDateTime).getTime() < now
}

/** Every session in one series, in date order. */
export function seriesSessions(id: SeriesId): Seminar[] {
  return seminars.filter((s) => s.series === id)
}

/**
 * Position within its own series, counted over every session rather than the
 * upcoming ones — so session 3 never gets relabeled "Session 1 of 5" once the
 * first two are held, and Winter starts again at 1.
 */
export function sessionNumber(seminar: Seminar): number {
  return seriesSessions(seminar.series).findIndex((s) => s.slug === seminar.slug) + 1
}

/** Sessions in one series still ahead of `now`. */
export function upcomingIn(id: SeriesId, now = Date.now()): Seminar[] {
  return seriesSessions(id).filter((s) => !hasEnded(s, now))
}

/** Sessions of every series whose end time has passed, most recent first. */
export function pastAt(now = Date.now()): Seminar[] {
  return seminars
    .filter((s) => hasEnded(s, now))
    .sort((a, b) => b.startDateTime.localeCompare(a.startDateTime))
}

/** Sessions still ahead of us, across both series. */
export const upcomingSeminars = seminars.filter((s) => !hasEnded(s))

/** Sessions whose date has passed, most recent first. */
export const pastSeminars = pastAt()

export interface SignupLink {
  href: string
  /** Opens in a new tab: the sign-up is held by Eventbrite or Google, not this site. */
  external: boolean
  /** Button text on the /events/ card. */
  label: string
  /** Button text on the homepage cards. */
  shortLabel: string
}

/**
 * Where a visitor signs up. Naming the platform in the label is the legitimacy
 * signal: registration is held by Eventbrite or Google, not a form on our site.
 */
export function seminarSignup(seminar: Seminar): SignupLink {
  if (seminar.eventbriteUrl) {
    return {
      href: seminar.eventbriteUrl,
      external: true,
      label: 'Register on Eventbrite',
      shortLabel: 'Register on Eventbrite',
    }
  }
  if (seminar.signupUrl) {
    return { href: seminar.signupUrl, external: true, label: 'Sign up (Google Form)', shortLabel: 'Sign up' }
  }
  return {
    href: `/events/register/?event=${encodeURIComponent(seminar.title)}`,
    external: false,
    label: 'Register Free',
    shortLabel: 'Register Free',
  }
}

/**
 * The URL schema.org and outside links point at. An outside listing comes first
 * because it is the proof the session was publicly distributed. Never the Zoom
 * room: a join link in page source invites uninvited guests.
 */
export function seminarPublicUrl(seminar: Seminar, siteUrl: string): string {
  return seminar.listing?.url || seminar.eventbriteUrl || seminar.signupUrl || `${siteUrl}/events/`
}
```

- [ ] **Step 4: Update the consumers.**

In `src/components/shared/UpcomingEvents.tsx`:
- Import `seminarSignup` from `@/data/seminars`.
- In the seminar mapping, replace the `href` and `ctaLabel` lines with:

```ts
      href: seminarSignup(s).href,
      ctaLabel: seminarSignup(s).shortLabel,
```

In `src/lib/nextEvent.ts`, in the seminar mapping, replace `href` and `ctaLabel` with:

```ts
        href: s.listing?.url || s.eventbriteUrl || s.signupUrl || '/events/',
        // Fall keeps its original wording; the Winter Field Lab says "Sign up".
        ctaLabel: s.series === 'fall-2026' ? 'Reserve a spot' : 'Sign up',
```

- [ ] **Step 5: Run the tests and confirm they pass.**
  - `npm test` should pass every test, the old ones and the new ones.
  - `npx tsc --noEmit` will report errors in `src/app/events/page.tsx` for
    `SEMINAR_CADENCE` and the `sessionNumber` signature. That is expected; Task 4
    fixes them.
  - To keep this commit's build green, make two minimal edits in that file now:
    - Replace `SEMINAR_CADENCE` with `SERIES['fall-2026'].cadence`, and fix the
      import.
    - Delete the local `sessionNumber` function, and replace its two calls
      `sessionNumber(seminar.slug)` with the imported `sessionNumber(seminar)`.
    - In the two places it appears, change `{seminars.length}` to
      `{seriesSessions(seminar.series).length}`.
  - Then run `npx tsc --noEmit && npm run lint && npm run build`. Expected: clean.
- [ ] **Step 6: Commit.**

```bash
git add src/data/seminars.ts src/data/seminars.test.ts src/components/shared/UpcomingEvents.tsx src/lib/nextEvent.ts src/app/events/page.tsx
git commit -m "feat(seminars): series-aware data model and Winter Field Lab sessions"
```

---

### Task 3: Monthly at-home challenge pairing

**Files:**
- Create: `src/lib/winterChallenge.ts`
- Create: `src/lib/winterChallenge.test.ts`

**Interfaces:**
- Consumes: `ecoMissions` from `@/data/ecochallenges`. The slugs are `water`,
  `zero-waste`, `energy`.
- Produces: `winterChallengeFor(now?: number): { month: string; mission: EcoMission; href: string } | null`.
  - `href` is `/ecochallenge/join/?challenge=<slug>`. The join page already
    reads `?challenge=`.

- [ ] **Step 1: Write the failing test.**

```ts
import { describe, expect, it } from 'vitest'
import { winterChallengeFor } from './winterChallenge'

const at = (iso: string) => Date.parse(iso)

describe('winterChallengeFor', () => {
  it('pairs November with water', () => {
    expect(winterChallengeFor(at('2026-11-21T12:00:00-08:00'))?.mission.slug).toBe('water')
  })
  it('pairs December with zero-waste and January with energy', () => {
    expect(winterChallengeFor(at('2026-12-05T12:00:00-08:00'))?.mission.slug).toBe('zero-waste')
    expect(winterChallengeFor(at('2027-01-23T12:00:00-08:00'))?.mission.slug).toBe('energy')
  })
  it('uses the Pacific month at a UTC month edge', () => {
    // 2026-12-01T05:00Z is still Nov 30 in Los Angeles.
    expect(winterChallengeFor(at('2026-12-01T05:00:00Z'))?.month).toBe('November')
  })
  it('links to the join page with the mission preselected', () => {
    expect(winterChallengeFor(at('2026-11-10T12:00:00-08:00'))?.href).toBe('/ecochallenge/join/?challenge=water')
  })
  it('shows nothing outside the season', () => {
    expect(winterChallengeFor(at('2026-10-28T12:00:00-07:00'))).toBeNull()
    expect(winterChallengeFor(at('2027-02-01T12:00:00-08:00'))).toBeNull()
    expect(winterChallengeFor(at('2027-11-15T12:00:00-08:00'))).toBeNull()
  })
})
```

- [ ] **Step 2: Run and confirm it fails.** Run `npm test -- src/lib/winterChallenge.test.ts`.
  Expected: FAIL, because the module is not found.

- [ ] **Step 3: Implement it.**

```ts
// The Winter Field Lab's at-home pairing: one existing EcoChallenge mission per
// month of the series. Keyed by Pacific year-month so the pairing switches on
// the calendar the sessions run on, and so it says nothing once the season is
// over instead of repeating next November.

import { ecoMissions, type EcoMission } from '@/data/ecochallenges'

const PAIRINGS: Record<string, { month: string; slug: string }> = {
  '2026-11': { month: 'November', slug: 'water' },
  '2026-12': { month: 'December', slug: 'zero-waste' },
  '2027-01': { month: 'January', slug: 'energy' },
}

export function winterChallengeFor(
  now = Date.now(),
): { month: string; mission: EcoMission; href: string } | null {
  const ym = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
  }).format(now)
  const pairing = PAIRINGS[ym]
  if (!pairing) return null
  const mission = ecoMissions.find((m) => m.slug === pairing.slug)
  if (!mission) return null
  return { month: pairing.month, mission, href: `/ecochallenge/join/?challenge=${mission.slug}` }
}
```

Check that `en-CA` with year and month formats as `2026-11`. If the test for the
Pacific month fails because of the format, build `ym` from `formatToParts`.

- [ ] **Step 4: Run it and confirm it passes.** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Commit.**

```bash
git add src/lib/winterChallenge.ts src/lib/winterChallenge.test.ts
git commit -m "feat(seminars): monthly at-home challenge for the Winter Field Lab"
```

---

### Task 4: Events page — shared card, Winter Field Lab, Fall, Past series

**Files:**
- Create: `src/components/shared/SeminarCard.tsx`
- Modify: `src/app/events/page.tsx` (seminar JSON-LD at lines 64–110, the seminar section at lines 480–627, the past section at lines 629–721, and metadata at lines 26–36)

**Interfaces:**
- Consumes from Task 2: `SERIES`, `upcomingIn`, `sessionNumber`,
  `seriesSessions`, `seminarSignup`, `seminarPublicUrl`, `upcomingSeminars`,
  `pastSeminars`.
- Consumes from Task 3: `winterChallengeFor`.
- Produces: the default export
  `SeminarCard({ seminar }: { seminar: Seminar })`, a server component that
  renders inside `HideAfter`.

- [ ] **Step 1: Create `SeminarCard.tsx`.** Do it in this order:
  1. Move the upcoming-session `<HideAfter …><article className="card border-l-4 border-primary-green">…</article></HideAfter>` JSX out of `src/app/events/page.tsx` verbatim, along with the icons and imports it uses.
  2. Apply the changes listed below.
  3. Keep the existing explanatory comments (the date tile, phones).
  4. Replace the Eventbrite naming comment with one about `seminarSignup`.

  Changes:
  - The badge reads `Session {sessionNumber(seminar)} of {seriesSessions(seminar.series).length}`.
  - The time row adds `30 minutes` / `40 minutes`: derive the length from
    `(Date.parse(endDateTime) - Date.parse(startDateTime)) / 60000` and render
    `· {n} min` after the display time.
  - Under the description, when `seminar.partner || seminar.game`, render this row:

```tsx
                        {(seminar.partner || seminar.game) && (
                          <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
                            {seminar.partner && (
                              <a
                                href={seminar.partner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-primary-green/30 bg-primary-green/5 px-3 py-1 font-semibold text-primary-green-dark hover:underline"
                              >
                                Take part: {seminar.partner.name}
                                <HiExternalLink className="opacity-70" aria-hidden />
                              </a>
                            )}
                            {seminar.game && (
                              <Link
                                href={seminar.game.href}
                                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 font-semibold text-primary-blue-dark hover:underline"
                              >
                                Try: {seminar.game.name}
                              </Link>
                            )}
                          </div>
                        )}
```

  - Replace the CTA conditional with:

```tsx
                        {(() => {
                          const signup = seminarSignup(seminar)
                          return signup.external ? (
                            <a
                              href={signup.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                              {signup.label}
                              <HiExternalLink className="text-base opacity-80" aria-hidden />
                            </a>
                          ) : (
                            <Link href={signup.href} className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap">
                              {signup.label}
                            </Link>
                          )
                        })()}
```

  - Keep "Preview Slides" as is.
  - When `seminar.listing` exists, add it after Preview Slides:
    `<a href={seminar.listing.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-blue-dark hover:underline">Also listed on {seminar.listing.name}</a>`.

- [ ] **Step 2: Replace the seminar section in `page.tsx` with three blocks, in this order:**
  1. **Winter Field Lab**, rendered only when `upcomingIn('winter-2026').length > 0`.
     - Wrapper: `<section id="winter-field-lab" className="section-padding">`.
     - Header: `section-header` with the `SERIES['winter-2026'].name` title,
       the `section-underline`, the pitch paragraph, and the cadence chip
       styled like the existing one (`🗓️ {SERIES['winter-2026'].cadence}`).
     - At-home challenge line: when `winterChallengeFor()` is not null, render
       a centered line below the chip:

```tsx
              {challenge && (
                <p className="mt-3 text-sm text-gray-700">
                  {challenge.month}&apos;s at-home challenge:{' '}
                  <Link href={challenge.href} className="font-semibold text-primary-green-dark hover:underline">
                    {challenge.mission.title}
                  </Link>
                </p>
              )}
```

       Compute `const challenge = winterChallengeFor()` at the top of the page
       component.
     - Cards: `<div className="space-y-6 max-w-5xl mx-auto">{upcomingIn('winter-2026').map((s) => <SeminarCard key={s.slug} seminar={s} />)}</div>`.
  2. **Fall series**, rendered only when `upcomingIn('fall-2026').length > 0`.
     - Wrapper: `<section id="seminars" className="section-padding pt-0">`.
       Keep `id="seminars"`, because the homepage links to `/events/#seminars`.
     - Header: the `SERIES['fall-2026']` name, pitch, and cadence.
     - Cards: `SeminarCard` per session.
  3. **When neither series has upcoming sessions,** render the existing "Dates
     for the next series are being finalized" paragraph inside
     `<section id="seminars">`. This keeps the anchor alive after Jan 23.

  - **Anchor rule:** when the Fall series has no upcoming sessions, put
    `id="seminars"` on the Winter section instead (`id={fallUpcoming.length ? 'winter-field-lab' : 'seminars'}`).
    That way `/events/#seminars` always lands on the live series.
  - Keep the "Every session has a permanent slide-deck page…" note once, after
    the last series block. Change its wording to: `Every session has a permanent
    slide-deck page on this site, so you can read through one you missed or
    revisit it afterward. Sign-up is free and there is no minimum age; under-13s
    sign up with a parent's or guardian's email.`

- [ ] **Step 3: Past series.** In the past section:
  - Rename the heading to `Past Sessions` → `Past Series`.
  - Group the cards by series, newest series first, each under an `h3` with the
    series name:

```tsx
            {(['winter-2026', 'fall-2026'] as const).map((id) => {
              const held = pastSeminars.filter((s) => s.series === id)
              if (held.length === 0) return null
              return (
                <div key={id} className="mb-10">
                  <h3 className="text-xl font-bold text-gray-800 font-heading mb-4">{SERIES[id].name}</h3>
                  <div className="space-y-6">{held.map((seminar) => /* existing past card JSX */)}</div>
                </div>
              )
            })}
```

  - Inside the existing past card, change the badge to `Session {sessionNumber(seminar)} of {seriesSessions(seminar.series).length}`.
  - Change the card's `h3` to `h4`, keeping its classes.

- [ ] **Step 4: JSON-LD.** In `SeminarSeriesJsonLd`:
  - Set `location.url` and `offers.url` to `seminarPublicUrl(seminar, SITE_URL)`.
  - Set `offers.validFrom` per series: `seminar.series === 'fall-2026' ? '2026-08-29T00:00:00-07:00' : '2026-10-28T00:00:00-07:00'`.
  - Add `superEvent: { '@type': 'EventSeries', name: SERIES[seminar.series].name }`.

- [ ] **Step 5: Metadata.**
  - Set `description` to `'EcoQuest Foundation runs free online environmental series — the Winter Field Lab, every other Saturday from November through January — plus hands-on beach and park cleanups across California. See upcoming dates and sign up.'`
  - Set `openGraph.description` to `'Free online environmental sessions and hands-on community conservation events in California.'`
  - Check the `h1` subtitle on line ~254. If it says "biweekly online seminar
    series", change it to `Free online series every other Saturday, plus
    hands-on beach and park cleanups across California`.

- [ ] **Step 6: Verify.** Run `npx tsc --noEmit && npm run lint && npm test && npm run build`. Then:

```bash
grep -c 'winter-field-lab' out/events/index.html   # ≥1
grep -o 'Session [0-9] of [0-9]*' out/events/index.html | sort | uniq -c   # Winter shows "of 5", never "of 10"
grep -c 'zoom.us' out/events/index.html             # 0
```

- [ ] **Step 7: Commit.**

```bash
git add src/components/shared/SeminarCard.tsx src/app/events/page.tsx
git commit -m "feat(events): Winter Field Lab section, shared seminar card, past series"
```

---

### Task 5: Five slide decks and sitemap entries

**Files:**
- Modify: `src/data/decks.ts` (append five keys)
- Modify: `src/app/sitemap.ts:31-33`

**Interfaces:**
- Consumes: the slugs from Task 2, the facts in the Task 1 sources file, and the `Slide` interface already in `decks.ts`.

- [ ] **Step 1: Write the decks.** Add five decks to `decks`, keyed
  `first-flush`, `winter-bioblitz`, `count-the-birds`, `king-tides`, and
  `smoke-fog-fireplaces`. Follow the structure and voice of the existing
  `'wildfire-data'` deck.

  **Size:** 7–9 slides per deck, because sessions are 30 minutes.

  **Fixed shape:**
  1. Title slide.
     - `eyebrow: 'EcoQuest Winter Field Lab'`.
     - The callout promises one concrete skill "in 30 minutes".
  2. Why this matters (the hook).
  3. 2–3 slides of hands-on work with the named public data source or tool.
     - The bullets name real pages.
     - Speaker notes say "open this in a tab before the session".
  4. One slide pairing the session with the EcoQuest game, if `game` is set.
  5. "Do this after": the partner project's official first step.
     - Bullets are concrete actions.
     - Include the official URL as text.
  6. Closing slide: Q&A, plus "This month's at-home challenge" naming the
     paired mission (Nov water, Dec zero-waste, Jan energy).

  **Rules:**
  - Every factual claim must appear in the Task 1 sources file. Where a figure
    would help, the speaker note says "look this up before the session".
  - Don't put numbers in the slides.
  - King Tides: Task 1 confirmed this winter's statewide king tide dates on
    the official page (Dec 23–25, 2026 and Jan 21–22, 2027). Name those dates
    and link the page; no session date is a tide day. Say no LA-area events are
    listed unless the sources file says otherwise.
  - First flush: don't claim bacteria spike in the first storm (LA County says
    bacteria don't follow first-flush patterns). The three-day ocean advisory
    after rain is confirmed.
  - Count the Birds: no circle map is available (Audubon's finder is a
    placeholder); link the join page. Don't say eBird takes sightings "any day".
    Use "one of the world's longest-running community science projects".
  - Winter air: AQMD's own wording is about emissions and stagnant weather; the
    word "inversion" may appear only in speaker notes as "look this up before
    the session". The season (Nov 1 to end of Feb) and alert sign-up are confirmed.
  - iNaturalist logging steps are not on an official page: slides say "follow
    iNaturalist's own getting-started guide" and link https://www.inaturalist.org/.
  - Safety notes go into the slide bullets, not only the notes:
    - King tides: stay off wet rocks and seawalls, and watch the water from a
      safe spot.
    - First flush: don't touch runoff, and don't go into the ocean after rain.
  - `notes` are presenter prep. Never put a Zoom link, an email address, or a
    phone number in them.
  - US spelling; K-12 tone.
- [ ] **Step 2: Sitemap.**
  - After the `home-footprint` line, add the two Fall decks the sitemap is
    missing (`climate-anxiety`, `local-conservation`), if their decks exist.
  - Add the five Winter decks, each `{ path: '/seminars/<slug>/', changeFrequency: 'monthly', priority: 0.6 }`.
- [ ] **Step 3: Verify.**
  - Run `npm run build`. Then `ls out/seminars/` should list all 10 slugs.
  - Run `grep -L "notes" out/seminars/first-flush/index.html`, and confirm by
    reading the page source that no speaker-note text appears. Spot-check one
    distinctive note sentence with `grep -c`; it should return 0.
- [ ] **Step 4: Commit.**

```bash
git add src/data/decks.ts src/app/sitemap.ts
git commit -m "feat(seminars): Winter Field Lab slide decks"
```

---

### Task 6: The sign-up form script (Apps Script, built and tested locally)

**Files:**
- Create: `scripts/signup-form/gas/appsscript.json`
- Create: `scripts/signup-form/gas/lib.js`. This holds the pure functions, with
  no Apps Script globals.
- Create: `scripts/signup-form/gas/Code.js`. This is the Apps Script entry
  points.
- Create: `scripts/signup-form/gas/config.example.js`
- Create: `scripts/signup-form/build-sessions.mjs`. It writes the gitignored
  `gas/sessions.js` from `seminars.ts`.
- Create: `scripts/signup-form/sync-links.mjs`. It fetches the web app JSON and
  writes the `signupUrl` values into `seminars.ts`.
- Create: `scripts/signup-form/lib.test.mjs`
- Create: `scripts/signup-form/sync-links.test.mjs`
- Modify: `.gitignore`
- Modify: `package.json`, adding scripts.

**Interfaces:**
- Consumes: `seminars` and `SERIES` from `src/data/seminars.ts`, imported
  directly by Node 24 with type stripping.
- Produces:
  - `npm run signup:build` writes `gas/sessions.js`.
  - `npm run signup:push` runs build, then `npx @google/clasp push`.
  - `npm run signup:sync` fetches the links and rewrites `signupUrl` fields.
  - The web app JSON shape is `{ formUrl: string, sessions: Record<slug, string> }`.

- [ ] **Step 1: `.gitignore`.** Append:

```
# Apps Script sign-up form: private config (Zoom link) and generated/linked files
/scripts/signup-form/gas/config.js
/scripts/signup-form/gas/sessions.js
/scripts/signup-form/.clasp.json
/scripts/signup-form/.webapp-url
```

- [ ] **Step 2: Write the failing tests** in `scripts/signup-form/lib.test.mjs`.
  `lib.js` is plain Apps Script JS with top-level functions, so the test loads
  it into a VM context rather than importing it.

```js
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { describe, expect, it } from 'vitest'

const ctx = vm.createContext({})
vm.runInContext(readFileSync(new URL('./gas/lib.js', import.meta.url), 'utf8'), ctx)
const { choiceLabel, dueForReminder, recipientsFor, reminderEmail, welcomeEmail } = ctx

const S = [
  { slug: 'first-flush', title: 'First Rain', displayDate: 'Saturday, November 21, 2026', displayTime: '11:00–11:30 AM PT', startDateTime: '2026-11-21T11:00:00-08:00' },
  { slug: 'king-tides', title: 'King Tides', displayDate: 'Saturday, January 9, 2027', displayTime: '11:00–11:30 AM PT', startDateTime: '2027-01-09T11:00:00-08:00' },
]

describe('choiceLabel', () => {
  it('leads with the date so the form reads in order', () => {
    expect(choiceLabel(S[0])).toBe('Sat, Nov 21 · First Rain')
  })
})

describe('dueForReminder', () => {
  it('is due two Pacific days before, at the 9 AM run', () => {
    expect(dueForReminder(S, Date.parse('2026-11-19T09:05:00-08:00'), 2).map((s) => s.slug)).toEqual(['first-flush'])
  })
  it('is not due one or three days before', () => {
    expect(dueForReminder(S, Date.parse('2026-11-20T09:05:00-08:00'), 2)).toEqual([])
    expect(dueForReminder(S, Date.parse('2026-11-18T09:05:00-08:00'), 2)).toEqual([])
  })
  it('counts days on the Pacific calendar across the new year', () => {
    expect(dueForReminder(S, Date.parse('2027-01-07T09:05:00-08:00'), 2).map((s) => s.slug)).toEqual(['king-tides'])
  })
  it('uses the Pacific date late in the evening (UTC has already rolled over)', () => {
    expect(dueForReminder(S, Date.parse('2026-11-19T23:30:00-08:00'), 2).map((s) => s.slug)).toEqual(['first-flush'])
  })
})

describe('recipientsFor', () => {
  const rows = [
    { email: 'A@x.org ', sessions: ['Sat, Nov 21 · First Rain'] },
    { email: 'a@x.org', sessions: ['Sat, Nov 21 · First Rain', 'Sat, Jan 9 · King Tides'] },
    { email: 'b@x.org', sessions: ['Sat, Jan 9 · King Tides'] },
    { email: 'not-an-email', sessions: ['Sat, Nov 21 · First Rain'] },
  ]
  it('returns unique, trimmed, lowercased valid emails for one session', () => {
    expect(recipientsFor(rows, 'Sat, Nov 21 · First Rain')).toEqual(['a@x.org'])
  })
})

describe('emails', () => {
  it('puts the join link in the reminder and the welcome', () => {
    const r = reminderEmail(S[0], 'https://zoom.example/j/1')
    expect(r.subject).toBe('Reminder: First Rain — Saturday, November 21, 2026, 11:00–11:30 AM PT')
    expect(r.body).toContain('https://zoom.example/j/1')
    const w = welcomeEmail([S[0], S[1]], 'https://zoom.example/j/1')
    expect(w.body).toContain('First Rain')
    expect(w.body).toContain('King Tides')
    expect(w.body).toContain('https://zoom.example/j/1')
  })
})
```

- [ ] **Step 3: Run the tests and confirm they fail.** Run `npm test -- scripts/signup-form/lib.test.mjs`.
  Expected: FAIL with ENOENT, because `lib.js` doesn't exist yet.

- [ ] **Step 4: Write `gas/lib.js`.**

```js
// Pure helpers for the Winter Field Lab sign-up form. No Apps Script globals
// here, so the same file runs in Apps Script and in the vitest suite.

var PACIFIC = 'America/Los_Angeles'

/** 'YYYY-MM-DD' on the Pacific calendar. */
function pacificDay(ms) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PACIFIC }).format(ms)
}

/** Whole days between two 'YYYY-MM-DD' strings. Noon UTC sidesteps DST. */
function daysBetween(a, b) {
  return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 86400000)
}

/** The checkbox text for a session. Responses store this text, so it is the join key. */
function choiceLabel(s) {
  var d = new Date(s.startDateTime)
  var day = new Intl.DateTimeFormat('en-US', { timeZone: PACIFIC, weekday: 'short', month: 'short', day: 'numeric' }).format(d)
  return day + ' · ' + s.title
}

/** Sessions whose Pacific start date is exactly `days` Pacific days after `nowMs`. */
function dueForReminder(sessions, nowMs, days) {
  var today = pacificDay(nowMs)
  return sessions.filter(function (s) {
    return daysBetween(today, pacificDay(Date.parse(s.startDateTime))) === days
  })
}

/** Unique valid emails of everyone who picked `label`. */
function recipientsFor(rows, label) {
  var seen = {}
  var out = []
  rows.forEach(function (r) {
    var email = String(r.email || '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    if (r.sessions.indexOf(label) === -1 || seen[email]) return
    seen[email] = true
    out.push(email)
  })
  return out
}

function sessionLine(s) {
  return '• ' + s.title + ' — ' + s.displayDate + ', ' + s.displayTime
}

var FOOTER =
  '\n\nThe session opens in a Zoom waiting room; we let people in at 11:00. ' +
  'Please do not share this link publicly.\n\n— EcoQuest Foundation\nhttps://www.ecoquestfoundation.org/events/'

function welcomeEmail(sessions, joinUrl) {
  return {
    subject: "You're signed up — EcoQuest Winter Field Lab",
    body:
      'Thanks for signing up! You picked:\n\n' + sessions.map(sessionLine).join('\n') +
      '\n\nJoin on Zoom (same link for every session):\n' + joinUrl +
      "\n\nWe'll email a reminder two days before each one." + FOOTER,
  }
}

function reminderEmail(s, joinUrl) {
  return {
    subject: 'Reminder: ' + s.title + ' — ' + s.displayDate + ', ' + s.displayTime,
    body: 'See you soon!\n\n' + sessionLine(s) + '\n\nJoin on Zoom:\n' + joinUrl + FOOTER,
  }
}
```

- [ ] **Step 5: Run the tests and confirm they pass.** Run `npm test -- scripts/signup-form/lib.test.mjs`. Expected: PASS.

- [ ] **Step 6: Write `gas/appsscript.json`.**

```json
{
  "timeZone": "America/Los_Angeles",
  "runtimeVersion": "V8",
  "exceptionLogging": "STACKDRIVER",
  "oauthScopes": [
    "https://www.googleapis.com/auth/forms",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/script.scriptapp"
  ],
  "webapp": { "executeAs": "USER_DEPLOYING", "access": "ANYONE_ANONYMOUS" }
}
```

- [ ] **Step 7: Write `gas/config.example.js`.**

```js
// Copy to config.js (gitignored) and fill in. config.js is pushed only to the
// private Apps Script project — it must never be committed: the repo is public.
var CONFIG = {
  zoomJoinUrl: 'https://us06web.zoom.us/j/REPLACE_ME?pwd=REPLACE_ME',
  replyTo: 'ecoquestfoundation@gmail.com',
}
```

- [ ] **Step 8: Write `gas/Code.js`.**

```js
// EcoQuest Winter Field Lab sign-up form. Runs in the ecoquestfoundation@gmail.com
// Apps Script project. Globals from other files: SESSIONS (sessions.js, generated),
// CONFIG (config.js, private), helpers (lib.js).
//
// setup() is safe to re-run: it reuses the stored form, re-syncs the session
// choices and confirmation message, and installs each trigger only once.

var FORM_TITLE = 'EcoQuest Winter Field Lab — Sign up'
var Q_SESSIONS = 'Which sessions would you like to join?'
var Q_NAME = 'Your name'
var Q_EMAIL = "Email (a parent's or guardian's if you're under 13)"
var Q_GRADE = 'Grade'
var Q_CONSENT = 'Permission'

function props() {
  return PropertiesService.getScriptProperties()
}

function getForm() {
  var id = props().getProperty('formId')
  return id ? FormApp.openById(id) : null
}

function itemByTitle(form, title) {
  var items = form.getItems()
  for (var i = 0; i < items.length; i++) if (items[i].getTitle() === title) return items[i]
  return null
}

function setup() {
  var form = getForm()
  if (!form) {
    form = FormApp.create(FORM_TITLE)
    var ss = SpreadsheetApp.create('EcoQuest Winter Field Lab — Sign-ups')
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())
    form.addCheckboxItem().setTitle(Q_SESSIONS).setRequired(true)
    form.addTextItem().setTitle(Q_NAME).setRequired(true)
    form.addTextItem()
      .setTitle(Q_EMAIL)
      .setRequired(true)
      .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    form.addListItem().setTitle(Q_GRADE).setRequired(true)
      .setChoiceValues(['K–5', '6–8', '9–12', 'College', 'Parent, educator, or other adult'])
    form.addCheckboxItem().setTitle(Q_CONSENT).setRequired(true)
      .setChoiceValues(["I'm 13 or older, or my parent or guardian says I can join and the email above is theirs."])
    props().setProperty('formId', form.getId())
  }

  form.setDescription(
    'Free 30-minute online sessions on Zoom, every other Saturday at 11:00 AM Pacific. ' +
    "We'll email you the Zoom link right away and a reminder two days before each session. " +
    'Run by EcoQuest Foundation, a 501(c)(3) nonprofit.')
  form.setPublishingSummary(false)
  form.setAllowResponseEdits(false)
  form.setCollectEmail(false)
  form.setConfirmationMessage(
    "You're signed up! Join on Zoom (same link for every session): " + CONFIG.zoomJoinUrl +
    ' — we have also emailed it to you. Please do not share it publicly.')

  var upcoming = SESSIONS.filter(function (s) { return Date.parse(s.endDateTime) > Date.now() })
  var sessionsItem = itemByTitle(form, Q_SESSIONS).asCheckboxItem()
  sessionsItem.setChoiceValues(upcoming.map(choiceLabel))
  form.setAcceptingResponses(upcoming.length > 0)

  var links = {}
  upcoming.forEach(function (s) {
    links[s.slug] = form.createResponse()
      .withItemResponse(sessionsItem.createResponse([choiceLabel(s)]))
      .toPrefilledUrl()
  })
  props().setProperty('links', JSON.stringify({ formUrl: form.getPublishedUrl(), sessions: links }))

  ensureTrigger('onSignup', function () {
    ScriptApp.newTrigger('onSignup').forForm(form).onFormSubmit().create()
  })
  ensureTrigger('sendReminders', function () {
    ScriptApp.newTrigger('sendReminders').timeBased().everyDays(1).atHour(9).inTimezone(PACIFIC).create()
  })
  Logger.log(props().getProperty('links'))
}

function ensureTrigger(fn, create) {
  var exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === fn })
  if (!exists) create()
}

/** Reads one response into { email, sessions } using the question titles. */
function rowOf(response) {
  var row = { email: '', sessions: [] }
  response.getItemResponses().forEach(function (ir) {
    var t = ir.getItem().getTitle()
    if (t === Q_EMAIL) row.email = ir.getResponse()
    if (t === Q_SESSIONS) row.sessions = ir.getResponse()
  })
  return row
}

function onSignup(e) {
  var row = rowOf(e.response)
  var picked = SESSIONS.filter(function (s) { return row.sessions.indexOf(choiceLabel(s)) !== -1 })
  var to = recipientsFor([row], row.sessions[0] || '')
  if (!to.length || !picked.length) return
  var mail = welcomeEmail(picked, CONFIG.zoomJoinUrl)
  MailApp.sendEmail({ to: to[0], replyTo: CONFIG.replyTo, name: 'EcoQuest Foundation', subject: mail.subject, body: mail.body })
}

function sendReminders() {
  var form = getForm()
  if (!form) return
  var rows = form.getResponses().map(rowOf)
  dueForReminder(SESSIONS, Date.now(), 2).forEach(function (s) {
    var key = 'reminded:' + s.slug
    if (props().getProperty(key)) return
    var bcc = recipientsFor(rows, choiceLabel(s))
    if (bcc.length === 0) { props().setProperty(key, 'none'); return }
    if (bcc.length + 1 > MailApp.getRemainingDailyQuota()) {
      console.warn('Daily email quota too low for ' + s.slug + ' (' + bcc.length + ' recipients); will retry tomorrow.')
      return
    }
    var mail = reminderEmail(s, CONFIG.zoomJoinUrl)
    MailApp.sendEmail({ to: CONFIG.replyTo, bcc: bcc.join(','), replyTo: CONFIG.replyTo, name: 'EcoQuest Foundation', subject: mail.subject, body: mail.body })
    props().setProperty(key, new Date().toISOString())
  })
}

/** Public JSON of the form links (they are public anyway). Never includes the Zoom link. */
function doGet() {
  return ContentService.createTextOutput(props().getProperty('links') || '{}')
    .setMimeType(ContentService.MimeType.JSON)
}
```

  A reminder is skipped at the two-day mark when the quota is too low. If the
  quota recovers by the next day's run, the reminder goes one day before
  instead, because `dueForReminder` with `days = 2` won't match again.
  Accept that, and record it in the runbook (Task 7).

- [ ] **Step 9: Write `build-sessions.mjs`.**

```js
// Writes gas/sessions.js from src/data/seminars.ts, so the form's session list
// has one source of truth. Node 24 strips the TypeScript types on import.
import { writeFileSync } from 'node:fs'
import { seminars } from '../../src/data/seminars.ts'

const sessions = seminars
  .filter((s) => s.series === 'winter-2026')
  .map(({ slug, title, displayDate, displayTime, startDateTime, endDateTime }) => ({
    slug, title, displayDate, displayTime, startDateTime, endDateTime,
  }))

writeFileSync(
  new URL('./gas/sessions.js', import.meta.url),
  `// Generated by build-sessions.mjs from src/data/seminars.ts. Do not edit.\nvar SESSIONS = ${JSON.stringify(sessions, null, 2)}\n`,
)
console.log(`Wrote ${sessions.length} sessions.`)
```

  Run `node scripts/signup-form/build-sessions.mjs`. Expected: `Wrote 5 sessions.`
  If Node refuses the `.ts` import, run with `node --experimental-strip-types`
  and use that in the npm script.

- [ ] **Step 10: Write `sync-links.mjs`, test first.**

  Test, in `scripts/signup-form/sync-links.test.mjs`:

```js
import { describe, expect, it } from 'vitest'
import { applyLinks } from './sync-links.mjs'

const src = `  {\n    slug: 'first-flush',\n    series: 'winter-2026',\n    signupUrl: '',\n  },\n  {\n    slug: 'king-tides',\n    signupUrl: 'https://old',\n  },\n`

describe('applyLinks', () => {
  it('fills each slug’s signupUrl and leaves others alone', () => {
    const out = applyLinks(src, { 'first-flush': 'https://docs.google.com/forms/d/e/X/viewform?entry.1=a' })
    expect(out).toContain("signupUrl: 'https://docs.google.com/forms/d/e/X/viewform?entry.1=a',")
    expect(out).toContain("signupUrl: 'https://old',")
  })
  it('rejects anything that is not a Google Forms URL', () => {
    expect(() => applyLinks(src, { 'first-flush': 'https://evil.example/' })).toThrow(/Google Forms/)
  })
  it('escapes quotes so the file stays valid', () => {
    expect(applyLinks(src, { 'first-flush': "https://docs.google.com/forms/d/e/X/viewform?entry.1=it's" }))
      .toContain("viewform?entry.1=it\\'s'")
  })
})
```

  Implementation:

```js
// Copies the prefilled sign-up links from the Apps Script web app into
// src/data/seminars.ts. Usage: npm run signup:sync
// The web app URL is read from scripts/signup-form/.webapp-url (gitignored).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const FORMS = /^https:\/\/docs\.google\.com\/forms\//

export function applyLinks(source, links) {
  let out = source
  for (const [slug, url] of Object.entries(links)) {
    if (!FORMS.test(url)) throw new Error(`Not a Google Forms URL for ${slug}: ${url}`)
    const safe = url.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const re = new RegExp(`(slug: '${slug}',[\\s\\S]*?signupUrl: )'[^']*(?:\\\\.[^']*)*'`)
    if (!re.test(out)) throw new Error(`No signupUrl field found for ${slug}`)
    out = out.replace(re, `$1'${safe}'`)
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const webapp = readFileSync(new URL('./.webapp-url', import.meta.url), 'utf8').trim()
  const res = await fetch(webapp, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Web app answered ${res.status}`)
  const { sessions } = await res.json()
  const file = new URL('../../src/data/seminars.ts', import.meta.url)
  writeFileSync(file, applyLinks(readFileSync(file, 'utf8'), sessions))
  console.log(`Updated ${Object.keys(sessions).length} sign-up links.`)
}
```

  Note on the regex: it must stop at the first `signupUrl` after the slug.
  The lazy `[\s\S]*?` does that. The test proves it doesn't reach into the next
  entry.

  Run `npm test`. Expected: all tests pass.

- [ ] **Step 11: Add the npm scripts** to `package.json` under `"scripts"`:

```json
    "signup:build": "node scripts/signup-form/build-sessions.mjs",
    "signup:push": "npm run signup:build && cd scripts/signup-form && npx --yes @google/clasp push --force",
    "signup:sync": "node scripts/signup-form/sync-links.mjs"
```

  `.clasp.json` lives in `scripts/signup-form/` with `"rootDir": "gas"`. Task 8
  creates it with `clasp create`.

- [ ] **Step 12: Verify that no Zoom link can be committed.** Run:
  - `git status --porcelain scripts/signup-form` should list no `config.js` and
    no `sessions.js`.
  - `git check-ignore scripts/signup-form/gas/config.js` should print the path.
- [ ] **Step 13: Commit.**

```bash
git add .gitignore package.json scripts/signup-form/gas/appsscript.json scripts/signup-form/gas/lib.js scripts/signup-form/gas/Code.js scripts/signup-form/gas/config.example.js scripts/signup-form/build-sessions.mjs scripts/signup-form/sync-links.mjs scripts/signup-form/lib.test.mjs scripts/signup-form/sync-links.test.mjs
git commit -m "feat(signup): Apps Script sign-up form with automatic welcome and reminder emails"
```

---

### Task 7: Runbook

**Files:**
- Modify: `docs/SEMINAR_RUNBOOK.md`

- [ ] **Step 1: Add the Season 2 section.** Add `## Season 2: Winter Field Lab` after `## Scheduling a future series`, with these subsections:
  - **Zoom.** One "Recurring meeting — No Fixed Time" in the Zoom web UI, so a
    single link works for every date. Use the same waiting room and mute
    settings as Season 1. The link goes only into
    `scripts/signup-form/gas/config.js`.
  - **The sign-up form (automatic).** Cover:
    - what the script does: form, sheet, welcome email, reminder at 9 AM PT two
      days before, and the JSON links;
    - the one-time steps:
      1. Turn on the Apps Script API at https://script.google.com/home/usersettings.
      2. Run `cd scripts/signup-form && npx @google/clasp login` as ecoquestfoundation@gmail.com.
      3. Run `npx @google/clasp create --type standalone --title "EcoQuest Winter Field Lab sign-up" --rootDir gas`.
      4. Copy `config.example.js` to `config.js` and add the Zoom link.
      5. Run `npm run signup:push`.
      6. In the script editor, run `setup` once and approve the permissions.
      7. Run `npx @google/clasp deploy`, and save the web app URL to `scripts/signup-form/.webapp-url`.
      8. Run `npm run signup:sync`, then commit `seminars.ts`.
    - **When sessions change:** edit `seminars.ts`, run `npm run signup:push`,
      run `setup` again in the editor (or wait; nothing else is needed for date
      text), then run `npm run signup:sync`.
    - **Checking it ran:** the script editor's Executions page, and the
      Sent folder of ecoquestfoundation@gmail.com.
    - **Known limit:** about 100 email recipients a day. If the quota is short,
      the reminder slips one day and a warning is logged.
  - **Distribution (no Eventbrite).** Season 2's outside proof comes from:
    - the city and library calendar submissions (once per series);
    - newsletter archive URLs;
    - social posts.

    When a calendar publishes a session, add `listing: { name, url }` to that
    session in `seminars.ts`. Don't post seminars on Idealist or JustServe
    (see that section above).
  - **Attendance record.** The linked Google Sheet, exported at the end of the
    season for the Congressional Award file.
- [ ] **Step 2:** In `## What to keep for the Congressional Award`, add `- Winter Field Lab sign-up sheet (Google Sheet export)`.
- [ ] **Step 3: Commit.**

```bash
git add docs/SEMINAR_RUNBOOK.md
git commit -m "docs(runbook): Winter Field Lab Zoom, automatic sign-up form, distribution"
```

---

### Task 8: Go live with the form (controller and user, not a subagent)

This task needs the user's Google and Zoom consent, so the controller runs it
with the user and does not dispatch it.

- [ ] **Step 1:** Ask the user for the one-time steps in a single message:
  1. Turn on the Apps Script API toggle.
  2. Create the Zoom no-fixed-time meeting and paste its join link. Pasting it
     into chat is fine; it goes only into the gitignored config.
  3. Run `! cd scripts/signup-form && npx @google/clasp login`.
- [ ] **Step 2:** Run `clasp create` (Task 7 runbook command). Write `gas/config.js` with the Zoom link, then run `npm run signup:push`.
- [ ] **Step 3:** Ask the user to open the script (`npx @google/clasp open`), run `setup`, and approve the permissions.
- [ ] **Step 4:** Run `npx @google/clasp deploy --description "links"`, and write the web app URL from `npx @google/clasp deployments` to `.webapp-url` (as `https://script.google.com/macros/s/<id>/exec`). Then run `npm run signup:sync`.
- [ ] **Step 5: Verify.**
  - `curl -sL "$(cat scripts/signup-form/.webapp-url)"` returns `formUrl` plus 5 session links, and no `zoom`.
  - Open one prefilled link: the matching session is checked.
  - Submit a test response with ecoquestfoundation@gmail.com. Confirm the
    welcome email arrives with the Zoom link, then delete the test response in
    the form.
- [ ] **Step 6:** Run `npm test && npm run build`. Then `grep -c "docs.google.com/forms" out/events/index.html` should be ≥ 5, and `grep -rc "zoom.us" out | grep -v ':0'` should print nothing.
- [ ] **Step 7: Commit.**

```bash
git add src/data/seminars.ts
git commit -m "feat(seminars): Winter Field Lab sign-up links"
```

---

### Task 9: Local preview for the user

- [ ] **Step 1:** Run `npm run build`, then serve `out/` (for example `npx --yes serve out -l 3000`, or the dev server).
- [ ] **Step 2:** Take screenshots at 1440 px and 390 px of `/events/`, the homepage Upcoming Events block, and one Winter deck page.
  - Check the Today badge, the challenge line, and the chips.
  - Check there is no horizontal scroll at 390 px.
- [ ] **Step 3:** Hand the user the local URL and the screenshots. Stop. Merging and deploying wait for their explicit approval.
