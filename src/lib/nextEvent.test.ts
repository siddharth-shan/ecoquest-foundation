import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.doUnmock('@/data/seminars')
  vi.doUnmock('@/data/campaigns')
})

const base = {
  title: 'T', displayDate: 'D', displayTime: 'Tm', description: 'd',
  startDateTime: '2099-01-01T11:00:00-08:00', endDateTime: '2099-01-01T11:30:00-08:00',
}

async function nextWith(seminar: Record<string, unknown>) {
  vi.resetModules()
  vi.doMock('@/data/campaigns', () => ({ upcomingCampaigns: [] }))
  vi.doMock('@/data/seminars', async () => {
    const actual = await vi.importActual<typeof import('@/data/seminars')>('@/data/seminars')
    return { ...actual, upcomingSeminars: [{ ...base, slug: 's', ...seminar }] }
  })
  const { getNextEvent } = await import('./nextEvent')
  return getNextEvent()
}

describe('getNextEvent seminar href', () => {
  it('Season 2 with a listing and a signupUrl links to the signup, labeled "Sign up"', async () => {
    const e = await nextWith({
      series: 'winter-2026', signupUrl: 'https://forms/x', listing: { name: 'Library', url: 'https://lib/e' },
    })
    expect(e?.href).toBe('https://forms/x')
    expect(e?.ctaLabel).toBe('Sign up')
  })
  it('Season 1 keeps its Eventbrite link and "Reserve a spot" label', async () => {
    const e = await nextWith({ series: 'fall-2026', eventbriteUrl: 'https://eb/x' })
    expect(e?.href).toBe('https://eb/x')
    expect(e?.ctaLabel).toBe('Reserve a spot')
  })
})
