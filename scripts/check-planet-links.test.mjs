import { describe, expect, it } from 'vitest'
import { checkUrl, extractUrls, isBroken } from './check-planet-links.mjs'

/** A fetch stand-in that answers with the given statuses (or throws the given errors) in order. */
function fakeFetch(answers) {
  const methods = []
  const fn = async (_url, opts) => {
    methods.push(opts.method)
    const next = answers.shift()
    if (next instanceof Error) throw next
    return { status: next }
  }
  return { fn, methods }
}

describe('extractUrls', () => {
  it('finds each quoted http(s) URL once', () => {
    const text = `url: 'https://a.org/x', other: "http://b.gov/y?a=1&b=2", again: 'https://a.org/x' // un.org/no-scheme`
    expect(extractUrls(text)).toEqual(['https://a.org/x', 'http://b.gov/y?a=1&b=2'])
  })
})

describe('checkUrl', () => {
  it('returns the HEAD status when it succeeds', async () => {
    const f = fakeFetch([200])
    expect(await checkUrl('https://x.org', f.fn)).toBe(200)
    expect(f.methods).toEqual(['HEAD'])
  })

  it('falls back to GET when HEAD is refused', async () => {
    const f = fakeFetch([405, 200])
    expect(await checkUrl('https://x.org', f.fn)).toBe(200)
    expect(f.methods).toEqual(['HEAD', 'GET'])
  })

  it('retries once after network errors', async () => {
    const f = fakeFetch([new Error('reset'), new Error('reset'), 200])
    expect(await checkUrl('https://x.org', f.fn)).toBe(200)
    expect(f.methods).toEqual(['HEAD', 'GET', 'HEAD'])
  })

  it('reports the final failing status', async () => {
    const f = fakeFetch([404, 404, 404, 404])
    expect(await checkUrl('https://x.org', f.fn)).toBe(404)
    expect(f.methods).toHaveLength(4)
  })

  it('reports 0 when nothing answers', async () => {
    const f = fakeFetch([new Error('a'), new Error('b'), new Error('c'), new Error('d')])
    expect(await checkUrl('https://x.org', f.fn)).toBe(0)
  })
})

describe('isBroken', () => {
  const blocks = new Set(['https://blocked.gov/page'])

  it('excuses a 403 from a page known to block bots', () => {
    expect(isBroken('https://blocked.gov/page', 403, blocks)).toBe(false)
  })

  it('still reports a known bot-blocking page that is gone or down', () => {
    expect(isBroken('https://blocked.gov/page', 404, blocks)).toBe(true)
    expect(isBroken('https://blocked.gov/page', 0, blocks)).toBe(true)
  })

  it('reports a 403 from any other page', () => {
    expect(isBroken('https://other.gov/page', 403, blocks)).toBe(true)
  })

  it('passes working pages', () => {
    expect(isBroken('https://other.gov/page', 200, blocks)).toBe(false)
  })
})
