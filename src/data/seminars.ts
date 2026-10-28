// Single source of truth for EcoQuest's online series (Fall Seminar Series and Winter Field Lab).
//
// Everything on the site — the /events/ cards, the schema.org Event markup, and
// the seminar deck pages — reads from this file. Keep it accurate: each entry is
// a public commitment with a real date, and the schema.org output is what Google
// indexes as an actual event.
//
// A session moves from "Upcoming" to "Past Sessions" on its own once its end
// time has passed — see the note on hasEnded below. What does NOT happen on its
// own is any claim about how the session went: attendance, a summary, and a
// recording are only ever published because a human typed them into `recap`
// after the fact. Nothing here can invent a number or describe a room it was
// not in.
//
// IF A SESSION IS CANCELLED, remove it from this list or move its date. Leaving
// a past-dated entry in place states that it was held.

/**
 * Where the recordings live. The MP4s are deliberately not in this repo — video
 * would bloat git history permanently and eat the site's bandwidth allowance.
 * See "Recordings" in docs/SEMINAR_RUNBOOK.md for how files get here.
 */
export const RECORDINGS_BASE_URL = 'https://storage.googleapis.com/ecoquest-seminar-recordings'

export interface SeminarRecording {
  /** File name under RECORDINGS_BASE_URL, e.g. 'wildfire-data.mp4'. */
  file: string
  /** Real length of the file, from ffprobe. Shown on the thumbnail. */
  durationSeconds: number
  /** Still from the recording, under public/. Shown until the visitor presses play. */
  poster: string
  /**
   * What the file actually is, shown on the thumbnail. Defaults to 'Recorded
   * walkthrough': the files are short narrated run-throughs of the deck, not
   * captures of the live session, and must not pass themselves off as one.
   */
  label?: string
}

export interface SeminarRecap {
  /**
   * Number of people who attended live. Report the real count, or leave it out
   * entirely — an omitted number says nothing, an invented one is a lie.
   */
  attendees?: number
  /** A recording that actually exists at RECORDINGS_BASE_URL. */
  recording?: SeminarRecording
  /**
   * One or two sentences on what was actually covered and discussed. Optional:
   * a recording speaks for itself, and a summary written by someone who was not
   * there is worse than none.
   */
  summary?: string
}

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

export interface Seminar {
  slug: string
  /** Which series this session belongs to. Numbering and headings are per series. */
  series: SeriesId
  title: string
  /** Short label used in card headers and the deck nav. */
  shortTitle: string
  /** ISO 8601 with the America/Los_Angeles offset. Feeds schema.org startDate. */
  startDateTime: string
  endDateTime: string
  /** Human-readable date for display, e.g. "Saturday, September 12, 2026". */
  displayDate: string
  displayTime: string
  /** What the session covers, in plain language, for the public listing. */
  description: string
  /** Who it is aimed at — shown on the card. */
  audience: string
  /** The existing EcoQuest work this session is built on. */
  builtOn: string
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
  /** Set once the slide deck page exists at /seminars/<slug>/. */
  hasDeck: boolean
  /** Filled in only after the session has actually been held. */
  recap?: SeminarRecap
}

export const seminars: Seminar[] = [
  {
    slug: 'wildfire-data',
    series: 'fall-2026',
    title: 'Reading Real Wildfire Data',
    shortTitle: 'Wildfire Data',
    startDateTime: '2026-09-12T11:00:00-07:00',
    endDateTime: '2026-09-12T11:40:00-07:00',
    displayDate: 'Saturday, September 12, 2026',
    displayTime: '11:00–11:40 AM PT',
    description:
      'Wildfire data is public, but almost nobody knows how to read it. We walk through where live fire and air-quality data actually comes from, what a containment percentage does and does not tell you, and how to check conditions near your own home. Includes a live walkthrough of the Wildfire Watch app EcoQuest students built.',
    audience: 'Middle and high school students, families, and educators',
    builtOn: 'Wildfire Watch, our student-built fire tracking app',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-reading-real-wildfire-data-tickets-1999171951122',
    hasDeck: true,
    recap: {
      recording: {
        file: 'wildfire-data.mp4',
        durationSeconds: 377,
        poster: '/images/seminars/wildfire-data.webp',
      },
    },
  },
  {
    slug: 'beach-cleanup-data',
    series: 'fall-2026',
    title: 'What a Beach Cleanup Actually Tells Us',
    shortTitle: 'Cleanup Data',
    startDateTime: '2026-09-26T11:00:00-07:00',
    endDateTime: '2026-09-26T11:40:00-07:00',
    displayDate: 'Saturday, September 26, 2026',
    displayTime: '11:00–11:40 AM PT',
    description:
      'A cleanup is not just picking up trash — it is a data collection exercise. Using what we have found at our own Seal Beach cleanups, we cover how volunteers log debris, why the categories matter, how that data reaches researchers and policymakers, and how to run a cleanup that actually produces useful numbers.',
    audience: 'Students, Scout troops, and community volunteers',
    builtOn: 'Our Seal Beach and Save Our Beach cleanups',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-what-a-beach-cleanup-actually-tells-us-tickets-1999172924032',
    hasDeck: true,
    recap: {
      recording: {
        file: 'beach-cleanup-data.mp4',
        durationSeconds: 247,
        poster: '/images/seminars/beach-cleanup-data.webp',
      },
    },
  },
  {
    slug: 'home-footprint',
    series: 'fall-2026',
    title: "Your Home's Water and Energy Footprint",
    shortTitle: 'Home Footprint',
    startDateTime: '2026-10-10T11:00:00-07:00',
    endDateTime: '2026-10-10T11:40:00-07:00',
    displayDate: 'Saturday, October 10, 2026',
    displayTime: '11:00–11:40 AM PT',
    description:
      'Most household conservation advice is guesswork. This session shows you how to read your own utility bills, find the three or four things in a typical home that dominate water and energy use, and measure whether a change actually did anything. Attendees leave with a worksheet and a two-week tracking challenge.',
    audience: 'Families, middle school students, and anyone curious about their bills',
    builtOn: 'Our EcoChallenge missions',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-your-homes-water-and-energy-footprint-tickets-1999172925035',
    hasDeck: true,
    recap: {
      recording: {
        file: 'home-footprint.mp4',
        durationSeconds: 268,
        poster: '/images/seminars/home-footprint.webp',
      },
    },
  },
  {
    slug: 'climate-anxiety',
    series: 'fall-2026',
    title: 'Climate Anxiety and How We Built MindMirror',
    shortTitle: 'Climate Anxiety',
    startDateTime: '2026-10-24T11:00:00-07:00',
    endDateTime: '2026-10-24T11:40:00-07:00',
    displayDate: 'Saturday, October 24, 2026',
    displayTime: '11:00–11:40 AM PT',
    description:
      'Worry about the climate is common, and for a lot of students it is the part of environmental science nobody talks about. We look at what climate anxiety actually is, what researchers have measured — including a 2021 Lancet Planetary Health survey of 10,000 people aged 16 to 25 across ten countries — and what EcoQuest students learned building MindMirror, a student research pilot that screens for depression risk from a short voice recording. We will be specific about what MindMirror does and does not do: it is a screening pilot rather than a diagnosis, and the climate anxiety module we designed for it has not been built. This session is about reading research carefully and being honest about what you have actually shipped. It is not medical advice.',
    audience: 'Middle and high school students, families, and educators',
    builtOn: 'Published climate anxiety research, and MindMirror — our student-built mental health screening pilot',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-climate-anxiety-and-how-we-built-mindmirror-tickets-1999172929047',
    hasDeck: true,
    recap: {
      recording: {
        file: 'climate-anxiety.mp4',
        durationSeconds: 359,
        poster: '/images/seminars/climate-anxiety.webp',
      },
    },
  },
  {
    slug: 'local-conservation',
    series: 'fall-2026',
    title: 'Conservation in Your Own Neighborhood',
    shortTitle: 'Local Action',
    startDateTime: '2026-11-07T11:00:00-08:00',
    endDateTime: '2026-11-07T11:40:00-08:00',
    displayDate: 'Saturday, November 7, 2026',
    displayTime: '11:00–11:40 AM PT',
    description:
      'How to find the environmental work already happening near you and plug into it — city parks and rec programs, watershed groups, library seed libraries, and volunteer platforms. We also cover how to organize your own small cleanup, from permits to supplies to logging service hours properly.',
    audience: 'Students seeking service hours, parents, and community organizers',
    builtOn: 'Three years of running our own community cleanups',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-conservation-in-your-own-neighborhood-tickets-1999172932056',
    hasDeck: true,
  },
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
    signupUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfOu5weTpomtM0fhjLCLam6j6i3yBrzlLLK5i81OIKb4f7cmg/viewform?usp=pp_url&entry.970705970=Sat,+Nov+21+%C2%B7+First+Rain,+First+Flush:+Where+Storm+Water+Goes',
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
    signupUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfOu5weTpomtM0fhjLCLam6j6i3yBrzlLLK5i81OIKb4f7cmg/viewform?usp=pp_url&entry.970705970=Sat,+Dec+5+%C2%B7+Winter+Bioblitz:+Logging+Life+in+the+Cool+Season',
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
    signupUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfOu5weTpomtM0fhjLCLam6j6i3yBrzlLLK5i81OIKb4f7cmg/viewform?usp=pp_url&entry.970705970=Sat,+Dec+19+%C2%B7+Count+the+Birds:+The+Christmas+Bird+Count+and+eBird',
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
    signupUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfOu5weTpomtM0fhjLCLam6j6i3yBrzlLLK5i81OIKb4f7cmg/viewform?usp=pp_url&entry.970705970=Sat,+Jan+9+%C2%B7+King+Tides:+A+Glimpse+of+Future+Sea+Levels',
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
    signupUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfOu5weTpomtM0fhjLCLam6j6i3yBrzlLLK5i81OIKb4f7cmg/viewform?usp=pp_url&entry.970705970=Sat,+Jan+23+%C2%B7+Smoke,+Fog+and+Fireplaces:+Winter+Air+Quality',
    hasDeck: true,
  },
]

/**
 * Splits 'Saturday, September 12, 2026' into the three lines of the date tile.
 * Reads the display string rather than parsing startDateTime, because that is a
 * UTC instant and the tile must show the Pacific date the session actually runs.
 * Returns the same shape as a campaign's `tile`, so one tile renders both.
 */
export function seminarTile(seminar: Seminar) {
  const [weekday, monthDay, year] = seminar.displayDate.split(', ')
  const [month, day] = monthDay.split(' ')
  return { top: weekday.slice(0, 3), main: day, bottom: `${month.slice(0, 3)} ${year}` }
}

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

export function recordingUrl(recording: SeminarRecording): string {
  return `${RECORDINGS_BASE_URL}/${recording.file}`
}

export function getSeminar(slug: string): Seminar | undefined {
  return seminars.find((s) => s.slug === slug)
}
