// Weekly check that every official page the homepage's "This Week for the
// Planet" section links to still answers. Run by
// .github/workflows/weekly-rebuild.yml. Writes broken-links.md when anything
// fails (the workflow turns it into a GitHub issue) and always exits 0, so a
// moved page never blocks a rebuild.

import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const SOURCES = ['src/data/awarenessDays.ts', 'src/data/seasons.ts']
const USER_AGENT = 'Mozilla/5.0 (compatible; EcoQuestLinkCheck/1.0; +https://www.ecoquestfoundation.org)'
const TIMEOUT_MS = 10_000

// Pages that open in a browser but answer 403 to GitHub's servers. Only a 403
// is excused, so a page that is really gone (404) or down still gets reported.
const BLOCKS_BOTS = new Set(['https://www.earthdata.nasa.gov/news/feature-articles/cloudy-chance-drizzle'])

/** Every quoted http(s) URL in the text, once each, in order of appearance. */
export function extractUrls(text) {
  return [...new Set(text.match(/https?:\/\/[^'"`\s]+/g) ?? [])]
}

const ok = (status) => status >= 200 && status < 400

/** True when the check should report this URL: a failing status, unless it is a known bot block. */
export function isBroken(url, status, blocksBots = BLOCKS_BOTS) {
  return !ok(status) && !(status === 403 && blocksBots.has(url))
}

/** The final HTTP status for a URL, or 0 if nothing answered. HEAD, then GET; the pair is tried twice. */
export async function checkUrl(url, fetchFn = fetch) {
  let status = 0
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const method of ['HEAD', 'GET']) {
      try {
        const res = await fetchFn(url, {
          method,
          redirect: 'follow',
          headers: { 'user-agent': USER_AGENT },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        })
        status = res.status
      } catch {
        status = 0
      }
      if (ok(status)) return status
    }
  }
  return status
}

async function main() {
  const texts = await Promise.all(SOURCES.map((file) => readFile(file, 'utf8')))
  const urls = extractUrls(texts.join('\n'))
  const results = await Promise.all(urls.map(async (url) => ({ url, status: await checkUrl(url) })))
  const broken = results.filter((r) => isBroken(r.url, r.status))
  console.log(`Checked ${urls.length} links, ${broken.length} broken.`)
  for (const b of broken) console.log(`  ${b.status || 'no response'}  ${b.url}`)
  if (broken.length === 0) return
  const list = broken.map((b) => `- ${b.url} — ${b.status || 'no response'}`).join('\n')
  await writeFile(
    'broken-links.md',
    `The weekly check could not reach these official pages linked from the homepage's This Week for the Planet section:\n\n${list}\n\n` +
      'Fix the URL in `src/data/awarenessDays.ts` or `src/data/seasons.ts`. Some sites refuse automated requests, so open each link in a browser first.\n',
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
