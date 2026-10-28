// Pure helpers for the Winter Field Lab sign-up form. No Apps Script globals
// here, so the same file runs in Apps Script and in the vitest suite.

var PACIFIC = 'America/Los_Angeles'

/** 'YYYY-MM-DD' on the Pacific calendar. */
function pacificDay(ms) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PACIFIC }).format(ms)
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

/** Sessions whose Pacific start date is exactly `days` Pacific days after `nowMs`. */
function dueForReminder(sessions, nowMs, days) {
  var today = pacificDay(nowMs)
  return sessions.filter(function (s) {
    return daysBetween(today, pacificDay(Date.parse(s.startDateTime))) === days
  })
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
      "\n\nWe'll email a reminder two days before each one." + FOOTER,
  }
}

function reminderEmail(s, joinUrl) {
  return {
    subject: 'Reminder: ' + s.title + ' — ' + s.displayDate + ', ' + s.displayTime,
    body: 'See you soon!\n\n' + sessionLine(s) + '\n\nJoin on Zoom:\n' + joinUrl + FOOTER,
  }
}
