// Single source of truth for the EcoQuest Online Seminar Series.
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

export interface SeminarRecap {
  /**
   * Number of people who attended live. Report the real count, or leave it out
   * entirely — an omitted number says nothing, an invented one is a lie.
   */
  attendees?: number
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
      'Worry about the climate is common, and for a lot of students it is the part of environmental science nobody talks about. We look at what climate anxiety actually is, what researchers have measured — including a 2021 Lancet Planetary Health survey of 10,000 people aged 16 to 25 across ten countries — and what EcoQuest students learned building MindMirror, a student research pilot that screens for depression risk from a short voice recording. We will be specific about what MindMirror does and does not do: it is a screening pilot rather than a diagnosis, and the climate anxiety module we designed for it has not been built. This session is about reading research carefully and being honest about what you have actually shipped. It is not medical advice.',
    audience: 'Middle and high school students, families, and educators',
    builtOn: 'Published climate anxiety research, and MindMirror — our student-built mental health screening pilot',
    eventbriteUrl: 'https://www.eventbrite.com/e/ecoquest-seminar-climate-anxiety-and-how-we-built-mindmirror-tickets-1999172929047',
    hasDeck: true,
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
    hasDeck: true,
  },
]

/**
 * Whether a session's scheduled end time has passed.
 *
 * Evaluated when the site is built, not in the visitor's browser: this is a
 * static export, so a session only moves out of "Upcoming" on the next deploy.
 * That is fine in practice — the runbook already has you redeploying after each
 * session to add the recap — but it does mean a stale deploy will keep showing
 * a finished session as upcoming. Redeploy.
 */
function hasEnded(seminar: Seminar): boolean {
  return new Date(seminar.endDateTime).getTime() < Date.now()
}

/** Sessions still ahead of us. */
export const upcomingSeminars = seminars.filter((s) => !hasEnded(s))

/** Sessions whose date has passed, most recent first. */
export const pastSeminars = seminars
  .filter(hasEnded)
  .sort((a, b) => b.startDateTime.localeCompare(a.startDateTime))

export function getSeminar(slug: string): Seminar | undefined {
  return seminars.find((s) => s.slug === slug)
}
