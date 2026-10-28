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
