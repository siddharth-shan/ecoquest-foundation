import { describe, expect, it } from 'vitest'
import { applyLinks } from './sync-links.mjs'

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
})
