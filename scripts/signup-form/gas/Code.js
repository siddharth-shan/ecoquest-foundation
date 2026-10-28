// EcoQuest Winter Field Lab sign-up form. Runs in the ecoquestfoundation@gmail.com
// Apps Script project. Globals from other files: SESSIONS (sessions.js, generated),
// CONFIG (config.js, private), helpers (lib.js).
//
// setup() is safe to re-run: it reuses the stored form, re-syncs the session
// choices and confirmation message, and installs each trigger only once.

var FORM_TITLE = 'EcoQuest Winter Field Lab — Sign up'
var Q_SESSIONS = 'Which sessions would you like to join?'
var Q_NAME = 'Your name'
var Q_EMAIL = "Email (a parent's or guardian's if you're under 13)"
var Q_GRADE = 'Grade'
var Q_CONSENT = 'Permission'

function props() {
  return PropertiesService.getScriptProperties()
}

function getForm() {
  var id = props().getProperty('formId')
  return id ? FormApp.openById(id) : null
}

function itemByTitle(form, title) {
  var items = form.getItems()
  for (var i = 0; i < items.length; i++) if (items[i].getTitle() === title) return items[i]
  return null
}

function setup() {
  var form = getForm()
  if (!form) {
    form = FormApp.create(FORM_TITLE)
    var ss = SpreadsheetApp.create('EcoQuest Winter Field Lab — Sign-ups')
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())
    form.addCheckboxItem().setTitle(Q_SESSIONS).setRequired(true)
    form.addTextItem().setTitle(Q_NAME).setRequired(true)
    form.addTextItem()
      .setTitle(Q_EMAIL)
      .setRequired(true)
      .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    form.addListItem().setTitle(Q_GRADE).setRequired(true)
      .setChoiceValues(['K–5', '6–8', '9–12', 'College', 'Parent, educator, or other adult'])
    form.addCheckboxItem().setTitle(Q_CONSENT).setRequired(true)
      .setChoiceValues(["I'm 13 or older, or my parent or guardian says I can join and the email above is theirs."])
    props().setProperty('formId', form.getId())
  }

  form.setDescription(
    'Free 30-minute online sessions on Zoom, every other Saturday at 11:00 AM Pacific. ' +
    "We'll email you the Zoom link right away and a reminder two days before each session. " +
    'Run by EcoQuest Foundation, a 501(c)(3) nonprofit.')
  form.setPublishingSummary(false)
  form.setAllowResponseEdits(false)
  form.setCollectEmail(false)
  // Never put the Zoom link here: Google embeds the confirmation message in the
  // public form's page source, so anyone could read it without signing up.
  form.setConfirmationMessage(
    "You're signed up! We've emailed the Zoom link to the address you gave, from " +
    CONFIG.replyTo + ". If it isn't in your inbox in a few minutes, check spam.")

  var upcoming = SESSIONS.filter(function (s) { return Date.parse(s.endDateTime) > Date.now() })
  var sessionsItem = itemByTitle(form, Q_SESSIONS).asCheckboxItem()
  sessionsItem.setChoiceValues(upcoming.map(choiceLabel))
  form.setAcceptingResponses(upcoming.length > 0)

  var links = {}
  upcoming.forEach(function (s) {
    links[s.slug] = form.createResponse()
      .withItemResponse(sessionsItem.createResponse([choiceLabel(s)]))
      .toPrefilledUrl()
  })
  props().setProperty('links', JSON.stringify({ formUrl: form.getPublishedUrl(), sessions: links }))

  ensureTrigger('onSignup', function () {
    ScriptApp.newTrigger('onSignup').forForm(form).onFormSubmit().create()
  })
  ensureTrigger('sendReminders', function () {
    ScriptApp.newTrigger('sendReminders').timeBased().everyDays(1).atHour(9).inTimezone(PACIFIC).create()
  })
  Logger.log(props().getProperty('links'))
}

function ensureTrigger(fn, create) {
  var exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === fn })
  if (!exists) create()
}

/** Reads one response into { email, sessions } using the question titles. */
function rowOf(response) {
  var row = { email: '', sessions: [] }
  response.getItemResponses().forEach(function (ir) {
    var t = ir.getItem().getTitle()
    if (t === Q_EMAIL) row.email = ir.getResponse()
    if (t === Q_SESSIONS) row.sessions = ir.getResponse()
  })
  return row
}

function onSignup(e) {
  var row = rowOf(e.response)
  var picked = SESSIONS.filter(function (s) { return row.sessions.indexOf(choiceLabel(s)) !== -1 })
  var to = recipientsFor([row], row.sessions[0] || '')
  if (!to.length || !picked.length) return
  var mail = welcomeEmail(picked, CONFIG.zoomJoinUrl)
  MailApp.sendEmail({ to: to[0], replyTo: CONFIG.replyTo, name: 'EcoQuest Foundation', subject: mail.subject, body: mail.body })
}

var BCC_MAX = 49 // consumer Gmail allows about 50 recipients per message

function sendReminders() {
  var lock = LockService.getScriptLock()
  if (!lock.tryLock(30000)) return
  try {
    var form = getForm()
    if (!form) return
    var rows = form.getResponses().map(rowOf)
    dueForReminder(SESSIONS, Date.now(), 2).forEach(function (s) {
      try {
        remindSession(s, rows)
      } catch (err) {
        Logger.log('Reminder failed for ' + s.slug + ': ' + err)
      }
    })
  } finally {
    lock.releaseLock()
  }
}

/** Sends one session's reminder in BCC chunks; progress is stored per chunk so a retry never resends. */
function remindSession(s, rows) {
  var doneKey = 'reminded:' + s.slug
  if (props().getProperty(doneKey)) return
  var chunks = chunk(recipientsFor(rows, choiceLabel(s)), BCC_MAX)
  var pending = []
  chunks.forEach(function (list, i) {
    if (!props().getProperty(doneKey + ':' + i)) pending.push({ i: i, list: list })
  })
  if (pending.length) {
    var needed = pending.reduce(function (n, c) { return n + c.list.length + 1 }, 0)
    if (needed > MailApp.getRemainingDailyQuota()) {
      Logger.log('Daily email quota too low for ' + s.slug + ' (' + needed + ' needed); will retry at the next daily run.')
      return
    }
    var mail = reminderEmail(s, CONFIG.zoomJoinUrl)
    pending.forEach(function (c) {
      MailApp.sendEmail({ to: CONFIG.replyTo, bcc: c.list.join(','), replyTo: CONFIG.replyTo, name: 'EcoQuest Foundation', subject: mail.subject, body: mail.body })
      props().setProperty(doneKey + ':' + c.i, new Date().toISOString())
    })
  }
  props().setProperty(doneKey, pending.length ? new Date().toISOString() : 'none')
}

/** Public JSON of the form links (they are public anyway). Never includes the Zoom link. */
function doGet() {
  return ContentService.createTextOutput(props().getProperty('links') || '{}')
    .setMimeType(ContentService.MimeType.JSON)
}
