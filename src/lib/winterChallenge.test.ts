import { describe, expect, it } from 'vitest'
import { winterChallengeFor } from './winterChallenge'

const at = (iso: string) => Date.parse(iso)

describe('winterChallengeFor', () => {
  it('pairs November with water', () => {
    expect(winterChallengeFor(at('2026-11-21T12:00:00-08:00'))?.mission.slug).toBe('water')
  })
  it('pairs December with zero-waste and January with energy', () => {
    expect(winterChallengeFor(at('2026-12-05T12:00:00-08:00'))?.mission.slug).toBe('zero-waste')
    expect(winterChallengeFor(at('2027-01-23T12:00:00-08:00'))?.mission.slug).toBe('energy')
  })
  it('uses the Pacific month at a UTC month edge', () => {
    // 2026-12-01T05:00Z is still Nov 30 in Los Angeles.
    expect(winterChallengeFor(at('2026-12-01T05:00:00Z'))?.month).toBe('November')
  })
  it('links to the join page with the mission preselected', () => {
    expect(winterChallengeFor(at('2026-11-10T12:00:00-08:00'))?.href).toBe('/ecochallenge/join/?challenge=water')
  })
  it('shows nothing outside the season', () => {
    expect(winterChallengeFor(at('2026-10-28T12:00:00-07:00'))).toBeNull()
    expect(winterChallengeFor(at('2027-02-01T12:00:00-08:00'))).toBeNull()
    expect(winterChallengeFor(at('2027-11-15T12:00:00-08:00'))).toBeNull()
  })
})
