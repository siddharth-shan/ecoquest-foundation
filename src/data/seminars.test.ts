import { describe, expect, it } from 'vitest'
import {
  SERIES,
  pastAt,
  seminarPublicUrl,
  seminarSignup,
  seminars,
  seriesSessions,
  sessionNumber,
  upcomingIn,
  type Seminar,
} from './seminars'

const at = (iso: string) => Date.parse(iso)
const SITE = 'https://www.ecoquestfoundation.org'

function fake(over: Partial<Seminar>): Seminar {
  return {
    slug: 'x', title: 'A & B', shortTitle: 'x', series: 'winter-2026',
    startDateTime: '2026-11-21T11:00:00-08:00', endDateTime: '2026-11-21T11:30:00-08:00',
    displayDate: 'Saturday, November 21, 2026', displayTime: '11:00–11:30 AM PT',
    description: '', audience: '', builtOn: '', hasDeck: false, ...over,
  }
}

describe('series', () => {
  it('has five sessions in each series', () => {
    expect(seriesSessions('fall-2026')).toHaveLength(5)
    expect(seriesSessions('winter-2026')).toHaveLength(5)
  })

  it('numbers sessions within their own series', () => {
    const first = seriesSessions('winter-2026')[0]
    expect(first.slug).toBe('first-flush')
    expect(sessionNumber(first)).toBe(1)
    expect(sessionNumber(seriesSessions('fall-2026')[4])).toBe(5)
  })

  it('runs every Winter Field Lab session 11:00–11:30 Pacific', () => {
    for (const s of seriesSessions('winter-2026')) {
      expect(s.startDateTime).toMatch(/T11:00:00-08:00$/)
      expect(s.endDateTime).toMatch(/T11:30:00-08:00$/)
      expect(s.displayTime).toBe('11:00–11:30 AM PT')
    }
  })

  it('states the holiday break in the winter cadence', () => {
    expect(SERIES['winter-2026'].cadence).toBe(
      'Every other Saturday, 11:00–11:30 AM Pacific · holiday break Dec 26–Jan 2',
    )
  })

  it('keeps slugs unique across series', () => {
    expect(new Set(seminars.map((s) => s.slug)).size).toBe(seminars.length)
  })
})

describe('upcoming and past', () => {
  const beforeNov7End = at('2026-10-28T12:00:00-07:00')

  it('keeps Nov 7 upcoming, not past, before it ends', () => {
    expect(upcomingIn('fall-2026', beforeNov7End).map((s) => s.slug)).toEqual(['local-conservation'])
    expect(pastAt(beforeNov7End).map((s) => s.slug)).not.toContain('local-conservation')
    expect(upcomingIn('winter-2026', beforeNov7End)).toHaveLength(5)
  })

  it('moves a winter session to past once it ends, newest first', () => {
    const afterDec5 = at('2026-12-05T11:31:00-08:00')
    expect(pastAt(afterDec5).slice(0, 2).map((s) => s.slug)).toEqual(['winter-bioblitz', 'first-flush'])
    expect(upcomingIn('winter-2026', afterDec5)[0].slug).toBe('count-the-birds')
  })

  it('keeps a session upcoming during its own half hour', () => {
    const during = at('2026-11-21T11:15:00-08:00')
    expect(upcomingIn('winter-2026', during)[0].slug).toBe('first-flush')
  })
})

describe('seminarSignup', () => {
  it('uses Eventbrite for the fall series', () => {
    expect(seminarSignup(fake({ series: 'fall-2026', eventbriteUrl: 'https://eb/x' }))).toEqual({
      href: 'https://eb/x', external: true, label: 'Register on Eventbrite', shortLabel: 'Register on Eventbrite',
    })
  })

  it('uses the Google Form when one is set', () => {
    expect(seminarSignup(fake({ signupUrl: 'https://docs.google.com/forms/d/e/abc/viewform' }))).toEqual({
      href: 'https://docs.google.com/forms/d/e/abc/viewform', external: true,
      label: 'Sign up (Google Form)', shortLabel: 'Sign up',
    })
  })

  it('falls back to the on-site register page when empty', () => {
    expect(seminarSignup(fake({ signupUrl: '' }))).toEqual({
      href: '/events/register/?event=A%20%26%20B', external: false, label: 'Register Free', shortLabel: 'Register Free',
    })
  })
})

describe('seminarPublicUrl', () => {
  it('prefers an outside listing', () => {
    expect(seminarPublicUrl(fake({ signupUrl: 'https://f', listing: { name: 'Library', url: 'https://lib/e' } }), SITE)).toBe('https://lib/e')
  })
  it('then the sign-up form', () => {
    expect(seminarPublicUrl(fake({ signupUrl: 'https://f' }), SITE)).toBe('https://f')
  })
  it('never returns an empty string', () => {
    expect(seminarPublicUrl(fake({ signupUrl: '' }), SITE)).toBe(`${SITE}/events/`)
  })
})
