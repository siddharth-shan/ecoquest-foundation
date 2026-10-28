import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { describe, expect, it } from 'vitest'

const ctx = vm.createContext({})
vm.runInContext(readFileSync(new URL('./gas/lib.js', import.meta.url), 'utf8'), ctx)
const { choiceLabel, chunk, dueForReminder, pacificDay, recipientsFor, reminderEmail, welcomeEmail } = ctx

const S = [
  { slug: 'first-flush', title: 'First Rain', displayDate: 'Saturday, November 21, 2026', displayTime: '11:00–11:30 AM PT', startDateTime: '2026-11-21T11:00:00-08:00' },
  { slug: 'king-tides', title: 'King Tides', displayDate: 'Saturday, January 9, 2027', displayTime: '11:00–11:30 AM PT', startDateTime: '2027-01-09T11:00:00-08:00' },
]

// Results from the VM come from another realm; normalize before toEqual.
const plain = (v) => JSON.parse(JSON.stringify(v))

describe('choiceLabel', () => {
  it('leads with the date so the form reads in order', () => {
    expect(choiceLabel(S[0])).toBe('Sat, Nov 21 · First Rain')
  })
})

describe('dueForReminder', () => {
  it('is due two Pacific days before, at the 9 AM run', () => {
    expect(dueForReminder(S, Date.parse('2026-11-19T09:05:00-08:00'), 2).map((s) => s.slug)).toEqual(['first-flush'])
  })
  it('is still due one day before (catch-up after a skipped run)', () => {
    expect(dueForReminder(S, Date.parse('2026-11-20T09:05:00-08:00'), 2).map((s) => s.slug)).toEqual(['first-flush'])
  })
  it('is not due on the day itself or three days before', () => {
    expect(plain(dueForReminder(S, Date.parse('2026-11-21T09:05:00-08:00'), 2))).toEqual([])
    expect(plain(dueForReminder(S, Date.parse('2026-11-18T09:05:00-08:00'), 2))).toEqual([])
  })
  it('counts days on the Pacific calendar across the new year', () => {
    expect(dueForReminder(S, Date.parse('2027-01-07T09:05:00-08:00'), 2).map((s) => s.slug)).toEqual(['king-tides'])
  })
  it('uses the Pacific date late in the evening (UTC has already rolled over)', () => {
    expect(dueForReminder(S, Date.parse('2026-11-19T23:30:00-08:00'), 2).map((s) => s.slug)).toEqual(['first-flush'])
  })
})

describe('pacificDay', () => {
  it('assembles YYYY-MM-DD on the Pacific calendar', () => {
    expect(pacificDay(Date.parse('2026-11-19T23:30:00-08:00'))).toBe('2026-11-19')
    expect(pacificDay(Date.parse('2027-01-01T01:00:00Z'))).toBe('2026-12-31')
  })
})

describe('chunk', () => {
  it('splits into groups of at most n, preserving order', () => {
    expect(plain(chunk([1, 2, 3, 4, 5], 2))).toEqual([[1, 2], [3, 4], [5]])
    expect(plain(chunk([], 49))).toEqual([])
    expect(chunk(Array.from({ length: 100 }, (_, i) => i), 49).map((c) => c.length)).toEqual([49, 49, 2])
  })
})

describe('recipientsFor', () => {
  const rows = [
    { email: 'A@x.org ', sessions: ['Sat, Nov 21 · First Rain'] },
    { email: 'a@x.org', sessions: ['Sat, Nov 21 · First Rain', 'Sat, Jan 9 · King Tides'] },
    { email: 'b@x.org', sessions: ['Sat, Jan 9 · King Tides'] },
    { email: 'not-an-email', sessions: ['Sat, Nov 21 · First Rain'] },
  ]
  it('returns unique, trimmed, lowercased valid emails for one session', () => {
    expect(Array.from(recipientsFor(rows, 'Sat, Nov 21 · First Rain'))).toEqual(['a@x.org'])
  })
})

describe('emails', () => {
  it('puts the join link in the reminder and the welcome', () => {
    const r = reminderEmail(S[0], 'https://zoom.example/j/1')
    expect(r.subject).toBe('Reminder: First Rain — Saturday, November 21, 2026, 11:00–11:30 AM PT')
    expect(r.body).toContain('https://zoom.example/j/1')
    const w = welcomeEmail([S[0], S[1]], 'https://zoom.example/j/1')
    expect(w.body).toContain('First Rain')
    expect(w.body).toContain('King Tides')
    expect(w.body).toContain('https://zoom.example/j/1')
    expect(w.body).toContain("If you didn't sign up, or want to be removed, reply to this email.")
  })
})
