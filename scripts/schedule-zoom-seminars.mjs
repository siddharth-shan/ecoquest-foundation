#!/usr/bin/env node
/**
 * Schedules the EcoQuest online seminar series in Zoom and prints the join links
 * to paste into src/data/seminars.ts.
 *
 * Requires a Zoom Server-to-Server OAuth app. Put its credentials in .env
 * (already gitignored — never commit them):
 *
 *   ZOOM_ACCOUNT_ID=...
 *   ZOOM_CLIENT_ID=...
 *   ZOOM_CLIENT_SECRET=...
 *
 * Usage:
 *   node scripts/schedule-zoom-seminars.mjs            # dry run, shows the plan
 *   node scripts/schedule-zoom-seminars.mjs --create    # one recurring meeting (recommended)
 *   node scripts/schedule-zoom-seminars.mjs --create --separate   # five standalone meetings
 */

import { readFileSync } from 'node:fs'

const DRY_RUN = !process.argv.includes('--create')
const SEPARATE = process.argv.includes('--separate')

// Zoom Basic caps meetings at 40 minutes. Keep this at 40 unless the account is paid.
const DURATION_MINUTES = 40
const TIMEZONE = 'America/Los_Angeles'

// Must stay in sync with src/data/seminars.ts.
const SESSIONS = [
  { date: '2026-09-12', title: 'Reading Real Wildfire Data' },
  { date: '2026-09-26', title: 'What a Beach Cleanup Actually Tells Us' },
  { date: '2026-10-10', title: "Your Home's Water and Energy Footprint" },
  { date: '2026-10-24', title: 'Climate Anxiety and How We Built MindMirror' },
  { date: '2026-11-07', title: 'Conservation in Your Own Neighborhood' },
]

const START_TIME = '11:00:00'

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

async function getAccessToken({ accountId, clientId, clientSecret }) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
    { method: 'POST', headers: { Authorization: `Basic ${basic}` } }
  )
  const body = await res.json()
  if (!res.ok) {
    throw new Error(`Zoom token request failed (${res.status}): ${JSON.stringify(body)}`)
  }
  return body.access_token
}

async function createMeeting(token, payload) {
  const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.json()
  if (!res.ok) {
    throw new Error(`Create meeting failed (${res.status}): ${JSON.stringify(body)}`)
  }
  return body
}

/** Shared settings. auto_recording is 'local' because cloud recording needs a paid plan. */
const SETTINGS = {
  host_video: true,
  participant_video: false,
  join_before_host: false,
  waiting_room: true,
  mute_upon_entry: true,
  auto_recording: 'local',
  approval_type: 2, // no registration required — Eventbrite handles signups
  audio: 'both',
}

function recurringPayload() {
  return {
    topic: 'EcoQuest Online Seminar Series',
    type: 8, // recurring meeting with a fixed time
    start_time: `${SESSIONS[0].date}T${START_TIME}`,
    duration: DURATION_MINUTES,
    timezone: TIMEZONE,
    agenda:
      'Free 40-minute environmental seminars from EcoQuest Foundation, every other Saturday. See ecoquestfoundation.org/events/ for each session topic.',
    settings: SETTINGS,
    recurrence: {
      type: 2, // weekly
      repeat_interval: 2, // every other week
      weekly_days: '7', // Saturday
      end_times: SESSIONS.length,
    },
  }
}

function singlePayload(session) {
  return {
    topic: `EcoQuest Seminar: ${session.title}`,
    type: 2, // scheduled, one-off
    start_time: `${session.date}T${START_TIME}`,
    duration: DURATION_MINUTES,
    timezone: TIMEZONE,
    agenda: `${session.title} — part of the EcoQuest Online Seminar Series. ecoquestfoundation.org/events/`,
    settings: SETTINGS,
  }
}

async function main() {
  console.log(
    `\nEcoQuest seminar scheduling — ${SEPARATE ? 'five standalone meetings' : 'one recurring meeting'}` +
      `, ${DURATION_MINUTES} min each, ${TIMEZONE}\n`
  )
  for (const s of SESSIONS) {
    console.log(`  ${s.date}  ${START_TIME}  ${s.title}`)
  }

  if (DRY_RUN) {
    console.log('\nDry run — nothing created. Re-run with --create to schedule for real.\n')
    return
  }

  const env = loadEnv()
  const creds = {
    accountId: env.ZOOM_ACCOUNT_ID,
    clientId: env.ZOOM_CLIENT_ID,
    clientSecret: env.ZOOM_CLIENT_SECRET,
  }
  const missing = Object.entries(creds)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length) {
    console.error(`\nMissing credentials: ${missing.join(', ')}. Add them to .env — see the header of this file.\n`)
    process.exit(1)
  }

  const token = await getAccessToken(creds)
  console.log('\nAuthenticated with Zoom.\n')

  if (SEPARATE) {
    for (const session of SESSIONS) {
      const meeting = await createMeeting(token, singlePayload(session))
      console.log(`${session.date}  ${session.title}`)
      console.log(`  join_url: ${meeting.join_url}\n`)
    }
    console.log('Add each join_url to the matching Eventbrite listing\'s attendee page.\n')
  } else {
    const meeting = await createMeeting(token, recurringPayload())
    console.log(`Created recurring meeting ${meeting.id}`)
    console.log(`  join_url: ${meeting.join_url}\n`)
    if (meeting.occurrences?.length) {
      console.log('Occurrences:')
      for (const o of meeting.occurrences) console.log(`  ${o.start_time}`)
      console.log()
    }
    console.log('This one link covers every session. Add it to all five Eventbrite listings.\n' +
      'Do not commit it — this repo is public.\n')
  }
}

main().catch((err) => {
  console.error(`\n${err.message}\n`)
  process.exit(1)
})
