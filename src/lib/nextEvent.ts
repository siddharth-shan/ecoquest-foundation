// Picks the next real, dated EcoQuest event to point a finished game at.
//
// Reads the same source of truth the /events page and its schema.org markup use,
// so a game can never advertise an event that is not really happening. If both
// lists are empty the games show no event at all — an invented one is worse than
// none. Prefers a third-party listing URL over our own form, because that is the
// link that proves the event was actually distributed publicly.

import { upcomingCampaigns } from '@/data/campaigns'
import { upcomingSeminars } from '@/data/seminars'

export interface NextEvent {
  title: string
  displayDate: string
  displayTime: string
  description: string
  href: string
  ctaLabel: string
  kind: 'campaign' | 'seminar'
}

export function getNextEvent(prefer?: 'campaign' | 'seminar'): NextEvent | null {
  interface Dated {
    start: string
    event: NextEvent
  }

  const dated: Dated[] = [
    ...upcomingCampaigns.map((c) => ({
      start: c.startDateTime,
      event: {
        title: c.title,
        displayDate: c.displayDate,
        displayTime: c.displayTime,
        description: c.description,
        href: c.listingUrl || c.registrationUrl || '/events/',
        ctaLabel: c.ctaLabel || 'Sign up',
        kind: 'campaign' as const,
      },
    })),
    ...upcomingSeminars.map((s) => ({
      start: s.startDateTime,
      event: {
        title: s.title,
        displayDate: s.displayDate,
        displayTime: s.displayTime,
        description: s.description,
        href: s.eventbriteUrl || '/events/',
        ctaLabel: 'Reserve a spot',
        kind: 'seminar' as const,
      },
    })),
  ].sort((a, b) => Date.parse(a.start) - Date.parse(b.start))

  if (dated.length === 0) return null
  if (prefer) {
    const match = dated.find((d) => d.event.kind === prefer)
    if (match) return match.event
  }
  return dated[0].event
}

/** Finds a specific upcoming campaign by slug, if it is still upcoming. */
export function getCampaignBySlug(slug: string): NextEvent | null {
  const c = upcomingCampaigns.find((x) => x.slug === slug)
  if (!c) return null
  return {
    title: c.title,
    displayDate: c.displayDate,
    displayTime: c.displayTime,
    description: c.description,
    href: c.listingUrl || c.registrationUrl || '/events/',
    ctaLabel: c.ctaLabel || 'Sign up',
    kind: 'campaign',
  }
}
