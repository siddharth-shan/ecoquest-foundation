// Open-Meteo Historical Weather API — the 75-year daily record behind
// /games/climate-record/.
//
// What this is: ERA5 / ERA5-Land *reanalysis*. A physics model is run over every
// historical observation that exists — stations, ships, balloons, satellites —
// to reconstruct a continuous gridded record. It is not a thermometer that has
// been standing in the player's town since 1950, and the game says so out loud.
// Reanalysis is the only way to give an arbitrary US ZIP a consistent 1950-to-now
// series at all: most towns have no station with an unbroken record that long.
//
// Request shape (probed 2026-09-29: keyless, CORS `*`, daily data from 1950):
//   GET archive-api.open-meteo.com/v1/archive
//       ?latitude&longitude&start_date&end_date&daily=temperature_2m_max
//       &temperature_unit=fahrenheit&timezone=auto
//
// ONE request covers the whole record. A 1950-01-01 → 2025-12-31 span for a
// single point is ~500 KB and answered in about 2 seconds; asking per-year or
// per-decade would be 8-76 round trips for the same bytes. Everything the game
// shows is aggregated from that single response on the client.

import { fetchJson, type Result } from './client'

/** A "hot day" here is a daily high at or above this, in °F. */
export const HOT_DAY_F = 90

/** Daily reanalysis in this dataset starts in 1940; 1950 gives whole decades. */
export const RECORD_START_YEAR = 1950

/** The trailing window compared against the baseline decade. */
export const RECENT_WINDOW_YEARS = 10

/** A year with fewer days than this is too gappy to average. */
const MIN_DAYS_PER_YEAR = 355

/** A decade needs this many usable years before it is plotted. */
const MIN_YEARS_PER_DECADE = 8

/** Fewer complete decades than this and there is no trend worth claiming. */
const MIN_DECADES = 3

export interface ArchiveDaily {
  time?: string[]
  temperature_2m_max?: Array<number | null>
}

export interface ArchiveResponse {
  daily?: ArchiveDaily
}

/** One aggregated span of years. */
export interface ClimateWindow {
  label: string
  startYear: number
  endYear: number
  /** Usable years actually averaged, which may be fewer than the span. */
  years: number
  /** Mean of every daily high in the window, °F. */
  meanDailyHigh: number
  /** Days at or above HOT_DAY_F, averaged per year. */
  hotDaysPerYear: number
}

export interface DecadeWindow extends ClimateWindow {
  /** False for a decade still in progress — excluded from the trend fit. */
  complete: boolean
}

/**
 * How confidently the record supports a trend at all.
 *
 * This exists because the honest answer for a lot of towns is "not very." The
 * game is scored on matching whatever this says, so a flat or noisy record is a
 * winnable round, not a failed reveal.
 */
export type SignalStrength = 'clear' | 'modest' | 'noise'

export type TrendDirection = 'up' | 'down' | 'flat'

export interface TrendReading {
  metric: 'temperature' | 'hotDays'
  unit: string
  /** Least-squares slope across complete decades, per decade. */
  perDecade: number
  /** Scatter of the decades around that straight line. The "noise". */
  residualSd: number
  /**
   * Rise-over-wobble: total fitted change across the record divided by the
   * decade-to-decade scatter. Below ~1 the trend is smaller than the noise.
   */
  snr: number
  /** Recent window minus baseline decade. The number the player guesses. */
  change: number
  direction: TrendDirection
  strength: SignalStrength
  headline: string
  detail: string
}

export interface ClimateRecord {
  decades: DecadeWindow[]
  /** First plotted decade — what "since the 1950s" is measured from. */
  baseline: DecadeWindow
  /** Most recent whole years, the other end of the comparison. */
  recent: ClimateWindow
  temperature: TrendReading
  hotDays: TrendReading
  /** Coldest complete decade in the record — the signal-vs-noise example. */
  coolestDecade: DecadeWindow
  /** Decade-to-decade steps that went *down*, out of `decadeSteps`. */
  decadeStepsDown: number
  decadeSteps: number
  firstYear: number
  lastYear: number
  dayCount: number
}

/* ------------------------------------------------------------------ */
/* Trend maths                                                         */
/* ------------------------------------------------------------------ */

interface Fit {
  slope: number
  residualSd: number
  snr: number
}

function linearFit(values: number[]): Fit {
  const n = values.length
  if (n < 2) return { slope: 0, residualSd: 0, snr: 0 }

  const meanX = (n - 1) / 2
  const meanY = values.reduce((a, b) => a + b, 0) / n

  let num = 0
  let den = 0
  values.forEach((y, x) => {
    num += (x - meanX) * (y - meanY)
    den += (x - meanX) * (x - meanX)
  })
  const slope = den === 0 ? 0 : num / den
  const intercept = meanY - slope * meanX

  // Residual spread with n-2 degrees of freedom: two were spent on the line.
  const dof = Math.max(1, n - 2)
  const ss = values.reduce((acc, y, x) => {
    const r = y - (slope * x + intercept)
    return acc + r * r
  }, 0)
  const residualSd = Math.sqrt(ss / dof)

  const span = Math.abs(slope) * (n - 1)
  const snr = residualSd > 0 ? span / residualSd : span > 0 ? Infinity : 0

  return { slope, residualSd, snr }
}

/** Minimum |change| for each strength band, per metric. */
const CHANGE_FLOOR = {
  temperature: { clear: 1.5, modest: 0.5, flat: 0.25 },
  hotDays: { clear: 6, modest: 2, flat: 1 },
} as const

/** A trend has to out-run the wobble as well as be large. */
const SNR_FLOOR = { clear: 2.5, modest: 1.2 } as const

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function signed(n: number, digits: number, unit: string): string {
  const v = digits === 0 ? Math.round(n) : Number(n.toFixed(digits))
  const sign = v > 0 ? '+' : v < 0 ? '−' : '±'
  return `${sign}${Math.abs(v).toFixed(digits)} ${unit}`
}

function describeTrend(
  metric: 'temperature' | 'hotDays',
  values: number[],
  change: number,
  baselineLabel: string,
  recentLabel: string,
): TrendReading {
  const { slope, residualSd, snr } = linearFit(values)
  const floors = CHANGE_FLOOR[metric]
  const size = Math.abs(change)

  const strength: SignalStrength =
    size >= floors.clear && snr >= SNR_FLOOR.clear
      ? 'clear'
      : size >= floors.modest && snr >= SNR_FLOOR.modest
        ? 'modest'
        : 'noise'

  const direction: TrendDirection = size < floors.flat ? 'flat' : change > 0 ? 'up' : 'down'

  const unit = metric === 'temperature' ? '°F' : 'days per year'
  const digits = metric === 'temperature' ? 2 : 1
  const changeText = signed(change, digits, unit)
  const perDecadeText = signed(
    slope,
    digits,
    metric === 'temperature' ? '°F per decade' : 'days per decade',
  )
  const wobbleText =
    metric === 'temperature'
      ? `${round2(residualSd).toFixed(2)} °F`
      : `${round1(residualSd).toFixed(1)} days`

  const noun = metric === 'temperature' ? 'the average daily high' : 'the number of days at or above 90 °F'
  const rise = metric === 'temperature' ? 'warming' : 'rise in hot days'
  const fall = metric === 'temperature' ? 'cooling' : 'drop in hot days'

  let headline: string
  let detail: string

  if (strength === 'noise') {
    headline = 'Mostly noise'
    detail =
      direction === 'flat'
        ? `Between the ${baselineLabel} and ${recentLabel}, ${noun} moved ${changeText} — smaller than the ${wobbleText} that this record wobbles from one decade to the next. For this location, this measurement does not show a trend you could pick out by eye.`
        : `${noun[0].toUpperCase()}${noun.slice(1)} moved ${changeText} between the ${baselineLabel} and ${recentLabel}, but the decades scatter by about ${wobbleText} around the straight line through them. The change is not bigger than the noise, so this record on its own cannot settle the question.`
  } else {
    const word = direction === 'up' ? rise : fall
    headline = `${strength === 'clear' ? 'Clear' : 'Modest'} ${word}`
    detail =
      strength === 'clear'
        ? `${noun[0].toUpperCase()}${noun.slice(1)} changed ${changeText} from the ${baselineLabel} to ${recentLabel} — about ${perDecadeText}, well clear of the ${wobbleText} of decade-to-decade wobble. This one is hard to explain away as chance.`
        : `${noun[0].toUpperCase()}${noun.slice(1)} changed ${changeText} from the ${baselineLabel} to ${recentLabel}, about ${perDecadeText}. That is real, but individual decades wobble by around ${wobbleText}, so the trend is easy to miss — and easy to overstate — decade by decade.`
  }

  return {
    metric,
    unit,
    perDecade: slope,
    residualSd,
    snr,
    change,
    direction,
    strength,
    headline,
    detail,
  }
}

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

export interface RecordMeta {
  firstYear: number
  lastYear: number
  dayCount: number
}

/**
 * Turns aggregated windows into a scored record. Pure, and shared with the
 * offline fixture so the fallback path runs exactly the same analysis as live
 * data rather than shipping pre-written conclusions.
 */
export function assembleRecord(
  decades: DecadeWindow[],
  recent: ClimateWindow,
  meta: RecordMeta,
): ClimateRecord | null {
  const complete = decades.filter((d) => d.complete)
  if (complete.length < MIN_DECADES) return null

  const baseline = complete[0]

  const temperature = describeTrend(
    'temperature',
    complete.map((d) => d.meanDailyHigh),
    recent.meanDailyHigh - baseline.meanDailyHigh,
    baseline.label,
    recent.label,
  )
  const hotDays = describeTrend(
    'hotDays',
    complete.map((d) => d.hotDaysPerYear),
    recent.hotDaysPerYear - baseline.hotDaysPerYear,
    baseline.label,
    recent.label,
  )

  let coolestDecade = complete[0]
  let decadeStepsDown = 0
  complete.forEach((d, i) => {
    if (d.meanDailyHigh < coolestDecade.meanDailyHigh) coolestDecade = d
    if (i > 0 && d.meanDailyHigh < complete[i - 1].meanDailyHigh) decadeStepsDown++
  })

  return {
    decades,
    baseline,
    recent,
    temperature,
    hotDays,
    coolestDecade,
    decadeStepsDown,
    decadeSteps: complete.length - 1,
    ...meta,
  }
}

/* ------------------------------------------------------------------ */
/* Aggregation from the raw daily series                               */
/* ------------------------------------------------------------------ */

interface YearTally {
  days: number
  sum: number
  hot: number
}

function tallyYears(daily: ArchiveDaily): Map<number, YearTally> {
  const times = daily.time ?? []
  const highs = daily.temperature_2m_max ?? []
  const years = new Map<number, YearTally>()

  for (let i = 0; i < times.length; i++) {
    const value = highs[i]
    // Reanalysis occasionally has gaps at the edges of the record.
    if (value === null || value === undefined || !Number.isFinite(value)) continue
    const year = Number(times[i].slice(0, 4))
    if (!Number.isFinite(year)) continue

    const tally = years.get(year) ?? { days: 0, sum: 0, hot: 0 }
    tally.days++
    tally.sum += value
    if (value >= HOT_DAY_F) tally.hot++
    years.set(year, tally)
  }

  return years
}

function windowFrom(
  label: string,
  startYear: number,
  endYear: number,
  years: Map<number, YearTally>,
): ClimateWindow | null {
  let days = 0
  let sum = 0
  let hot = 0
  let usable = 0

  for (let y = startYear; y <= endYear; y++) {
    const t = years.get(y)
    // A part-year would drag an annual mean toward whichever season it covers.
    if (!t || t.days < MIN_DAYS_PER_YEAR) continue
    days += t.days
    sum += t.sum
    hot += t.hot
    usable++
  }

  if (usable === 0 || days === 0) return null

  return {
    label,
    startYear,
    endYear,
    years: usable,
    meanDailyHigh: sum / days,
    hotDaysPerYear: hot / usable,
  }
}

/** Last calendar year that has certainly finished. Keeps decades whole. */
export function lastCompleteYear(now: Date = new Date()): number {
  return now.getUTCFullYear() - 1
}

export function archiveUrl(
  lat: number,
  lon: number,
  startYear = RECORD_START_YEAR,
  endYear = lastCompleteYear(),
): string {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    start_date: `${startYear}-01-01`,
    end_date: `${endYear}-12-31`,
    daily: 'temperature_2m_max',
    temperature_unit: 'fahrenheit',
    timezone: 'auto',
  })
  return `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`
}

/** Aggregates one archive response into decades plus a trailing window. */
export function buildClimateRecord(daily: ArchiveDaily): ClimateRecord | null {
  const years = tallyYears(daily)
  if (years.size === 0) return null

  // forEach rather than spreading the Map: the build targets ES5 output.
  const present: number[] = []
  years.forEach((_tally, year) => present.push(year))
  present.sort((a, b) => a - b)
  const firstYear = present[0]
  const lastYear = present[present.length - 1]

  const decades: DecadeWindow[] = []
  const firstDecade = Math.floor(firstYear / 10) * 10
  for (let start = firstDecade; start <= lastYear; start += 10) {
    const end = start + 9
    const w = windowFrom(`${start}s`, start, end, years)
    if (!w || w.years < MIN_YEARS_PER_DECADE) {
      // A decade that is merely unfinished still belongs on the chart, flagged.
      if (w && end > lastYear) decades.push({ ...w, complete: false })
      continue
    }
    decades.push({ ...w, complete: end <= lastYear })
  }

  const recentStart = lastYear - RECENT_WINDOW_YEARS + 1
  const recent = windowFrom(
    `${recentStart}–${lastYear}`,
    recentStart,
    lastYear,
    years,
  )
  if (!recent) return null

  let dayCount = 0
  years.forEach((t) => {
    dayCount += t.days
  })
  return assembleRecord(decades, recent, { firstYear, lastYear, dayCount })
}

/**
 * One network call for the whole 75-year record at these coordinates.
 * Never throws: failures come back as `ok: false` for the caller to fall back on.
 */
export async function fetchClimateRecord(
  lat: number,
  lon: number,
  opts: { signal?: AbortSignal; endYear?: number } = {},
): Promise<Result<ClimateRecord>> {
  const res = await fetchJson<ArchiveResponse>(
    archiveUrl(lat, lon, RECORD_START_YEAR, opts.endYear ?? lastCompleteYear()),
    // 76 years of daily values is a large document; give it more than the
    // default 8s before calling it a timeout, and do not hammer a slow archive.
    { timeoutMs: 20000, retries: 1, signal: opts.signal },
  )
  if (!res.ok) return res

  const record = buildClimateRecord(res.data?.daily ?? {})
  if (!record) {
    return {
      ok: false,
      reason: 'empty',
      message: 'The archive returned too little history for this location.',
    }
  }
  return { ok: true, data: record }
}
