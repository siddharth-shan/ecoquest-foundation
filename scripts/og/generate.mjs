#!/usr/bin/env node
// Builds the share images in public/og/ — one 1200×630 JPEG per page.
//
//   node scripts/og/generate.mjs            # all cards
//   node scripts/og/generate.mjs blog home  # only slugs containing these words
//
// Each card is the EcoQuest logo, the page's own title, and (where there is
// one) a real screenshot or photo already published on the site. Nothing is
// drawn or generated: if a page has no picture of its own it gets the plain card.
//
// Needs Google Chrome and macOS `sips`; the output is committed, so the build
// and the deploy do not.

import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PUBLIC = path.join(ROOT, 'public')
const OUT = path.join(PUBLIC, 'og')
const CHROME =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const FALL = 'Fall Online Seminar Series'
const WINTER = 'EcoQuest Winter Field Lab'

/** slug → [kicker, title, image under public/ (optional)] */
const cards = {
  home: ['Student-led nonprofit · Cerritos, California', 'Empowering Youth to Protect Our Planet', 'images/mission.png'],
  about: ['About', 'Who We Are and Why We Started', 'images/mission.png'],
  programs: ['Programs', 'Games, Seminars, Challenges, and Cleanups', 'images/apps/wildfire-watch.png'],
  impact: ['Impact Portfolio', 'What We Have Built and Done', 'images/events/friendship-park-2026-2.webp'],
  events: ['Events', 'Online Seminars and Community Cleanups', 'images/events/friendship-park-2026-3.webp'],
  'get-involved': ['Get Involved', 'Volunteer, Partner, or Bring Us to Your School', 'images/events/friendship-park-2026-2.webp'],
  blog: ['News & Updates', 'Stories From Our Projects and Events', 'images/apps/mindmirror.png'],
  resources: ['Resources', 'Guides, Apps, and Reading for Students and Educators', 'images/games/bioblitz.jpg'],
  games: ['Free Games', 'Four Games Built on Real Data for Your Own ZIP Code', 'images/games/storm-drain.png'],
  'game-storm-drain': ['Free Game', 'Storm Drain Detective', 'images/games/storm-drain.png'],
  'game-bioblitz': ['Free Game', 'Backyard Bioblitz', 'images/games/bioblitz.jpg'],
  'game-air-detective': ['Free Game', 'Air Detective', 'images/games/air-detective.png'],
  'game-climate-record': ['Free Game', 'Your Climate Record', 'images/games/climate-record.png'],
  contact: ['Contact', 'Get in Touch With EcoQuest Foundation'],
  donate: ['Donate', 'Support Student-Led Environmental Education'],
  privacy: ['Privacy Policy', 'How We Handle Your Information'],
  terms: ['Terms of Service', 'Terms for Using Our Site and Programs'],
  'events-register': ['Events', 'Register for an EcoQuest Event'],
  'ecochallenge-join': ['EcoChallenge', 'Join a Week-Long Environmental Mission'],

  'blog-congressional-app-challenge': ['Competition', 'Wildfire Watch: Our Congressional App Challenge Entry', 'images/apps/wildfire-watch.png'],
  'blog-blue-ocean-competition': ['Competition', 'MindMirror: Top 500 Finalist, Blue Ocean Entrepreneurship Competition', 'images/apps/mindmirror.png'],
  'blog-oceanaware-guardian': ['Project', 'OceanAware Guardian', 'images/apps/oceanaware.png'],
  'blog-greenledger': ['Project', 'GreenLedger: A City Budget You Can Actually Read', 'images/apps/greenledger.png'],
  'blog-games-rebuilt': ['Project', 'Why We Rebuilt All Four of Our Games', 'images/games/climate-record.png'],
  'blog-fall-seminar-series': ['Event', 'Our First Online Seminar Series', 'images/seminars/wildfire-data.webp'],
  'blog-friendship-park-cleanup': ['Event', 'An Afternoon at Friendship Park', 'images/events/friendship-park-2026-3.webp'],

  'seminar-wildfire-data': [FALL, 'Reading Real Wildfire Data', 'images/seminars/wildfire-data.webp'],
  'seminar-beach-cleanup-data': [FALL, 'What a Beach Cleanup Actually Tells Us', 'images/seminars/beach-cleanup-data.webp'],
  'seminar-home-footprint': [FALL, 'Your Home’s Water and Energy Footprint', 'images/seminars/home-footprint.webp'],
  'seminar-climate-anxiety': [FALL, 'Climate Anxiety and How We Built MindMirror', 'images/seminars/climate-anxiety.webp'],
  'seminar-local-conservation': [FALL, 'Conservation in Your Own Neighborhood'],
  'seminar-first-flush': [WINTER, 'First Rain, First Flush: Where Storm Water Goes', 'images/games/storm-drain.png'],
  'seminar-winter-bioblitz': [WINTER, 'Winter Bioblitz: Logging Life in the Cool Season', 'images/games/bioblitz.jpg'],
  'seminar-count-the-birds': [WINTER, 'Count the Birds: The Christmas Bird Count and eBird'],
  'seminar-king-tides': [WINTER, 'King Tides: A Glimpse of Future Sea Levels', 'images/games/climate-record.png'],
  'seminar-smoke-fog-fireplaces': [WINTER, 'Smoke, Fog and Fireplaces: Winter Air Quality', 'images/games/air-detective.png'],
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const fileUrl = (rel) => pathToFileURL(path.join(PUBLIC, rel)).href

function html([kicker, title, image]) {
  const size = title.length > 52 ? 46 : title.length > 34 ? 54 : 64
  return `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Poppins:wght@500;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { display: flex; font-family: Poppins, sans-serif; color: #fff;
         background: linear-gradient(135deg, #137333 0%, #0e5a28 60%, #0072a3 160%); }
  .text { flex: 1; padding: 56px 56px 48px 64px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font: 700 28px Montserrat, sans-serif; }
  .brand img { width: 64px; height: 64px; border-radius: 14px; background: #fff; }
  .mid { margin: auto 0; }
  .kicker { color: #fbbc04; font-weight: 600; font-size: 22px; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 18px; }
  h1 { font: 800 ${size}px/1.12 Montserrat, sans-serif; letter-spacing: -.01em; text-wrap: balance; }
  .url { font-weight: 500; font-size: 22px; opacity: .85; }
  .pic { width: 540px; padding: 40px 40px 40px 0; }
  .pic div { width: 100%; height: 100%; border-radius: 24px; border: 6px solid rgba(255,255,255,.9);
             background: #fff center / cover no-repeat; box-shadow: 0 18px 50px rgba(0,0,0,.35); }
  .plain .text { padding-right: 120px; }
  .plain h1 { font-size: ${size + 8}px; }
</style>
<body class="${image ? '' : 'plain'}">
  <div class="text">
    <div class="brand"><img src="${fileUrl('logo.png')}">EcoQuest Foundation</div>
    <div class="mid"><div class="kicker">${esc(kicker)}</div><h1>${esc(title)}</h1></div>
    <div class="url">ecoquestfoundation.org</div>
  </div>
  ${image ? `<div class="pic"><div style="background-image:url('${fileUrl(image)}')"></div></div>` : ''}
</body>`
}

const only = process.argv.slice(2)
const tmp = mkdtempSync(path.join(tmpdir(), 'eq-og-'))
mkdirSync(OUT, { recursive: true })

for (const [slug, card] of Object.entries(cards)) {
  if (only.length && !only.some((w) => slug.includes(w))) continue
  if (card[2]) readFileSync(path.join(PUBLIC, card[2])) // fail loudly on a missing picture
  const page = path.join(tmp, `${slug}.html`)
  const png = path.join(tmp, `${slug}.png`)
  writeFileSync(page, html(card))
  execFileSync(
    CHROME,
    ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
     '--window-size=1200,630', '--virtual-time-budget=8000', `--screenshot=${png}`, pathToFileURL(page).href],
    { stdio: 'ignore' },
  )
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', path.join(OUT, `${slug}.jpg`)], { stdio: 'ignore' })
  console.log(`og/${slug}.jpg`)
}
rmSync(tmp, { recursive: true, force: true })
