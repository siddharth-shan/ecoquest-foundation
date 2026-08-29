// Single source of truth for the EcoQuest Online Seminar Series.
//
// Everything on the site — the /events/ cards, the schema.org Event markup, and
// the seminar deck pages — reads from this file. Keep it accurate: each entry is
// a public commitment with a real date, and the schema.org output is what Google
// indexes as an actual event.
//
// AFTER RUNNING A SESSION: fill in the `recap` block. A session with no recap
// renders as upcoming; a session with a recap moves into "Past Sessions". Nothing
// claims to have happened until the recap is filled in, so the page cannot
// overstate the record.

export interface SeminarRecap {
  /** Number of people who attended live. Report the real count. */
  attendees: number
  /** Public recording URL (YouTube unlisted is fine — it still resolves). */
  recordingUrl?: string
  /** One or two sentences on what was actually covered and discussed. */
  summary: string
}

export interface Seminar {
  slug: string
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
  /** Public Eventbrite listing. Empty string until the listing is created. */
  eventbriteUrl: string
  /**
   * Zoom join link. One recurring meeting covers the whole series, so every
   * session shares this link. Not rendered on the public page — the schema.org
   * markup prefers the Eventbrite URL, and registrants get the link by email.
   */
  /** Set once the slide deck page exists at /seminars/<slug>/. */
  hasDeck: boolean
  /** Filled in only after the session has actually been held. */
  recap?: SeminarRecap
}

/** Cadence statement shown on /events/. Keep in sync with the dates below. */
export const SEMINAR_CADENCE = 'Every other Saturday, 11:00–11:40 AM Pacific'

export const seminars: Seminar[] = [
  {
    slug: 'wildfire-data',
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
  },
  {
    slug: 'beach-cleanup-data',
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
  },
  {
    slug: 'home-footprint',
    title: "Your Home's Water and Energy Footprint",
    shortTitle: 'Home Footprint',
    startDateTime: '2026-10-10T11:00:00-07:00',
    endDateTime: '2026-10-10T11:40:00-07:00',
    displayDate: 'Saturday, October 10, 2026',
    displayTime: '11:00–11:40 AM PT',
    description:
      'Most household conservation advice is guesswork. This session shows you how to read your own utility bills, find the three or four things in a typical home that dominate water and energy use, and measure whether a change actually did anything. Attendees leave with a worksheet and a two-week tracking challenge.',
    audience: 'Families, middle school students, and anyone curious about their bills',
    builtOn: 'Our EcoChallenge monthly missions',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-your-homes-water-and-energy-footprint-tickets-1999172925035',
    hasDeck: true,
  },
  {
    slug: 'climate-anxiety',
    title: 'Climate Anxiety and How We Built MindMirror',
    shortTitle: 'Climate Anxiety',
    startDateTime: '2026-10-24T11:00:00-07:00',
    endDateTime: '2026-10-24T11:40:00-07:00',
    displayDate: 'Saturday, October 24, 2026',
    displayTime: '11:00–11:40 AM PT',
    description:
      'Worry about the climate is common, and for a lot of students it is the part of environmental science nobody talks about. We look at what climate anxiety actually is, what researchers measure when they study it, and how EcoQuest students designed MindMirror, a 60-second check-in built around that question. This is a session about reading the research and building a tool, not about giving medical advice — MindMirror is a check-in, not a diagnosis, and we will be clear about that difference.',
    audience: 'Middle and high school students, families, and educators',
    builtOn: 'MindMirror, our student-built climate anxiety check-in',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-climate-anxiety-and-how-we-built-mindmirror-tickets-1999172929047',
    hasDeck: false,
  },
  {
    slug: 'local-conservation',
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
    hasDeck: false,
  },
]

/** Sessions that have not yet been held (no recap recorded). */
export const upcomingSeminars = seminars.filter((s) => !s.recap)

/** Sessions that have actually happened, most recent first. */
export const pastSeminars = seminars
  .filter((s) => s.recap)
  .sort((a, b) => b.startDateTime.localeCompare(a.startDateTime))

export function getSeminar(slug: string): Seminar | undefined {
  return seminars.find((s) => s.slug === slug)
}
