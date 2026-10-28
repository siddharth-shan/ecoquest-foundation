import { describe, expect, it } from 'vitest'
import type { AwarenessDay } from '@/data/awarenessDays'
import { activityFor, icsFor, slugify, type UpcomingDay } from './planetCalendar'

const stamp = new Date(Date.UTC(2026, 9, 27, 15, 4, 5))

function upcoming(day: Partial<AwarenessDay>, date: Date): UpcomingDay {
  const full: AwarenessDay = {
    name: 'Test, Day; One',
    when: { month: date.getMonth() + 1, day: date.getDate() },
    source: 'UN observance',
    url: 'https://example.org/day',
    why: 'Why, really.',
    activity: 'bioblitz',
    ...day,
  }
  return { day: full, date, daysAway: 0, activity: activityFor(full.activity) }
}

describe('slugify', () => {
  it('lowercases and joins words with dashes', () => {
    expect(slugify('World Day to Combat Desertification and Drought')).toBe('world-day-to-combat-desertification-and-drought')
    expect(slugify('Test, Day; One')).toBe('test-day-one')
  })
})

describe('icsFor', () => {
  const ics = icsFor(upcoming({}, new Date(2026, 11, 31)), stamp)
  const lines = ics.split('\r\n')

  it('is a calendar with one all-day event ending the next day', () => {
    expect(lines[0]).toBe('BEGIN:VCALENDAR')
    expect(lines).toContain('VERSION:2.0')
    expect(lines[lines.indexOf('CALSCALE:GREGORIAN') + 1]).toBe('METHOD:PUBLISH')
    expect(lines).toContain('BEGIN:VEVENT')
    expect(lines).toContain('DTSTART;VALUE=DATE:20261231')
    expect(lines).toContain('DTEND;VALUE=DATE:20270101')
    expect(lines[lines.indexOf('DTEND;VALUE=DATE:20270101') + 1]).toBe('TRANSP:TRANSPARENT')
    expect(lines).toContain('DTSTAMP:20261027T150405Z')
    expect(lines).toContain('END:VEVENT')
    expect(lines.at(-2)).toBe('END:VCALENDAR')
  })

  it('uses a stable UID from the name and date', () => {
    expect(lines).toContain('UID:test-day-one-20261231@ecoquestfoundation.org')
  })

  it('escapes text and puts the why line and link in the description', () => {
    expect(lines).toContain('SUMMARY:Test\\, Day\\; One')
    expect(lines).toContain('DESCRIPTION:Why\\, really.\\nhttps://example.org/day')
    expect(lines).toContain('URL:https://example.org/day')
  })

  it('escapes backslash, semicolon, comma and newline', () => {
    const out = icsFor(upcoming({ name: 'a\\b;c,d\ne' }, new Date(2026, 11, 31)), stamp)
    expect(out.split('\r\n')).toContain('SUMMARY:a\\\\b\\;c\\,d\\ne')
  })

  it('uses CRLF everywhere and ends with one', () => {
    expect(ics.endsWith('\r\n')).toBe(true)
    expect(ics.replace(/\r\n/g, '').includes('\n')).toBe(false)
  })

  it('folds lines longer than 75 characters', () => {
    const why = 'A sentence long enough to need folding. '.repeat(6).trim()
    const long = icsFor(upcoming({ why }, new Date(2027, 2, 21)), stamp)
    for (const line of long.split('\r\n')) expect(line.length).toBeLessThanOrEqual(75)
    expect(long.replace(/\r\n /g, '')).toContain(`DESCRIPTION:${why}\\nhttps://example.org/day`)
  })
})
