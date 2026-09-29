// Single source of truth for time-boxed EcoQuest campaigns — the short-run
// initiatives that sit alongside the recurring seminar series.
//
// Same discipline as src/data/seminars.ts, and for the same reason: the
// /events/ cards and the schema.org Event markup both read from here, so this
// file is what Google indexes as a real, dated, attendable event. Every field
// below is a public commitment.
//
// A campaign disappears from the page on its own once its end time has passed
// — see hasEnded. Nothing here backfills a result: there is no recap field,
// because a campaign that has closed should be written up deliberately (in the
// Cleanup History timeline, with a real date) rather than auto-narrated.
//
// IF A CAMPAIGN IS CANCELLED OR MOVED, change it here. Leaving a stale entry in
// place is the site telling a stranger to show up somewhere nobody will be.

export interface CampaignTile {
  /** Small line above the number — a weekday, or a month for a date range. */
  top: string
  /** The number itself: a day, or a day range. */
  main: string
  /** Small line below — month and year, or just the year for a range. */
  bottom: string
}

export interface CampaignPlace {
  name: string
  street: string
  city: string
  region: string
  postalCode: string
  /** Public map link. Shown on the card and used as nothing else. */
  mapUrl: string
}

export interface Campaign {
  slug: string
  title: string
  /** Short label for badges and compact contexts. */
  shortTitle: string
  /** ISO 8601 with the America/Los_Angeles offset. Feeds schema.org startDate. */
  startDateTime: string
  endDateTime: string
  /** Human-readable date for display, e.g. "Sunday, October 11, 2026". */
  displayDate: string
  displayTime: string
  /** The three lines of the date tile, written out rather than parsed — a
   *  month-long campaign has no single weekday to derive. */
  tile: CampaignTile
  /** Drives both the schema.org attendance mode and which meta row renders. */
  attendanceMode: 'online' | 'in-person'
  /** Set for in-person campaigns only. */
  place?: CampaignPlace
  /** Shown in place of a venue for online campaigns, e.g. "Anywhere in California". */
  onlineWhere?: string
  /**
   * Another organization helping staff the event, credited at the org level —
   * never by individual name.
   *
   * This is deliberately NOT a co-host field. EcoQuest organizes and runs these
   * events; a group listed here supplies volunteers. That distinction is why the
   * schema.org `organizer` stays EcoQuest alone, and it is the distinction
   * docs/SEMINAR_RUNBOOK.md cares about under "On double-counting" — a co-hosted
   * cleanup splits whose program the hours belong to, a volunteer-supported one
   * does not.
   *
   * Only fill this in once that organization has actually agreed. Naming a group
   * on a public page implies they endorsed it.
   */
  supportedBy?: string
  description: string
  audience: string
  /** What a participant can honestly log. Stated because most people asking
   *  are asking for exactly this, and a vague answer invites them to invent one. */
  serviceHours: string
  /** Extra detail rendered as a short list. Keep to facts, not selling points. */
  details?: string[]
  /**
   * Google Form sign-up. This is a channel EcoQuest controls, so it collects
   * registrations but does NOT satisfy the reachability test in
   * docs/SEMINAR_RUNBOOK.md — "could a stranger who has never heard of EcoQuest
   * have found this event in advance, through a channel EcoQuest does not
   * control?" Only listingUrl answers that.
   */
  registrationUrl: string
  /** Text on the sign-up button. Says what the reader is signing up to do. */
  ctaLabel: string
  /**
   * Public third-party listing — Eventbrite for the cleanup, an iNaturalist
   * project for the challenge. Empty until one exists. When it is filled in,
   * the card links out to it and the schema.org markup points at it instead of
   * back at our own site. Fill this in; it is the evidence, not the form.
   */
  listingUrl: string
  /** Label for the listing link, e.g. "Eventbrite" or "iNaturalist". */
  listingLabel?: string
}

/** Umbrella name for the current campaign group, shown as the section heading. */
export const CAMPAIGN_TITLE = 'October Environmental Action Campaign'

export const CAMPAIGN_BLURB =
  'Two ways to take part this October — one you can do from anywhere in California on your own schedule, and one morning of hands-on work in Cerritos. Both are free, both are open to anyone, and both count toward documented service hours.'

export const campaigns: Campaign[] = [
  {
    slug: 'biodiversity-challenge-2026',
    title: 'California Biodiversity Challenge 2026',
    shortTitle: 'Biodiversity Challenge',
    startDateTime: '2026-10-01T00:00:00-07:00',
    endDateTime: '2026-10-31T23:59:00-07:00',
    displayDate: 'October 1–31, 2026',
    displayTime: 'Open all month, on your own schedule',
    tile: { top: 'Oct', main: '1–31', bottom: '2026' },
    attendanceMode: 'online',
    onlineWhere: 'Anywhere in California',
    description:
      'Spend October documenting the wildlife and plants where you already are — a backyard, a schoolyard, a hiking trail, a storm drain. Photograph what you find, upload it to iNaturalist, and your observations join a public dataset that researchers actually use. No prior experience and no equipment beyond a phone camera.',
    audience: 'Students, families, and anyone in California with a phone',
    serviceHours: '2 hours for 1–24 verified observations, 4 hours for 25–50',
    details: [
      'Observations are recorded through iNaturalist, a free public science platform.',
      'Anywhere in California counts — there is no travel and no set meeting time.',
      'Service hours are verified against your iNaturalist observation count.',
    ],
    registrationUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLScrxCtbZT8CPTDbjWsnw8NsvUCSZshJxoameYmdPATlkcLSlQ/viewform',
    ctaLabel: 'Join the Challenge',
    listingUrl: '',
    listingLabel: 'iNaturalist',
  },
  {
    slug: 'friendship-park-cleanup-2026',
    title: 'Community Cleanup — Friendship Park',
    shortTitle: 'Friendship Park Cleanup',
    startDateTime: '2026-10-11T09:00:00-07:00',
    endDateTime: '2026-10-11T12:00:00-07:00',
    displayDate: 'Sunday, October 11, 2026',
    displayTime: '9:00 AM–12:00 PM PT',
    tile: { top: 'Sun', main: '11', bottom: 'Oct 2026' },
    attendanceMode: 'in-person',
    place: {
      name: 'Friendship Park',
      street: '13650 Acoro Street',
      city: 'Cerritos',
      region: 'CA',
      postalCode: '90703',
      mapUrl: 'https://maps.google.com/?q=13650+Acoro+Street,+Cerritos,+CA+90703',
    },
    supportedBy: 'with volunteer support from a local Scout troop',
    description:
      'A morning of litter pickup around Friendship Park and the surrounding block. Inspired by National Cleanup Day and its mission to keep communities clean, and run as part of our October campaign. Bring water and closed-toe shoes; we supply bags, gloves, and grabbers.',
    audience: 'All ages — under-16s should come with an adult',
    serviceHours: '3 hours, signed off on the day',
    details: [
      'Meet at the park; look for the EcoQuest table near the parking lot.',
      'Bags, gloves, and litter grabbers are provided.',
      'Runs rain or shine unless we email registrants otherwise.',
    ],
    registrationUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfJxxcYTTaLF1b5CF_VNi46SN9FnAdnrJpnGi6JCWGfDb12OQ/viewform',
    ctaLabel: 'Volunteer Sign-Up',
    listingUrl: '',
    listingLabel: 'Eventbrite',
  },
]

/**
 * Whether a campaign's end time has passed.
 *
 * Evaluated at build time, not in the visitor's browser — this is a static
 * export. A campaign that closed last night keeps showing until the next
 * deploy, so redeploy when one ends.
 */
function hasEnded(campaign: Campaign): boolean {
  return new Date(campaign.endDateTime).getTime() < Date.now()
}

/** Campaigns still open. The whole section hides when this is empty. */
export const upcomingCampaigns = campaigns.filter((c) => !hasEnded(c))
