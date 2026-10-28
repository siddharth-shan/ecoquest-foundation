// Copies the prefilled sign-up links from the Apps Script web app into
// src/data/seminars.ts. Usage: npm run signup:sync
// The web app URL is read from scripts/signup-form/.webapp-url (gitignored).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const FORMS = /^https:\/\/docs\.google\.com\/forms\//

export function applyLinks(source, links) {
  let out = source
  for (const [slug, url] of Object.entries(links)) {
    if (!FORMS.test(url)) throw new Error(`Not a Google Forms URL for ${slug}: ${url}`)
    const safe = url.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const escSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Bounded to one entry: stops at the entry's closing "\n  }," so it cannot reach the next entry.
    const re = new RegExp(`(slug: '${escSlug}',(?:(?!\\n  \\},)[\\s\\S])*?signupUrl: )'[^']*(?:\\\\.[^']*)*'`)
    if (!re.test(out)) throw new Error(`No signupUrl field found for ${slug}`)
    out = out.replace(re, (_, head) => `${head}'${safe}'`)
  }
  return out
}

/** The JSON from the web app, or a clear error when setup() hasn't run yet. */
export function extractSessions(data) {
  const sessions = data && data.sessions
  if (!sessions || typeof sessions !== 'object') {
    throw new Error('web app has no links yet — run setup in the Apps Script editor first')
  }
  return sessions
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const webapp = readFileSync(new URL('./.webapp-url', import.meta.url), 'utf8').trim()
  const res = await fetch(webapp, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Web app answered ${res.status}`)
  const sessions = extractSessions(await res.json())
  const file = new URL('../../src/data/seminars.ts', import.meta.url)
  writeFileSync(file, applyLinks(readFileSync(file, 'utf8'), sessions))
  console.log(`Updated ${Object.keys(sessions).length} sign-up links.`)
}
