# This Week for the Planet, v2 — design

Date: 2026-10-27 · Status: design approved in chat, awaiting spec review
Builds on: `2026-10-27-homepage-this-week-design.md` (shipped in 6bca56b)

## Goal

Make the section answer "what matters for the planet right now, and why",
with more of the year covered, a local Southern California angle, and small
usability wins. Everything still updates from the date alone: no feeds, no
cron, no yearly edits.

Decided with the user: all four of A (fuller calendar), B (why it matters),
C (SoCal season card), D (usability).

Non-negotiables (unchanged): every fact traceable to the official page it
links; the pairing with an EcoQuest activity is ours, not the organizer's;
no implied partnership; US spelling; K-12 appropriate framing.

## 1. Data: `src/data/awarenessDays.ts`

```ts
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6        // 0 = Sunday, as Date#getDay
type DateRule =
  | { month: number; day: number }                // fixed: Sep 16
  | { month: number; weekday: Weekday; nth: 1 | 2 | 3 | 4 | 'last' } // 3rd Sat of Sep

interface AwarenessDay {
  name: string
  when: DateRule
  /** Who declares the day, shown as the link text: "UN observance", "FAO", … */
  source: string
  /** The organizer's official page. */
  url: string
  /** One sentence, paraphrased from `url`. */
  why: string
  /** Key of a PlanetActivity. */
  activity: string
}
```

`source` labels: "UN observance" for un.org days; the agency name for
specialized-agency days listed by the UN (FAO, WMO, UNEP); the organizer for
the rest ("Arbor Day Foundation", "California Coastal Commission",
"World Rivers Day", "Environment for the Americas" for Migratory Bird Day —
confirm the organizer on its site).

### Days

The 16 existing days stay. Added (dates/rules confirmed on the UN list or the
organizer's site on 2026-10-27; the `why` lines and their supporting quotes
are in Appendix A):

| When | Day | Source | Activity |
|---|---|---|---|
| Mar 1 | World Seagrass Day | UN | storm-drain |
| Mar 21 | World Day for Glaciers | UN | climate-record |
| Mar 23 | World Meteorological Day | WMO | climate-record |
| last Fri Apr | National Arbor Day | Arbor Day Foundation | bioblitz |
| 2nd Sat May | World Migratory Bird Day (US date) | migratorybirdday.org | bioblitz |
| May 12 | International Day of Plant Health | FAO | bioblitz |
| May 20 | World Bee Day | FAO | bioblitz |
| Jun 17 | World Day to Combat Desertification and Drought | UN | water |
| Jul 12 | Intl. Day of Combating Sand and Dust Storms | UN | air-detective |
| Aug 27 | World Lake Day | UN | water |
| 3rd Sat Sep | California Coastal Cleanup Day | California Coastal Commission | cleanup |
| 4th Sun Sep | World Rivers Day | World Rivers Day | storm-drain |
| Oct 13 | Intl. Day for Disaster Risk Reduction | UN | air-detective |
| Oct 16 | World Food Day | FAO | zero-waste |
| Nov 26 | World Sustainable Transport Day | UN | energy |

Excluded: Earth Hour (last *or* penultimate Saturday of March — no rule
predicts it), International Mountain Day (no fitting activity), days whose
subject is too grim for the homepage.

**Same-date days are allowed** (Forests + Glaciers on Mar 21; World Cleanup
Day Sep 20 can coincide with the 3rd Saturday). Ties sort in data order, so
the list is stable. The existing "no two observances on the same date" test
becomes "no two observances with the same name".

## 2. Logic: `src/lib/planetCalendar.ts`

- `occurrence(rule, year): Date` — local-midnight date of a rule in a year.
  `nth: 'last'` counts back from the month's last day.
- `nextAwarenessDays` uses `occurrence` for this year, falling back to next
  year when it has passed (a rule day re-computes for the new year, so its
  date can differ from last year's). Ties by data order.
- `weeklyPick` unchanged (override within 7 days, else rotation).
- `seasonFor(today): Season` — the entry for `today.getMonth()`.
- `countdown(daysAway): string` — "Today", "Tomorrow", "in N days".
- `icsFor(day: UpcomingDay): string` — RFC 5545 VCALENDAR with one all-day
  VEVENT: `DTSTART;VALUE=DATE`, `DTEND;VALUE=DATE` (next day), SUMMARY = name,
  DESCRIPTION = why + url, a stable UID (`<slug>-<yyyymmdd>@ecoquestfoundation.org`),
  CRLF line endings, text escaped per RFC 5545 (`\\ ; ,` and newlines).

## 3. Season card: `src/data/seasons.ts`

```ts
interface Season {
  month: number        // 1–12
  heading: string      // ≤ 6 words
  text: string         // two factual sentences
  sourceLabel: string
  sourceUrl: string
  activity: string     // PlanetActivity key
}
```

Twelve entries, one per month, written once from authoritative Southern
California sources (Appendix B). Claims stay general ("often", "typically")
unless the source states a figure. A test asserts exactly one entry per month,
https sources, and known activity keys.

## 4. Layout: `src/components/home/ThisWeekForPlanet.tsx`

Desktop: two columns, as now (3/5 + 2/5). Mobile: stacked.

**Left column**
1. Weekly-pick card. Image area fixed at `h-48 sm:h-56`, `object-contain`
   on a `bg-gray-50` panel, so screenshots are shown whole and photos are
   letterboxed rather than cropped. Text and CTA unchanged.
2. Season card below it: small label "This season in Southern California",
   heading, text, "Source: <label> ↗" link, and "Try: <activity> →".

**Right column — Coming up for the planet**: 4 rows (was 3). Each row:
- date block (month / day), and a countdown chip ("Today" green, otherwise
  gray "Tomorrow" / "in 12 days");
- name;
- `why` sentence (text-sm, gray);
- "<source> ↗" link to the official page (opens in new tab, aria-label
  names the day);
- "Try: <activity> →" and "Add to calendar" (a `button` that builds the
  .ics from `icsFor`, downloads `<slug>.ics` via a Blob URL, then revokes it).

Initial render still uses the build date; the effect swaps in the visitor's
date (unchanged hydration approach).

## 5. Staying current with no manual work

Required by the user: nothing in this section may need a person to update it.

- **Everything is computed from the visitor's date on each page load:** the
  next days, rule dates (re-derived for every year, so Coastal Cleanup Day is
  always the correct 3rd Saturday), countdowns, the weekly pick, and the
  season card. The data holds dates and rules, never years.
- **Copy is timeless.** `why` lines describe what a day is for, never a
  year's theme ("2027 theme: …"), and season text never names a year, so no
  sentence can go out of date.
- **Static HTML stays fresh too.** The site is a static export, so the HTML
  carries the build date until JavaScript runs (and for crawlers and
  link previews). A GitHub Actions workflow
  (`.github/workflows/weekly-rebuild.yml`, cron every Monday 08:00 UTC) calls
  a Vercel Deploy Hook so the build date never lags by more than a week.
  One-time setup: create the hook in Vercel and store it as the repo secret
  `VERCEL_DEPLOY_HOOK_URL`. If the secret is missing, the job logs a notice
  and exits 0.
- **Broken links get reported, not silently shown.** The same workflow runs
  `scripts/check-planet-links.mjs`, which requests every `url` and
  `sourceUrl` (HEAD, falling back to GET; 10 s timeout; one retry). On any
  final 4xx/5xx it opens — or updates — a single GitHub issue titled
  "Planet calendar: broken links" listing them; it does not fail the build.
  This is the only signal a human ever needs to act on, and only if an
  organizer moves its page.

## 6. Testing

Vitest, `TZ=America/Los_Angeles`:
- `occurrence`: 3rd Sat Sep 2026 = Sep 19; last Fri Apr 2027 = Apr 30;
  4th Sun Sep 2026 = Sep 27; 2nd Sat May 2027 = May 8.
- A rule day that has passed this year moves to next year's occurrence
  (from 2026-09-20, Coastal Cleanup Day → 2027-09-18).
- Same-date ties keep data order.
- `seasonFor` returns the entry for each of the 12 months.
- `countdown(0/1/12)`.
- `icsFor`: all-day dates, DTEND = next day, CRLF, escaping, UID format.
- Data: every entry has `why`, `source`, https `url`, known activity,
  unique names; fixed dates are real dates.

Then `npm run lint`, `tsc --noEmit`, `npm run build`, and a local visual
check at 1440px and 390px before anything is pushed. The user reviews the
local build before deploy.

## Appendix A — `why` lines

Use verbatim. Each is a paraphrase of the linked page; the supporting quote
for every line is in `2026-10-27-this-week-v2-sources.md` (fetched
2026-10-27/28). Lines that named a single year's theme were rewritten to
be timeless.

| Day | why |
|---|---|
| International Day of Clean Energy | This day encourages people everywhere to support a fair and inclusive switch to clean energy that helps people and the planet. |
| World Wetlands Day | About one in eight people on Earth depend on wetlands for their livelihoods, which is why this day celebrates them. |
| World Seagrass Day | Seagrasses give fish food, shelter and nursery areas, keep water cleaner and help stop coastal erosion. |
| World Wildlife Day | This day celebrates the many kinds of wild animals and plants, and the benefits that protecting them brings to people. |
| International Day of Forests | This day celebrates all types of forests and encourages local activities such as tree planting. |
| World Day for Glaciers | Glaciers, snow and ice play a key role in Earth's climate and water cycle, and this day raises awareness of them. |
| World Water Day | This day celebrates water and inspires action on the global water crisis, which affects everyone but not equally. |
| World Meteorological Day | This day highlights how weather and water services help keep communities safe. |
| International Day of Zero Waste | This day promotes more sustainable ways of making and using things, so less ends up as waste. |
| International Mother Earth Day | This day recognizes that we share a responsibility to live in harmony with nature and the Earth. |
| National Arbor Day | National Arbor Day celebrates planting trees; each state also holds its own Arbor Day at its best planting time. |
| World Migratory Bird Day | This day celebrates migratory birds and the people working to protect them. |
| International Day of Plant Health | Protecting plant health helps end hunger, protect biodiversity and the environment, and keep food on our tables. |
| World Bee Day | Bees and other pollinators help keep people and the planet healthy, and this day raises awareness of the challenges they face. |
| International Day for Biological Diversity | Biodiversity is the variety of life on Earth, and people depend on it. |
| World Environment Day | Held every year since 1973, this is the largest global day for environmental outreach, celebrated by millions of people. |
| World Oceans Day | The ocean covers about two-thirds of Earth, and this day helps people learn how our actions affect it. |
| World Day to Combat Desertification and Drought | The UN calls desertification one of the greatest environmental challenges of our time. |
| International Day of Combating Sand and Dust Storms | Sand and dust storms can harm people's health, so this day encourages ways to reduce their effects. |
| World Lake Day | Lakes supply fresh water and habitat for wildlife, but overuse and pollution put them under pressure. |
| International Day of Clean Air for Blue Skies | Clean air is fundamental to healthy people, and this day calls on everyone to act for cleaner air. |
| International Day for the Preservation of the Ozone Layer | The ozone layer shields Earth from harmful sun rays; this day marks the 1987 Montreal Protocol that protects it. |
| California Coastal Cleanup Day | California's largest yearly volunteer event, removing trash from beaches and inland waterways across the state. |
| World Cleanup Day | Clean-ups remind us that we share responsibility for keeping our surroundings clean and healthy. |
| World Rivers Day | This day celebrates the world's waterways and encourages better care of rivers everywhere. |
| International Day of Awareness of Food Loss and Waste | This day builds awareness and action to reduce food that is lost or wasted. |
| International Day for Disaster Risk Reduction | This day celebrates how people and communities are reducing their risk from disasters. |
| World Food Day | This day raises awareness of hunger worldwide and encourages action for the future of food, people and the planet. |
| World Cities Day | This day raises awareness of how cities are growing and supports efforts to make them sustainable. |
| World Sustainable Transport Day | This day recognizes how safe, affordable and sustainable transport supports people and communities. |
| World Soil Day | This day raises awareness of the role soil plays in growing food and keeping ecosystems working. |

URLs: as listed in the sources file. Notes: the WMO URL is
`https://wmo.int/events-and-meetings/world-met-day` (old one redirects);
World Soil Day uses `https://www.fao.org/world-soil-day/en/` with source
"FAO"; Migratory Bird Day source label "World Migratory Bird Day".
URL test is `^https?://` — LA County Public Health's beach page is served
over http only.

## Appendix B — season entries

Use verbatim. Supporting quotes in the sources file. No year appears in any
entry. Month placement is editorial; each source supports the season.

| Mo | heading | text | source | activity |
|---|---|---|---|---|
| 1 | Rain and beach water | After a rain, storm drains carry runoff to the ocean, which can raise bacteria levels at the beach. LA County advises avoiding ocean water for at least 72 hours after rainfall. | LA County Public Health — http://publichealth.lacounty.gov/beach/ | storm-drain |
| 2 | Wildflower season begins | In the Antelope Valley, wildflower season can start as early as mid-February. The blooms change through spring, so it's a good time to look closely at local plants. | California State Parks — https://www.parks.ca.gov/poppyreserve | bioblitz |
| 3 | Spring bird migration | Each spring, starting around March, birds of every kind fly north from their winter homes. More than a billion birds pass over California on the way. | Audubon California — https://www.audubon.org/california/news/spring-migration-california | bioblitz |
| 4 | Peak wildflower viewing | Antelope Valley wildflowers bloom from March through May. California State Parks lists mid-April as the usual peak. | California State Parks — https://www.parks.ca.gov/AccessibleFeatures/Details/627 | bioblitz |
| 5 | Ozone season begins | May marks the start of ozone season in Southern California. Heat, sunlight and still air can raise ground-level ozone, especially inland in the afternoon. | South Coast AQMD — https://www.aqmd.gov/home/research/pubs-docs-reports/newsletters/may-jun-jul-2026/ozone-season-begins-across-the-south-coast-air-basin | air-detective |
| 6 | May Gray, June Gloom | Southern Californians call the low coastal clouds of late spring "May Gray" and "June Gloom." NOAA notes that marine layers are especially common along the coasts of Central and Southern California. | NOAA — https://www.noaa.gov/jetstream/ocean/marine-layer | climate-record |
| 7 | Grunion on the beach | Grunion are small, silvery fish found only along the coast of Southern California and northern Baja California. They leave the water at night to spawn on beaches in spring and summer. | California Dept. of Fish and Wildlife — https://wildlife.ca.gov/Fishing/Ocean/Grunion | bioblitz |
| 8 | Hot days, busy power grid | On very hot days, California's power grid can be under stress. Flex Alerts ask people to use less electricity, especially in the late afternoon and evening. | California Public Utilities Commission — https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/flex-alert | energy |
| 9 | Coastal Cleanup Day | California Coastal Cleanup Day is held each September. It is the state's largest yearly volunteer event, removing trash from beaches and inland waterways. | California Coastal Commission — https://www.coastal.ca.gov/publiced/ccd/ccd.html | cleanup |
| 10 | Fall bird migration | Fall migration is one of the great natural sights in California. It peaks in October and November. | Audubon California — https://www.audubon.org/california/news/top-16-places-spot-migratory-birds-california | bioblitz |
| 11 | First storms of the season | Southern California has a rainy season and a dry season. After months without rain, the first storms can wash built-up pollution into storm drains. | LA County Public Works — https://pw.lacounty.gov/general/faq/index.cfm?Action=getAnswers&FaqID=IyMtMz0K&Theme=default&ShowTemplate= | storm-drain |
| 12 | King tide season | Winter is king tide season on California's coast. The Coastal Commission invites people to photograph king tides to help document coastal flood risk. | California Coastal Commission — https://www.coastal.ca.gov/kingtides/learn.html | climate-record |

The May AQMD URL contains "2026" in its path (an archived newsletter);
the text itself is timeless, and the weekly link check will report the
page if it is ever removed.
