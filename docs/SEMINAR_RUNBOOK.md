# Online Seminar Series — Runbook

Fall 2026 series. Five free sessions, every other Saturday, 11:00–11:40 AM PT.

| # | Date | Topic | Deck |
|---|------|-------|------|
| 1 | Sat Sep 12, 2026 | Reading Real Wildfire Data | `/seminars/wildfire-data/` |
| 2 | Sat Sep 26, 2026 | What a Beach Cleanup Actually Tells Us | `/seminars/beach-cleanup-data/` |
| 3 | Sat Oct 10, 2026 | Your Home's Water and Energy Footprint | `/seminars/home-footprint/` |
| 4 | Sat Oct 24, 2026 | Climate Anxiety and How We Built MindMirror | `/seminars/climate-anxiety/` |
| 5 | Sat Nov 7, 2026 | Conservation in Your Own Neighborhood | `/seminars/local-conservation/` |

All session data lives in **`src/data/seminars.ts`**. That one file drives the
event cards, the schema.org markup, and the deck pages. Slide content lives in
**`src/data/decks.ts`**.

---

## The rule this series runs on

A session moves from "Upcoming" to "Past Sessions" on its own once its end time
has passed. What does **not** happen on its own is any claim about how it went:
attendance, a summary, and a recording appear only because a human typed them
into the `recap` block afterwards. A past session with no recap shows its date,
its title, and a link to its slide deck — and says nothing else.

Do not add attendance numbers, recordings, or summaries for a session you have
not actually held.

**If a session is cancelled, remove it from `src/data/seminars.ts` or move its
date.** Leaving a past-dated entry in place is the site stating it was held.

**The move happens at build time**, because the site is a static export. A
session that finished this morning keeps showing as upcoming until the next
deploy. You will be redeploying anyway to add the recap — but if you are not
writing a recap yet, still redeploy, or the page is out of date.

### Speaker notes are not published

Notes live in `src/data/decks.ts` and are stripped before the deck page renders
them, so they never reach the browser. Hiding them with CSS would not be enough:
a static export serializes whatever is passed to a component into the page
source, where anyone can read it.

To read them while presenting:

```bash
python3 scripts/print-speaker-notes.py                 # list the decks
python3 scripts/print-speaker-notes.py wildfire-data   # one deck, as markdown
```

Pipe it to a file and open it on a second screen. Do not paste notes back onto
the site.

---

## Before session 1 — one-time setup

### 1. Zoom — DONE

One recurring meeting covers the whole series, every other Saturday from Sep 12,
11:00 AM PT.

**The meeting ID, passcode, and join link are deliberately not in this repo.**
This repository is public, so anything committed here is permanently readable by
anyone — including in git history after a later deletion. The link lives in two
places only: the Zoom account, and the attendee page of each Eventbrite listing,
where it reaches people who registered.

On the free (Basic) plan, meetings are capped at **40 minutes** and recording is
**local only** — cloud recording requires a paid plan. Sessions are published as
40 minutes for that reason.

**Settings to fix before the link goes public** (Zoom → Meetings → the series →
Edit → *Edit all occurrences*):
- Turn **off** "Allow participants to join anytime" and turn **on** the
  **Waiting Room**. With a link posted publicly on Eventbrite, join-anytime means
  strangers can sit in the room unsupervised before you arrive.
- Turn **off** participant video on entry, and mute on entry. Attendees can
  unmute for Q&A.

**The join link is deliberately not printed on the website.** The public page
links to Eventbrite; Eventbrite emails the link to people who register. That
gives you a registration list — which is the evidence you need — and keeps the
raw room out of page source where bots scrape it.

### 2. Eventbrite

**Step 1 — publish the first event by hand.** A fresh Eventbrite account has no
organization, and the API cannot create events without one. Eventbrite provisions
it the first time you publish through the web UI. (The user_id fallback in their
docs does not work on a new account — verified, returns 404.)

So create session 1 manually at eventbrite.com: free online event, correct PT
times, free tickets, public. While you are in that flow, set the **organizer
profile** to **EcoQuest Foundation** with a short bio naming the 501(c)(3) status
and the EIN on file (33-4376241), the logo, and the website link. That profile is
what attendees and reviewers see — it starts life as "unnamed organizer", which
is not what you want on a public listing.

After that event is live, the organization exists and the script can create the
rest.

**Step 2 — private token.** Get one at
<https://www.eventbrite.com/platform/api-keys/> and add it to `.env` in the repo
root (gitignored — never commit it):

```
EVENTBRITE_TOKEN=...
```

**Step 3 — run the script.** It reads the sessions out of
`src/data/seminars.ts`, so the listings and the site cannot say different things.

```bash
node scripts/create-eventbrite-events.mjs           # dry run — shows the plan
node scripts/create-eventbrite-events.mjs --check   # verify token + organization
node scripts/create-eventbrite-events.mjs --create  # create and publish all five
```

Each event is created as a free online event with 100 free tickets, given a
description, and published. The script prints the public URLs and skips any
session that already has an `eventbriteUrl`, so it is safe to re-run.

**Step 4 — paste the URLs** into the matching `eventbriteUrl` fields in
`src/data/seminars.ts`, then rebuild and redeploy. Until you do, the Register
buttons fall back to the email form — which works, but produces no public
listing, so do not leave it that way.

**Step 5 — add the Zoom link to each listing's online event page** in the
Eventbrite UI, so registrants receive it after signing up. Do this by hand: it is
the one place the join link belongs, and it should reach registrants only.

Use a **Text block** under "Share additional content" — do **not** use the
"Add Zoom" connector. That integration creates a brand-new Zoom meeting per event
instead of using the one you already scheduled, so you would end up with five
orphan meeting IDs, none carrying the waiting-room settings, none matching the
recurring meeting registrants are expecting. It also fails outright on a free Zoom
account.

**Also set per event, by hand** (the API script does not do these): cover image,
organizer, tags, category, and the Zoom text block. Check the **end time saved as
11:40** — Eventbrite has silently kept 12:00 here before.

**Cover images** are in `docs/eventbrite/` at Eventbrite's 2160 × 1080 — one per
session, plus `ecoquest-series-banner.png` for the organizer profile header and
`logo.png` for the profile picture:

| Session | Cover |
|---|---|
| Sep 12 — Reading Real Wildfire Data | `wildfire-banner.png` |
| Sep 26 — What a Beach Cleanup Actually Tells Us | `beach-cleanup-banner.png` |
| Oct 10 — Your Home's Water and Energy Footprint | `home-footprint-banner.png` |
| Oct 24 — Climate Anxiety and How We Built MindMirror | `climate-anxiety-banner.png` |
| Nov 7 — Conservation in Your Own Neighborhood | `local-conservation-banner.png` |

See the README in that folder for how to re-render them if the schedule changes.

### 3. Verify the search markup
- Deploy, then run `https://www.ecoquestfoundation.org/events/` through
  [Google's Rich Results Test](https://search.google.com/test/rich-results).
- You should see one `Event` item per **upcoming** seminar and campaign — the
  markup only covers events that have not ended yet, so the count drops as dates
  pass (5 on Sep 30, 2026: three sessions plus the two October campaign events).
  **Screenshot the result** — that is dated evidence the events were published
  and machine-discoverable.
- Submit the sitemap in Google Search Console if it is not already submitted.

---

## Scheduling a future series

The Fall 2026 series was scheduled by hand in the Zoom web UI, which is the
recommended way: one recurring meeting, Weekly / repeat every 2 weeks / Saturday
/ end after N occurrences.

`scripts/schedule-zoom-seminars.mjs` does the same thing through the Zoom API if
you ever want to script it. It needs a Server-to-Server OAuth app
(`meeting:write:admin` scope) with its credentials in a gitignored `.env` —
run it with no flags for a dry run, `--create` to schedule. Note that free
Basic accounts often cannot create Server-to-Server apps at all, so the manual
route is the reliable one.

---

## Season 2: Winter Field Lab

Season 2 is a second biweekly online series. Its sign-up form, welcome emails,
and reminders run on a Google Apps Script, not on Eventbrite. The script lives
in `scripts/signup-form/`, and its session list is generated from
`src/data/seminars.ts`, so the form and the site cannot disagree about dates.

**Zoom.** Use one "Recurring meeting — No Fixed Time" in the Zoom web UI, so a
single link works for every date. Use the same waiting room and mute settings as
Season 1. The link goes only into `scripts/signup-form/gas/config.js`. That file
is gitignored and is pushed only to the private Apps Script project.

**The sign-up form (automatic).** The script creates a Google Form and a linked
Google Sheet. When someone signs up, it sends a welcome email with the Zoom link.
At 9 AM Pacific, it sends a reminder two days before each session, and it writes
the session's links into `src/data/seminars.ts` for the site.

One-time steps:

1. Turn on the Apps Script API at https://script.google.com/home/usersettings.
2. Run `cd scripts/signup-form && npx @google/clasp login` as ecoquestfoundation@gmail.com.
3. Run `npx @google/clasp create --type standalone --title "EcoQuest Winter Field Lab sign-up" --rootDir gas`.
4. Copy `scripts/signup-form/config.example.js` to `scripts/signup-form/gas/config.js` and add the Zoom link.
5. Run `npm run signup:push`.
6. In the script editor, run `setup` once and approve the permissions.
7. Run `npx @google/clasp deploy`, and save the web app URL to `scripts/signup-form/.webapp-url`.
8. Run `npm run signup:sync`, then commit `seminars.ts`.

**When sessions change:** edit `seminars.ts`, run `npm run signup:push`, run
`setup` again in the editor (or wait; nothing else is needed for date text), then
run `npm run signup:sync`.

**Checking it ran:** look at the script editor's Executions page, and at the
Sent folder of ecoquestfoundation@gmail.com.

**Limits.** Reminders go out in BCC batches of up to 49 recipients, which is the
free Gmail per-message limit. The daily send limit is about 100 recipients, and
it is shared with welcome emails. If a send would exceed the quota, the run logs
a warning. If the quota is short or a send fails, the run retries the next day,
still before the session. Batches that were already sent are never resent.

**Good to know:**
- Reminders match sign-ups by the session's choice text on the form. If you
  change a session's title or date after people have signed up, those earlier
  sign-ups won't match and won't get a reminder. Email them yourself from the Sheet.
- Someone who signs up after the reminder has gone out still gets the welcome
  email with the link.
- If the form is ever deleted or the stored form ID is lost, delete the old
  `onSignup` trigger in the script editor's Triggers page before running `setup`
  again, so the new form gets its own trigger.
- `config.js`, `.clasp.json`, and `.webapp-url` are gitignored. Never commit
  them, and never paste the Zoom link into the repo or the site.

**Distribution (no Eventbrite).** Season 2's outside proof comes from:
- the city and library calendar submissions (once per series);
- newsletter archive URLs;
- social posts.

When a calendar publishes a session, add `listing: { name, url }` to that
session in `seminars.ts`. Don't post seminars on Idealist or JustServe (see that
section above).

**Attendance record.** The linked Google Sheet, exported at the end of the
season for the Congressional Award file.

---

## Distribution — do this for every session, ~2 weeks ahead

The test that matters: **could a stranger who has never heard of EcoQuest have
found this event in advance, through a channel EcoQuest does not control?**
Your own website does not satisfy that on its own. These do.

**Every session:**
- [ ] Eventbrite listing live (this is the canonical public record)
- [ ] Posted to Instagram and/or LinkedIn — once ~2 weeks out, once ~2 days out
- [ ] Newsletter announcement sent. Use Mailchimp or Buttondown, both of which
      publish a **public archive URL per issue** — save that URL, it is your dated
      proof of announcement
- [ ] Nextdoor post (free for nonprofits, local reach)

**Once per series, not per session:**
- [ ] Submitted to city community calendars: Cerritos, Artesia, Chino parks & rec
- [ ] Submitted to the local public library community calendar
- [ ] Emailed to school counselors and science teachers at nearby middle schools

A **city or library calendar listing is the strongest single signal on this list**,
because a municipality reviewed and published it. Those submissions usually take
one form and about ten minutes. Do them.

### Idealist (formerly VolunteerMatch) and JustServe

Both platforms list **volunteer opportunities and service projects** — work
someone comes to *do*. A seminar people attend to learn is not that, so do not
post the sessions there as if they were. Wrong category, likely rejected, and it
misrepresents what the thing is.

Use them for the **cleanups**, which are unambiguous volunteer service, and for
any *genuine* volunteer role on the series — a session moderator, tech help,
outreach — but only if the role is real and someone will actually be given it.
Posting a role that does not exist to earn a listing is fabrication.

Note: **volunteermatch.org now redirects to idealist.org** — the two merged in
early 2025 and VolunteerMatch is no longer a separate platform.

JustServe requires nonprofit verification (an IRS determination letter) before an
organization can post, and every project is reviewed by the nearest local
JustServe specialist before it goes live. Its guidelines bar fundraising,
political or advocacy activity, and religious instruction; they do not address
educational or online projects either way, so whether the seminar series itself
qualifies is the local specialist's call — worth asking rather than assuming.

---

## Running a session

1. Open all data sources in tabs **before** you start. Do not search live.
2. Start the local recording (free plan records to your own machine).
3. Open the deck at `/seminars/<slug>/` and press **F** to present full-screen,
   then share that browser tab in Zoom. The deck page carries no speaker notes —
   print them first with `python3 scripts/print-speaker-notes.py <slug>` and keep
   them on a second screen or on paper.
4. Note the **peak attendee count** — you need the real number for the recap.
5. Save the chat log before ending the meeting.

---

## After a session — within 48 hours

1. Prepare and upload the recording (see **Recordings** below for the one-time
   bucket setup). Name it after the session slug:

```bash
SLUG=wildfire-data
# Move the index to the front so playback starts before the whole file arrives.
ffmpeg -i ~/Downloads/<zoom-file>.mp4 -c copy -movflags +faststart /tmp/$SLUG.mp4
# Poster: a still of the title slide, shown until the visitor presses play.
ffmpeg -ss 3 -i /tmp/$SLUG.mp4 -frames:v 1 -vf scale=1280:-2 -c:v libwebp -quality 80 \
  public/images/seminars/$SLUG.webp
# Real duration in seconds, for the thumbnail badge.
ffprobe -v error -show_entries format=duration -of csv=p=0 /tmp/$SLUG.mp4
gcloud storage cp /tmp/$SLUG.mp4 gs://ecoquest-seminar-recordings/$SLUG.mp4 \
  --cache-control="public, max-age=31536000" \
  --content-disposition="attachment; filename=EcoQuest-$SLUG.mp4"
```

2. Add a `recap` block to that seminar in `src/data/seminars.ts`:

```ts
recap: {
  attendees: 14,
  recording: {
    file: 'wildfire-data.mp4',
    durationSeconds: 377,
    poster: '/images/seminars/wildfire-data.webp',
  },
  summary: 'Covered where public fire and air-quality data comes from and what containment percentage actually measures. Most questions were about AQI apps disagreeing with each other.',
},
```

Every field is optional. If the turnout was small and you would rather not
print the number, leave `attendees` out — an omitted number says nothing, an
invented one is a lie. If there is no recording, leave `recording` out; the
slide deck link stands on its own. Without a `summary` the card shows the
session's published description instead.

3. Rebuild and redeploy. The session is already in "Past Sessions" by date; the
   redeploy is what puts the recap on it.
4. Post a short recap to social with one screenshot from the session.

---

## Recordings

The MP4s are **not** in this repo — video would sit in git history forever. They
live in a public Google Cloud Storage bucket, `gs://ecoquest-seminar-recordings`,
and the site points at it through `RECORDINGS_BASE_URL` in
`src/data/seminars.ts`. The Past Sessions card shows a poster with a play
button; the video only downloads when someone presses play, so the bucket only
bills for actual viewing.

One-time bucket setup:

```bash
gcloud storage buckets create gs://ecoquest-seminar-recordings \
  --location=us-west2 --uniform-bucket-level-access
gcloud storage buckets add-iam-policy-binding gs://ecoquest-seminar-recordings \
  --member=allUsers --role=roles/storage.objectViewer
```

Cost at this size is pennies: storage is about $0.02/GB/month (the whole series
is under 0.1 GB) and egress is about $0.12/GB, so a 15 MB recording watched to
the end 100 times costs roughly $0.18. If viewing ever grows into tens of GB a
month, move the files to Cloudflare R2 (no egress fees) and change only
`RECORDINGS_BASE_URL`.

---

## What to keep for the Congressional Award

Keep these per session in one folder. Together they turn a self-reported hour
count into a corroborated one:

- Eventbrite registration list (export it)
- Attendance count from Zoom
- The recording link (and the original Zoom file — keep it off the bucket)
- The deck URL
- Newsletter archive URL for the announcement
- Prep time, logged honestly and separately from delivery time
- Winter Field Lab sign-up sheet (Google Sheet export)

**On double-counting:** hours generally count once, toward one program. Cleanups
run jointly with a Scout troop are noted as co-hosted on the Events page for
exactly this reason. This seminar series is unambiguously EcoQuest's own work,
which is what makes it clean to log here.

**Co-hosted is not the same as volunteer-supported.** From the October 2026
campaign on, a Scout troop may help distribute flyers and supply volunteers, but
EcoQuest organizes and runs the event. That is recorded in the `supportedBy`
field in `src/data/campaigns.ts` ("with volunteer support from a local Scout
troop"), not as a co-host, and the schema.org `organizer` stays EcoQuest alone. A
volunteer-supported event does not split whose program the hours belong to; a
co-hosted one does. Only use `coHosted` (on past timeline entries) when the troop
genuinely ran the event jointly, and only fill in `supportedBy` once the group
has agreed to be named. Note that Scout flyer distribution is outreach — it does
not satisfy the reachability test above.
