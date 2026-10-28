import { describe, expect, it } from 'vitest'
import { applyLinks, extractSessions } from './sync-links.mjs'

const src = `  {\n    slug: 'first-flush',\n    series: 'winter-2026',\n    signupUrl: '',\n  },\n  {\n    slug: 'king-tides',\n    signupUrl: 'https://old',\n  },\n`

describe('applyLinks', () => {
  it('fills each slug’s signupUrl and leaves others alone', () => {
    const out = applyLinks(src, { 'first-flush': 'https://docs.google.com/forms/d/e/X/viewform?entry.1=a' })
    expect(out).toContain("signupUrl: 'https://docs.google.com/forms/d/e/X/viewform?entry.1=a',")
    expect(out).toContain("signupUrl: 'https://old',")
  })
  it('rejects anything that is not a Google Forms URL', () => {
    expect(() => applyLinks(src, { 'first-flush': 'https://evil.example/' })).toThrow(/Google Forms/)
  })
  it('escapes quotes so the file stays valid', () => {
    expect(applyLinks(src, { 'first-flush': "https://docs.google.com/forms/d/e/X/viewform?entry.1=it's" }))
      .toContain("viewform?entry.1=it\\'s'")
  })
  it('throws when a slug has no signupUrl and leaves the next entry unchanged', () => {
    const two = `  {\n    slug: 'a-one',\n    title: 'x',\n  },\n  {\n    slug: 'b-two',\n    signupUrl: 'https://old',\n  },\n`
    expect(() => applyLinks(two, { 'a-one': 'https://docs.google.com/forms/d/e/X/viewform' })).toThrow(/No signupUrl/)
    expect(applyLinks(two, { 'b-two': 'https://docs.google.com/forms/d/e/Y/viewform' })).toContain("slug: 'a-one',\n    title: 'x',")
  })
  it('writes a URL containing $& literally', () => {
    expect(applyLinks(src, { 'first-flush': 'https://docs.google.com/forms/d/e/X/viewform?a=$&b=$1' }))
      .toContain("signupUrl: 'https://docs.google.com/forms/d/e/X/viewform?a=$&b=$1',")
  })
  it('treats the slug literally in the pattern', () => {
    expect(() => applyLinks(src, { '.*': 'https://docs.google.com/forms/d/e/X/viewform' })).toThrow(/No signupUrl/)
  })
  it('explains an empty web app response', () => {
    expect(() => extractSessions({})).toThrow(/run setup in the Apps Script editor first/)
    expect(() => extractSessions(null)).toThrow(/run setup/)
    expect(extractSessions({ sessions: { a: 'b' } })).toEqual({ a: 'b' })
  })
})
