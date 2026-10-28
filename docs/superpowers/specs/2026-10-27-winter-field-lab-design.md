# EcoQuest Winter Field Lab: Design

Date: 2026-10-27
Status: draft, awaiting approval

## Why

The Fall 2026 Online Seminar Series ends with session 5 on Sat Nov 7, 2026.
After that the site has no recurring online program. EcoQuest needs online
activity that runs at least through the end of January 2027, keeps the same
public, verifiable shape as Season 1, and stays on mission: environmental
education that leads to real action.

Season 2 is called **EcoQuest Winter Field Lab**. Each session is tied to a real
winter community-science project run by an outside organization, so attendees
leave with something to *do*. That organizer is named and linked, and the
session pairs with an EcoQuest game the site already has.

## Goals

- Five free, online, 30-minute sessions, every other Saturday with a holiday
  break, Nov 21, 2026 to Jan 23, 2027, 11:00–11:30 AM PT, on the existing Zoom
  account.
- Signup through a Google Form, not Eventbrite.
- The Events page shows the new series at the top, using the same card design
  as Season 1. Season 1 moves into a "Past series" archive with its recordings.
- The homepage cards (Upcoming Events, Featured Programs/next event) pick up the
  next Winter Field Lab session on their own.
- Upcoming/past status flips on its own, as Season 1 already does. Nobody edits
  the site on session day.
- Each session has a slide deck page at `/seminars/<slug>/`, drafted by Claude
  and presented by the user.
- Monthly at-home EcoChallenge pairings: November is Water, December is
  Zero-Waste, January is Energy. These reuse the three missions in
  `src/data/ecochallenges.ts`.

## Non-goals

- No Eventbrite listings or Eventbrite API script for Season 2.
- No new games. Sessions point at existing games.
- No in-site signup form or backend. The Google Form is hosted by Google.
- The site does not show live attendance or registration counts.
- An optional Feb 6, 2027 session (Great Backyard Bird Count preview) is not part
  of this build. Adding it later is one new data entry. *(Claude's call.)*

## Anti-goals (failure even if it works)

- **The join link must never appear on the website or in the repo.** The repo is
  public, and the sessions have kids in them. The link goes only to people who
  sign up.
- **Nothing invented.** Every outside project is named with its official URL.
  Every date for an outside event (Christmas Bird Count window, King Tide dates,
  Check Before You Burn season) is checked against the organizer's official page
  before it is published. If a date can't be confirmed, the copy leaves it out
  and says "see the official page." No recap is published for a session that
  wasn't held.
- **The Scout troop is never shown as a co-host.** Only as "volunteer support,"
  and only where that support is real.
- **Recordings are labeled "Recorded walkthrough"** unless one really is a
  capture of the live session.
- No current-era years in body copy beyond the dates themselves. Use US
  spelling. Copy must suit K-12 readers.

## The lineup (user-approved shape; titles are drafts)

| # | Date (Sat) | Slug | Title | Real project | Site game |
|---|---|---|---|---|---|
| 1 | Nov 21, 2026 | `first-flush` | First Rain, First Flush | USGS water data and stormwater runoff | Storm Drain Detective |
| 2 | Dec 5, 2026 (World Soil Day) | `winter-bioblitz` | Winter Bioblitz | iNaturalist | Backyard Bioblitz |
| 3 | Dec 19, 2026 | `count-the-birds` | Count the Birds | Audubon Christmas Bird Count + eBird | none |
| 4 | Jan 9, 2027 | `king-tides` | King Tides | California King Tides Project (Coastal Commission) | Climate Record |
| 5 | Jan 23, 2027 | `smoke-fog-fireplaces` | Smoke, Fog and Fireplaces | South Coast AQMD Check Before You Burn | Air Detective |

The schedule skips Thanksgiving weekend (Nov 28) and the holiday Saturdays (Dec 26, Jan 2).

**Session shape (30 min):** about 5 minutes for a hook (one local photo or data
point), about 15 minutes hands-on with real public data or the project's own
tools, and about 10 minutes for "Do this after" (the official sign-up step for
the outside project) plus Q&A. The free Zoom plan's 40-minute cap leaves room to
run over.

**Before anything is published, verify on official pages:**
- the CBC count window and whether any Southern California count circle falls near our area;
- the January 2027 King Tide dates;
- the AQMD Check Before You Burn season dates.

Record each source in a sources file, as `2026-10-27-this-week-v2-sources.md` does.

- **Who verifies:** Claude, during the build.
- **Who signs off:** the user, while reviewing the local preview.
- **If a date can't be confirmed:** the session still ships, with "see the
  official page" copy in place of the date.
- **CBC count circles:** name one only if Audubon's official circle map shows
  it. Otherwise say "find a count near you" and link the map. *(Claude's
  call.)*

## Signup: decided

- **The user creates one Google Form for the series.** It asks which session(s),
  name, email, grade or "adult", and for under-13s a parent/guardian consent
  checkbox.
  - One shared form, not one per session. That's one link to maintain, and
    attendance per session still shows in the responses sheet. *(Claude's call.)*
- **The Zoom link is delivered privately:** on the form's confirmation message,
  plus a reminder email the user sends about two days before each session
  (BCC, from the responses sheet). The Zoom waiting room stays on.
- **The site only stores the public form URL.** The sign-up button on each
  session card reads "Sign up (Google Form)." It opens in a new tab.
  - If the form supports pre-filling the session, the button pre-fills it. If
    the pre-fill entry ID isn't available yet, the button uses the plain form URL.
  - While the form URL is empty, the button falls back to the existing
    `/events/register/?event=…` route, as Season 1 does when `eventbriteUrl` is
    empty.
- The responses sheet is the attendance record for the Congressional Award.
- **Deadline for the form:** about Nov 7, 2026, so distribution can start about
  2 weeks before Nov 21. This is an action item for the user, not a build
  blocker. Until the URL is pasted in, cards fall back to the existing
  `/events/register/?event=<title>` route, as Season 1 did before its Eventbrite
  links existed. *(Claude's call: the precedent already works.)*
- **Optional outside listing.** Each Season 2 session may also carry an optional
  `listingUrl`, matching campaigns. Once a city or library calendar listing
  exists, its link shows as a small "Also listed on <name>" link and becomes the
  schema.org `url`. The sign-up button still goes to the form. *(Claude's
  call.)*

### Reachability (the tradeoff the user accepted)

A Google Form can't be found by a stranger, and Eventbrite was the series' main
proof that it was public. Season 2 replaces it with outside channels from the
runbook's distribution checklist:
- Cerritos and Artesia city community calendars;
- the local library community calendar (the strongest single proof);
- newsletter issues with public archive URLs;
- Instagram/LinkedIn and Nextdoor.

The schema.org Event markup stays on the Events page.

Per the runbook, seminars are **not** posted on Idealist/VolunteerMatch or
JustServe. Those sites are for volunteer service, not talks.

## Site changes

1. **Data.** Season 2 sessions live alongside Season 1 in the existing seminar
   data model (`src/data/seminars.ts`), with a way to tell the two series apart
   (series name, cadence line, session numbering "Session N of 5" per series).
   - Season 1 keeps its `eventbriteUrl` values untouched.
   - Season 2 needs a sign-up URL field instead.
   - Each Season 2 session also carries, for display:
     - the partner project's name and official URL ("Take part");
     - the paired site game, if any;
     - the paired monthly EcoChallenge.
   - The exact field names and how the series is modeled are left to the builder.
2. **Events page (`src/app/events/page.tsx`).**
   - **Order:** campaigns stay on top. Next comes the Winter Field Lab section,
     with its own heading, a one-line pitch, a cadence chip ("Every other
     Saturday, 11:00–11:30 AM Pacific · holiday break Dec 26–Jan 2"). The gap
     from Dec 19 to Jan 9 is three weeks, so a plain "every other Saturday"
     would be untrue. *(Claude's call.)* and session cards in the Season 1
     style.
   - **On each card:**
     - partner project chip, linked to the official site;
     - "Try: <game>" link;
     - "Sign up (Google Form)" button;
     - "Preview Slides" button.
   - **Season 1 until Nov 7:** while any Season 1 session is still ahead, it
     keeps its current upcoming card under its own "Fall Seminar Series"
     heading, below Winter Field Lab. "Past series" shows **only sessions
     whose end time has passed**, so a session not yet held never sits under a
     "Past" heading. *(Claude's call.)*
   - **Below that, "Past series":** Season 1's held sessions and recordings,
     shown as they are now (cards, `SeminarVideo`, "Recorded walkthrough").
     Season 2 sessions join it automatically once they end.
   - The metadata/description copy is updated to mention both series.
3. **Schema.org.** Season 2 sessions are emitted as online Events like Season 1.
   The `url`/offer points at the sign-up URL, or at `/events/` if there is none.
   The organizer is EcoQuest Foundation.
4. **Homepage.** `UpcomingEvents.tsx` and `src/lib/nextEvent.ts` currently read
   `eventbriteUrl` and say "Register on Eventbrite." They must use whichever
   sign-up URL a session has. The label follows the platform: "Register on
   Eventbrite" for Season 1, "Sign up" for a Google Form. Once Nov 7 passes, the
   next session shown is Nov 21, with no edit needed.
   - Season 1 labels stay exactly as they are today: "Register on Eventbrite"
     in `UpcomingEvents`, and "Reserve a spot" in `getNextEvent`.
   - Season 2 uses "Sign up" in both places. *(Claude's call: Season 1 has one
     session left, so nothing is gained by changing it.)*
5. **Monthly EcoChallenge pairing.** During each month (Nov/Dec/Jan, judged by
   Pacific time at build), the Winter Field Lab section shows a small "This
   month's at-home challenge" link to the matching mission. Outside those months
   it shows nothing. The weekly rebuild already keeps this current.
6. **Decks.** Claude drafts five decks in `src/data/decks.ts`, following
   Season 1's structure. Speaker notes are not published. Each deck ends with a
   "Do this after" slide naming the outside project's official sign-up step.
7. **Runbook.** Add a "Season 2: Winter Field Lab" section to
   `docs/SEMINAR_RUNBOOK.md` with these steps:
   - schedule the Zoom recurring meeting (5 occurrences, 30 min);
   - set up the Google Form (fields above; Zoom link in the confirmation
     message; no link in the repo);
   - paste the form URL into the data file;
   - send the reminder emails;
   - follow the distribution checklist without Eventbrite.

## What stays the same

- The automatic upcoming→past move, done at build time and kept current by the
  weekly rebuild plus the `HideAfter` client guard.
- Recordings in GCS (`ecoquest-seminar-recordings`) and the recap rules
  (human-entered only).
- The link checker: new outside URLs are added to whatever list it checks, if the
  builder finds it covers seminar data. Otherwise they are checked once by hand
  and noted. *(Builder decides.)*

## Process constraints

- Build on a branch. The user sees the final version locally before anything is
  merged. Merging and deploying need the user's explicit approval.
- `npm test`, lint, `tsc` and build must pass. Add tests for these behaviors:
  - the sign-up URL fallback;
  - per-series session numbering;
  - Season 1 vs Season 2 CTA labels;
  - the month → EcoChallenge pairing (including outside Nov–Jan);
  - Season 2 sessions joining "Past series" after they end.

## Left to the builder

- Data-model shape and field names.
- Component split: whether the Season 1 card JSX is extracted into a shared component.
- Visual details within the existing design system (colors, chips, spacing).
- Deck slide content, within the anti-goals above.
