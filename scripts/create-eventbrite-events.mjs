#!/usr/bin/env node
/**
 * Creates the five EcoQuest seminar listings on Eventbrite as free online events,
 * then prints the public URLs to paste back into src/data/seminars.ts.
 *
 * Session data is read straight out of src/data/seminars.ts so the listings and
 * the website cannot drift apart. Edit that file, not this one.
 *
 * Requires an Eventbrite private token. Get one at
 * https://www.eventbrite.com/platform/api-keys/ and put it in .env
 * (already gitignored — never commit it):
 *
 *   EVENTBRITE_TOKEN=...
 *
 * Usage:
 *   node scripts/create-eventbrite-events.mjs           # dry run, shows the plan
 *   node scripts/create-eventbrite-events.mjs --check   # verify the token + show the org
 *   node scripts/create-eventbrite-events.mjs --create  # create + publish for real
 *
 * Safe to re-run: an event whose eventbriteUrl is already filled in is skipped.
 *
 * To push an edited title or description back to a listing that already exists:
 *
 *   node scripts/create-eventbrite-events.mjs --update                 # all listed sessions
 *   node scripts/create-eventbrite-events.mjs --update --only=<slug>   # just one
 *
 * --update rewrites name, summary, and description from src/data/seminars.ts.
 * It does not touch dates, tickets, or the cover image.
 */

import { readFileSync } from 'node:fs'

const API = 'https://www.eventbriteapi.com/v3'
const UPDATE = process.argv.includes('--update')
const DRY_RUN = !process.argv.includes('--create') && !UPDATE
const CHECK_ONLY = process.argv.includes('--check')
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.slice('--only='.length)

const CAPACITY = 100
const TIMEZONE = 'America/Los_Angeles'
const SITE_EVENTS_URL = 'https://www.ecoquestfoundation.org/events/'

function loadEnv() {
  const env = { ...process.env }
  try {
    for (const line of readFileSync('.env', 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (match) env[match[1]] ??= match[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // No .env file — fall back to the real environment.
  }
  return env
}

/**
 * Pulls the seminar entries out of src/data/seminars.ts. Deliberately a parser
 * rather than a second copy of the data: one source of truth, no drift.
 */
function readSeminars() {
  const src = readFileSync('src/data/seminars.ts', 'utf8')
  const arrayBody = src.slice(
    src.indexOf('export const seminars: Seminar[] = ['),
    src.indexOf('\n]\n', src.indexOf('export const seminars'))
  )

  const field = (block, key) => {
    const m = block.match(new RegExp(`\\b${key}:\\s*(?:'([^']*)'|"([^"]*)")`, 's'))
    return m ? (m[1] ?? m[2]) : ''
  }

  return arrayBody
    .split(/\n  \{\n/)
    .slice(1)
    .map((block) => ({
      slug: field(block, 'slug'),
      title: field(block, 'title'),
      startDateTime: field(block, 'startDateTime'),
      endDateTime: field(block, 'endDateTime'),
      displayDate: field(block, 'displayDate'),
      displayTime: field(block, 'displayTime'),
      description: field(block, 'description'),
      audience: field(block, 'audience'),
      builtOn: field(block, 'builtOn'),
      eventbriteUrl: field(block, 'eventbriteUrl'),
    }))
    .filter((s) => s.slug)
}

/** Eventbrite wants UTC as YYYY-MM-DDTHH:MM:SSZ — no milliseconds. */
function toEventbriteUtc(iso) {
  return new Date(iso).toISOString().replace(/\.\d{3}Z$/, 'Z')
}

/** Eventbrite caps the summary at 140 characters. */
function summarize(seminar) {
  const s = `${seminar.description.split('. ')[0]}.`
  return s.length <= 140 ? s : `${s.slice(0, 137).trimEnd()}...`
}

function listingHtml(seminar) {
  return [
    `<p>${seminar.description}</p>`,
    `<p><strong>When:</strong> ${seminar.displayDate}, ${seminar.displayTime}</p>`,
    `<p><strong>Where:</strong> Online via Zoom. The join link is emailed to you after you register.</p>`,
    `<p><strong>Who it's for:</strong> ${seminar.audience}</p>`,
    `<p><strong>Built on:</strong> ${seminar.builtOn}</p>`,
    `<p>Free and open to anyone. Hosted by EcoQuest Foundation, a student-led 501(c)(3) nonprofit (EIN 33-4376241). Full series schedule at <a href="${SITE_EVENTS_URL}">ecoquestfoundation.org/events</a>.</p>`,
  ].join('\n')
}

async function api(token, method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = { raw: text }
  }
  if (!res.ok) {
    const detail = parsed.error_description || parsed.error || text.slice(0, 400)
    throw new Error(`${method} ${path} failed (${res.status}): ${detail}`)
  }
  return parsed
}

async function getOrganization(token) {
  const { organizations } = await api(token, 'GET', '/users/me/organizations/')
  if (!organizations?.length) {
    throw new Error(
      'This Eventbrite account has no organization yet, so there is nothing to create\n' +
        'events under. Eventbrite provisions one the first time you publish an event\n' +
        'through the web UI — the user_id fallback in their docs does not work on a\n' +
        'fresh account (verified: 404).\n\n' +
        'Fix: create and publish the first session by hand at eventbrite.com, setting the\n' +
        'organizer profile to "EcoQuest Foundation" while you are there. Then re-run this\n' +
        'script and it will create the remaining sessions automatically.'
    )
  }
  return organizations[0]
}

/**
 * Description body. Eventbrite's listing description lives behind the structured
 * content endpoint; the older description.html field no longer drives display.
 * Non-fatal — the summary still carries the gist if this shape shifts.
 */
async function setDescription(token, eventId, html, version = 1) {
  await api(token, 'POST', `/events/${eventId}/structured_content/${version}/?purpose=listing`, {
    modules: [{ type: 'text', data: { body: { type: 'text', text: html, alignment: 'left' } } }],
    publish: true,
    purpose: 'listing',
  })
}

/** Eventbrite event IDs are the trailing -tickets-<id> segment of the public URL. */
function eventIdFrom(url) {
  return url.match(/-tickets-(\d+)/)?.[1]
}

/**
 * Rewrites an existing listing from src/data/seminars.ts. The description lives
 * behind a versioned endpoint: post to current + 1 or Eventbrite rejects it.
 */
async function updateOne(token, seminar) {
  const id = eventIdFrom(seminar.eventbriteUrl)
  if (!id) throw new Error(`Could not read an event id out of ${seminar.eventbriteUrl}`)

  await api(token, 'POST', `/events/${id}/`, {
    event: {
      name: { html: `EcoQuest Seminar: ${seminar.title}` },
      summary: summarize(seminar),
    },
  })

  const current = await api(token, 'GET', `/events/${id}/structured_content/?purpose=listing`)
  await setDescription(token, id, listingHtml(seminar), (current.page_version_number ?? 1) + 1)

  return api(token, 'GET', `/events/${id}/`)
}

async function createOne(token, orgId, seminar) {
  const event = await api(token, 'POST', `/organizations/${orgId}/events/`, {
    event: {
      name: { html: `EcoQuest Seminar: ${seminar.title}` },
      summary: summarize(seminar),
      start: { timezone: TIMEZONE, utc: toEventbriteUtc(seminar.startDateTime) },
      end: { timezone: TIMEZONE, utc: toEventbriteUtc(seminar.endDateTime) },
      currency: 'USD',
      online_event: true,
      listed: true,
      shareable: true,
      capacity: CAPACITY,
    },
  })

  await api(token, 'POST', `/events/${event.id}/ticket_classes/`, {
    ticket_class: {
      name: 'Free Registration',
      quantity_total: CAPACITY,
      free: true,
      delivery_methods: ['electronic'],
    },
  })

  try {
    await setDescription(token, event.id, listingHtml(seminar))
  } catch (err) {
    console.log(`    ! description not set (${err.message.slice(0, 120)}) — add it in the UI`)
  }

  await api(token, 'POST', `/events/${event.id}/publish/`)

  return event
}

async function main() {
  const seminars = readSeminars()
  const env = loadEnv()
  const token = env.EVENTBRITE_TOKEN

  console.log(`\nEcoQuest Eventbrite listings — ${seminars.length} sessions read from src/data/seminars.ts\n`)
  for (const s of seminars) {
    const state = s.eventbriteUrl ? 'already listed — will skip' : 'to create'
    console.log(`  ${s.startDateTime.slice(0, 10)}  ${s.title}`)
    console.log(`      ${state}`)
  }

  if (!token) {
    console.error(
      '\nMissing EVENTBRITE_TOKEN. Get a private token at ' +
        'https://www.eventbrite.com/platform/api-keys/ and add it to .env:\n\n' +
        '  EVENTBRITE_TOKEN=your_token_here\n'
    )
    process.exit(1)
  }

  const org = await getOrganization(token)
  console.log(`\nAuthenticated. Organization: ${org.name} (${org.id})\n`)

  if (CHECK_ONLY) {
    console.log('Token and organization look good. Re-run with --create to publish.\n')
    return
  }
  if (DRY_RUN) {
    console.log('Dry run — nothing created. Re-run with --create to publish for real.\n')
    return
  }

  if (UPDATE) {
    const targets = seminars.filter(
      (s) => s.eventbriteUrl && (!ONLY || s.slug === ONLY)
    )
    if (!targets.length) {
      console.error(`Nothing to update${ONLY ? ` — no listed session with slug "${ONLY}"` : ''}.\n`)
      process.exit(1)
    }
    for (const seminar of targets) {
      console.log(`update  ${seminar.slug}`)
      const event = await updateOne(token, seminar)
      console.log(`    name: ${event.name.text}`)
      console.log(`    url : ${event.url}`)
      if (event.url !== seminar.eventbriteUrl) {
        console.log('    ! the public URL changed — update eventbriteUrl in src/data/seminars.ts')
      }
      console.log()
    }
    return
  }

  const created = []
  for (const seminar of seminars) {
    if (seminar.eventbriteUrl) {
      console.log(`skip  ${seminar.title} — already has a listing`)
      continue
    }
    console.log(`create  ${seminar.title}`)
    const event = await createOne(token, org.id, seminar)
    console.log(`    live: ${event.url}\n`)
    created.push({ slug: seminar.slug, url: event.url })
  }

  if (created.length) {
    console.log('\nPaste these into the matching eventbriteUrl fields in src/data/seminars.ts:\n')
    for (const c of created) {
      console.log(`  ${c.slug}\n    eventbriteUrl: '${c.url}',`)
    }
    console.log(
      '\nThen add the Zoom join link to each listing\'s online event page in the\n' +
        'Eventbrite UI, so registrants receive it. Rebuild and redeploy after.\n'
    )
  }
}

main().catch((err) => {
  console.error(`\n${err.message}\n`)
  process.exit(1)
})
