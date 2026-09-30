// Hourly air-pollution data for the player's own ZIP, and the forensics on top
// of it that Air Detective is built from.
//
// WHAT THIS DATA IS. Open-Meteo's air-quality endpoint serves the Copernicus
// CAMS *model reanalysis* — a physics model of the atmosphere constrained by
// satellite and ground observations, sampled at the player's coordinates. It is
// not a reading from a monitor at the end of their street. That distinction is
// stated on the page, not buried here, and the game links out to AirNow so a
// student can find the nearest real regulatory monitor.
//
// WHAT WE ARE THEREFORE ALLOWED TO SAY. A model reanalysis can support claims
// about *pattern*: which pollutant moved, at what hour, in what season, at what
// temperature. It cannot support claims about *cause* for an arbitrary spike —
// nothing in the data names what burned or what drove past. So every case this
// module emits is classified by its pattern, and the one place a specific named
// event appears is the hand-curated list at the bottom of this file, each entry
// of which was checked against the public record. If a spike is not on that
// list, the game says "a smoke or plume event" and stops there.

import { fetchJson, type Result } from './client'
import { DEMO_PLACE, type Place } from '../place'
import {
  fixtureCorrelation,
  fixtureWindows,
  type FixtureWindow,
} from '../fixtures/airDetective'

const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive'

/**
 * CAMS reanalysis trails real time. Ending the survey a few days back avoids a
 * ragged tail of nulls that would look like missing data to a student.
 */
const LAG_DAYS = 3
const SURVEY_DAYS = 365

/** Days of context either side of the day under investigation. */
export const WINDOW_RADIUS = 3

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Suspect =
  | 'smoke'
  | 'traffic'
  | 'ozone'
  | 'inversion'
  | 'dust'
  | 'clean'
  | 'unknown'

export interface SuspectInfo {
  id: Suspect
  /** What the player picks off the lineup. Describes a pattern, not a culprit. */
  label: string
  /** The fingerprint, in one line, so the choice is learnable rather than a guess. */
  tell: string
}

/**
 * The lineup. Wording matters here: "smoke or plume" rather than "wildfire",
 * because a sustained PM2.5 cloud in a December dataset may be wood smoke,
 * agricultural burning or regional transport, and the data cannot tell them
 * apart. Over-naming is the exact failure mode this game exists to teach against.
 */
export const SUSPECTS: SuspectInfo[] = [
  {
    id: 'smoke',
    label: 'Smoke or plume',
    tell: 'PM2.5 several times above normal, high all day and all night, holding for days, then dropping away.',
  },
  {
    id: 'ozone',
    label: 'Heat and sunlight (ozone)',
    tell: 'Ozone climbs through the morning, peaks mid-afternoon, collapses after dark. PM2.5 barely moves.',
  },
  {
    id: 'inversion',
    label: 'Cool-season inversion',
    tell: 'PM2.5 piles up overnight and before dawn, clears by afternoon. Night-time ozone near zero. Winter.',
  },
  {
    id: 'traffic',
    label: 'Traffic hours',
    tell: 'Two PM2.5 humps, morning and evening commute, with a quiet middle of the day.',
  },
  {
    id: 'dust',
    label: 'Dust or blowing soil',
    tell: 'Coarse particles (PM10) jump far more than fine ones (PM2.5), and the model’s dust field lights up.',
  },
  {
    id: 'clean',
    label: 'Just a clean day',
    tell: 'Nothing above background. Low PM2.5, low ozone, no rhythm worth explaining.',
  },
  {
    id: 'unknown',
    label: 'Not enough evidence',
    tell: 'Something moved, but the fingerprints fit more than one story. Saying so is the right answer.',
  },
]

export function suspectInfo(id: Suspect): SuspectInfo {
  return SUSPECTS.find((s) => s.id === id) ?? SUSPECTS[SUSPECTS.length - 1]
}

export interface DaySummary {
  /** YYYY-MM-DD, local to the player's location. */
  date: string
  /** 24 hourly PM2.5 values, index 0 = midnight local. */
  pm25: number[]
  /** 24 hourly ozone values, index 0 = midnight local. */
  ozone: number[]
  pm25Max: number
  pm25Mean: number
  pm25PeakHour: number
  ozoneMax: number
  ozonePeakHour: number
  pm10Max: number
  dustMax: number
  tempMaxF: number | null
}

export interface CaseFeatures {
  /** 1-12, from the focus date. */
  month: number
  pm25Max: number
  /** Median daily-max PM2.5 over the seven days ending four days earlier. */
  pm25Baseline: number
  /** pm25Max divided by the baseline. The headline "how unusual is this?". */
  ratio: number
  /** Days in [focus, focus+3] whose PM2.5 max is at least twice baseline. */
  sustainedDays: number
  /** Mean PM2.5 00h-07h over mean PM2.5 12h-17h. High = trapped overnight. */
  overnightRatio: number
  /** Mean PM2.5 06h-09h over mean 12h-15h. */
  morningRatio: number
  /** Mean PM2.5 17h-20h over mean 12h-15h. */
  eveningRatio: number
  ozoneMax: number
  ozonePeakHour: number
  /** Mean ozone 21h-04h. Near zero means fresh traffic exhaust is eating it. */
  ozoneNightMean: number
  pm10Max: number
  /** pm10Max over pm25Max. Above ~2.5 means the particles are coarse. */
  coarseRatio: number
  dustMax: number
  tempMaxF: number | null
}

export interface AirCase {
  id: string
  /** What the pattern says. For 'unknown' the honest answer IS 'unknown'. */
  suspect: Suspect
  /** Index into `days` of the day under investigation. */
  focusIndex: number
  focusDate: string
  /** The focus day plus up to WINDOW_RADIUS days either side. */
  days: DaySummary[]
  features: CaseFeatures
  /** Only ever set from the hand-checked list below. Usually null. */
  curated: CuratedEvent | null
}

export interface CorrelationSeries {
  startDate: string
  endDate: string
  tempMaxF: number[]
  ozoneMax: number[]
  pm25Max: number[]
}

export interface AirDossier {
  days: DaySummary[]
  correlation: CorrelationSeries | null
  /** 'live' = this player's own ZIP. 'fixture' = disclosed Cerritos sample. */
  source: 'live' | 'fixture'
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

interface AirResponse {
  hourly?: {
    time?: string[]
    pm2_5?: (number | null)[]
    pm10?: (number | null)[]
    ozone?: (number | null)[]
    dust?: (number | null)[]
  }
}

interface ArchiveResponse {
  daily?: {
    time?: string[]
    temperature_2m_max?: (number | null)[]
  }
}

function isoDay(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
    d.getUTCDate()
  ).padStart(2, '0')}`
}

/** The survey range: one year of hourly data, ending a few days back. */
export function surveyRange(today: Date = new Date()): { start: string; end: string } {
  const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
  end.setUTCDate(end.getUTCDate() - LAG_DAYS)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (SURVEY_DAYS - 1))
  return { start: isoDay(start), end: isoDay(end) }
}

/**
 * One year of hourly PM2.5, PM10, ozone and dust plus daily maximum
 * temperature, both at the player's coordinates. `timezone=auto` matters more
 * than it looks: every "time of day" conclusion in this game is only true in
 * local hours, and Open-Meteo will happily hand back UTC if you let it.
 */
export async function fetchAirDossier(
  place: Place,
  signal?: AbortSignal
): Promise<Result<AirDossier>> {
  const { start, end } = surveyRange()
  const coords = `latitude=${place.lat}&longitude=${place.lon}`
  const range = `start_date=${start}&end_date=${end}&timezone=auto`

  const air = await fetchJson<AirResponse>(
    `${AIR_URL}?${coords}&hourly=pm2_5,pm10,ozone,dust&${range}`,
    { signal, timeoutMs: 12000 }
  )
  if (!air.ok) return air

  const hourly = air.data?.hourly
  if (!hourly?.time?.length || !hourly.pm2_5 || !hourly.ozone) {
    return { ok: false, reason: 'empty', message: 'No air-quality data for this location.' }
  }

  // Temperature is a separate service, and a nice-to-have: without it the
  // correlation round is skipped rather than the whole game failing.
  const arch = await fetchJson<ArchiveResponse>(
    `${ARCHIVE_URL}?${coords}&daily=temperature_2m_max&temperature_unit=fahrenheit&${range}`,
    { signal, timeoutMs: 12000 }
  )
  const temps = new Map<string, number>()
  if (arch.ok && arch.data?.daily?.time && arch.data.daily.temperature_2m_max) {
    const { time, temperature_2m_max: tmax } = arch.data.daily
    time.forEach((d, i) => {
      const v = tmax[i]
      if (typeof v === 'number' && Number.isFinite(v)) temps.set(d, v)
    })
  }

  const days = buildDays(
    hourly.time,
    hourly.pm2_5,
    hourly.pm10 ?? [],
    hourly.ozone,
    hourly.dust ?? [],
    temps
  )

  if (days.length < 60) {
    return {
      ok: false,
      reason: 'empty',
      message: 'This location only returned a few complete days of air data.',
    }
  }

  return { ok: true, data: { days, correlation: buildCorrelation(days), source: 'live' } }
}

/**
 * Fold the hourly arrays into complete local days. A day with any missing hour
 * is dropped outright: a diurnal-rhythm game that silently interpolates over a
 * gap is teaching a shape the atmosphere did not make.
 */
export function buildDays(
  time: string[],
  pm25: (number | null)[],
  pm10: (number | null)[],
  ozone: (number | null)[],
  dust: (number | null)[],
  temps: Map<string, number>
): DaySummary[] {
  interface Bucket {
    pm25: (number | null)[]
    ozone: (number | null)[]
    pm10: (number | null)[]
    dust: (number | null)[]
  }
  const buckets = new Map<string, Bucket>()

  for (let i = 0; i < time.length; i++) {
    const stamp = time[i]
    if (typeof stamp !== 'string' || stamp.length < 13) continue
    const date = stamp.slice(0, 10)
    const hour = Number(stamp.slice(11, 13))
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) continue

    let b = buckets.get(date)
    if (!b) {
      b = {
        pm25: new Array<number | null>(24).fill(null),
        ozone: new Array<number | null>(24).fill(null),
        pm10: new Array<number | null>(24).fill(null),
        dust: new Array<number | null>(24).fill(null),
      }
      buckets.set(date, b)
    }
    b.pm25[hour] = num(pm25[i])
    b.ozone[hour] = num(ozone[i])
    b.pm10[hour] = num(pm10[i])
    b.dust[hour] = num(dust[i])
  }

  const out: DaySummary[] = []
  for (const date of Array.from(buckets.keys()).sort()) {
    const b = buckets.get(date)!
    if (b.pm25.some((v) => v === null) || b.ozone.some((v) => v === null)) continue
    const p = b.pm25 as number[]
    const o = b.ozone as number[]
    out.push({
      date,
      pm25: p,
      ozone: o,
      pm25Max: Math.max(...p),
      pm25Mean: mean(p),
      pm25PeakHour: argMax(p),
      ozoneMax: Math.max(...o),
      ozonePeakHour: argMax(o),
      pm10Max: maxOrZero(b.pm10),
      dustMax: maxOrZero(b.dust),
      tempMaxF: temps.get(date) ?? null,
    })
  }
  return out
}

/** Build the heat-vs-ozone series from whichever days carry a temperature. */
export function buildCorrelation(days: DaySummary[]): CorrelationSeries | null {
  const withTemp = days.filter((d) => d.tempMaxF !== null)
  if (withTemp.length < 60) return null
  return {
    startDate: withTemp[0].date,
    endDate: withTemp[withTemp.length - 1].date,
    tempMaxF: withTemp.map((d) => d.tempMaxF as number),
    ozoneMax: withTemp.map((d) => d.ozoneMax),
    pm25Max: withTemp.map((d) => d.pm25Max),
  }
}

// ---------------------------------------------------------------------------
// Forensics
// ---------------------------------------------------------------------------

function num(v: number | null | undefined): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0
}

function slice(xs: number[], from: number, to: number): number[] {
  return xs.slice(from, to + 1)
}

function argMax(xs: number[]): number {
  let best = 0
  for (let i = 1; i < xs.length; i++) if (xs[i] > xs[best]) best = i
  return best
}

function maxOrZero(xs: (number | null)[]): number {
  const vals = xs.filter((v): v is number => v !== null)
  return vals.length ? Math.max(...vals) : 0
}

export function median(xs: number[]): number {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const mid = s.length >> 1
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/** Pearson r. Returns null when a series has no spread to correlate. */
export function pearson(xs: number[], ys: number[]): number | null {
  const n = Math.min(xs.length, ys.length)
  if (n < 3) return null
  const mx = mean(xs.slice(0, n))
  const my = mean(ys.slice(0, n))
  let num2 = 0
  let dx = 0
  let dy = 0
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx
    const b = ys[i] - my
    num2 += a * b
    dx += a * a
    dy += b * b
  }
  if (dx === 0 || dy === 0) return null
  return num2 / Math.sqrt(dx * dy)
}

/**
 * Baselines use a seven-day median ending four days before the focus day. The
 * lead gap is the important part: without it a four-day smoke episode sits in
 * its own baseline and hides itself.
 */
export function baselineFor(days: DaySummary[], index: number): number | null {
  const from = index - 10
  const to = index - 4
  if (from < 0) return null
  const prior = days.slice(from, to + 1).map((d) => d.pm25Max)
  if (prior.length < 4) return null
  return median(prior)
}

export function featuresFor(
  days: DaySummary[],
  index: number,
  baseline: number
): CaseFeatures {
  const d = days[index]
  const base = Math.max(baseline, 3)
  const afternoon = Math.max(mean(slice(d.pm25, 12, 17)), 1)
  const midday = Math.max(mean(slice(d.pm25, 12, 15)), 1)

  let sustained = 0
  for (let j = index; j < Math.min(days.length, index + 4); j++) {
    if (days[j].pm25Max >= 2 * base) sustained++
  }

  return {
    month: Number(d.date.slice(5, 7)),
    pm25Max: d.pm25Max,
    pm25Baseline: baseline,
    ratio: d.pm25Max / base,
    sustainedDays: sustained,
    overnightRatio: mean(slice(d.pm25, 0, 7)) / afternoon,
    morningRatio: mean(slice(d.pm25, 6, 9)) / midday,
    eveningRatio: mean(slice(d.pm25, 17, 20)) / midday,
    ozoneMax: d.ozoneMax,
    ozonePeakHour: d.ozonePeakHour,
    ozoneNightMean: mean([...slice(d.ozone, 21, 23), ...slice(d.ozone, 0, 4)]),
    pm10Max: d.pm10Max,
    coarseRatio: d.pm10Max / Math.max(d.pm25Max, 1),
    dustMax: d.dustMax,
    tempMaxF: d.tempMaxF,
  }
}

/**
 * Classify one day by pattern alone. Thresholds were set by running this over
 * four real ZIPs (Cerritos CA, New York NY, Bozeman MT, Lubbock TX) and checking
 * that each label only fires on days whose shape actually matches it — dust,
 * for instance, fires in Bozeman and Lubbock and never in Cerritos, which is
 * the correct answer for a coastal suburb.
 *
 * Returns null when the day is unremarkable, which is most days. 'unknown' is
 * returned only when something genuinely moved and the evidence genuinely does
 * not settle it — that is a case worth playing, with "not enough evidence" as
 * the correct accusation.
 */
export function classify(f: CaseFeatures): Suspect | null {
  // A real plume sits over a place day and night. An inversion only fills the
  // calm hours before dawn, so overnightRatio screens that impostor out.
  if (f.ratio >= 2 && f.pm25Max >= 55 && f.sustainedDays >= 2 && f.overnightRatio <= 3) {
    return 'smoke'
  }
  if (f.coarseRatio >= 2.5 && f.dustMax >= 20 && f.pm10Max >= 25) return 'dust'
  if (
    f.ozoneMax >= 110 &&
    f.ozonePeakHour >= 11 &&
    f.ozonePeakHour <= 18 &&
    f.ratio < 1.6 &&
    f.month >= 4 &&
    f.month <= 10
  ) {
    return 'ozone'
  }
  if (
    (f.month >= 11 || f.month <= 2) &&
    f.overnightRatio >= 2.2 &&
    f.pm25Max >= 25 &&
    f.ozoneNightMean <= 8
  ) {
    return 'inversion'
  }
  if (
    f.month >= 4 &&
    f.month <= 10 &&
    f.morningRatio >= 1.35 &&
    f.eveningRatio >= 1.25 &&
    f.pm25Max < 45 &&
    f.ozoneMax < 100
  ) {
    return 'traffic'
  }
  if (f.pm25Max < 18 && f.ozoneMax < 75) return 'clean'

  // Something moved, but not enough to name. A one-day bump of roughly double
  // background could be a passing plume, a stagnant night or a local source;
  // the model cannot separate them, and neither can the student.
  if (f.ratio >= 1.6 && f.ratio <= 2.4 && f.sustainedDays <= 1) return 'unknown'
  // Shoulder seasons run both the commute rhythm and the stagnation rhythm at
  // once, and a morning-weighted day in March fits either.
  if (
    (f.month === 3 || f.month === 4 || f.month === 10 || f.month === 11) &&
    f.overnightRatio >= 2 &&
    f.pm25Max >= 25 &&
    f.pm25Max <= 60
  ) {
    return 'unknown'
  }
  return null
}

/**
 * Walk the whole year and return every day that carries a readable pattern,
 * thinned so that one four-day episode produces one case rather than four.
 */
export function detectCases(days: DaySummary[], place: Place): AirCase[] {
  const scored: Array<{ index: number; suspect: Suspect; features: CaseFeatures }> = []

  for (let i = 0; i < days.length; i++) {
    const baseline = baselineFor(days, i)
    if (baseline === null) continue
    const features = featuresFor(days, i, baseline)
    const suspect = classify(features)
    if (suspect) scored.push({ index: i, suspect, features })
  }

  // Keep the clearest day of each run, then space the survivors out so the game
  // never asks about the same weather twice.
  const byStrength = [...scored].sort((a, b) => strength(b) - strength(a))
  const taken: number[] = []
  const cases: AirCase[] = []

  for (const s of byStrength) {
    if (taken.some((t) => Math.abs(t - s.index) < 5)) continue
    taken.push(s.index)
    const from = Math.max(0, s.index - WINDOW_RADIUS)
    const to = Math.min(days.length - 1, s.index + WINDOW_RADIUS)
    const window = days.slice(from, to + 1)
    cases.push({
      id: `${days[s.index].date}-${s.suspect}`,
      suspect: s.suspect,
      focusIndex: s.index - from,
      focusDate: days[s.index].date,
      days: window,
      features: s.features,
      curated: curatedFor(place, days[s.index].date, s.suspect),
    })
  }

  return cases.sort((a, b) => a.focusDate.localeCompare(b.focusDate))
}

/** How unmistakable a case is. Used only to pick the best day of an episode. */
function strength(s: { suspect: Suspect; features: CaseFeatures }): number {
  const f = s.features
  switch (s.suspect) {
    case 'smoke':
      return 1000 + f.pm25Max
    case 'dust':
      return 800 + f.coarseRatio * 10
    case 'ozone':
      return 600 + f.ozoneMax
    case 'inversion':
      return 500 + f.overnightRatio * 10
    case 'traffic':
      return 400 + f.morningRatio * 10
    case 'clean':
      return 300 - f.pm25Max
    default:
      return 200 - Math.abs(f.ratio - 2) * 10
  }
}

// ---------------------------------------------------------------------------
// The curated list — the ONLY place a spike gets a name
// ---------------------------------------------------------------------------

export interface CuratedEvent {
  id: string
  headline: string
  body: string
  href: string
  linkLabel: string
}

interface CuratedRule extends CuratedEvent {
  suspect: Suspect
  latMin: number
  latMax: number
  lonMin: number
  lonMax: number
  from: string
  to: string
}

/**
 * Adding an entry here is a factual claim about a real event, so each one needs
 * a public record behind it and a bounding box tight enough that the claim is
 * true everywhere inside it. There is exactly one entry today. If a player's
 * spike is not covered, the game calls it "a smoke or plume event" and says out
 * loud that the data cannot name the source.
 */
const CURATED: CuratedRule[] = [
  {
    id: 'la-fires-january-2025',
    suspect: 'smoke',
    // The Los Angeles basin and the coastal plain immediately downwind.
    latMin: 33.4,
    latMax: 34.5,
    lonMin: -119,
    lonMax: -117.3,
    from: '2025-01-07',
    to: '2025-01-14',
    headline: 'The January 2025 Los Angeles wildfires',
    body: 'The Palisades and Eaton fires ignited on 7 January 2025 and burned for weeks across Los Angeles County. This is one of the very few spikes in this game that can be named: the date, the place and the size of the plume all match a documented event. Every other spike you will see is described only by its shape, because the data alone cannot say what burned.',
    href: 'https://www.fire.ca.gov/incidents/2025',
    linkLabel: 'CAL FIRE 2025 incident record',
  },
]

export function curatedFor(place: Place, date: string, suspect: Suspect): CuratedEvent | null {
  const hit = CURATED.find(
    (c) =>
      c.suspect === suspect &&
      place.lat >= c.latMin &&
      place.lat <= c.latMax &&
      place.lon >= c.lonMin &&
      place.lon <= c.lonMax &&
      date >= c.from &&
      date <= c.to
  )
  if (!hit) return null
  const { id, headline, body, href, linkLabel } = hit
  return { id, headline, body, href, linkLabel }
}

// ---------------------------------------------------------------------------
// Presentation helpers shared by the page
// ---------------------------------------------------------------------------

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** 2025-01-09 -> "9 January 2025". Parsed as parts, never through Date(). */
export function prettyDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  const month = MONTHS[Number(m) - 1] ?? m
  return `${Number(d)} ${month} ${y}`
}

/** 2025-01-09 -> "Jan 9". */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${(MONTHS[Number(m) - 1] ?? m).slice(0, 3)} ${Number(d)}`
}

/** 15 -> "3 PM". Hours are local to the player's ZIP. */
export function hourLabel(h: number): string {
  if (h === 0) return '12 AM'
  if (h === 12) return '12 PM'
  return h < 12 ? `${h} AM` : `${h - 12} PM`
}

export function seasonOf(month: number): string {
  if (month === 12 || month <= 2) return 'winter'
  if (month <= 5) return 'spring'
  if (month <= 8) return 'summer'
  return 'autumn'
}

/** Plain-language strength of a correlation, for the heat round. */
export function correlationWord(r: number): string {
  const a = Math.abs(r)
  if (a >= 0.6) return 'strong'
  if (a >= 0.35) return 'moderate'
  if (a >= 0.15) return 'weak'
  return 'essentially none'
}

// ---------------------------------------------------------------------------
// Offline fallback
// ---------------------------------------------------------------------------

/** YYYY-MM-DD plus n days, done on calendar parts so no timezone can shift it. */
function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d))
  t.setUTCDate(t.getUTCDate() + n)
  return isoDay(t)
}

function windowToDays(w: FixtureWindow): DaySummary[] {
  const count = Math.floor(w.pm25.length / 24)
  const out: DaySummary[] = []
  for (let i = 0; i < count; i++) {
    const pm25 = w.pm25.slice(i * 24, i * 24 + 24)
    const ozone = w.ozone.slice(i * 24, i * 24 + 24)
    out.push({
      date: addDays(w.startDate, i),
      pm25,
      ozone,
      pm25Max: Math.max(...pm25),
      pm25Mean: mean(pm25),
      pm25PeakHour: argMax(pm25),
      ozoneMax: Math.max(...ozone),
      ozonePeakHour: argMax(ozone),
      pm10Max: w.pm10Max[i] ?? 0,
      dustMax: w.dustMax[i] ?? 0,
      tempMaxF: w.tempMaxF[i] ?? null,
    })
  }
  return out
}

/**
 * The bundled Cerritos windows, run through the very same classifier the live
 * data goes through. Nothing here carries a hand-written answer key — if a
 * threshold above changes, the fallback game changes with it, which is the only
 * way the offline path can stay honest about what the numbers show.
 */
export function fixtureCases(): AirCase[] {
  const out: AirCase[] = []
  for (const w of fixtureWindows) {
    const days = windowToDays(w)
    const focusIndex = days.findIndex((d) => d.date === w.focusDate)
    if (focusIndex < 0) continue
    const features = featuresFor(days, focusIndex, w.baselinePm25Max)
    const suspect = classify(features)
    if (!suspect) continue
    out.push({
      id: w.id,
      suspect,
      focusIndex,
      focusDate: w.focusDate,
      days,
      features,
      curated: curatedFor(DEMO_PLACE, w.focusDate, suspect),
    })
  }
  return out
}

export function fixtureDossier(): { cases: AirCase[]; correlation: CorrelationSeries } {
  return {
    cases: fixtureCases(),
    correlation: {
      startDate: fixtureCorrelation.startDate,
      endDate: fixtureCorrelation.endDate,
      tempMaxF: fixtureCorrelation.tempMaxF,
      ozoneMax: fixtureCorrelation.ozoneMax,
      pm25Max: fixtureCorrelation.pm25Max,
    },
  }
}

// ---------------------------------------------------------------------------
// Building a playthrough out of whatever the player's own year contains
// ---------------------------------------------------------------------------

export type RoundKind = 'accuse' | 'correlate'

export interface AccuseRound {
  kind: 'accuse'
  /** 1 obvious, 2 discriminating, 3 honest ambiguity. */
  level: 1 | 2 | 3
  /** Why this case was chosen, shown as the case briefing. */
  brief: string
  airCase: AirCase
}

export interface CorrelateRound {
  kind: 'correlate'
  level: 2
  series: CorrelationSeries
}

export type Round = AccuseRound | CorrelateRound

/** The smallest set of accusations that still teaches the three levels. */
export const MIN_CASES = 4

function take(pool: AirCase[], used: Set<string>, ...want: Suspect[]): AirCase | null {
  for (const suspect of want) {
    const hit = pool.find((c) => c.suspect === suspect && !used.has(c.id))
    if (hit) {
      used.add(hit.id)
      return hit
    }
  }
  return null
}

/**
 * Assemble the case file. The ramp is fixed — one unmistakable case, then the
 * PM2.5-versus-ozone discrimination that is the whole point of the game, then
 * the heat round, then the cases where the honest answer is "I can't tell".
 * Which real days fill those slots depends entirely on the player's own ZIP, so
 * a student in Bozeman gets a dust case and a student in Cerritos does not.
 */
export function buildRounds(cases: AirCase[], correlation: CorrelationSeries | null): Round[] {
  const used = new Set<string>()
  const rounds: Round[] = []

  const opener = take(cases, used, 'smoke', 'dust', 'ozone', 'inversion')
  if (opener) {
    rounds.push({
      kind: 'accuse',
      level: 1,
      brief:
        'Case one. Something here is loud enough to see from across the room. Find which pollutant moved, and how long it stayed.',
      airCase: opener,
    })
  }

  const ozoneCase = take(cases, used, 'ozone')
  if (ozoneCase) {
    rounds.push({
      kind: 'accuse',
      level: 2,
      brief:
        'Case two. Nothing dramatic happened to the particle count on this day. Look at the other pollutant, and look at what time it moved.',
      airCase: ozoneCase,
    })
  }

  const particleCase = take(cases, used, 'inversion', 'traffic', 'unknown')
  if (particleCase) {
    rounds.push({
      kind: 'accuse',
      level: 2,
      brief:
        'Case three. Now the particles move and the ozone does not. Same town, different pollutant, different hours of the day. "Bad air" is never one thing.',
      airCase: particleCase,
    })
  }

  if (correlation) rounds.push({ kind: 'correlate', level: 2, series: correlation })

  const ambiguous = take(cases, used, 'unknown')
  if (ambiguous) {
    rounds.push({
      kind: 'accuse',
      level: 3,
      brief:
        'Case four. Read this one carefully before you accuse anybody. A detective who names a suspect on thin evidence is not a good detective.',
      airCase: ambiguous,
    })
  }

  const closer = take(cases, used, 'clean', 'traffic', 'inversion', 'unknown', 'ozone', 'smoke')
  if (closer) {
    rounds.push({
      kind: 'accuse',
      level: 3,
      brief: 'Final case. No hints this time.',
      airCase: closer,
    })
  }

  return rounds
}

export function accusationCount(rounds: Round[]): number {
  return rounds.filter((r) => r.kind === 'accuse').length
}
