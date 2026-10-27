# Homepage: "This Week for the Planet" + tidy — design

Date: 2026-10-27 · Status: approved in chat, awaiting spec review

## Goal

Give the homepage a reason to come back to and tie EcoQuest to what is
happening for the planet, without anyone ever having to update it by hand.

Decided with the user:

- Add an **awareness-days calendar** and a **this week's mission** feature.
  (Live data feeds — NOAA CO₂, NASA EONET — were considered and declined.)
- Scope is "add + tidy": the new section, a single impact block, a real photo
  in the hero. Everything else stays.

Non-negotiables carried over from the site's standards: no invented claims,
no implied partnerships (UN days are linked as observances, EcoQuest's
activity is "ours, related"), US spelling.

## 1. New section: "This Week for the Planet"

Placed directly below `<UpcomingEvents />` in `src/app/page.tsx`. One band,
two columns on desktop, stacked on mobile.

**Left — This week's mission.** One featured card: image, title, short
description, one CTA.

- Pool = `ecoMissions` (3, CTA "Start this mission" →
  `/ecochallenge/join/?challenge=<title>`) + the 4 games (CTA "Play now" →
  `/games/<slug>/`). Games are described in a small `weeklyGames` list next to
  the selection logic, reusing existing copy and images.
- Default pick: `pool[weekIndex % pool.length]`, where `weekIndex` is the
  number of whole weeks (Monday-based) since a fixed epoch, in the visitor's
  local time.
- **Calendar override:** if an awareness day falls within the next 7 days
  (today inclusive) and has a paired activity, that activity is featured
  instead, with a line "World Water Day is Monday, Mar 22 — so this week:".
  Earliest such day wins.

**Right — Coming up for the planet.** The next 3 awareness days, each row:
date, name, "UN observance" link to the official page, and
"Try: <EcoQuest activity>" link. The current day shows a "Today" badge.

## 2. Data and automatic updating

New `src/data/awarenessDays.ts`:

```ts
interface AwarenessDay {
  month: number   // 1–12
  day: number
  name: string
  url: string     // official observance page
  activity: string // key into the weekly pool (mission slug or game slug)
}
```

Fixed-date days only, verified against
un.org/en/observances/list-days-weeks on 2026-10-27:

| Date   | Day                                       | Activity            |
|--------|-------------------------------------------|---------------------|
| Jan 26 | International Day of Clean Energy         | energy mission      |
| Feb 2  | World Wetlands Day                        | storm-drain         |
| Mar 3  | World Wildlife Day                        | bioblitz            |
| Mar 21 | International Day of Forests              | bioblitz            |
| Mar 22 | World Water Day                           | water mission       |
| Mar 30 | International Day of Zero Waste           | zero-waste mission  |
| Apr 22 | International Mother Earth Day            | climate-record      |
| May 22 | International Day for Biological Diversity| bioblitz            |
| Jun 5  | World Environment Day                     | zero-waste mission  |
| Jun 8  | World Oceans Day                          | storm-drain         |
| Sep 7  | Intl. Day of Clean Air for Blue Skies     | air-detective       |
| Sep 16 | Intl. Day for the Preservation of the Ozone Layer | air-detective |
| Sep 20 | World Cleanup Day                         | cleanup (→ /events/)|
| Sep 29 | Intl. Day of Awareness of Food Loss and Waste | zero-waste mission |
| Oct 31 | World Cities Day                          | storm-drain         |
| Dec 5  | World Soil Day                            | bioblitz            |

URLs are the ones listed on the UN page (FAO pages for Forests and Food Loss,
cleanairblueskies.org for Clean Air). Excluded: days with no fitting EcoQuest activity (e.g. Mountain Day), floating dates (e.g. Arbor
Day) and observances whose subject is too grim for a K-12 homepage.

`cleanup` is a pool entry used only as a calendar pairing (CTA "See our
cleanups" → `/events/`); it is not part of the weekly rotation.

**Why it never needs editing:** pure functions in
`src/lib/planetCalendar.ts` —

- `nextAwarenessDays(today, n)` — sorted by next occurrence, wraps Dec → Jan.
- `weeklyPick(today)` — override rule, then rotation.

The section is a client component that renders with the build date as its
initial value (no empty flash, no hydration mismatch) and recomputes from
`new Date()` in an effect, so it stays correct between deploys. No network,
no cron, no secrets. New missions or games added to the data join the pool
automatically.

## 3. Tidy

- **Hero:** `friendship-park-2026-3.webp` (1600×1200) as an `object-cover`
  background image under the existing gradient + dark overlay; text and CTAs
  unchanged; alt text empty (decorative, copy carries meaning).
- **Impact:** delete the static "Our Impact" block in `page.tsx`; keep
  `<ImpactDashboard />` (superset). The "4 Interactive Web Apps" stat goes;
  the Interactive Apps section still lists all four.

## 4. Testing

- Add `vitest` (devDependency) and an `npm test` script.
- `src/lib/planetCalendar.test.ts` covers: Dec 28 → Jan 26 wrap; a day
  that is today is included and flagged; override within 7 days, not at 8;
  rotation is stable within a week and advances the next Monday.
- Then `npm run lint`, `tsc --noEmit`, `npm run build`; visual check of the
  static build at desktop and 390px width.
