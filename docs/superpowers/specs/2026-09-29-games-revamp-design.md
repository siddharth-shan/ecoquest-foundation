# EcoQuest Games Revamp — Design Spec

**Date:** 2026-09-29
**Status:** Approved for implementation
**Scope:** Replace all four educational games at `/games/*` with locally-grounded,
data-backed games. Old games are removed outright; their URLs 301 to successors.

---

## 1. Why

The four existing games (`guardians`, `ocean-cleanup`, `recycling-hero`,
`carbon-quest`) are hardcoded, emoji-driven, and have no connection to any real
place. An audit also found they are functionally broken in ways a player notices:

- **Guardians** — random events `alert()` "+5 Health / +50 Points" but mutate
  nothing; mission health gains are clobbered by a recompute effect; `biodiversity`
  is never decremented so the win threshold is trivial; soft-locks below 50 energy.
- **Ocean Cleanup** — the 60s timer is torn down and restarted on every collected
  item, so the clock is not 60s; "Items Collected" is `score/15`, an invented number.
- **Recycling Hero** — accuracy is `(itemsSorted-3)/itemsSorted` and game-over
  always means `lives===0`, so **the game can only ever end in failure**.
- **Carbon Quest** — every choice button prints its own carbon cost, so optimal play
  is "click the smallest number." The assessment measures nothing.

The replacement set is built on **real public data for the player's own ZIP code**,
so content is never hardcoded and differs in every town.

## 2. Non-negotiable constraints

1. **Authenticity.** A prior Google nonprofit review flagged "unauthenticated
   content." No invented statistics, no fabricated leaderboards, no placeholder
   impact numbers. Anything presented as fact must be traceable to a real source
   shown to the player. Where data is a *model estimate*, say so.
2. **Static export.** `next.config.js` sets `output:'export'`, `trailingSlash:true`.
   No API routes, no server actions, no database. All logic client-side.
   Internal links keep trailing slashes.
3. **No accounts, no backend, nothing leaves the device.** All progress in
   `localStorage`. This is the COPPA-safe pattern for a K-12 audience and is
   forced by the static host anyway.
4. **Keyless, CORS-open APIs only.** No API key may ship in client JS.
5. **Photo attribution is legally required** (see §3).
6. **Every game must be fully playable with zero network.**
7. **Accessibility is a requirement, not a polish pass.** The current codebase has
   no `prefers-reduced-motion` anywhere and games use `alert()` for feedback.

## 3. Verified data sources

All endpoints below were probed on 2026-09-29 with an `Origin:` header and
confirmed `200` + `Access-Control-Allow-Origin: *`, keyless.

| Source | Endpoint | Used by | Verified result |
|---|---|---|---|
| Zippopotam | `api.zippopotam.us/us/{zip}` | shared | 90703 → Cerritos, CA 33.8669,-118.0686 |
| iNaturalist v1 | `api.inaturalist.org/v1` | Bioblitz | 4,842 research-grade species within 25km (re-probed 2026-09-29; counts drift upward as observers add records) |
| Open-Meteo Air Quality | `air-quality-api.open-meteo.com` | Air Detective | hourly pm2_5/ozone/NO2/CO back to 2020 |
| Open-Meteo Archive | `archive-api.open-meteo.com` | Climate Record | daily temps 1950→present |
| USGS NLDI | `api.water.usgs.gov/nldi` | Storm Drain | downstream trace + gauge list |
| USGS Water Services | `waterservices.usgs.gov/nwis` | Storm Drain | live gauge readings |

**Rejected after probing:** OpenAQ v3 (401, no CORS header), PurpleAir (no CORS,
now paid), CAL FIRE (no CORS), Census geocoder (no CORS), EPA EJScreen (site
returns 404 — decommissioned), AirNow / eBird (keyless calls rejected; key would
be exposed in client JS). Earth911 recycling API requires a partner key and its
developer portal is 404 — **there is no free browser-callable recycling-rules
API**, which is why the waste game was dropped from the set.

### 3.1 iNaturalist photo licensing — HARD REQUIREMENT

Probed photos returned `license_code` of `cc-by-nc` and `cc-by-sa`. These licenses
**require attribution**. Every displayed photo MUST render its
`photo.attribution` string visibly adjacent to the image. A photo whose
`license_code` is null, absent, or `c` (all rights reserved) MUST be skipped —
do not display it. Non-commercial use by a 501(c)(3) education site is compatible
with `-NC`.

### 3.2 Honesty notes baked into content

- Open-Meteo air quality is **CAMS model reanalysis**, not a ground monitor. The
  game says so and links the player to their nearest regulatory monitor.
- The local warming signal is **modest and non-monotonic**. Cerritos decadal mean
  daily high: 1950s 74.92°F → 1970s 74.10°F → 1990s 74.74°F → 2010s 75.82°F →
  last decade 75.68°F. Days ≥90°F: 28.3 → 23.5 → 31.3 → 30.9 → 31.4.
  A naive 1955-vs-2025 summer comparison shows *cooling*. **The climate game must
  report whatever the data says, including "noisy" or "barely changed."**
- July 4th fireworks move Cerritos PM2.5 only 17.8 → 24.8 in this dataset. **Not
  used as a case** — too weak to attribute honestly.

## 4. Shared architecture

```
src/lib/
  place.ts          resolveZip(), Place type, localStorage persistence (SSR-safe)
  progress.ts       badges/streaks under `ecoquest:games:*`, SSR-safe
  api/
    client.ts       fetchJson() — timeout, abort, {ok:true,data}|{ok:false,reason}
    inaturalist.ts  openMeteoAir.ts  openMeteoArchive.ts  usgs.ts
  fixtures/         real captured Cerritos data for offline fallback
src/components/games/
  PlaceGate.tsx     ZIP entry + validation + "Cerritos, CA" confirm + change link
  GameShell.tsx     shared frame: title, place badge, score, restart, a11y live region
  ImpactPanel.tsx   the four impact loops (see §6)
  PrintableSheet.tsx print-only CSS
  DataSourceNote.tsx provenance line — required on every game
src/app/games/
  bioblitz/ storm-drain/ air-detective/ climate-record/   (page.tsx + layout.tsx)
```

**Conventions to follow (from the existing codebase):**
- Each game is `'use client'`; metadata lives in a sibling `layout.tsx` exporting
  `Metadata` with `alternates.canonical` — required because pages are client
  components. Replicate the existing pattern exactly.
- Reuse `.card`, `.card-hover`, `.btn`/`.btn-primary`/`.btn-outline`,
  `.container-custom`, `.section-padding`, `.bg-gradient-eco` from `globals.css`.
  The old games bypassed `.card` with ad-hoc styling; new ones must not.
- Colors: `primary-green #34a853`, `primary-blue #00a8e1`, `accent-yellow #fbbc04`.
- No new runtime dependencies without justification. No canvas, no animation lib.

**`usePlace()`** — one ZIP, entered once, shared by all four games via
`localStorage['ecoquest:place']`. Default demo place is Cerritos 90703 so every
game is instantly playable without typing anything (needed for classrooms and for
reviewers).

## 5. The four games

Four distinct verbs so the set does not feel like one engine wearing four hats:
**identify · trace · deduce · predict**.

### 5.1 Backyard Bioblitz — `/games/bioblitz/` (replaces `guardians`)

**Identify.** Real photos of species actually observed near the player's ZIP.

- Data: `/v1/observations/species_counts?lat&lng&radius=25&quality_grade=research&per_page=200`
- Round: show one real photo; four choices drawn from the local pool, filtered to
  the same `iconic_taxon_name` so distractors are plausible rather than absurd.
- Skip any taxon lacking `default_photo.medium_url` or a permissive license.
- Difficulty ramps by observation count: common species first, rarer later.
- Reveal shows the real local observation count, whatever the API returns that day ("seen 8,944 times near you"). Never hardcode a count.

**Offline mission:** printable 5×5 bingo card of species genuinely present near
that ZIP. **Community science:** hand off to iNaturalist / City Nature Challenge.

### 5.2 Storm Drain Detective — `/games/storm-drain/` (replaces `ocean-cleanup`)

**Trace.** The honest version of the ocean game: where does *your* water go?

Verified for Cerritos: `comid/position` → comid 22524985 → `navigation/DM/flowlines?distance=80`
returns 7 segments terminating at **33.7445, -118.1146 — the San Gabriel River
mouth at Seal Beach**, passing gauges **USGS-11090500 "COYOTE C NR ARTESIA CA"**
and **USGS-11090700 "COYOTE C A LOS ALAMITOS CA"**.

- Player predicts which way their water flows, then watches the real traced path
  animate downstream to the sea.
- Live gauge readings from `waterservices.usgs.gov` show how fast it is moving now.
- For a Cerritos-area player the path ends at the beach EcoQuest actually cleans —
  stated as the computed result, never hardcoded.
- Litter-travel reasoning: what survives the trip, what sinks, what breaks up.

**Do NOT depend on Overpass for storm-drain points** — OSM drain coverage in US
suburbs is sparse and a probe returned 406. The offline mission is physical:
find the drain nearest your home, photograph it, log it.

**Offline mission:** adopt-a-drain log sheet (printable). **Events:** link to the
real next cleanup from `src/data/campaigns.ts`.

### 5.3 Air Detective — `/games/air-detective/` (replaces `recycling-hero`)

**Deduce.** A forensics game over real hourly pollution data for the player's ZIP.

Each case is a real multi-day window with the cause hidden. Clues: which pollutant
moved (PM2.5 vs ozone), time of day, season, temperature.
Lineup: wildfire smoke · traffic · heat+sunlight ozone · winter inversion · dust ·
clean day.

Verified signatures in Cerritos data:
- **Smoke** — Jan 2025 LA fires: daily max PM2.5 jumps 37.3 → 108.3 on Jan 8,
  holds ~110 through Jan 11, drops to 35.9 on Jan 12.
- **Ozone is heat-driven** — July mean by hour: 06h 26 → 15h 126 → 21h 56.
  January 15h peaks at only 78. This is the urban-heat lesson: hot pavement and
  missing shade literally cook worse air. The student derives it from their own data.
- Level 2 teaches that **PM2.5 and ozone are different pollutants with different
  causes and different daily rhythms** — the most common student misconception.
- Level 3 includes cases where the correct answer is **"not enough evidence,"**
  and scores that correctly.

**Authenticity guard:** cases are detected algorithmically from the player's own
data and classified by *pattern*, which is always defensible. A specific named
cause ("the January 2025 LA fires") appears ONLY for a small hand-curated,
verified set. Everywhere else the game says "a smoke event" — it must never
invent a cause for a spike it cannot attribute.

**Offline mission:** check AQI before exercising; find your nearest real monitor.
**Classroom:** EPA-style air-quality flag activity, printable.

### 5.4 Your Climate Record — `/games/climate-record/` (replaces `carbon-quest`)

**Predict.** Commit to a guess about your own town, then meet the real record.

- Player predicts the decadal trend in mean daily high and days ≥90°F for their ZIP.
- Reveal plots real Open-Meteo archive data 1950→present for their exact coordinates.
- Scoring rewards calibration, not doom: a player who predicts "small and noisy"
  for a town whose data is small and noisy scores **full marks**.
- Explicit lesson on signal vs. noise, using the real 1970s dip as the worked example.
- Per the eco-anxiety literature, every finding is paired with local agency and
  solutions — never a doom-only reveal.

**Impact:** links to real EcoQuest events from `campaigns.ts` / `seminars.ts`.

## 6. Impact loops (all four required per game)

1. **Real events** — surface the genuine next campaign/seminar from `src/data/`,
   linking out to the real Eventbrite listing (satisfies the reachability standard).
2. **Offline mission** — a concrete physical task, handed off via the site's
   existing `mailto:` pattern (`ecochallenge/join/page.tsx:57`) and/or print.
3. **Community science** — hand off to a real program (iNaturalist / City Nature
   Challenge, Adopt-a-Drain, air-quality flag program).
4. **Classroom** — printable worksheet, no login, session result exportable.

`ImpactPanel.tsx` renders all four; each game supplies its content.

## 7. Failure and degradation

Every fetch path needs a real answer for: API down, slow, rate-limited, rural ZIP
with thin data, offline classroom, and user who won't type a ZIP.

- `fetchJson()` — 8s timeout, `AbortController`, single retry with backoff,
  returns a discriminated union. **No unhandled rejections, no `alert()`.**
- On failure, each game falls back to **real captured Cerritos data** bundled in
  `src/lib/fixtures/`, labeled visibly as *"Showing sample data from Cerritos, CA
  — live data unavailable."* Never silently present fixture data as the player's own.
- Thin-data ZIP (e.g. <40 local species) → widen radius once, then fall back with
  an explanation.
- Loading states are skeletons, never spinners-forever.

## 8. Accessibility baseline

- Full keyboard operability; visible focus rings; logical tab order.
- Feedback via `aria-live="polite"` region. **No `alert()` anywhere.**
- `prefers-reduced-motion` respected — this is currently absent codebase-wide.
- Color never the sole signal; correct/incorrect also carry text and icon.
- Tap targets ≥44px; charts get text-table equivalents.
- Alt text on every image; photo attribution is visible text, not an `alt`.

## 9. Migration

- **Delete** `src/app/games/{guardians,ocean-cleanup,recycling-hero,carbon-quest}/`.
- **Add** 301s in `vercel.json`, both with and without trailing slash, matching the
  existing redirect style:
  `guardians→bioblitz`, `ocean-cleanup→storm-drain`,
  `recycling-hero→air-detective`, `carbon-quest→climate-record`.
- Rewrite `src/app/games/page.tsx` cards + metadata for the new four.
- `src/app/sitemap.ts` — swap the four routes.
- **Screenshots:** `public/images/games/*.png` are screenshots of the OLD games and
  must not ship. Capture real screenshots of the new games after build. **Do not
  create mockup images** — that would be exactly the unauthenticated content the
  site is recovering from. Until real captures exist, the cards use CSS art.

## 10. Verification

- `npm run build` must pass (static export) and `npm run lint` clean.
- Each game: playable start→finish with network disabled (fixture path).
- Each game: playable with a non-California ZIP (test 10001 NY, 59718 MT for a
  thin-data case).
- Keyboard-only playthrough of each game.
- Confirm no `alert()`, no API key, and no `localStorage` write outside
  `ecoquest:*` in the final diff.
- Confirm every rendered iNat photo shows its attribution string.

## 11. Out of scope

Server-side anything; accounts; cross-device sync; real leaderboards (would require
a backend and would breach the no-fabrication rule if faked); a waste/recycling
game (no free rules API); embedding third-party games (Stop Disasters and NASA both
send `X-Frame-Options: SAMEORIGIN`).
