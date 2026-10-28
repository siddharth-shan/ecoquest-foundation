// Pure helpers for the Winter Field Lab sign-up form. No Apps Script globals
// here, so the same file runs in Apps Script and in the vitest suite.

var PACIFIC = 'America/Los_Angeles'

/** 'YYYY-MM-DD' on the Pacific calendar. */
function pacificDay(ms) {
  var parts = {}
  new Intl.DateTimeFormat('en-US', { timeZone: PACIFIC, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(ms)
    .forEach(function (p) { parts[p.type] = p.value })
  return parts.year + '-' + parts.month + '-' + parts.day
}

/** Whole days between two 'YYYY-MM-DD' strings. Noon UTC sidesteps DST. */
function daysBetween(a, b) {
  return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 86400000)
}

/** The checkbox text for a session. Responses store this text, so it is the join key. */
function choiceLabel(s) {
  var d = new Date(s.startDateTime)
  var day = new Intl.DateTimeFormat('en-US', { timeZone: PACIFIC, weekday: 'short', month: 'short', day: 'numeric' }).format(d)
  return day + ' · ' + s.title
}

/**
 * Sessions starting 1..`days` Pacific days from `nowMs`. The window (not just
 * exactly `days`) lets a run that was skipped, e.g. for low email quota, catch
 * up the next day. The caller tracks which reminders were already sent.
 */
function dueForReminder(sessions, nowMs, days) {
  var today = pacificDay(nowMs)
  return sessions.filter(function (s) {
    var until = daysBetween(today, pacificDay(Date.parse(s.startDateTime)))
    return until > 0 && until <= days
  })
}

/** Sessions that have not ended yet. These are the form's checkbox choices. */
function upcomingSessions(sessions, nowMs) {
  return sessions.filter(function (s) { return Date.parse(s.endDateTime) > nowMs })
}

/** Adds a pending welcome (recipient + session slugs), merging repeats for the same address. */
function addPendingWelcome(list, to, slugs) {
  var out = list.map(function (p) { return { to: p.to, slugs: p.slugs.slice() } })
  var addr = String(to).trim().toLowerCase()
  for (var i = 0; i < out.length; i++) {
    if (out[i].to === addr) {
      slugs.forEach(function (sl) { if (out[i].slugs.indexOf(sl) === -1) out[i].slugs.push(sl) })
      return out
    }
  }
  out.push({ to: addr, slugs: slugs.slice() })
  return out
}

/** Splits a list into consecutive groups of at most `size`. */
function chunk(list, size) {
  var out = []
  for (var i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

/** Unique valid emails of everyone who picked `label`. */
function recipientsFor(rows, label) {
  var seen = {}
  var out = []
  rows.forEach(function (r) {
    var email = String(r.email || '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    if (r.sessions.indexOf(label) === -1 || seen[email]) return
    seen[email] = true
    out.push(email)
  })
  return out
}

function sessionLine(s) {
  return '• ' + s.title + ' — ' + s.displayDate + ', ' + s.displayTime
}

var FOOTER =
  '\n\nThe session opens in a Zoom waiting room; we let people in at 11:00. ' +
  'Please do not share this link publicly.\n\n— EcoQuest Foundation\nhttps://www.ecoquestfoundation.org/events/'

function welcomeEmail(sessions, joinUrl) {
  return {
    subject: "You're signed up — EcoQuest Winter Field Lab",
    body:
      'Thanks for signing up! You picked:\n\n' + sessions.map(sessionLine).join('\n') +
      '\n\nJoin on Zoom (same link for every session):\n' + joinUrl +
      "\n\nWe'll email a reminder two days before each one." + FOOTER +
      "\n\nIf you didn't sign up, or want to be removed, reply to this email.",
  }
}

function reminderEmail(s, joinUrl) {
  return {
    subject: 'Reminder: ' + s.title + ' — ' + s.displayDate + ', ' + s.displayTime,
    body: 'See you soon!\n\n' + sessionLine(s) + '\n\nJoin on Zoom:\n' + joinUrl + FOOTER,
  }
}
