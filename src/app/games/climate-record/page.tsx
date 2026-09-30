'use client'

// Your Climate Record — PREDICT.
//
// The player commits to a number about their own town *before* any data loads,
// then meets the real 1950-to-now daily record for their coordinates.
//
// The design constraint that shaped everything here: for a lot of American
// towns the local warming signal is small and non-monotonic. Cerritos, this
// site's own city, warms about +0.75 °F over seventy years, with the 1970s
// landing cooler than the 1950s and four of six decade-to-decade steps going
// down. A game built to always deliver a dramatic reveal would have to
// misrepresent that record to do it. So the game scores *calibration*: guess
// "small and noisy" for a town that is small and noisy and you get full marks,
// and over-predicting warming costs exactly as much as under-predicting it.
//
// One network call per location per session covers the whole 75-year record.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import DataSourceNote from '@/components/games/DataSourceNote'
import GameShell from '@/components/games/GameShell'
import ImpactPanel from '@/components/games/ImpactPanel'
import PlaceGate from '@/components/games/PlaceGate'
import { failureMessage } from '@/lib/api/client'
import {
  fetchClimateRecord,
  HOT_DAY_F,
  type ClimateRecord,
  type ClimateWindow,
  type DecadeWindow,
  type SignalStrength,
} from '@/lib/api/openMeteoArchive'
import { CERRITOS_CLIMATE_RECORD, CERRITOS_FIXTURE_LABEL } from '@/lib/fixtures/climateRecord'
import { getNextEvent } from '@/lib/nextEvent'
import { type Place } from '@/lib/place'
import { getBestScore, recordScore, type BestScore } from '@/lib/progress'

const GAME_KEY = 'climate-record'

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

function f1(n: number): string {
  return n.toFixed(1)
}

/** Signed change, with a real minus sign rather than a hyphen. */
function signedF(n: number, digits: number): string {
  const v = Number(n.toFixed(digits))
  if (v === 0) return `±0${digits > 0 ? `.${'0'.repeat(digits)}` : ''}`
  return `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(digits)}`
}

function spokenTemp(v: number): string {
  if (v === 0) return 'no change since the 1950s'
  const n = Math.abs(v).toFixed(2).replace(/0$/, '')
  return `${n} degrees Fahrenheit ${v > 0 ? 'warmer' : 'cooler'} than the 1950s`
}

function spokenHotDays(v: number): string {
  if (v === 0) return 'the same number of days at or above 90 degrees'
  return `${Math.abs(v)} ${v > 0 ? 'more' : 'fewer'} days at or above 90 degrees each year`
}

/* ------------------------------------------------------------------ */
/* Scoring — bands on |predicted − actual|, never "more warming is better"  */
/* ------------------------------------------------------------------ */

interface Band {
  within: number
  points: number
  verdict: string
}

const TEMP_BANDS: Band[] = [
  { within: 0.3, points: 40, verdict: 'Spot on' },
  { within: 0.75, points: 32, verdict: 'Close' },
  { within: 1.5, points: 22, verdict: 'Right ballpark' },
  { within: 3, points: 10, verdict: 'Off' },
]

const HOT_BANDS: Band[] = [
  { within: 2, points: 40, verdict: 'Spot on' },
  { within: 5, points: 32, verdict: 'Close' },
  { within: 10, points: 22, verdict: 'Right ballpark' },
  { within: 20, points: 10, verdict: 'Off' },
]

const MISS: Band = { within: Infinity, points: 0, verdict: 'Way off' }

function scoreNumeric(bands: Band[], predicted: number, actual: number): Band & { error: number } {
  const error = Math.abs(predicted - actual)
  const hit = bands.find((b) => error <= b.within) ?? MISS
  return { ...hit, error }
}

const SIGNAL_ORDER: SignalStrength[] = ['noise', 'modest', 'clear']

const SIGNAL_CHOICES: { value: SignalStrength; title: string; blurb: string }[] = [
  {
    value: 'noise',
    title: 'Mostly noise',
    blurb: 'Decades bounce around, but there is no trend you could point at.',
  },
  {
    value: 'modest',
    title: 'A modest trend',
    blurb: 'It moves one way overall, but single decades go the other way.',
  },
  {
    value: 'clear',
    title: 'A clear trend',
    blurb: 'The rise is bigger than the wobble. Hard to miss.',
  },
]

function scoreSignal(predicted: SignalStrength, actual: SignalStrength): Band {
  const distance = Math.abs(SIGNAL_ORDER.indexOf(predicted) - SIGNAL_ORDER.indexOf(actual))
  if (distance === 0) return { within: 0, points: 20, verdict: 'Matched the record' }
  if (distance === 1) return { within: 1, points: 10, verdict: 'One band off' }
  return { within: 2, points: 0, verdict: 'Opposite read' }
}

interface Guess {
  tempDelta: number
  hotDelta: number
  signal: SignalStrength
}

interface ScoreLine {
  key: string
  question: string
  predicted: string
  actual: string
  points: number
  max: number
  verdict: string
  /** Redundant with colour on purpose: colour is never the only signal. */
  mark: '✓' | '≈' | '✗'
}

interface Scorecard {
  lines: ScoreLine[]
  total: number
}

function buildScorecard(guess: Guess, record: ClimateRecord): Scorecard {
  const temp = scoreNumeric(TEMP_BANDS, guess.tempDelta, record.temperature.change)
  const hot = scoreNumeric(HOT_BANDS, guess.hotDelta, record.hotDays.change)
  const signal = scoreSignal(guess.signal, record.temperature.strength)

  const mark = (points: number, max: number): '✓' | '≈' | '✗' =>
    points === max ? '✓' : points > 0 ? '≈' : '✗'

  const signalTitle = (s: SignalStrength) =>
    SIGNAL_CHOICES.find((c) => c.value === s)?.title ?? s

  const lines: ScoreLine[] = [
    {
      key: 'temp',
      question: 'Change in the average daily high',
      predicted: `${signedF(guess.tempDelta, 2)} °F`,
      actual: `${signedF(record.temperature.change, 2)} °F`,
      points: temp.points,
      max: 40,
      verdict: `${temp.verdict} — off by ${temp.error.toFixed(2)} °F`,
      mark: mark(temp.points, 40),
    },
    {
      key: 'hot',
      question: `Change in days at or above ${HOT_DAY_F} °F`,
      predicted: `${signedF(guess.hotDelta, 0)} days/year`,
      actual: `${signedF(record.hotDays.change, 1)} days/year`,
      points: hot.points,
      max: 40,
      verdict: `${hot.verdict} — off by ${hot.error.toFixed(1)} days`,
      mark: mark(hot.points, 40),
    },
    {
      key: 'signal',
      question: 'How clear the temperature trend is',
      predicted: signalTitle(guess.signal),
      actual: signalTitle(record.temperature.strength),
      points: signal.points,
      max: 20,
      verdict: signal.verdict,
      mark: mark(signal.points, 20),
    },
  ]

  return { lines, total: lines.reduce((a, l) => a + l.points, 0) }
}

/* ------------------------------------------------------------------ */
/* Inline SVG charts — no chart library, and a real table for every one */
/* ------------------------------------------------------------------ */

const CHART_W = 720
const CHART_H = 330
const PAD = { left: 68, right: 132, top: 20, bottom: 74 }
const PLOT_W = CHART_W - PAD.left - PAD.right
const PLOT_H = CHART_H - PAD.top - PAD.bottom

interface ChartProps {
  kind: 'line' | 'bar'
  decades: DecadeWindow[]
  /** Pulls the plotted number out of a decade. */
  pick: (d: DecadeWindow) => number
  baseline: DecadeWindow
  recent: ClimateWindow
  recentValue: number
  unit: string
  unitShort: string
  color: string
  title: string
  /** One plain sentence stating what the chart shows. */
  summary: string
  valueHeading: string
}

function DecadeChart({
  kind,
  decades,
  pick,
  baseline,
  recent,
  recentValue,
  unit,
  unitShort,
  color,
  title,
  summary,
  valueHeading,
}: ChartProps) {
  const [showTable, setShowTable] = useState(false)
  const uid = useId().replace(/:/g, '')
  const tableId = `tbl-${uid}`

  const values = decades.map(pick)
  const baselineValue = pick(baseline)
  const pool = [...values, baselineValue, recentValue]
  const rawMin = Math.min(...pool)
  const rawMax = Math.max(...pool)
  const pad = (rawMax - rawMin) * 0.25 || 1
  const yMin = kind === 'bar' ? 0 : rawMin - pad
  const yMax = rawMax + pad
  const span = yMax - yMin || 1

  const n = decades.length
  const slot = PLOT_W / n
  const cx = (i: number) => PAD.left + (i + 0.5) * slot
  const cy = (v: number) => PAD.top + PLOT_H * (1 - (v - yMin) / span)

  const ticks = [0, 1, 2, 3, 4].map((i) => yMin + (span * i) / 4)

  const completeIdx = decades.map((d, i) => (d.complete ? i : -1)).filter((i) => i >= 0)
  const solidPath = completeIdx.map((i) => `${cx(i)},${cy(values[i])}`).join(' ')
  const lastComplete = completeIdx.length > 0 ? completeIdx[completeIdx.length - 1] : null
  const partialIdx = decades.map((d, i) => (d.complete ? -1 : i)).filter((i) => i >= 0)

  // Two dashed reference lines — the 1950s average and the most recent ten
  // years — because the gap between them *is* the number the player guessed.
  const baseY = cy(baselineValue)
  const recentY = cy(recentValue)
  const labelNudge = Math.abs(baseY - recentY) < 26 ? (baseY <= recentY ? -12 : 12) : 0
  const barW = Math.min(46, slot * 0.6)

  const hasPartial = partialIdx.length > 0

  return (
    <figure className="card p-5 md:p-6 m-0">
      <figcaption className="mb-1 font-heading font-bold text-lg text-gray-900">{title}</figcaption>
      <p className="text-sm text-gray-600 mb-4">{summary}</p>

      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={PAD.left + PLOT_W}
              y1={cy(t)}
              y2={cy(t)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text x={PAD.left - 10} y={cy(t) + 4} textAnchor="end" fontSize={12} fill="#6b7280">
              {f1(t)}
            </text>
          </g>
        ))}

        <line
          x1={PAD.left}
          x2={PAD.left + PLOT_W}
          y1={PAD.top + PLOT_H}
          y2={PAD.top + PLOT_H}
          stroke="#9ca3af"
          strokeWidth={1.5}
        />

        {/* Reference: the baseline decade. */}
        <line
          x1={PAD.left}
          x2={PAD.left + PLOT_W}
          y1={baseY}
          y2={baseY}
          stroke="#6b7280"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text
          x={PAD.left + PLOT_W + 8}
          y={baseY - labelNudge - 2}
          fontSize={12}
          fill="#4b5563"
          fontWeight={600}
        >
          {baseline.label} avg
        </text>
        <text x={PAD.left + PLOT_W + 8} y={baseY - labelNudge + 13} fontSize={12} fill="#4b5563">
          {f1(baselineValue)} {unitShort}
        </text>

        {/* Reference: the most recent ten complete years. */}
        <line
          x1={PAD.left}
          x2={PAD.left + PLOT_W}
          y1={recentY}
          y2={recentY}
          stroke="#137333"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text
          x={PAD.left + PLOT_W + 8}
          y={recentY + labelNudge - 2}
          fontSize={12}
          fill="#137333"
          fontWeight={600}
        >
          {recent.label}
        </text>
        <text x={PAD.left + PLOT_W + 8} y={recentY + labelNudge + 13} fontSize={12} fill="#137333">
          {f1(recentValue)} {unitShort}
        </text>

        {kind === 'bar' &&
          decades.map((d, i) => (
            <rect
              key={d.label}
              x={cx(i) - barW / 2}
              y={cy(values[i])}
              width={barW}
              height={Math.max(1, PAD.top + PLOT_H - cy(values[i]))}
              fill={color}
              fillOpacity={d.complete ? 0.85 : 0.35}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray={d.complete ? undefined : '4 3'}
            />
          ))}

        {kind === 'line' && (
          <>
            <polyline points={solidPath} fill="none" stroke={color} strokeWidth={3} />
            {partialIdx.map((i) =>
              lastComplete === null ? null : (
                <line
                  key={`seg-${i}`}
                  x1={cx(lastComplete)}
                  y1={cy(values[lastComplete])}
                  x2={cx(i)}
                  y2={cy(values[i])}
                  stroke={color}
                  strokeWidth={3}
                  strokeDasharray="5 5"
                />
              ),
            )}
            {decades.map((d, i) => (
              <circle
                key={d.label}
                cx={cx(i)}
                cy={cy(values[i])}
                r={6}
                fill={d.complete ? color : '#ffffff'}
                stroke={color}
                strokeWidth={2.5}
              />
            ))}
          </>
        )}

        {decades.map((d, i) => (
          <g key={`lbl-${d.label}`}>
            <text
              x={cx(i)}
              y={cy(values[i]) - 14}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="#374151"
            >
              {f1(values[i])}
            </text>
            <text
              x={cx(i)}
              y={PAD.top + PLOT_H + 22}
              textAnchor="middle"
              fontSize={13}
              fill="#374151"
            >
              {d.label}
              {d.complete ? '' : '*'}
            </text>
          </g>
        ))}

        <text x={PAD.left} y={CHART_H - 26} fontSize={12} fill="#6b7280">
          {unit}
        </text>
        {hasPartial && (
          <text x={PAD.left} y={CHART_H - 8} fontSize={12} fill="#6b7280">
            * decade still in progress — shown dashed and left out of the trend line
          </text>
        )}
      </svg>

      <div className="mt-4 flex items-center gap-3 print:hidden">
        {/*
         * No aria-expanded here: the table below is never removed from the
         * accessibility tree, so announcing it as collapsed would be a lie.
         * This button only changes whether it is drawn on screen.
         */}
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-controls={tableId}
          className="btn btn-outline min-h-[44px] text-sm"
        >
          {showTable ? 'Hide the numbers on screen' : 'Show the numbers on screen'}
        </button>
      </div>

      {/* Always in the accessibility tree; only the visual styling toggles. */}
      <div id={tableId} className={showTable ? 'mt-4 overflow-x-auto' : 'sr-only'}>
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-sm text-gray-600 mb-2">
            {title}. {summary}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="text-left py-2 pr-4 border-b border-gray-300">
                Decade
              </th>
              <th scope="col" className="text-left py-2 pr-4 border-b border-gray-300">
                {valueHeading}
              </th>
              <th scope="col" className="text-left py-2 border-b border-gray-300">
                Years averaged
              </th>
            </tr>
          </thead>
          <tbody>
            {decades.map((d, i) => (
              <tr key={d.label}>
                <th scope="row" className="text-left font-normal py-2 pr-4 border-b border-gray-200">
                  {d.label} {d.complete ? '' : '(in progress)'}
                </th>
                <td className="py-2 pr-4 border-b border-gray-200">{f1(values[i])}</td>
                <td className="py-2 border-b border-gray-200">{d.years}</td>
              </tr>
            ))}
            <tr>
              <th scope="row" className="text-left font-semibold py-2 pr-4 border-b border-gray-300">
                {recent.label} (most recent 10 full years)
              </th>
              <td className="py-2 pr-4 font-semibold border-b border-gray-300">{f1(recentValue)}</td>
              <td className="py-2 border-b border-gray-300">{recent.years}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ClimateRecordPage() {
  // PlaceGate owns the ZIP state, so "change location" clears storage and
  // remounts the gate rather than trying to reach into it.

  return (
    <PlaceGate
      purpose="We use your ZIP to pull the real daily temperature record for your exact coordinates, going back to 1950."
    >
      {(place, isDemo, onChangePlace) => (
        <ClimateRecordGame
          key={`${place.lat},${place.lon}`}
          place={place}
          isDemo={isDemo}
          onChangePlace={onChangePlace}
        />
      )}
    </PlaceGate>
  )
}

type Phase = 'predict' | 'loading' | 'reveal'

interface Loaded {
  record: ClimateRecord
  isFixture: boolean
  notice: string | null
}

interface GameProps {
  place: Place
  isDemo: boolean
  onChangePlace: () => void
}

function ClimateRecordGame({ place, isDemo, onChangePlace }: GameProps) {
  const [phase, setPhase] = useState<Phase>('predict')
  const [tempDelta, setTempDelta] = useState(0)
  const [hotDelta, setHotDelta] = useState(0)
  const [signal, setSignal] = useState<SignalStrength>('modest')
  const [locked, setLocked] = useState<Guess | null>(null)
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [best, setBest] = useState<BestScore>({ best: 0, played: 0 })

  useEffect(() => {
    setBest(getBestScore(GAME_KEY))
  }, [])

  // One request per location, reused if the player replays this session.
  useEffect(() => {
    if (phase !== 'loading') return
    if (loaded) {
      setPhase('reveal')
      return
    }

    const controller = new AbortController()
    let cancelled = false

    void (async () => {
      const res = await fetchClimateRecord(place.lat, place.lon, { signal: controller.signal })
      if (cancelled) return
      setLoaded(
        res.ok
          ? { record: res.data, isFixture: false, notice: null }
          : {
              record: CERRITOS_CLIMATE_RECORD,
              isFixture: true,
              notice: failureMessage(res),
            },
      )
      setPhase('reveal')
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [phase, loaded, place.lat, place.lon])

  const scorecard = useMemo(
    () => (locked && loaded ? buildScorecard(locked, loaded.record) : null),
    [locked, loaded],
  )

  // Record the run and speak the result once per reveal.
  const recorded = useRef(false)
  useEffect(() => {
    if (phase !== 'reveal' || !scorecard || !loaded) return
    if (recorded.current) return
    recorded.current = true
    setBest(recordScore(GAME_KEY, scorecard.total))
    setAnnouncement(
      `Record loaded. ${loaded.record.temperature.headline}. ` +
        `The average daily high changed ${signedF(loaded.record.temperature.change, 2)} degrees Fahrenheit ` +
        `and days at or above ${HOT_DAY_F} changed by ${signedF(loaded.record.hotDays.change, 1)} per year. ` +
        `You scored ${scorecard.total} out of 100 for calibration.`,
    )
  }, [phase, scorecard, loaded])

  const lockIn = useCallback(() => {
    setLocked({ tempDelta, hotDelta, signal })
    setPhase('loading')
    setAnnouncement(
      `Prediction locked in: ${spokenTemp(tempDelta)}, ${spokenHotDays(hotDelta)}. Loading 75 years of daily records for ${place.city}.`,
    )
  }, [tempDelta, hotDelta, signal, place.city])

  const restart = useCallback(() => {
    recorded.current = false
    setLocked(null)
    setPhase('predict')
    setAnnouncement('Starting over. Make a new prediction.')
  }, [])

  const print = useCallback(() => {
    if (typeof window !== 'undefined') window.print()
  }, [])

  const event = useMemo(() => getNextEvent(), [])

  const score =
    phase === 'reveal' && scorecard
      ? [
          { label: 'Calibration', value: `${scorecard.total}/100` },
          { label: 'Best here', value: `${best.best}/100` },
        ]
      : undefined

  return (
    <GameShell
      title="Your Climate Record"
      tagline="Commit to a guess about your own town. Then meet 75 years of real daily data."
      place={place}
      isDemo={isDemo}
      onChangePlace={onChangePlace}
      announcement={announcement}
      score={score}
      onRestart={phase === 'reveal' ? restart : undefined}
    >
      {phase === 'predict' && (
        <PredictStep
          place={place}
          tempDelta={tempDelta}
          hotDelta={hotDelta}
          signal={signal}
          onTemp={setTempDelta}
          onHot={setHotDelta}
          onSignal={setSignal}
          onLockIn={lockIn}
        />
      )}

      {phase === 'loading' && <LoadingSkeleton place={place} />}

      {phase === 'reveal' && locked && loaded && scorecard && (
        <RevealStep
          place={place}
          guess={locked}
          loaded={loaded}
          scorecard={scorecard}
          event={event}
          onPrint={print}
        />
      )}
    </GameShell>
  )
}

/* ------------------------------------------------------------------ */
/* Step 1 — predict, before anything loads                             */
/* ------------------------------------------------------------------ */

interface PredictProps {
  place: Place
  tempDelta: number
  hotDelta: number
  signal: SignalStrength
  onTemp: (v: number) => void
  onHot: (v: number) => void
  onSignal: (v: SignalStrength) => void
  onLockIn: () => void
}

function PredictStep({
  place,
  tempDelta,
  hotDelta,
  signal,
  onTemp,
  onHot,
  onSignal,
  onLockIn,
}: PredictProps) {
  return (
    <div className="max-w-3xl">
      <div className="card p-6 md:p-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3 text-primary-green">
          Before you see any data
        </h2>
        <p className="text-gray-700 mb-2">
          In a moment we will pull every daily high temperature recorded for{' '}
          <strong>
            {place.city}, {place.state}
          </strong>{' '}
          since 1950 — around 27,000 days — and average it by decade.
        </p>
        <p className="text-gray-700 mb-6">
          Commit first. You are comparing the <strong>1950s</strong> with the{' '}
          <strong>most recent ten full years</strong>. There is no right answer waiting for you:
          some towns have changed a lot, some have barely changed at all, and this is scored on how
          close you get either way.
        </p>

        <div className="mb-8">
          <label
            htmlFor="temp-slider"
            className="block font-heading font-semibold text-lg text-gray-900 mb-1"
          >
            1. How much has the average daily high changed?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Not the hottest day — the average of every day in the year, winter included.
          </p>
          <input
            id="temp-slider"
            type="range"
            min={-3}
            max={6}
            step={0.25}
            value={tempDelta}
            onChange={(e) => onTemp(Number(e.target.value))}
            aria-valuetext={spokenTemp(tempDelta)}
            aria-describedby="temp-readout"
            className="w-full h-11 accent-primary-blue cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1" aria-hidden="true">
            <span>−3 °F (cooler)</span>
            <span>no change</span>
            <span>+6 °F (warmer)</span>
          </div>
          <p id="temp-readout" className="mt-3 text-2xl font-bold font-heading text-primary-blue">
            {signedF(tempDelta, 2)} °F
          </p>
        </div>

        <div className="mb-8">
          <label
            htmlFor="hot-slider"
            className="block font-heading font-semibold text-lg text-gray-900 mb-1"
          >
            2. How many more or fewer days at or above {HOT_DAY_F} °F, per year?
          </label>
          <p className="text-sm text-gray-600 mb-3">
            A whole-year count. Somewhere cool might have two of these a year; somewhere hot might
            have eighty.
          </p>
          <input
            id="hot-slider"
            type="range"
            min={-20}
            max={40}
            step={1}
            value={hotDelta}
            onChange={(e) => onHot(Number(e.target.value))}
            aria-valuetext={spokenHotDays(hotDelta)}
            aria-describedby="hot-readout"
            className="w-full h-11 accent-accent-orange cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1" aria-hidden="true">
            <span>−20 days</span>
            <span>no change</span>
            <span>+40 days</span>
          </div>
          <p id="hot-readout" className="mt-3 text-2xl font-bold font-heading text-accent-orange">
            {signedF(hotDelta, 0)} days per year
          </p>
        </div>

        <fieldset className="mb-8 border-0 p-0 m-0">
          <legend className="font-heading font-semibold text-lg text-gray-900 mb-1">
            3. How clear do you think that temperature trend will be?
          </legend>
          <p className="text-sm text-gray-600 mb-3">
            Seven decades is seven numbers. Will they march in one direction, or jump around?
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {SIGNAL_CHOICES.map((c) => (
              <label
                key={c.value}
                className={`block cursor-pointer rounded-xl border-2 p-4 min-h-[44px] transition-colors ${
                  signal === c.value
                    ? 'border-primary-green bg-primary-green/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="signal-strength"
                    value={c.value}
                    checked={signal === c.value}
                    onChange={() => onSignal(c.value)}
                    className="mt-1 h-5 w-5 accent-primary-green"
                  />
                  <span>
                    <span className="block font-semibold text-gray-900">{c.title}</span>
                    <span className="block text-sm text-gray-600 mt-1">{c.blurb}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="button" onClick={onLockIn} className="btn btn-primary min-h-[44px]">
          Lock in my prediction
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Your prediction is compared to the real record. Guessing more warming than the data shows
          costs you exactly as much as guessing less.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function LoadingSkeleton({ place }: { place: Place }) {
  return (
    <div className="max-w-4xl" aria-busy="true">
      <p className="text-gray-700 mb-6">
        Reading every daily high for {place.city} since 1950…
      </p>
      <div className="space-y-6">
        <div className="h-24 rounded-xl bg-gray-100 animate-pulse motion-reduce:animate-none" />
        <div className="h-72 rounded-xl bg-gray-100 animate-pulse motion-reduce:animate-none" />
        <div className="h-72 rounded-xl bg-gray-100 animate-pulse motion-reduce:animate-none" />
      </div>
      <span className="sr-only">Loading the climate record. This usually takes a few seconds.</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Step 2 — the reveal, then the lesson, then agency                   */
/* ------------------------------------------------------------------ */

interface RevealProps {
  place: Place
  guess: Guess
  loaded: Loaded
  scorecard: Scorecard
  event: ReturnType<typeof getNextEvent>
  onPrint: () => void
}

function RevealStep({ place, guess, loaded, scorecard, event, onPrint }: RevealProps) {
  const { record, isFixture, notice } = loaded
  const shown = isFixture ? 'Cerritos, CA' : `${place.city}, ${place.state}`
  const temp = record.temperature
  const hot = record.hotDays

  const strengthTone: Record<SignalStrength, string> = {
    clear: 'text-accent-orange',
    modest: 'text-primary-blue',
    noise: 'text-gray-700',
  }

  // The sample IS Cerritos's record, so a Cerritos player must not be told it
  // describes somewhere else. What is stale for them is the fetch, not the place.
  const inFixtureCity = place.city.trim().toLowerCase() === 'cerritos'

  return (
    <div className="max-w-4xl">
      {isFixture && notice && (
        <div
          role="status"
          className="mb-8 rounded-xl border-2 border-accent-orange/40 bg-accent-orange/5 p-5"
        >
          {inFixtureCity ? (
            <>
              <p className="font-semibold text-gray-900 mb-1">
                This is a saved record, not a live one.
              </p>
              <p className="text-gray-700 text-sm">
                {notice} You are seeing the bundled sample for Cerritos, CA — your own city, so the
                numbers below do describe your town. Try again later to pull the record fresh.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-900 mb-1">
                This is not your town&apos;s record.
              </p>
              <p className="text-gray-700 text-sm">
                {notice} You are seeing the bundled sample for Cerritos, CA instead, so the game
                still works — but the numbers below describe Cerritos, not {place.city}. Try again
                later for your own record.
              </p>
            </>
          )}
        </div>
      )}

      {/* --- Scorecard --------------------------------------------------- */}
      <section aria-labelledby="score-heading" className="mb-12">
        <h2
          id="score-heading"
          className="font-heading font-bold text-3xl mb-2 text-primary-green"
        >
          How calibrated were you?
        </h2>
        <p className="text-gray-600 mb-6">
          Scored on distance from the real number, in both directions.
        </p>

        <div className="card overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">
              Your prediction compared with the real record for {shown}, and the points earned for
              each.
            </caption>
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="p-4 text-sm font-semibold text-gray-700">
                  What you predicted
                </th>
                <th scope="col" className="p-4 text-sm font-semibold text-gray-700">
                  You said
                </th>
                <th scope="col" className="p-4 text-sm font-semibold text-gray-700">
                  The record says
                </th>
                <th scope="col" className="p-4 text-sm font-semibold text-gray-700">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {scorecard.lines.map((l) => (
                <tr key={l.key} className="border-b border-gray-100 last:border-0">
                  <th scope="row" className="p-4 font-normal text-gray-900">
                    {l.question}
                  </th>
                  <td className="p-4 text-gray-700">{l.predicted}</td>
                  <td className="p-4 font-semibold text-gray-900">{l.actual}</td>
                  <td className="p-4">
                    <span
                      className={`font-bold ${
                        l.points === l.max
                          ? 'text-primary-green'
                          : l.points > 0
                            ? 'text-primary-blue'
                            : 'text-gray-700'
                      }`}
                    >
                      <span aria-hidden="true">{l.mark} </span>
                      {l.points}/{l.max}
                    </span>
                    <span className="block text-sm text-gray-600">{l.verdict}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-lg text-gray-800">
          <strong className="font-heading text-2xl text-primary-green">
            {scorecard.total}/100
          </strong>{' '}
          for calibration.{' '}
          {scorecard.total >= 80
            ? 'You read this town well before you saw a single number.'
            : scorecard.total >= 50
              ? 'A reasonable read. Look at where you were furthest off and why.'
              : 'Worth asking what you were expecting, and where that expectation came from.'}
        </p>
      </section>

      {/* --- The record -------------------------------------------------- */}
      <section aria-labelledby="record-heading" className="mb-12">
        <h2
          id="record-heading"
          className="font-heading font-bold text-3xl mb-2 text-primary-green"
        >
          The real record for {shown}
        </h2>
        <p className="text-gray-600 mb-8">
          {record.dayCount.toLocaleString()} daily high temperatures, {record.firstYear} to{' '}
          {record.lastYear}, averaged by decade in your browser.
        </p>

        <div className="grid gap-6">
          <div className="card p-6">
            <p className="text-sm uppercase tracking-wide font-semibold text-gray-500 mb-1">
              Average daily high
            </p>
            <p className={`font-heading font-bold text-3xl mb-3 ${strengthTone[temp.strength]}`}>
              {temp.headline}
            </p>
            <p className="text-gray-700">{temp.detail}</p>
          </div>

          <DecadeChart
            kind="line"
            decades={record.decades}
            pick={(d) => d.meanDailyHigh}
            baseline={record.baseline}
            recent={record.recent}
            recentValue={record.recent.meanDailyHigh}
            unit="Average daily high, °F"
            unitShort="°F"
            color="#00a8e1"
            title="Average daily high by decade"
            summary={`Each point is the mean of every daily high in that decade for ${shown}. The two dashed lines are the ${record.baseline.label} average and the ${record.recent.label} average — the gap between them is ${signedF(temp.change, 2)} °F.`}
            valueHeading="Average daily high (°F)"
          />

          <div className="card p-6">
            <p className="text-sm uppercase tracking-wide font-semibold text-gray-500 mb-1">
              Days at or above {HOT_DAY_F} °F
            </p>
            <p className={`font-heading font-bold text-3xl mb-3 ${strengthTone[hot.strength]}`}>
              {hot.headline}
            </p>
            <p className="text-gray-700">{hot.detail}</p>
            {hot.strength !== temp.strength && (
              <p className="text-gray-700 mt-3">
                Notice that this reads differently from the average-temperature trend above. Counts
                of extreme days are far jumpier than averages — a couple of unusual summers can move
                a decade — so the two measurements can disagree about how clear the signal is even
                though they come from the same {record.dayCount.toLocaleString()} days.
              </p>
            )}
          </div>

          <DecadeChart
            kind="bar"
            decades={record.decades}
            pick={(d) => d.hotDaysPerYear}
            baseline={record.baseline}
            recent={record.recent}
            recentValue={record.recent.hotDaysPerYear}
            unit={`Days per year at or above ${HOT_DAY_F} °F`}
            unitShort="days"
            color="#f57c00"
            title={`Days at or above ${HOT_DAY_F} °F, per year by decade`}
            summary={`Each bar is the average number of days per year that reached ${HOT_DAY_F} °F in that decade for ${shown}. The gap between the two dashed lines is ${signedF(hot.change, 1)} days per year.`}
            valueHeading={`Days ≥ ${HOT_DAY_F} °F per year`}
          />
        </div>
      </section>

      <SignalVsNoise record={record} shown={shown} guess={guess} />

      <Agency record={record} shown={shown} />

      <ImpactPanel
        mission={{
          title: 'Map the shade on one block',
          body: `Pick the block you walk most in ${place.city}. On a hot afternoon, stand on the sunny asphalt, then in the shade of the nearest tree, and note how different they feel — with a thermometer if you have one. Count how many of the buildings, bus stops and crosswalks on that block have any shade at all. Shade is the part of local heat that a town can actually change.`,
          mailtoSubject: `Climate Record: shade survey for ${place.city}, ${place.state} ${place.zip}`,
        }}
        science={{
          title: 'Send your measurements somewhere they count',
          body: 'The GLOBE Program takes observations from students worldwide — surface temperature, cloud cover, land cover — and puts them in a database that researchers and NASA missions actually use. It is free, it has no age minimum, and your school can register.',
          href: 'https://www.globe.gov/',
          linkLabel: 'Visit the GLOBE Program',
        }}
        event={event}
        onPrint={onPrint}
        printLabel={"Print this town's climate record"}
      />

      <DataSourceNote
        sources={[
          {
            label: 'Open-Meteo Historical Weather API (ERA5 reanalysis)',
            href: 'https://open-meteo.com/en/docs/historical-weather-api',
          },
          { label: 'EPA — Heat Islands', href: 'https://www.epa.gov/heatislands' },
        ]}
        isFixture={isFixture}
        fixtureLabel={CERRITOS_FIXTURE_LABEL}
        note={`Open-Meteo's archive is ERA5 reanalysis, not a single weather station. A weather model is re-run over every historical observation that exists — stations, ships, balloons, satellites — to reconstruct a continuous record on a grid of roughly 10 to 30 km. That is the only way to give an arbitrary ZIP code an unbroken series back to 1950, because most towns have no station that old, but it means these are modelled values for a grid cell near ${shown}, not readings from a thermometer on your street. Every figure on this page was aggregated in your browser from ${record.dayCount.toLocaleString()} daily values; nothing about you was sent anywhere.`}
      />

      <PrintSheet place={place} shown={shown} record={record} guess={guess} scorecard={scorecard} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The lesson: one decade going the other way is not a counter-example */
/* ------------------------------------------------------------------ */

function SignalVsNoise({
  record,
  shown,
  guess,
}: {
  record: ClimateRecord
  shown: string
  guess: Guess
}) {
  const temp = record.temperature
  const coolest = record.coolestDecade
  const vsBaseline = coolest.meanDailyHigh - record.baseline.meanDailyHigh
  const vsRecent = record.recent.meanDailyHigh - coolest.meanDailyHigh
  const hasDip = record.decadeStepsDown > 0 && coolest.label !== record.baseline.label

  // If the player's own town happens to march upward every decade, the worked
  // example comes from Cerritos instead — labelled as Cerritos, not implied to
  // be theirs.
  const cerritos = CERRITOS_CLIMATE_RECORD

  const overPredicted = guess.tempDelta > temp.change + 0.75
  const underPredicted = guess.tempDelta < temp.change - 0.75

  return (
    <section aria-labelledby="noise-heading" className="mb-12">
      <h2 id="noise-heading" className="font-heading font-bold text-3xl mb-2 text-primary-green">
        Signal and noise
      </h2>
      <p className="text-gray-600 mb-6">
        The hardest part of reading a climate record is not the trend. It is everything that is not
        the trend.
      </p>

      <div className="card p-6 md:p-8">
        {hasDip ? (
          <>
            <h3 className="font-heading font-bold text-xl mb-3">
              Worked example: the {coolest.label} in {shown}
            </h3>
            <p className="text-gray-700 mb-4">
              The coolest decade in this record is the <strong>{coolest.label}</strong>, averaging{' '}
              {f1(coolest.meanDailyHigh)} °F — {signedF(vsBaseline, 2)} °F against the{' '}
              {record.baseline.label} and {signedF(-vsRecent, 2)} °F against the{' '}
              {record.recent.label} average. In all, {record.decadeStepsDown} of{' '}
              {record.decadeSteps} decade-to-decade steps in this record went{' '}
              <strong>down</strong>.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-heading font-bold text-xl mb-3">
              Worked example: the 1970s in Cerritos, CA
            </h3>
            <p className="text-gray-700 mb-4">
              Unusually, every decade in the {shown} record came in warmer than the one before.
              That is not typical, so here is a record that does wobble: in Cerritos, CA — this
              site&apos;s home city — the {cerritos.coolestDecade.label} averaged{' '}
              {f1(cerritos.coolestDecade.meanDailyHigh)} °F, <em>cooler</em> than the{' '}
              {cerritos.baseline.label} at {f1(cerritos.baseline.meanDailyHigh)} °F, and{' '}
              {cerritos.decadeStepsDown} of {cerritos.decadeSteps} decade steps there went down —
              while the record still warms {signedF(cerritos.temperature.change, 2)} °F overall.
            </p>
          </>
        )}

        <p className="text-gray-700 mb-4">
          Both of these things are true at once, and neither cancels the other. A decade that
          arrives cooler than the one before it does not undo a trend, and a single scorching summer
          does not create one. Weather is what any given year does; a trend is what the whole
          record does once the years are stacked up.
        </p>

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">The test this game uses</h4>
          <p className="text-gray-700 text-sm">
            Fit a straight line through the complete decades, then measure how far the decades
            scatter away from that line. For {shown}: the line rises{' '}
            <strong>{signedF(temp.perDecade, 2)} °F per decade</strong>, and the decades scatter by
            about <strong>{temp.residualSd.toFixed(2)} °F</strong> around it. The total change is{' '}
            {temp.snr === Infinity ? 'far larger than' : `${temp.snr.toFixed(1)}× `}
            {temp.snr === Infinity ? '' : 'the size of '}
            that scatter — which is why this record is called{' '}
            <strong>
              {temp.strength === 'clear'
                ? 'a clear trend'
                : temp.strength === 'modest'
                  ? 'a modest trend'
                  : 'mostly noise'}
            </strong>
            . Under about 1×, a trend is smaller than the ordinary wobble and this record alone
            cannot tell you it is there.
          </p>
        </div>

        {(overPredicted || underPredicted) && (
          <p className="text-gray-700">
            {overPredicted
              ? `You predicted more warming than this record shows. That is a common miss, and it matters: overstating what the data says is how a real finding gets argued away by anyone who checks. The honest version of this record is ${signedF(temp.change, 2)} °F, and it is still worth acting on.`
              : `You predicted less warming than this record shows. Worth asking what "normal" you were comparing against — for most people it is the weather they grew up with, which has already moved.`}
          </p>
        )}
        {!overPredicted && !underPredicted && (
          <p className="text-gray-700">
            Your temperature guess landed within {Math.abs(guess.tempDelta - temp.change).toFixed(2)}{' '}
            °F of the real change. That is a well-calibrated read of your own town — which is the
            whole skill this game is after.
          </p>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Never end on the reveal.                                            */
/* ------------------------------------------------------------------ */

function Agency({ record, shown }: { record: ClimateRecord; shown: string }) {
  const warming = record.temperature.change > 0 || record.hotDays.change > 0

  return (
    <section aria-labelledby="agency-heading" className="mb-4">
      <h2 id="agency-heading" className="font-heading font-bold text-3xl mb-2 text-primary-green">
        So what can actually be done about it, here?
      </h2>
      <p className="text-gray-700 mb-6 max-w-3xl">
        {warming
          ? `The part of ${shown}'s heat that a town can change fastest is not the global average — it is the several degrees that pavement, roofs and missing shade add on top of it on a hot afternoon. That part is local, and it responds to local decisions.`
          : `This record does not show much change for ${shown}, and that is a real result worth reporting honestly. It also does not mean there is nothing to do: how hot a given street feels on an August afternoon depends heavily on shade, pavement and roof colour, and those are local decisions everywhere.`}
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <h3 className="font-heading font-bold text-lg mb-2">Shade is infrastructure</h3>
          <p className="text-gray-600 text-sm">
            A tree over a sidewalk, a shade sail over a bus stop, a lighter-coloured roof: the EPA
            documents all three as urban heat island measures. Ask who decides where street trees go
            in your city, and whether your block is on the list.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-heading font-bold text-lg mb-2">Heat is a safety issue</h3>
          <p className="text-gray-600 text-sm">
            Know where your nearest cooling centre is before you need it, and know which neighbours
            would struggle in a multi-day heat wave. Extreme heat is the deadliest weather hazard in
            the United States, and the deaths are overwhelmingly among people who were alone.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-heading font-bold text-lg mb-2">Records need measurers</h3>
          <p className="text-gray-600 text-sm">
            The reason we can reconstruct {record.lastYear - record.firstYear + 1} years for your
            coordinates at all is that people kept taking measurements and sharing them. That job is
            not finished, and students do it.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Printable worksheet — hidden on screen, laid out for paper          */
/* ------------------------------------------------------------------ */

function PrintSheet({
  place,
  shown,
  record,
  guess,
  scorecard,
}: {
  place: Place
  shown: string
  record: ClimateRecord
  guess: Guess
  scorecard: Scorecard
}) {
  return (
    <div className="print-sheet">
      <h1 style={{ fontSize: '20pt', marginBottom: '2pt' }}>Your Climate Record — {shown}</h1>
      <p style={{ marginBottom: '10pt' }}>
        {place.city}, {place.state} {place.zip} · {place.lat.toFixed(4)}, {place.lon.toFixed(4)} ·{' '}
        {record.firstYear}–{record.lastYear} · {record.dayCount.toLocaleString()} daily high
        temperatures · Source: Open-Meteo Historical Weather API (ERA5 reanalysis, a model
        reconstruction — not a single weather station).
      </p>

      <p style={{ marginBottom: '10pt' }}>
        Name: ______________________________ Class: ______________ Date: ______________
      </p>

      <h2 style={{ fontSize: '14pt', marginBottom: '4pt' }}>1. The record, decade by decade</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12pt' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Decade
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Average daily high (°F)
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Days ≥ {HOT_DAY_F} °F per year
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Years averaged
            </th>
          </tr>
        </thead>
        <tbody>
          {record.decades.map((d) => (
            <tr key={d.label}>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3pt' }}>
                {d.label}
                {d.complete ? '' : ' (in progress)'}
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3pt' }}>
                {f1(d.meanDailyHigh)}
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3pt' }}>
                {f1(d.hotDaysPerYear)}
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3pt' }}>{d.years}</td>
            </tr>
          ))}
          <tr>
            <td style={{ borderBottom: '1px solid #000', padding: '3pt', fontWeight: 700 }}>
              {record.recent.label}
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '3pt', fontWeight: 700 }}>
              {f1(record.recent.meanDailyHigh)}
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '3pt', fontWeight: 700 }}>
              {f1(record.recent.hotDaysPerYear)}
            </td>
            <td style={{ borderBottom: '1px solid #000', padding: '3pt', fontWeight: 700 }}>
              {record.recent.years}
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ fontSize: '14pt', marginBottom: '4pt' }}>2. Prediction vs. record</h2>
      <p style={{ marginBottom: '4pt' }}>
        Predicted: {signedF(guess.tempDelta, 2)} °F and {signedF(guess.hotDelta, 0)} days per year.
        Record: {signedF(record.temperature.change, 2)} °F and{' '}
        {signedF(record.hotDays.change, 1)} days per year. Calibration score:{' '}
        {scorecard.total}/100.
      </p>
      <p style={{ marginBottom: '12pt' }}>
        Verdict from the data: {record.temperature.headline} — {record.temperature.detail}
      </p>

      <h2 style={{ fontSize: '14pt', marginBottom: '4pt' }}>3. Signal and noise</h2>
      <p style={{ marginBottom: '4pt' }}>
        a. Which decade in the table above is the coolest? ____________ Does that cancel the overall
        change? Why or why not?
      </p>
      <p style={{ marginBottom: '4pt' }}>
        ______________________________________________________________________________
      </p>
      <p style={{ marginBottom: '4pt' }}>
        b. The straight line through these decades rises {signedF(record.temperature.perDecade, 2)}{' '}
        °F per decade, and the decades scatter about{' '}
        {record.temperature.residualSd.toFixed(2)} °F away from it. Is the change bigger than the
        wobble? ____________
      </p>
      <p style={{ marginBottom: '12pt' }}>
        c. Why might the count of days ≥ {HOT_DAY_F} °F jump around more than the average daily
        high? ______________________________________________________________
      </p>

      <h2 style={{ fontSize: '14pt', marginBottom: '4pt' }}>4. Shade survey — take this outside</h2>
      <p style={{ marginBottom: '4pt' }}>
        Pick one block. Record the surface you are standing on, whether it is shaded, and how it
        feels or measures.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Spot
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Surface
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Shaded?
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt' }}>
              Temp / how it felt
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td style={{ borderBottom: '1px solid #ccc', padding: '10pt 3pt' }}>{i}</td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '10pt 3pt' }} />
              <td style={{ borderBottom: '1px solid #ccc', padding: '10pt 3pt' }} />
              <td style={{ borderBottom: '1px solid #ccc', padding: '10pt 3pt' }} />
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: '10pt' }}>
        Send your results to ecoquestfoundation@gmail.com, or log observations with the GLOBE
        Program at globe.gov.
      </p>
    </div>
  )
}
