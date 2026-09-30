'use client'

// Air Detective — deduce.
//
// A year of real hourly air-pollution data for the player's own ZIP, with the
// interesting days pulled out of it automatically and the causes hidden. The
// player reads the evidence and accuses a pattern.
//
// Three things about this game are deliberate and should survive any rewrite:
//
// 1. Nothing is hand-authored per case. The classifier in lib/api/openMeteoAir
//    decides what each real day is, so the game can never assert a cause the
//    data does not carry. A specific named event appears only from the curated
//    list in that module; everywhere else it is "a smoke or plume event".
// 2. Level two exists to break the belief that "bad air" is one substance. The
//    ozone case and the particle case sit next to each other on purpose: same
//    town, different pollutant, different hours, different season.
// 3. "Not enough evidence" is a scoring answer, not a forfeit. On an ambiguous
//    case it is the only correct answer, and naming a suspect there loses the
//    point. Calibrated uncertainty is the skill being taught.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DataSourceNote from '@/components/games/DataSourceNote'
import GameShell from '@/components/games/GameShell'
import ImpactPanel from '@/components/games/ImpactPanel'
import PlaceGate from '@/components/games/PlaceGate'
import { failureMessage } from '@/lib/api/client'
import {
  SUSPECTS,
  accusationCount,
  buildRounds,
  correlationWord,
  detectCases,
  fetchAirDossier,
  fixtureDossier,
  hourLabel,
  pearson,
  prettyDate,
  seasonOf,
  shortDate,
  suspectInfo,
  MIN_CASES,
  type AccuseRound,
  type AirCase,
  type CorrelateRound,
  type Round,
  type Suspect,
} from '@/lib/api/openMeteoAir'
import { getNextEvent } from '@/lib/nextEvent'
import type { Place } from '@/lib/place'
import { getBestScore, recordScore } from '@/lib/progress'

const GAME_KEY = 'air-detective'

const PM_COLOR = '#f57c00'
const O3_COLOR = '#00a8e1'

const MONITOR_URL = 'https://www.airnow.gov/'

/**
 * The bundled sample is Cerritos's own air, so a Cerritos player falling back
 * to it must not be told "this is not your town" — it is. The disclaimer they
 * need is a different one: the data is local but not live.
 */
const FIXTURE_CITY = 'Cerritos'
function playsInFixtureCity(place: Place): boolean {
  return place.city.trim().toLowerCase() === FIXTURE_CITY.toLowerCase()
}
const FLAG_PROGRAM_URL = 'https://www.airnow.gov/air-quality-flag-program/'
const AQI_BASICS_URL = 'https://www.airnow.gov/aqi/aqi-basics/'

// ---------------------------------------------------------------------------
// Charts. Inline SVG only — no chart library, and every figure is paired with
// the same numbers as a real table, because an SVG polyline says nothing at all
// to a screen reader.
// ---------------------------------------------------------------------------

/** Round an axis maximum up to something a person would write on paper. */
function niceCeil(v: number): number {
  if (v <= 0) return 1
  const mag = Math.pow(10, Math.floor(Math.log(v) / Math.LN10))
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]
  for (const s of steps) {
    if (v <= s * mag) return s * mag
  }
  return 10 * mag
}

interface TableProps {
  caption: string
  head: string[]
  rows: (string | number)[][]
}

function DataTable({ caption, head, rows }: TableProps) {
  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-semibold text-primary-blue py-2 min-h-[44px] flex items-center">
        Show these numbers as a table
      </summary>
      <div className="overflow-x-auto">
        <table className="mt-2 w-full text-sm border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {head.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="text-left border-b-2 border-gray-300 py-1 pr-4 font-semibold text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r[0])}>
                {r.map((cell, i) => (
                  <td
                    key={i}
                    className="border-b border-gray-200 py-1 pr-4 text-gray-700 tabular-nums"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

interface BarChartProps {
  title: string
  subtitle: string
  unit: string
  labels: string[]
  values: number[]
  highlight: number
  color: string
  tableCaption: string
  rowLabel: string
}

/** Daily maxima across the window, with the day under investigation marked. */
function BarChart({
  title,
  subtitle,
  unit,
  labels,
  values,
  highlight,
  color,
  tableCaption,
  rowLabel,
}: BarChartProps) {
  const W = 680
  const H = 210
  const padL = 52
  const padR = 10
  const padT = 18
  const padB = 56
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const top = niceCeil(Math.max(...values, 1))
  const slot = plotW / values.length
  const barW = Math.max(8, slot * 0.58)
  const y = (v: number) => padT + plotH - (v / top) * plotH

  const peak = labels[highlight]
  const desc = `${title}. ${labels
    .map((l, i) => `${l}: ${values[i].toFixed(1)}`)
    .join('; ')}. Day under investigation: ${peak}.`

  return (
    <figure className="card p-4">
      <figcaption className="mb-1">
        <span className="block font-heading font-bold text-base text-gray-800">{title}</span>
        <span className="block text-sm text-gray-500">{subtitle}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={desc}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(top * f)}
              y2={y(top * f)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={y(top * f) + 4}
              textAnchor="end"
              fontSize={12}
              fill="#6b7280"
            >
              {Math.round(top * f)}
            </text>
          </g>
        ))}
        <text x={4} y={12} fontSize={11} fill="#6b7280">
          {unit}
        </text>

        {values.map((v, i) => {
          const cx = padL + slot * i + slot / 2
          const isFocus = i === highlight
          return (
            <g key={labels[i]}>
              <rect
                x={cx - barW / 2}
                y={y(v)}
                width={barW}
                height={Math.max(1, padT + plotH - y(v))}
                fill={color}
                fillOpacity={isFocus ? 1 : 0.42}
                stroke={isFocus ? '#1f2937' : 'none'}
                strokeWidth={isFocus ? 2.5 : 0}
                rx={2}
              />
              <text x={cx} y={y(v) - 6} textAnchor="middle" fontSize={11} fill="#374151">
                {v.toFixed(0)}
              </text>
              <text
                x={cx}
                y={padT + plotH + 18}
                textAnchor="middle"
                fontSize={12}
                fill={isFocus ? '#111827' : '#6b7280'}
                fontWeight={isFocus ? 700 : 400}
              >
                {labels[i]}
              </text>
              {isFocus && (
                <text x={cx} y={padT + plotH + 38} textAnchor="middle" fontSize={11} fill="#111827">
                  ▲ this day
                </text>
              )}
            </g>
          )
        })}
        <line
          x1={padL}
          x2={W - padR}
          y1={padT + plotH}
          y2={padT + plotH}
          stroke="#9ca3af"
          strokeWidth={1.5}
        />
      </svg>
      <DataTable
        caption={tableCaption}
        head={['Day', `${rowLabel} (${unit})`, 'Under investigation']}
        rows={labels.map((l, i) => [l, values[i].toFixed(1), i === highlight ? 'yes' : ''])}
      />
    </figure>
  )
}

interface HourChartProps {
  title: string
  subtitle: string
  unit: string
  values: number[]
  color: string
  dashed?: boolean
  tableCaption: string
  rowLabel: string
}

/** One day, hour by hour. The shape here is the whole lesson. */
function HourChart({
  title,
  subtitle,
  unit,
  values,
  color,
  dashed = false,
  tableCaption,
  rowLabel,
}: HourChartProps) {
  const W = 680
  const H = 210
  const padL = 52
  const padR = 12
  const padT = 18
  const padB = 44
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const top = niceCeil(Math.max(...values, 1))
  const x = (h: number) => padL + (h / 23) * plotW
  const y = (v: number) => padT + plotH - (v / top) * plotH
  const path = values.map((v, h) => `${h === 0 ? 'M' : 'L'}${x(h).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  let peakHour = 0
  for (let i = 1; i < values.length; i++) if (values[i] > values[peakHour]) peakHour = i

  const ticks = [0, 6, 12, 18, 23]
  const desc = `${title}. Hourly values from midnight to 11 PM local time: ${values
    .map((v, h) => `${hourLabel(h)} ${v.toFixed(0)}`)
    .join(', ')}. Peak at ${hourLabel(peakHour)}.`

  return (
    <figure className="card p-4">
      <figcaption className="mb-1">
        <span className="block font-heading font-bold text-base text-gray-800">{title}</span>
        <span className="block text-sm text-gray-500">{subtitle}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={desc}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(top * f)}
              y2={y(top * f)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text x={padL - 8} y={y(top * f) + 4} textAnchor="end" fontSize={12} fill="#6b7280">
              {Math.round(top * f)}
            </text>
          </g>
        ))}
        <text x={4} y={12} fontSize={11} fill="#6b7280">
          {unit}
        </text>

        {/* Daylight band: the ozone story is a sunlight story. */}
        <rect
          x={x(7)}
          y={padT}
          width={x(19) - x(7)}
          height={plotH}
          fill="#fbbc04"
          fillOpacity={0.09}
        />
        <text x={(x(7) + x(19)) / 2} y={padT + 12} textAnchor="middle" fontSize={11} fill="#92400e">
          daylight
        </text>

        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray={dashed ? '7 4' : undefined}
        />
        {values.map((v, h) =>
          h % 3 === 0 || h === peakHour ? (
            dashed ? (
              <rect key={h} x={x(h) - 3.5} y={y(v) - 3.5} width={7} height={7} fill={color} />
            ) : (
              <circle key={h} cx={x(h)} cy={y(v)} r={3.5} fill={color} />
            )
          ) : null
        )}
        <g>
          <line
            x1={x(peakHour)}
            x2={x(peakHour)}
            y1={y(values[peakHour])}
            y2={padT + plotH}
            stroke="#111827"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={Math.min(W - padR - 60, Math.max(padL, x(peakHour)))}
            y={Math.max(padT + 24, y(values[peakHour]) - 10)}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="#111827"
          >
            peak {hourLabel(peakHour)}
          </text>
        </g>

        <line
          x1={padL}
          x2={W - padR}
          y1={padT + plotH}
          y2={padT + plotH}
          stroke="#9ca3af"
          strokeWidth={1.5}
        />
        {ticks.map((h) => (
          <text key={h} x={x(h)} y={padT + plotH + 20} textAnchor="middle" fontSize={12} fill="#6b7280">
            {hourLabel(h)}
          </text>
        ))}
      </svg>
      <DataTable
        caption={tableCaption}
        head={['Hour (local)', `${rowLabel} (${unit})`]}
        rows={values.map((v, h) => [hourLabel(h), v.toFixed(1)])}
      />
    </figure>
  )
}

interface ScatterProps {
  title: string
  subtitle: string
  xs: number[]
  ys: number[]
  xUnit: string
  yUnit: string
  color: string
  square?: boolean
  r: number | null
  tableCaption: string
}

/** Every day of the year as one dot: temperature against a pollutant. */
function ScatterChart({
  title,
  subtitle,
  xs,
  ys,
  xUnit,
  yUnit,
  color,
  square = false,
  r,
  tableCaption,
}: ScatterProps) {
  const W = 400
  const H = 300
  const padL = 46
  const padR = 14
  const padT = 14
  const padB = 46
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const xMin = Math.floor(Math.min(...xs) / 10) * 10
  const xMax = niceCeil(Math.max(...xs))
  const yMax = niceCeil(Math.max(...ys, 1))
  const px = (v: number) => padL + ((v - xMin) / Math.max(xMax - xMin, 1)) * plotW
  const py = (v: number) => padT + plotH - (v / yMax) * plotH

  // Binned means, so the trend is readable without reading 365 dots.
  const bands: { lo: number; hi: number; vals: number[] }[] = []
  const step = Math.max(5, Math.round((xMax - xMin) / 6 / 5) * 5)
  for (let lo = xMin; lo < xMax; lo += step) bands.push({ lo, hi: lo + step, vals: [] })
  xs.forEach((v, i) => {
    const b = bands.find((bb) => v >= bb.lo && v < bb.hi) ?? bands[bands.length - 1]
    if (b) b.vals.push(ys[i])
  })
  const filled = bands.filter((b) => b.vals.length >= 3)

  const desc = `${title}. ${xs.length} days plotted. ${filled
    .map(
      (b) =>
        `${b.lo} to ${b.hi} ${xUnit}: average ${(
          b.vals.reduce((a, c) => a + c, 0) / b.vals.length
        ).toFixed(0)} ${yUnit} over ${b.vals.length} days`
    )
    .join('; ')}.`

  return (
    <figure className="card p-4">
      <figcaption className="mb-1">
        <span className="block font-heading font-bold text-base text-gray-800">{title}</span>
        <span className="block text-sm text-gray-500">{subtitle}</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={desc}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={padL} x2={W - padR} y1={py(yMax * f)} y2={py(yMax * f)} stroke="#e5e7eb" />
            <text x={padL - 6} y={py(yMax * f) + 4} textAnchor="end" fontSize={11} fill="#6b7280">
              {Math.round(yMax * f)}
            </text>
          </g>
        ))}
        {xs.map((v, i) =>
          square ? (
            <rect
              key={i}
              x={px(v) - 2.5}
              y={py(ys[i]) - 2.5}
              width={5}
              height={5}
              fill={color}
              fillOpacity={0.4}
            />
          ) : (
            <circle key={i} cx={px(v)} cy={py(ys[i])} r={2.6} fill={color} fillOpacity={0.4} />
          )
        )}
        {/* Band averages, drawn heavy so the trend survives the scatter. */}
        {filled.map((b) => {
          const m = b.vals.reduce((a, c) => a + c, 0) / b.vals.length
          return (
            <g key={b.lo}>
              <line
                x1={px(b.lo) + 2}
                x2={px(b.hi) - 2}
                y1={py(m)}
                y2={py(m)}
                stroke="#111827"
                strokeWidth={3}
              />
              <text x={(px(b.lo) + px(b.hi)) / 2} y={py(m) - 6} textAnchor="middle" fontSize={11} fill="#111827">
                {m.toFixed(0)}
              </text>
            </g>
          )
        })}
        <line x1={padL} x2={W - padR} y1={padT + plotH} y2={padT + plotH} stroke="#9ca3af" />
        {bands.map((b) => (
          <text key={b.lo} x={px(b.lo)} y={padT + plotH + 18} textAnchor="middle" fontSize={11} fill="#6b7280">
            {b.lo}
          </text>
        ))}
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="#374151">
          daily high temperature ({xUnit})
        </text>
        <text x={4} y={11} fontSize={11} fill="#6b7280">
          {yUnit}
        </text>
      </svg>
      <p className="text-sm text-gray-600 mt-1">
        Thick horizontal bars are the average for each temperature band.{' '}
        {r === null ? (
          <>Correlation could not be computed for this location.</>
        ) : (
          <>
            Correlation <span className="font-semibold tabular-nums">r = {r.toFixed(2)}</span> (
            {correlationWord(r)}).
          </>
        )}
      </p>
      <DataTable
        caption={tableCaption}
        head={['Temperature band (°F)', 'Days', `Average ${yUnit}`]}
        rows={filled.map((b) => [
          `${b.lo}–${b.hi}`,
          b.vals.length,
          (b.vals.reduce((a, c) => a + c, 0) / b.vals.length).toFixed(1),
        ])}
      />
    </figure>
  )
}

// ---------------------------------------------------------------------------
// Evidence wording
// ---------------------------------------------------------------------------

function pollutantClue(c: AirCase): string {
  const f = c.features
  const pm = `PM2.5 peaked at ${f.pm25Max.toFixed(1)} µg/m³. A normal day for this spot in the week beforehand peaked near ${f.pm25Baseline.toFixed(
    1
  )}, so this day is ${f.ratio.toFixed(1)}× a normal day.`
  const o3 = `Ozone peaked at ${f.ozoneMax.toFixed(0)} µg/m³.`
  const coarse = `Coarse particles (PM10) peaked at ${f.pm10Max.toFixed(
    0
  )} µg/m³ — ${f.coarseRatio.toFixed(1)}× the fine-particle peak. A wind-blown soil event usually runs above 2.5×.`
  return `${pm} ${o3} ${coarse}`
}

function timeClue(c: AirCase): string {
  const f = c.features
  return `PM2.5 was highest at ${hourLabel(c.days[c.focusIndex].pm25PeakHour)}; ozone was highest at ${hourLabel(
    f.ozonePeakHour
  )}. Averaged across the day, the hours from midnight to 8 AM carried ${f.overnightRatio.toFixed(
    1
  )}× the PM2.5 of the early afternoon. Between 9 PM and 4 AM the ozone averaged ${f.ozoneNightMean.toFixed(
    0
  )} µg/m³.`
}

function seasonClue(c: AirCase): string {
  const f = c.features
  const t =
    f.tempMaxF === null
      ? 'No temperature reading was available for this day.'
      : `The day reached ${f.tempMaxF.toFixed(0)}°F.`
  const run =
    f.sustainedDays >= 2
      ? `The elevation held for ${f.sustainedDays} days in a row.`
      : 'The elevation did not hold past this day.'
  return `${prettyDate(c.focusDate)} — ${seasonOf(f.month)}. ${t} ${run}`
}

// ---------------------------------------------------------------------------
// The verdict, written from the evidence rather than from a lookup table
// ---------------------------------------------------------------------------

function verdictBody(c: AirCase): string {
  const f = c.features
  switch (c.suspect) {
    case 'smoke':
      return `PM2.5 ran ${f.ratio.toFixed(
        1
      )}× above the week's normal and stayed there for ${f.sustainedDays} days, high right through the night as well as the day. Only a cloud of particles sitting over the whole area does that. An inversion would have cleared every afternoon; traffic would have come and gone twice a day.`
    case 'ozone':
      return `The particles barely moved (${f.ratio.toFixed(
        1
      )}× normal) while ozone reached ${f.ozoneMax.toFixed(0)} µg/m³ and peaked at ${hourLabel(
        f.ozonePeakHour
      )}. Ozone is not emitted by anything — it is built in the air when sunlight cooks exhaust and vapours together, so it climbs with the sun and collapses after dark.`
    case 'inversion':
      return `PM2.5 was ${f.overnightRatio.toFixed(
        1
      )}× heavier before dawn than in the afternoon, and night-time ozone sat at ${f.ozoneNightMean.toFixed(
        0
      )} µg/m³. On a cold, still night a lid of warm air traps the cold air near the ground, and everything emitted into it stays there until the sun breaks the lid.`
    case 'traffic':
      return `Two humps: the 6–9 AM average ran ${f.morningRatio.toFixed(
        1
      )}× the midday level and the 5–8 PM average ${f.eveningRatio.toFixed(
        1
      )}×, with a quiet middle of the day and no big total. That twice-a-day rhythm is the rhythm of a road, helped along by shallow morning air.`
    case 'dust':
      return `Coarse particles reached ${f.pm10Max.toFixed(0)} µg/m³ against a fine-particle peak of ${f.pm25Max.toFixed(
        0
      )} — a ratio of ${f.coarseRatio.toFixed(
        1
      )} — and the model's dust field peaked at ${f.dustMax.toFixed(
        0
      )}. Combustion makes tiny particles. Wind lifting soil makes big ones.`
    case 'clean':
      return `PM2.5 topped out at ${f.pm25Max.toFixed(1)} µg/m³ and ozone at ${f.ozoneMax.toFixed(
        0
      )}. Nothing here needs explaining, and "nothing happened" is a real finding — it is what you compare the other days against.`
    default:
      return `Something moved: PM2.5 reached ${f.ratio.toFixed(
        1
      )}× the week's normal. But it lasted ${
        f.sustainedDays <= 1 ? 'a single day' : `${f.sustainedDays} days`
      }, which is short for a plume, and the shape fits more than one story — a passing patch of smoke, a still night, or a source close by. A model estimate like this one cannot separate them. The honest verdict is that the evidence does not reach a name.`
  }
}

// ---------------------------------------------------------------------------
// Correlation round
// ---------------------------------------------------------------------------

type CorrOption = 'ozone-up' | 'pm-up' | 'both-up' | 'neither'

const CORR_OPTIONS: { id: CorrOption; label: string }[] = [
  { id: 'ozone-up', label: 'Hotter days push ozone up. Fine particles do not follow the heat.' },
  { id: 'pm-up', label: 'Hotter days push fine particles up. Ozone does not follow the heat.' },
  { id: 'both-up', label: 'Hotter days push both of them up.' },
  { id: 'neither', label: 'Temperature does not move either of them here.' },
]

const STRONG = 0.35

function correlationAnswer(rO: number | null, rP: number | null): CorrOption {
  const o = rO !== null && rO >= STRONG
  const p = rP !== null && rP >= STRONG
  if (o && p) return 'both-up'
  if (o) return 'ozone-up'
  if (p) return 'pm-up'
  return 'neither'
}

// ---------------------------------------------------------------------------
// Rounds
// ---------------------------------------------------------------------------

interface AccuseViewProps {
  round: AccuseRound
  answered: Suspect | null
  onAccuse: (s: Suspect) => void
}

function AccuseView({ round, answered, onAccuse }: AccuseViewProps) {
  const c = round.airCase
  const focus = c.days[c.focusIndex]
  const labels = c.days.map((d) => shortDate(d.date))
  const correct = answered !== null && answered === c.suspect
  const truth = suspectInfo(c.suspect)

  return (
    <div>
      <p className="text-lg text-gray-700 mb-6 max-w-3xl">{round.brief}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <BarChart
          title="Fine particles (PM2.5), day by day"
          subtitle={`Highest reading of each day, ${shortDate(c.days[0].date)}–${shortDate(
            c.days[c.days.length - 1].date
          )}`}
          unit="µg/m³"
          labels={labels}
          values={c.days.map((d) => d.pm25Max)}
          highlight={c.focusIndex}
          color={PM_COLOR}
          rowLabel="PM2.5 peak"
          tableCaption="Daily maximum PM2.5 across the case window"
        />
        <BarChart
          title="Ozone, day by day"
          subtitle="Highest reading of each day, same window"
          unit="µg/m³"
          labels={labels}
          values={c.days.map((d) => d.ozoneMax)}
          highlight={c.focusIndex}
          color={O3_COLOR}
          rowLabel="Ozone peak"
          tableCaption="Daily maximum ozone across the case window"
        />
        <HourChart
          title={`PM2.5 through ${prettyDate(focus.date)}`}
          subtitle="Hour by hour, local time"
          unit="µg/m³"
          values={focus.pm25}
          color={PM_COLOR}
          rowLabel="PM2.5"
          tableCaption="Hourly PM2.5 on the day under investigation"
        />
        <HourChart
          title={`Ozone through ${prettyDate(focus.date)}`}
          subtitle="Hour by hour, local time (dashed line, square markers)"
          unit="µg/m³"
          values={focus.ozone}
          color={O3_COLOR}
          dashed
          rowLabel="Ozone"
          tableCaption="Hourly ozone on the day under investigation"
        />
      </div>

      <h3 className="font-heading font-bold text-xl mt-8 mb-3">The lab reports</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { t: 'Which pollutant moved?', b: pollutantClue(c) },
          { t: 'What time of day?', b: timeClue(c) },
          { t: 'What season, and how warm?', b: seasonClue(c) },
        ].map((clue) => (
          <details key={clue.t} className="card p-4">
            <summary className="cursor-pointer font-semibold text-primary-blue min-h-[44px] flex items-center">
              {clue.t}
            </summary>
            <p className="text-gray-700 mt-2 text-sm leading-relaxed">{clue.b}</p>
          </details>
        ))}
      </div>

      <h3 className="font-heading font-bold text-xl mt-8 mb-1">Name the pattern</h3>
      <p className="text-gray-600 mb-4">
        Pick the explanation the evidence actually supports — including &ldquo;not enough
        evidence&rdquo;, which is a real answer and scores a point when it is the right one.
      </p>

      <ul className="grid gap-3 md:grid-cols-2 list-none p-0">
        {SUSPECTS.map((s) => {
          const picked = answered === s.id
          const isTruth = answered !== null && s.id === c.suspect
          let tone = 'border-gray-200 bg-white'
          if (answered !== null && isTruth) tone = 'border-primary-green bg-green-50'
          else if (picked) tone = 'border-red-500 bg-red-50'
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onAccuse(s.id)}
                disabled={answered !== null}
                aria-pressed={picked}
                className={`w-full text-left p-4 min-h-[44px] rounded-xl border-2 transition-colors disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary-green/50 ${tone} ${
                  answered === null ? 'hover:border-primary-green' : ''
                }`}
              >
                <span className="flex items-start gap-2">
                  {answered !== null && (
                    <span aria-hidden="true" className="font-bold">
                      {isTruth ? '✓' : picked ? '✗' : '·'}
                    </span>
                  )}
                  <span>
                    <span className="block font-semibold text-gray-900">{s.label}</span>
                    <span className="block text-sm text-gray-600 mt-0.5">{s.tell}</span>
                    {answered !== null && isTruth && (
                      <span className="block text-sm font-semibold text-primary-green mt-1">
                        This is what the evidence shows.
                      </span>
                    )}
                    {answered !== null && picked && !isTruth && (
                      <span className="block text-sm font-semibold text-red-700 mt-1">
                        Your accusation.
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {answered !== null && (
        <div className="card p-6 mt-6 border-l-4" style={{ borderLeftColor: correct ? '#34a853' : '#f57c00' }}>
          <p className="font-heading font-bold text-xl mb-2">
            <span aria-hidden="true">{correct ? '✓ ' : '✗ '}</span>
            {correct
              ? c.suspect === 'unknown'
                ? 'Correct — and this is the hardest kind of correct.'
                : 'Correct.'
              : 'Not what the evidence shows.'}
          </p>
          {!correct && answered === 'unknown' && (
            <p className="text-gray-700 mb-3">
              Holding back is a good instinct, but this day does leave enough fingerprints to read.
              Here is the one it left.
            </p>
          )}
          {!correct && answered !== 'unknown' && c.suspect === 'unknown' && (
            <p className="text-gray-700 mb-3">
              You named a suspect. That is the mistake this case was built to catch: the data is
              suggestive, not conclusive, and a scientist who names a cause anyway is guessing in a
              lab coat.
            </p>
          )}
          <p className="font-semibold text-gray-900 mb-1">{truth.label}</p>
          <p className="text-gray-700 leading-relaxed">{verdictBody(c)}</p>

          {c.curated ? (
            <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="font-semibold text-gray-900 mb-1">{c.curated.headline}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{c.curated.body}</p>
              <a
                href={c.curated.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-blue underline text-sm mt-2 inline-block"
              >
                {c.curated.linkLabel}
              </a>
            </div>
          ) : (
            c.suspect === 'smoke' && (
              <p className="mt-4 text-sm text-gray-600 italic">
                What burned? This game will not tell you, because this data cannot. A model estimate
                of particle concentration shows that smoke arrived; it says nothing about the fire,
                the stove or the burn pile that made it. Naming one would be a guess dressed up as a
                fact.
              </p>
            )
          )}
        </div>
      )}
    </div>
  )
}

interface CorrelateViewProps {
  round: CorrelateRound
  answered: CorrOption | null
  rOzone: number | null
  rPm: number | null
  onAnswer: (o: CorrOption) => void
}

function CorrelateView({ round, answered, rOzone, rPm, onAnswer }: CorrelateViewProps) {
  const s = round.series
  const truth = correlationAnswer(rOzone, rPm)
  const correct = answered === truth
  const days = s.tempMaxF.length

  return (
    <div>
      <p className="text-lg text-gray-700 mb-2 max-w-3xl">
        The heat round. Every dot below is one real day in your area between {prettyDate(s.startDate)}{' '}
        and {prettyDate(s.endDate)} — {days} days in all. Across the bottom is how hot that day got.
        Up the side is how bad the air got.
      </p>
      <p className="text-gray-600 mb-6 max-w-3xl">
        Nobody is going to tell you the answer. Read the two charts and decide what temperature does
        to each pollutant.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <ScatterChart
          title="Heat against ozone"
          subtitle="Each dot is one day: its high temperature, and its peak ozone"
          xs={s.tempMaxF}
          ys={s.ozoneMax}
          xUnit="°F"
          yUnit="µg/m³"
          color={O3_COLOR}
          square
          r={rOzone}
          tableCaption="Average peak ozone by temperature band"
        />
        <ScatterChart
          title="Heat against fine particles"
          subtitle="The same days, the same temperatures, the other pollutant"
          xs={s.tempMaxF}
          ys={s.pm25Max}
          xUnit="°F"
          yUnit="µg/m³"
          color={PM_COLOR}
          r={rPm}
          tableCaption="Average peak PM2.5 by temperature band"
        />
      </div>

      <h3 className="font-heading font-bold text-xl mt-8 mb-4">What did you find?</h3>
      <ul className="grid gap-3 list-none p-0">
        {CORR_OPTIONS.map((o) => {
          const picked = answered === o.id
          const isTruth = answered !== null && o.id === truth
          let tone = 'border-gray-200 bg-white'
          if (answered !== null && isTruth) tone = 'border-primary-green bg-green-50'
          else if (picked) tone = 'border-red-500 bg-red-50'
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => onAnswer(o.id)}
                disabled={answered !== null}
                aria-pressed={picked}
                className={`w-full text-left p-4 min-h-[44px] rounded-xl border-2 transition-colors disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary-green/50 ${tone} ${
                  answered === null ? 'hover:border-primary-green' : ''
                }`}
              >
                <span className="flex items-start gap-2">
                  {answered !== null && (
                    <span aria-hidden="true" className="font-bold">
                      {isTruth ? '✓' : picked ? '✗' : '·'}
                    </span>
                  )}
                  <span className="text-gray-900">{o.label}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {answered !== null && (
        <div
          className="card p-6 mt-6 border-l-4"
          style={{ borderLeftColor: correct ? '#34a853' : '#f57c00' }}
        >
          <p className="font-heading font-bold text-xl mb-2">
            <span aria-hidden="true">{correct ? '✓ ' : '✗ '}</span>
            {correct ? 'That is what your data says.' : 'Read the band averages again.'}
          </p>
          <p className="text-gray-700 leading-relaxed">
            Across these {days} days, temperature and peak ozone correlate at{' '}
            <span className="font-semibold tabular-nums">
              r = {rOzone === null ? 'n/a' : rOzone.toFixed(2)}
            </span>{' '}
            ({rOzone === null ? 'not computable' : correlationWord(rOzone)}). Temperature and peak
            PM2.5 correlate at{' '}
            <span className="font-semibold tabular-nums">
              r = {rPm === null ? 'n/a' : rPm.toFixed(2)}
            </span>{' '}
            ({rPm === null ? 'not computable' : correlationWord(rPm)}).
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Ozone is not emitted. It is assembled in the air out of exhaust and vapours, and the
            reaction runs on sunlight and heat — so the hotter the afternoon, the more of it gets
            built. Particles come straight out of something burning, and a thermometer has very
            little to say about whether something is burning. That is why one of those numbers is
            large and the other is not.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            This is also why shade is an air-quality measure and not just a comfort. A street of
            asphalt and parked cars runs hotter than a street with a canopy over it, and hotter air
            cooks more ozone out of the same exhaust. Planting the block is not decoration.
          </p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Game
// ---------------------------------------------------------------------------

interface GameProps {
  place: Place
  isDemo: boolean
  onChangePlace: () => void
}

type Phase = 'loading' | 'playing' | 'done' | 'error'

function AirDetective({ place, isDemo, onChangePlace }: GameProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [rounds, setRounds] = useState<Round[]>([])
  const [source, setSource] = useState<'live' | 'fixture'>('live')
  const [fallbackReason, setFallbackReason] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(Suspect | CorrOption | null)[]>([])
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [nonce, setNonce] = useState(0)
  const recorded = useRef(false)

  const event = useMemo(() => getNextEvent(), [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    setPhase('loading')
    setRounds([])
    setIndex(0)
    setAnswers([])
    setScore(0)
    setAnnouncement('')
    setFallbackReason(null)
    recorded.current = false
    setBest(getBestScore(GAME_KEY).best)

    function fallBackToFixture(reason: string | null) {
      const fx = fixtureDossier()
      const built = buildRounds(fx.cases, fx.correlation)
      if (cancelled) return
      setSource('fixture')
      setFallbackReason(reason)
      setRounds(built)
      setAnswers(new Array(built.length).fill(null))
      setPhase(built.length ? 'playing' : 'error')
    }

    async function load() {
      const res = await fetchAirDossier(place, controller.signal)
      if (cancelled) return

      if (!res.ok) {
        fallBackToFixture(failureMessage(res))
        return
      }

      const cases = detectCases(res.data.days, place)
      if (cases.length < MIN_CASES) {
        fallBackToFixture(
          `The air-quality model returned only ${cases.length} readable case${
            cases.length === 1 ? '' : 's'
          } for ${place.city} in the past year — not enough to build a full investigation.`
        )
        return
      }

      const built = buildRounds(cases, res.data.correlation)
      if (accusationCount(built) < MIN_CASES) {
        fallBackToFixture(
          `${place.city}'s data did not contain enough different kinds of air-pollution day to build a full investigation.`
        )
        return
      }

      setSource('live')
      setRounds(built)
      setAnswers(new Array(built.length).fill(null))
      setPhase('playing')
    }

    void load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [place, nonce])

  const round = rounds[index]
  const answered = answers[index] ?? null

  const corrStats = useMemo(() => {
    const r = rounds.find((x): x is CorrelateRound => x.kind === 'correlate')
    if (!r) return { rOzone: null as number | null, rPm: null as number | null }
    return {
      rOzone: pearson(r.series.tempMaxF, r.series.ozoneMax),
      rPm: pearson(r.series.tempMaxF, r.series.pm25Max),
    }
  }, [rounds])

  const advance = useCallback(
    (wasCorrect: boolean, headline: string) => {
      if (wasCorrect) setScore((s) => s + 1)
      const last = index === rounds.length - 1
      setAnnouncement(
        `${headline} ${last ? 'That was the last case.' : `Case ${index + 2} of ${rounds.length} is ready.`}`
      )
    },
    [index, rounds.length]
  )

  function accuse(s: Suspect) {
    if (!round || round.kind !== 'accuse' || answered !== null) return
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = s
      return next
    })
    const right = s === round.airCase.suspect
    advance(
      right,
      right
        ? `Correct. The evidence points to ${suspectInfo(round.airCase.suspect).label.toLowerCase()}.`
        : `Not quite. The evidence points to ${suspectInfo(round.airCase.suspect).label.toLowerCase()}.`
    )
  }

  function answerCorrelation(o: CorrOption) {
    if (!round || round.kind !== 'correlate' || answered !== null) return
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = o
      return next
    })
    const right = o === correlationAnswer(corrStats.rOzone, corrStats.rPm)
    advance(right, right ? 'Correct.' : 'Not what your data shows.')
  }

  function next() {
    if (index < rounds.length - 1) {
      setIndex((i) => i + 1)
      setAnnouncement(`Case ${index + 2} of ${rounds.length}.`)
      return
    }
    if (!recorded.current) {
      recorded.current = true
      setBest(recordScore(GAME_KEY, score).best)
    }
    setPhase('done')
    setAnnouncement(`Case file closed. You read ${score} of ${rounds.length} correctly.`)
  }

  const restart = useCallback(() => setNonce((n) => n + 1), [])

  const dataNote = (
    <DataSourceNote
      sources={[
        { label: 'Open-Meteo Air Quality API', href: 'https://open-meteo.com/en/docs/air-quality-api' },
        { label: 'Copernicus CAMS', href: 'https://atmosphere.copernicus.eu/' },
        { label: 'AirNow (US EPA) — find your nearest real monitor', href: MONITOR_URL },
      ]}
      isFixture={source === 'fixture'}
      fixtureLabel={
        fallbackReason
          ? playsInFixtureCity(place)
            ? `Showing a saved Cerritos, CA sample — your city, but not today's readings. ${fallbackReason}`
            : `Showing sample data from Cerritos, CA — not from ${place.city}. ${fallbackReason}`
          : undefined
      }
      note={
        'Important: these numbers are CAMS model reanalysis, not readings from a monitor. A computer model of the atmosphere, corrected against satellite and ground observations, is asked what the air was probably like at your coordinates. It is good at regional patterns and honest about nothing else — it smooths over anything local, like one smoky chimney or one busy intersection, and it is not a legal or medical measurement. For an actual instrument near you, and for the AQI you should check before exercising, use AirNow.'
      }
    />
  )

  if (phase === 'loading') {
    return (
      <GameShell
        title="Air Detective"
        tagline="Six real days near you. Something moved the air. Work out what."
        place={place}
        isDemo={isDemo}
        onChangePlace={onChangePlace}
        announcement="Reading a year of air-quality data for your area."
      >
        <div aria-busy="true">
          <div className="h-8 w-2/3 rounded bg-gray-100 animate-pulse motion-reduce:animate-none mb-6" />
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 rounded-xl bg-gray-100 animate-pulse motion-reduce:animate-none"
              />
            ))}
          </div>
          <p className="text-gray-600 mt-6">
            Pulling a year of hourly readings for {place.city}, {place.state} and looking for days
            worth investigating.
          </p>
        </div>
      </GameShell>
    )
  }

  if (phase === 'error' || !round) {
    return (
      <GameShell
        title="Air Detective"
        tagline="Six real days near you. Something moved the air. Work out what."
        place={place}
        isDemo={isDemo}
        onChangePlace={onChangePlace}
        announcement="No case file could be built."
      >
        <div className="card p-6 max-w-2xl">
          <h2 className="font-heading font-bold text-2xl mb-2">No case file this time</h2>
          <p className="text-gray-700 mb-4">
            {fallbackReason ??
              'The air-quality service could not be reached, and the bundled sample could not be read either.'}
          </p>
          <button type="button" onClick={restart} className="btn btn-primary">
            Try again
          </button>
        </div>
        {dataNote}
      </GameShell>
    )
  }

  if (phase === 'done') {
    const accusations = accusationCount(rounds)
    return (
      <GameShell
        title="Air Detective"
        tagline="Six real days near you. Something moved the air. Work out what."
        place={place}
        isDemo={isDemo}
        onChangePlace={onChangePlace}
        announcement={announcement}
        score={[
          { label: 'Cases read correctly', value: `${score} / ${rounds.length}` },
          { label: 'Best on this device', value: `${best} / ${rounds.length}` },
        ]}
        onRestart={restart}
      >
        <div className="card p-6 max-w-3xl">
          <h2 className="font-heading font-bold text-2xl mb-3 text-primary-green">
            Case file closed
          </h2>
          <p className="text-gray-700 mb-4">
            You read {score} of {rounds.length} correctly across {accusations} accusations
            {rounds.length > accusations ? ' and one heat analysis' : ''}, all of it from{' '}
            {source === 'live' ? (
              <>
                real modelled air data for {place.city}, {place.state}
              </>
            ) : (
              <>the bundled Cerritos, CA sample</>
            )}
            .
          </p>
          <p className="text-gray-700 mb-4">
            The point was never the score. It was this: <strong>&ldquo;bad air&rdquo; is not one
            thing.</strong> Fine particles come out of something burning and hang around for days.
            Ozone is not emitted at all — it is built in the air by sunlight, peaks in the
            mid-afternoon and is gone by night. They have different causes, different clocks and
            different fixes, and a town can have a serious problem with one and none with the other.
          </p>
          <p className="text-gray-700">
            And when the evidence ran out, the right answer was to say so. That is not a failure to
            solve the case. It is the part of science that keeps the rest of it trustworthy.
          </p>
        </div>

        <ImpactPanel
          mission={{
            title: 'Find the real monitor nearest you',
            body: 'Everything you just read was a model. Go find the instrument. Open AirNow, type in your ZIP, and note the name of the closest monitoring site and how far away it is — in many suburbs it is miles from where you actually breathe. Then check the AQI there before your next practice, run or walk, and see whether you would have changed anything.',
            mailtoSubject: 'Air Detective: the nearest air monitor to my ZIP',
          }}
          science={{
            title: 'Run the Air Quality Flag Program',
            body: 'A real EPA and AirNow program for schools: each morning a class checks the AQI forecast and raises the matching coloured flag, and the school adjusts outdoor activity to match. It costs a set of flags and five minutes a day, and it is genuine public-health practice rather than a simulation.',
            href: FLAG_PROGRAM_URL,
            linkLabel: 'Start a flag program',
          }}
          event={event}
          onPrint={() => window.print()}
          printLabel="Print the flag-program sheet"
        />

        {dataNote}
      </GameShell>
    )
  }

  const caseNumber = index + 1

  return (
    <GameShell
      title="Air Detective"
      tagline="Six real days near you. Something moved the air. Work out what."
      place={place}
      isDemo={isDemo}
      onChangePlace={onChangePlace}
      announcement={announcement}
      score={[
        { label: 'Case', value: `${caseNumber} / ${rounds.length}` },
        { label: 'Read correctly', value: score },
      ]}
      onRestart={restart}
    >
      {source === 'fixture' && (
        <div className="card p-4 mb-6 border-l-4 border-l-accent-orange bg-orange-50">
          {playsInFixtureCity(place) ? (
            <>
              <p className="font-semibold text-gray-900">
                These are real Cerritos days — but saved ones, not this week&apos;s.
              </p>
              <p className="text-gray-700 text-sm mt-1">
                {fallbackReason} The days below were recorded for your own city, so everything it
                teaches applies directly; only the dates are older than today.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-900">
                These are not {place.city}&apos;s days — they are Cerritos, CA&apos;s.
              </p>
              <p className="text-gray-700 text-sm mt-1">
                {fallbackReason} The game is still real data, just somebody else&apos;s. Everything
                it teaches still applies to your town; the dates and numbers do not.
              </p>
            </>
          )}
        </div>
      )}

      <p className="text-sm uppercase tracking-wide font-semibold text-gray-500 mb-1">
        Level {round.level} ·{' '}
        {round.level === 1
          ? 'the obvious one'
          : round.level === 2
            ? 'telling two pollutants apart'
            : 'knowing when to stop'}
      </p>

      {round.kind === 'accuse' ? (
        <AccuseView
          round={round}
          answered={(answered as Suspect | null) ?? null}
          onAccuse={accuse}
        />
      ) : (
        <CorrelateView
          round={round}
          answered={(answered as CorrOption | null) ?? null}
          rOzone={corrStats.rOzone}
          rPm={corrStats.rPm}
          onAnswer={answerCorrelation}
        />
      )}

      {answered !== null && (
        <div className="mt-6">
          <button type="button" onClick={next} className="btn btn-primary">
            {index === rounds.length - 1 ? 'Close the case file' : 'Next case'}
          </button>
        </div>
      )}

      {dataNote}
      <FlagSheet place={place} isFixture={source === 'fixture'} />
    </GameShell>
  )
}

// ---------------------------------------------------------------------------
// Printable classroom sheet
// ---------------------------------------------------------------------------

/**
 * AQI categories, breakpoints and cautionary wording are the US EPA's, as
 * published on AirNow. They are quoted, not invented, and the sheet cites where
 * they came from so a teacher can check.
 */
const AQI_BANDS = [
  { flag: 'Green', range: '0–50', name: 'Good', action: 'Everyone can be active outdoors.' },
  {
    flag: 'Yellow',
    range: '51–100',
    name: 'Moderate',
    action: 'Unusually sensitive students should watch for symptoms and take it easier.',
  },
  {
    flag: 'Orange',
    range: '101–150',
    name: 'Unhealthy for Sensitive Groups',
    action:
      'Students with asthma or heart or lung conditions take more breaks and do less intense activity.',
  },
  {
    flag: 'Red',
    range: '151–200',
    name: 'Unhealthy',
    action: 'Everyone cuts back on long or intense outdoor activity. Move practice indoors.',
  },
  {
    flag: 'Purple',
    range: '201–300',
    name: 'Very Unhealthy',
    action: 'Move all activities indoors, or reschedule them.',
  },
  {
    flag: 'Maroon',
    range: '301+',
    name: 'Hazardous',
    action: 'Everyone stays indoors and keeps activity light.',
  },
]

function FlagSheet({ place, isFixture }: { place: Place; isFixture: boolean }) {
  return (
    <div className="print-sheet">
      <h1 style={{ fontSize: '20pt', fontWeight: 700, marginBottom: '4pt' }}>
        Air Quality Flag Program — one-week log
      </h1>
      <p style={{ marginBottom: '10pt' }}>
        School / class: ______________________________ Week of: ______________
        <br />
        Location: {place.city}, {place.state} {place.zip}
        {isFixture && ' (the on-screen game used the saved Cerritos, CA sample)'}
        <br />
        Nearest official monitoring site (find it at airnow.gov):
        ______________________________ Distance: ________
      </p>

      <h2 style={{ fontSize: '14pt', fontWeight: 700, margin: '10pt 0 4pt' }}>
        The flags, and what each one means
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>Flag</th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>AQI</th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>Category</th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>
              What the school does
            </th>
          </tr>
        </thead>
        <tbody>
          {AQI_BANDS.map((b) => (
            <tr key={b.flag}>
              <td style={{ border: '1px solid #666', padding: '4pt' }}>{b.flag}</td>
              <td style={{ border: '1px solid #666', padding: '4pt' }}>{b.range}</td>
              <td style={{ border: '1px solid #666', padding: '4pt' }}>{b.name}</td>
              <td style={{ border: '1px solid #666', padding: '4pt' }}>{b.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: '14pt', fontWeight: 700, margin: '12pt 0 4pt' }}>This week</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>Day</th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>AQI</th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>
              Main pollutant (PM2.5 or ozone?)
            </th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>Flag</th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>
              High temp (°F)
            </th>
            <th style={{ border: '1px solid #666', padding: '4pt', textAlign: 'left' }}>
              What we changed
            </th>
          </tr>
        </thead>
        <tbody>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
            <tr key={d}>
              <td style={{ border: '1px solid #666', padding: '10pt 4pt' }}>{d}</td>
              <td style={{ border: '1px solid #666', padding: '10pt 4pt' }} />
              <td style={{ border: '1px solid #666', padding: '10pt 4pt' }} />
              <td style={{ border: '1px solid #666', padding: '10pt 4pt' }} />
              <td style={{ border: '1px solid #666', padding: '10pt 4pt' }} />
              <td style={{ border: '1px solid #666', padding: '10pt 4pt' }} />
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: '14pt', fontWeight: 700, margin: '12pt 0 4pt' }}>
        Questions to answer on Friday
      </h2>
      <ol style={{ paddingLeft: '16pt', fontSize: '10pt', lineHeight: 1.9 }}>
        <li>
          On the days when ozone was the main pollutant, what time of day was the air worst? What
          about on the days when PM2.5 was the main pollutant?
        </li>
        <li>
          Compare your temperature column with your AQI column. Which pollutant followed the
          thermometer, and which one ignored it?
        </li>
        <li>
          Was there a day this week where you could not tell what caused the reading? Write down
          what extra evidence you would have needed.
        </li>
        <li>
          Where is the nearest monitor, and who lives between it and your school? Would a reading
          taken there describe their air as well as yours?
        </li>
      </ol>

      <p style={{ fontSize: '9pt', marginTop: '12pt' }}>
        AQI categories, breakpoints and activity guidance are published by the US EPA at{' '}
        {AQI_BASICS_URL}. Program details at {FLAG_PROGRAM_URL}. Worksheet by EcoQuest Foundation to
        accompany the Air Detective game; the game itself uses Copernicus CAMS model reanalysis
        served by Open-Meteo, which is a model estimate and not a monitor reading.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------

export default function AirDetectivePage() {
  // PlaceGate owns the only usePlace() instance that matters and hands back its
  // own "change location" callback, so the game never touches storage directly.
  // Keying the game on the ZIP restarts the investigation when the place moves.
  return (
    <PlaceGate purpose="Air Detective reads a year of real hourly pollution readings for your ZIP code, then hides the causes and asks you to work them out.">
      {(place, isDemo, changePlace) => (
        <AirDetective
          key={place.zip}
          place={place}
          isDemo={isDemo}
          onChangePlace={changePlace}
        />
      )}
    </PlaceGate>
  )
}
