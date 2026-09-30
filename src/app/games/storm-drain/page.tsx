'use client'

// Storm Drain Detective — TRACE.
//
// "Where does the water on your street actually go?"
//
// The game this replaced was a timed sprite-collecting ocean game whose
// "Items Collected" number was score/15 — an invented figure on a site that
// had already been flagged for unauthenticated content. This one makes exactly
// one factual claim and it is computed live: USGS's NHDPlus river network says
// the water leaving your catchment goes *here*, past *these* named gauges.
//
// The shape of the lesson is commit-then-reveal. A student who is told the
// answer nods along; a student who has written down "north, a few miles, it
// gets treated first" and is then shown the real trace has something to
// reconcile. The misconception this is built to break is the belief that a
// storm drain leads to a treatment plant. In most US cities it does not.
//
// Honesty rules that shape the code more than the design does:
//   * If NLDI has no mapped catchment under the player (closed inland basins,
//     much of Hawaii, some coastal ZIPs), we say so and offer the Cerritos
//     sample as an explicit choice. We never draw a guessed line to the sea.
//   * A network failure falls back to the bundled real Cerritos capture, always
//     behind a visible "sample data" label.
//   * The terminus is named by coordinates and by the waterway names the API
//     actually returned. No beach, bay or river name is hardcoded anywhere in
//     this file — grep it and you will not find one.

import { useCallback, useEffect, useMemo, useState } from 'react'
import PlaceGate from '@/components/games/PlaceGate'
import GameShell from '@/components/games/GameShell'
import ImpactPanel from '@/components/games/ImpactPanel'
import DataSourceNote from '@/components/games/DataSourceNote'
import { type Place } from '@/lib/place'
import { getNextEvent } from '@/lib/nextEvent'
import { getBestScore, recordScore } from '@/lib/progress'
import { CERRITOS_TRACE } from '@/lib/fixtures/stormDrain'
import { failureMessage } from '@/lib/api/client'
import {
  buildTrace,
  fetchLiveFlow,
  makeProjection,
  tracePoints,
  haversineKm,
  bearingLabel,
  cardinalLabel,
  formatCoord,
  osmLink,
  TRACE_DISTANCE_KM,
  type Cardinal,
  type Gauge,
  type GaugeReading,
  type LonLat,
  type StormDrainTrace,
} from '@/lib/api/usgs'

const GAME_KEY = 'storm-drain'

// ---------------------------------------------------------------------------
// question data
// ---------------------------------------------------------------------------

const CARDINALS: { id: Cardinal; label: string }[] = [
  { id: 'north', label: 'North' },
  { id: 'east', label: 'East' },
  { id: 'south', label: 'South' },
  { id: 'west', label: 'West' },
]

interface Bucket {
  id: string
  label: string
  min: number
  max: number
}

const DISTANCE_BUCKETS: Bucket[] = [
  { id: 'near', label: 'Less than 5 km (about 3 miles)', min: 0, max: 5 },
  { id: 'mid', label: '5 to 20 km (3 to 12 miles)', min: 5, max: 20 },
  { id: 'far', label: '20 to 50 km (12 to 31 miles)', min: 20, max: 50 },
  { id: 'vfar', label: 'More than 50 km (31 miles and up)', min: 50, max: Infinity },
]

function bucketFor(km: number): Bucket {
  return DISTANCE_BUCKETS.find((b) => km >= b.min && km < b.max) ?? DISTANCE_BUCKETS[0]
}

const DESTINATIONS = [
  { id: 'treated', label: 'To a treatment plant, where it gets cleaned first' },
  { id: 'sewer', label: 'Into the same pipes as the water from my sink and toilet' },
  { id: 'surface', label: 'Straight into a creek, river, lake or the sea — untreated' },
  { id: 'ground', label: 'It soaks into the ground and goes nowhere' },
] as const

type DestinationId = (typeof DESTINATIONS)[number]['id']
const CORRECT_DESTINATION: DestinationId = 'surface'

type Fate = 'floats' | 'sinks' | 'fragments'

const FATES: { id: Fate; label: string }[] = [
  { id: 'floats', label: 'Floats — it rides the current the whole way down' },
  { id: 'sinks', label: 'Sinks — it drops out of the water near where it went in' },
  { id: 'fragments', label: 'Breaks apart — it shatters into pieces too small to pick up' },
]

interface LitterItem {
  id: string
  label: string
  icon: string
  answer: Fate
  why: string
}

/**
 * Five items, five pieces of material science. Every answer turns on density or
 * brittleness — things a student can check — rather than on a statistic they
 * would have to take our word for.
 */
const LITTER: LitterItem[] = [
  {
    id: 'glass',
    label: 'A glass bottle',
    icon: '🍾',
    answer: 'sinks',
    why: 'Glass is about two and a half times denser than water. Once the bottle fills it drops to the bed of the channel close to where it went in, and it stays there. It never becomes microplastic — tumbling just wears it into sea glass — but it is still a cut waiting to happen for anyone wading.',
  },
  {
    id: 'bag',
    label: 'A plastic grocery bag',
    icon: '🛍️',
    answer: 'floats',
    why: 'Polyethylene is lighter than water (about 0.92 g/cm³), so the bag rides at or just under the surface for the entire trip. Drifting at the surface, slowly, translucent — that is exactly why bags get eaten by sea turtles hunting jellyfish.',
  },
  {
    id: 'foam',
    label: 'A polystyrene foam cup',
    icon: '🥤',
    answer: 'fragments',
    why: 'Foam is mostly trapped air, so it floats easily. The problem is that it is brittle: sunlight plus tumbling through a concrete channel breaks it into thousands of beads. Once it has fragmented there is no realistic way to collect it, which is why foam is the item cleanup crews dread most.',
  },
  {
    id: 'can',
    label: 'An aluminium drink can',
    icon: '🥫',
    answer: 'sinks',
    why: 'Aluminium is roughly 2.7 times denser than water. A can fills, sinks, and settles near the outlet rather than travelling on. That is actually the good news in this list: a sunk can is findable and recyclable, unlike anything that has already broken up.',
  },
  {
    id: 'butt',
    label: 'A cigarette filter',
    icon: '🚬',
    answer: 'fragments',
    why: 'Most filters are cellulose acetate, which is a plastic. A soaked filter unravels into thousands of fine plastic fibres and carries the tar and nicotine it trapped along with them. Filters are among the most-collected items in coastal cleanups worldwide.',
  },
]

// ---------------------------------------------------------------------------
// entry point
// ---------------------------------------------------------------------------

export default function StormDrainPage() {
  // PlaceGate owns its own copy of the place hook, so the way to send a player
  // back to the ZIP form is to clear storage and remount it.

  return (
    <PlaceGate
      purpose="We use your ZIP code to look up the real river reach your neighbourhood drains into, straight from the US Geological Survey."
    >
      {(place, isDemo, changePlace) => (
        <StormDrainGame
          key={place.zip}
          place={place}
          isDemo={isDemo}
          onChangePlace={changePlace}
        />
      )}
    </PlaceGate>
  )
}

// ---------------------------------------------------------------------------
// load state
// ---------------------------------------------------------------------------

type LoadState =
  | { status: 'loading' }
  /** A real trace for the player's own coordinates. */
  | { status: 'live'; trace: StormDrainTrace }
  /** The bundled Cerritos capture, always labelled as such. */
  | { status: 'fixture'; trace: StormDrainTrace; reason: string }
  /** USGS genuinely has no mapped stream here. Not an error, and not faked. */
  | { status: 'nostream'; message: string }

type Phase = 'predict' | 'reveal' | 'litter' | 'done'

interface Prediction {
  direction: Cardinal | null
  distance: string | null
  destination: DestinationId | null
}

function StormDrainGame({
  place,
  isDemo,
  onChangePlace,
}: {
  place: Place
  isDemo: boolean
  onChangePlace: () => void
}) {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [phase, setPhase] = useState<Phase>('predict')
  const [prediction, setPrediction] = useState<Prediction>({
    direction: null,
    distance: null,
    destination: null,
  })
  const [predictScore, setPredictScore] = useState(0)
  const [round, setRound] = useState(0)
  const [pick, setPick] = useState<Fate | null>(null)
  const [litterScore, setLitterScore] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [flows, setFlows] = useState<Record<string, GaugeReading | null>>({})
  const [flowsDone, setFlowsDone] = useState(false)
  const [best, setBest] = useState<{ best: number; played: number } | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  const event = useMemo(() => getNextEvent('campaign'), [])
  const maxScore = 3 + LITTER.length

  useEffect(() => {
    setBest(getBestScore(GAME_KEY))
  }, [])

  // Respected in CSS too; this just avoids mounting the animation at all.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // --- load the trace in the background while the player predicts -----------
  useEffect(() => {
    let cancelled = false
    setLoad({ status: 'loading' })

    buildTrace(place.lat, place.lon).then((res) => {
      if (cancelled) return
      if (res.ok) {
        setLoad({ status: 'live', trace: res.data })
        return
      }
      // 'empty' means USGS answered honestly: there is no mapped stream here.
      // Anything else means we could not ask. Those deserve different answers.
      if (res.reason === 'empty') {
        setLoad({ status: 'nostream', message: res.message })
      } else {
        setLoad({ status: 'fixture', trace: CERRITOS_TRACE, reason: failureMessage(res) })
      }
    })

    return () => {
      cancelled = true
    }
  }, [place.lat, place.lon])

  const trace = load.status === 'live' || load.status === 'fixture' ? load.trace : null
  const isFixture = load.status === 'fixture'

  // --- live discharge, once we know which gauges are on the path ------------
  useEffect(() => {
    if (!trace) return
    let cancelled = false
    setFlows({})
    setFlowsDone(false)

    const targets = trace.gauges.slice(0, 3)
    if (targets.length === 0) {
      setFlowsDone(true)
      return
    }

    Promise.all(targets.map((g) => fetchLiveFlow(g.siteNo).then((r) => [g.siteNo, r] as const)))
      .then((pairs) => {
        if (cancelled) return
        setFlows(Object.fromEntries(pairs))
        setFlowsDone(true)
      })
      .catch(() => {
        if (!cancelled) setFlowsDone(true)
      })

    return () => {
      cancelled = true
    }
  }, [trace])

  // --- computed truths ------------------------------------------------------
  const truth = useMemo(() => {
    if (!trace) return null
    const origin: LonLat = [trace.origin.lon, trace.origin.lat]
    const pts = tracePoints(trace.segments)
    return {
      origin,
      pts,
      start: pts[0] ?? origin,
      direction: cardinalLabel(origin, trace.terminus),
      fineDirection: bearingLabel(origin, trace.terminus),
      bucket: bucketFor(trace.totalKm),
      nearestStreamKm: haversineKm(origin, pts[0] ?? origin),
    }
  }, [trace])

  const restart = useCallback(() => {
    setPhase('predict')
    setPrediction({ direction: null, distance: null, destination: null })
    setPredictScore(0)
    setRound(0)
    setPick(null)
    setLitterScore(0)
    setAnnouncement('Starting over. Make your prediction again.')
  }, [])

  const lockIn = useCallback(() => {
    if (!truth) return
    let s = 0
    if (prediction.direction === truth.direction) s++
    if (prediction.distance === truth.bucket.id) s++
    if (prediction.destination === CORRECT_DESTINATION) s++
    setPredictScore(s)
    setPhase('reveal')
    setAnnouncement(
      `Prediction locked in. You got ${s} of 3. The real trace runs ${truth.fineDirection} for ${trace ? trace.totalKm.toFixed(1) : '0'} kilometres.`
    )
  }, [prediction, truth, trace])

  const answerLitter = useCallback(
    (fate: Fate) => {
      if (pick) return
      const item = LITTER[round]
      const right = fate === item.answer
      setPick(fate)
      if (right) setLitterScore((v) => v + 1)
      setAnnouncement(`${right ? 'Correct.' : 'Not quite.'} ${item.label}: ${item.why}`)
    },
    [pick, round]
  )

  const nextLitter = useCallback(() => {
    if (round + 1 < LITTER.length) {
      setRound((r) => r + 1)
      setPick(null)
      setAnnouncement(`Item ${round + 2} of ${LITTER.length}.`)
    } else {
      const total = predictScore + litterScore
      setBest(recordScore(GAME_KEY, total))
      setPhase('done')
      setAnnouncement(`Finished. You scored ${total} out of ${maxScore}.`)
    }
  }, [round, predictScore, litterScore, maxScore])

  const print = useCallback(() => {
    if (typeof window !== 'undefined') window.print()
  }, [])

  const score = useMemo(() => {
    const rows: { label: string; value: string | number }[] = [
      { label: 'Score', value: `${predictScore + litterScore} / ${maxScore}` },
    ]
    if (best && best.played > 0) rows.push({ label: 'Your best', value: `${best.best} / ${maxScore}` })
    return rows
  }, [predictScore, litterScore, maxScore, best])

  return (
    <GameShell
      title="Storm Drain Detective"
      tagline="Where does the water on your street actually go?"
      place={place}
      isDemo={isDemo}
      onChangePlace={onChangePlace}
      announcement={announcement}
      score={phase === 'predict' ? undefined : score}
      onRestart={phase === 'predict' ? undefined : restart}
    >
      {load.status === 'loading' && <TraceSkeleton />}

      {load.status === 'nostream' && (
        <NoStreamPanel
          place={place}
          message={load.message}
          onUseSample={() =>
            setLoad({
              status: 'fixture',
              trace: CERRITOS_TRACE,
              reason: 'You chose the Cerritos, CA sample because the river network has no mapped stream at your location.',
            })
          }
          onChangePlace={onChangePlace}
        />
      )}

      {trace && truth && (
        <>
          {phase === 'predict' && (
            <PredictStep
              place={place}
              prediction={prediction}
              onChange={setPrediction}
              onLockIn={lockIn}
            />
          )}

          {phase === 'reveal' && (
            <RevealStep
              place={place}
              trace={trace}
              truth={truth}
              prediction={prediction}
              flows={flows}
              flowsDone={flowsDone}
              reduceMotion={reduceMotion}
              onContinue={() => {
                setPhase('litter')
                setAnnouncement(`Now the litter rounds. Item 1 of ${LITTER.length}.`)
              }}
            />
          )}

          {phase === 'litter' && (
            <LitterStep
              index={round}
              item={LITTER[round]}
              pick={pick}
              onAnswer={answerLitter}
              onNext={nextLitter}
            />
          )}

          {phase === 'done' && (
            <DoneStep
              trace={trace}
              truth={truth}
              predictScore={predictScore}
              litterScore={litterScore}
              maxScore={maxScore}
            />
          )}

          {phase === 'done' && (
            <ImpactPanel
              mission={{
                title: 'Adopt the drain nearest your home',
                body: 'Walk out and find the storm drain closest to your front door. Photograph it. Write down the cross street, whether it has a "no dumping — drains to ocean" stencil, and what is sitting in the gutter around it. Check it once a week for a month. That drain is now yours.',
                mailtoSubject: 'Adopt-a-Drain log — Storm Drain Detective',
              }}
              science={{
                title: 'Log what you find, for real',
                body: 'Marine Debris Tracker is NOAA-supported and works anywhere in the world: log each item you find at your drain and it goes into an open dataset researchers actually use. Many cities also run a formal Adopt-a-Drain programme — search your city name plus "adopt a drain" to see if yours does.',
                href: 'https://debristracker.org/',
                linkLabel: 'Open Marine Debris Tracker',
              }}
              event={event}
              onPrint={print}
              printLabel="Print the adopt-a-drain log sheet"
            />
          )}

          <DataSourceNote
            sources={[
              { label: 'USGS Network Linked Data Index (NLDI)', href: 'https://api.water.usgs.gov/nldi/' },
              { label: 'USGS Water Services', href: 'https://waterservices.usgs.gov/' },
              ...(trace.waterways.length > 0
                ? [{ label: 'geoconnex reference mainstems', href: 'https://reference.geoconnex.us/' }]
                : []),
            ]}
            isFixture={isFixture}
            fixtureLabel={
              isFixture
                ? `Showing sample data from Cerritos, CA — not ${place.city}. ${load.status === 'fixture' ? load.reason : ''}`
                : undefined
            }
            note={`The path is USGS's NHDPlus modelled stream network, traced downstream up to ${TRACE_DISTANCE_KM} km. Storm drain pipes themselves are not mapped in any national dataset, so the trace begins at the nearest mapped stream reach — about ${truth.nearestStreamKm.toFixed(1)} km from your ZIP code's centre point — not at a kerb inlet. Gauge readings are provisional USGS data subject to revision.`}
          />

          <PrintSheet place={place} trace={trace} truth={truth} isFixture={isFixture} />
        </>
      )}
    </GameShell>
  )
}

// ---------------------------------------------------------------------------
// loading + no-data
// ---------------------------------------------------------------------------

function TraceSkeleton() {
  return (
    <div className="card p-8" aria-busy="true">
      <div className="h-6 w-2/3 rounded bg-gray-200 animate-pulse motion-reduce:animate-none" />
      <div className="mt-6 h-64 rounded-xl bg-gray-100 animate-pulse motion-reduce:animate-none" />
      <div className="mt-6 h-4 w-1/2 rounded bg-gray-200 animate-pulse motion-reduce:animate-none" />
      <p className="sr-only">Looking up the river reach for your ZIP code.</p>
    </div>
  )
}

function NoStreamPanel({
  place,
  message,
  onUseSample,
  onChangePlace,
}: {
  place: Place
  message: string
  onUseSample: () => void
  onChangePlace: () => void
}) {
  return (
    <div className="card p-8 max-w-3xl">
      <h2 className="font-heading font-bold text-2xl mb-3 text-primary-green">
        We cannot trace {place.city} honestly
      </h2>
      <p className="text-gray-700 mb-4">{message}</p>
      <p className="text-gray-600 mb-4">
        This happens for real reasons, and it is worth knowing which one applies to you. The
        US Geological Survey&apos;s NHDPlus network covers mapped surface streams. It has gaps
        over closed inland basins that drain to a dry lake instead of the sea, over much of
        Hawaii and the territories, and over some coastal blocks where the ZIP code&apos;s
        centre point falls on the ocean side of the shoreline.
      </p>
      <p className="text-gray-600 mb-6">
        We could draw you a plausible-looking line to the nearest coast. We are not going to,
        because we would be making it up, and every number on this site has to come from
        somewhere you can check.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={onChangePlace} className="btn btn-primary">
          Try a different ZIP code
        </button>
        <button type="button" onClick={onUseSample} className="btn btn-outline">
          Play the Cerritos, CA sample instead
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        The sample is a real captured trace from EcoQuest&apos;s home city. It will be
        labelled as a sample throughout — it is not your location.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// phase 1 — predict
// ---------------------------------------------------------------------------

interface ChoiceGroupProps<T extends string> {
  legend: string
  hint?: string
  name: string
  options: { id: T; label: string }[]
  value: T | null
  onChange: (v: T) => void
}

function ChoiceGroup<T extends string>({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className="mb-8">
      <legend className="font-heading font-bold text-lg text-gray-900 mb-1">{legend}</legend>
      {hint && <p className="text-sm text-gray-500 mb-3">{hint}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const checked = value === o.id
          return (
            <label
              key={o.id}
              className={`flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                checked
                  ? 'border-primary-green bg-primary-green/10 text-gray-900'
                  : 'border-gray-300 hover:border-primary-blue'
              } focus-within:ring-2 focus-within:ring-primary-green focus-within:ring-offset-2`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={checked}
                onChange={() => onChange(o.id)}
                className="h-5 w-5 accent-primary-green"
              />
              <span className="font-medium">{o.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function PredictStep({
  place,
  prediction,
  onChange,
  onLockIn,
}: {
  place: Place
  prediction: Prediction
  onChange: (p: Prediction) => void
  onLockIn: () => void
}) {
  const ready = prediction.direction && prediction.distance && prediction.destination

  return (
    <div className="card p-8">
      <p className="inline-block text-xs font-bold uppercase tracking-wider text-white bg-primary-blue rounded-full px-3 py-1 mb-4">
        Step 1 of 3 · Commit first
      </p>
      <h2 className="font-heading font-bold text-3xl mb-3 text-primary-green">
        Before we show you anything
      </h2>
      <p className="text-gray-700 mb-2 max-w-3xl">
        Picture the kerb outside your home in {place.city}. It rains hard. The water runs along
        the gutter and disappears down the grate.
      </p>
      <p className="text-gray-700 mb-8 max-w-3xl">
        Write down what you think happens next. Then we will ask the US Geological Survey and
        find out together. Guessing wrong here is the point — it is the fastest way to notice
        what you assumed.
      </p>

      <ChoiceGroup
        legend="1. Which way does that water head?"
        hint="The general direction it travels once it is out of your neighbourhood."
        name="direction"
        options={CARDINALS}
        value={prediction.direction}
        onChange={(v) => onChange({ ...prediction, direction: v })}
      />

      <ChoiceGroup
        legend="2. How far does it travel before it stops?"
        hint="Distance along the channel, not a straight line."
        name="distance"
        options={DISTANCE_BUCKETS.map((b) => ({ id: b.id, label: b.label }))}
        value={prediction.distance}
        onChange={(v) => onChange({ ...prediction, distance: v })}
      />

      <ChoiceGroup
        legend="3. Where does it end up?"
        name="destination"
        options={DESTINATIONS.map((d) => ({ id: d.id, label: d.label }))}
        value={prediction.destination}
        onChange={(v) => onChange({ ...prediction, destination: v })}
      />

      <button type="button" onClick={onLockIn} disabled={!ready} className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
        Lock in my prediction
      </button>
      {!ready && (
        <p className="text-sm text-gray-500 mt-3">Answer all three to see the real trace.</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// phase 2 — reveal
// ---------------------------------------------------------------------------

interface Truth {
  origin: LonLat
  pts: LonLat[]
  start: LonLat
  direction: Cardinal
  fineDirection: string
  bucket: Bucket
  nearestStreamKm: number
}

function Verdict({ right, children }: { right: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <span
        className={`shrink-0 font-bold ${right ? 'text-primary-green' : 'text-accent-orange'}`}
        aria-hidden="true"
      >
        {right ? '✓' : '✗'}
      </span>
      <span className="text-gray-700">
        <span className="sr-only">{right ? 'Correct. ' : 'Incorrect. '}</span>
        {children}
      </span>
    </li>
  )
}

function RevealStep({
  place,
  trace,
  truth,
  prediction,
  flows,
  flowsDone,
  reduceMotion,
  onContinue,
}: {
  place: Place
  trace: StormDrainTrace
  truth: Truth
  prediction: Prediction
  flows: Record<string, GaugeReading | null>
  flowsDone: boolean
  reduceMotion: boolean
  onContinue: () => void
}) {
  const destLabel = DESTINATIONS.find((d) => d.id === prediction.destination)?.label ?? ''
  const gaugeList = trace.gauges.slice(0, 8)
  const terminal = trace.waterways[trace.waterways.length - 1]

  return (
    <>
      <div className="card p-8 mb-8">
        <p className="inline-block text-xs font-bold uppercase tracking-wider text-white bg-primary-blue rounded-full px-3 py-1 mb-4">
          Step 2 of 3 · The real answer
        </p>
        <h2 className="font-heading font-bold text-3xl mb-6 text-primary-green">
          Here is what USGS says
        </h2>

        <ul className="mb-8">
          <Verdict right={prediction.direction === truth.direction}>
            You said the water heads <strong>{prediction.direction}</strong>. It actually runs{' '}
            <strong>{truth.fineDirection}</strong> — from your ZIP code&apos;s centre point to
            the end of the trace at {formatCoord(trace.terminus)}.
          </Verdict>
          <Verdict right={prediction.distance === truth.bucket.id}>
            You said <strong>{DISTANCE_BUCKETS.find((b) => b.id === prediction.distance)?.label}</strong>.
            The traced channel is <strong>{trace.totalKm.toFixed(1)} km</strong> (
            {(trace.totalKm * 0.621371).toFixed(1)} miles) across{' '}
            {trace.segments.length} mapped stream {trace.segments.length === 1 ? 'reach' : 'reaches'}.
          </Verdict>
          <Verdict right={prediction.destination === CORRECT_DESTINATION}>
            You said &ldquo;{destLabel}&rdquo;. In most US cities the storm drain system is
            entirely separate from the sanitary sewer, and it discharges{' '}
            <strong>untreated</strong> to the nearest waterway. The grate outside your house is
            not a drain to a treatment plant. It is the front door of the creek.
          </Verdict>
        </ul>

        <TraceMap trace={trace} truth={truth} place={place} reduceMotion={reduceMotion} />

        <TraceTextEquivalent trace={trace} truth={truth} place={place} />
      </div>

      {gaugeList.length > 0 && (
        <div className="card p-8 mb-8">
          <h3 className="font-heading font-bold text-2xl mb-2 text-primary-green">
            Real instruments on that path
          </h3>
          <p className="text-gray-600 mb-6">
            These are live USGS monitoring stations sitting on the water your street feeds. Not
            illustrations — you can open any of them and read the record yourself.
          </p>
          <ul className="space-y-4">
            {gaugeList.map((g) => {
              const reading = flows[g.siteNo]
              return (
                <li key={g.id} className="border-l-4 border-primary-blue pl-4">
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-blue underline hover:no-underline"
                  >
                    {g.name}
                  </a>
                  <p className="text-sm text-gray-500">
                    Station {g.id} · {formatCoord([g.lon, g.lat])}
                  </p>
                  <p className="text-sm mt-1">
                    {!flowsDone ? (
                      <span className="text-gray-400">Checking current flow…</span>
                    ) : reading ? (
                      <span className="text-gray-800">
                        Flowing at <strong>{reading.value.toLocaleString()} {reading.unit}</strong>
                        {reading.dateTime ? ` as of ${new Date(reading.dateTime).toLocaleString()}` : ''}.
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        No current discharge reading. That is a normal answer, not a broken one —
                        many of these gauges are seasonal, and a creek in a dry month genuinely
                        has nothing to report.
                      </span>
                    )}
                  </p>
                </li>
              )
            })}
          </ul>
          {trace.gauges.length > gaugeList.length && (
            <p className="text-sm text-gray-500 mt-4">
              Showing {gaugeList.length} of {trace.gauges.length} stations on this path.
            </p>
          )}
        </div>
      )}

      <div className="card p-8 mb-8">
        <h3 className="font-heading font-bold text-2xl mb-3 text-primary-green">
          So what is at the end of it?
        </h3>
        <p className="text-gray-700 mb-3">
          The trace stops at <strong>{formatCoord(trace.terminus)}</strong>.{' '}
          {trace.truncated ? (
            <>
              That is not the end of the water — it is the end of our question. We asked USGS to
              walk {trace.distanceLimitKm} km downstream and it used all of it, so the channel
              carries on past this point.
            </>
          ) : (
            <>
              There is no further downstream flowline in the national river network from here,
              so as far as USGS is concerned this is the outlet.
            </>
          )}{' '}
          {terminal?.name && (
            <>
              The last named waterway on the path is <strong>{terminal.name}</strong>.
            </>
          )}
        </p>
        <p className="text-gray-700 mb-4">
          Go and look at those coordinates yourself, and then decide whether you would swim
          there.
        </p>
        <a
          href={osmLink(trace.terminus)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          See the end point on a map
        </a>
      </div>

      <button type="button" onClick={onContinue} className="btn btn-primary">
        Next: what survives the trip?
      </button>
    </>
  )
}

// ---------------------------------------------------------------------------
// the drawing
// ---------------------------------------------------------------------------

const VB_W = 680
const VB_H = 440
const VB_PAD = 38
/**
 * Normalising the path to a fixed pathLength lets the draw-on animation use a
 * constant dasharray, with no getTotalLength() call and therefore no layout
 * read on mount.
 */
const PATH_UNITS = 1000

function TraceMap({
  trace,
  truth,
  place,
  reduceMotion,
}: {
  trace: StormDrainTrace
  truth: Truth
  place: Place
  reduceMotion: boolean
}) {
  const titleId = 'sd-map-title'
  const descId = 'sd-map-desc'
  const gauges = trace.gauges.slice(0, 8)

  const { d, originXY, startXY, endXY, gaugeXY } = useMemo(() => {
    const all: LonLat[] = [
      ...truth.pts,
      truth.origin,
      ...gauges.map((g) => [g.lon, g.lat] as LonLat),
    ]
    const proj = makeProjection(all, VB_W, VB_H, VB_PAD)
    const path = truth.pts
      .map((p, i) => {
        const [x, y] = proj.project(p)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')
    return {
      d: path,
      originXY: proj.project(truth.origin),
      startXY: proj.project(truth.start),
      endXY: proj.project(trace.terminus),
      gaugeXY: gauges.map((g) => ({ g, xy: proj.project([g.lon, g.lat]) })),
    }
  }, [truth, trace.terminus, gauges])

  const desc = `A line map of the ${trace.totalKm.toFixed(
    1
  )} kilometre downstream path traced from ${place.city}, ${place.state}. It runs ${
    truth.fineDirection
  } from the ZIP code centre point through ${trace.segments.length} mapped stream reaches and past ${
    trace.gauges.length
  } USGS monitoring stations, ending at latitude ${trace.terminus[1].toFixed(
    4
  )}, longitude ${trace.terminus[0].toFixed(4)}. The same information is written out as a list below this map.`

  return (
    <figure className="my-8">
      <style>{`
        @keyframes sd-draw { from { stroke-dashoffset: ${PATH_UNITS}; } to { stroke-dashoffset: 0; } }
        .sd-draw {
          stroke-dasharray: ${PATH_UNITS};
          stroke-dashoffset: ${PATH_UNITS};
          animation: sd-draw 2.6s ease-in-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .sd-draw { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
        }
      `}</style>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto rounded-xl bg-slate-50 border border-gray-200"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>
          Downstream water path from {place.city}, {place.state}
        </title>
        <desc id={descId}>{desc}</desc>

        {/* Your ZIP centre is not on the stream: show the gap rather than hide it. */}
        <line
          x1={originXY[0]}
          y1={originXY[1]}
          x2={startXY[0]}
          y2={startXY[1]}
          stroke="#9ca3af"
          strokeWidth={2}
          strokeDasharray="5 5"
        />

        {/* Casing stroke so the water line reads on the pale background. */}
        <path d={d} fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={d}
          pathLength={PATH_UNITS}
          className={reduceMotion ? undefined : 'sd-draw'}
          fill="none"
          stroke="#00a8e1"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g>
          <circle cx={originXY[0]} cy={originXY[1]} r={8} fill="#34a853" stroke="#fff" strokeWidth={2.5} />
          <text x={originXY[0] + 13} y={originXY[1] + 4} fontSize={13} fontWeight={700} fill="#166534">
            {place.zip}
          </text>
        </g>

        {gaugeXY.map(({ g, xy }, i) => (
          <g key={g.id}>
            <circle cx={xy[0]} cy={xy[1]} r={7} fill="#fbbc04" stroke="#7c5c00" strokeWidth={2} />
            <text x={xy[0]} y={xy[1] + 4} fontSize={10} fontWeight={700} textAnchor="middle" fill="#3f2d00">
              {i + 1}
            </text>
          </g>
        ))}

        <g>
          <circle cx={endXY[0]} cy={endXY[1]} r={9} fill="#dc2626" stroke="#fff" strokeWidth={2.5} />
          <text
            x={endXY[0]}
            y={endXY[1] - 15}
            fontSize={12}
            fontWeight={700}
            textAnchor="middle"
            fill="#7f1d1d"
          >
            end of trace
          </text>
        </g>
      </svg>
      <figcaption className="mt-3 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1.5 mr-4">
          <span className="inline-block w-3 h-3 rounded-full bg-primary-green" aria-hidden="true" /> your ZIP centre
        </span>
        <span className="inline-flex items-center gap-1.5 mr-4">
          <span className="inline-block w-3 h-3 rounded-full bg-accent-yellow" aria-hidden="true" /> USGS gauge
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600" aria-hidden="true" /> end of trace
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * The map is a picture of the answer; this is the answer. Everything the drawing
 * shows has to be readable here too, in order, with the real names attached.
 */
function TraceTextEquivalent({
  trace,
  truth,
  place,
}: {
  trace: StormDrainTrace
  truth: Truth
  place: Place
}) {
  const { gauges } = trace
  const gaugesByComid = useMemo(() => {
    const m = new Map<number, Gauge[]>()
    for (const g of gauges) {
      const list = m.get(g.comid) ?? []
      list.push(g)
      m.set(g.comid, list)
    }
    return m
  }, [gauges])

  return (
    <details className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <summary className="cursor-pointer font-semibold text-gray-800 min-h-[44px] flex items-center">
        Read the route as a list (same data as the map)
      </summary>

      {trace.waterways.length > 0 && (
        <p className="mt-4 text-gray-700">
          <strong>Named waterways, in order:</strong>{' '}
          {trace.waterways.map((w) => w.name).join(' → ')}
          {trace.waterways[trace.waterways.length - 1]?.terminal &&
            ' (no named waterway downstream of that one)'}
          .
        </p>
      )}

      <ol className="mt-4 space-y-3 list-decimal list-inside text-gray-700">
        <li>
          <strong>Start:</strong> the centre point of ZIP {place.zip}, {place.city},{' '}
          {place.state}, at {formatCoord(truth.origin)}. The nearest mapped stream reach is{' '}
          {truth.nearestStreamKm.toFixed(1)} km away — the pipes in between are not in any
          national dataset.
        </li>
        {trace.segments.map((seg, i) => {
          const here = gaugesByComid.get(seg.comid) ?? []
          return (
            <li key={`${seg.comid}-${i}`}>
              <strong>Reach {i + 1}</strong> (NHDPlus COMID {seg.comid}): flows{' '}
              {bearingLabel(seg.coords[0], seg.coords[seg.coords.length - 1])} to{' '}
              {formatCoord(seg.coords[seg.coords.length - 1])}.
              {here.length > 0 && (
                <> Passes USGS station{here.length > 1 ? 's' : ''} {here.map((g) => `${g.name} (${g.id})`).join(', ')}.</>
              )}
            </li>
          )
        })}
        <li>
          <strong>End of trace:</strong> {formatCoord(trace.terminus)}, after{' '}
          {trace.totalKm.toFixed(1)} km.{' '}
          {trace.truncated
            ? `The water continues past here — we stopped the trace at our ${trace.distanceLimitKm} km limit.`
            : 'The national river network has no flowline downstream of this point.'}
        </li>
      </ol>
    </details>
  )
}

// ---------------------------------------------------------------------------
// phase 3 — litter
// ---------------------------------------------------------------------------

function LitterStep({
  index,
  item,
  pick,
  onAnswer,
  onNext,
}: {
  index: number
  item: LitterItem
  pick: Fate | null
  onAnswer: (f: Fate) => void
  onNext: () => void
}) {
  const right = pick === item.answer

  return (
    <div className="card p-8">
      <p className="inline-block text-xs font-bold uppercase tracking-wider text-white bg-primary-blue rounded-full px-3 py-1 mb-4">
        Step 3 of 3 · Item {index + 1} of {LITTER.length}
      </p>
      <h2 className="font-heading font-bold text-3xl mb-2 text-primary-green">
        It goes down the drain. Then what?
      </h2>
      <p className="text-gray-600 mb-6">
        Nothing filters it. So the only thing that decides an item&apos;s fate is what it is
        made of.
      </p>

      <div className="flex items-center gap-4 mb-6 p-5 rounded-xl bg-gray-50 border border-gray-200">
        <span className="text-5xl" aria-hidden="true">
          {item.icon}
        </span>
        <span className="font-heading font-bold text-2xl">{item.label}</span>
      </div>

      <div className="grid gap-3">
        {FATES.map((f) => {
          const chosen = pick === f.id
          const isAnswer = f.id === item.answer
          let cls = 'border-gray-300 hover:border-primary-blue'
          if (pick) {
            if (isAnswer) cls = 'border-primary-green bg-primary-green/10'
            else if (chosen) cls = 'border-accent-orange bg-accent-orange/10'
            else cls = 'border-gray-200 opacity-60'
          }
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onAnswer(f.id)}
              disabled={pick !== null}
              aria-pressed={chosen}
              className={`text-left min-h-[44px] px-5 py-4 rounded-xl border-2 font-medium transition-colors disabled:cursor-default ${cls}`}
            >
              <span className="mr-2 font-bold" aria-hidden="true">
                {pick ? (isAnswer ? '✓' : chosen ? '✗' : '·') : '·'}
              </span>
              {f.label}
              {pick && isAnswer && <span className="sr-only"> (correct answer)</span>}
            </button>
          )
        })}
      </div>

      {pick && (
        <div className="mt-6">
          <p className={`font-heading font-bold text-xl mb-2 ${right ? 'text-primary-green' : 'text-accent-orange'}`}>
            {right ? '✓ Correct' : '✗ Not quite'}
          </p>
          <p className="text-gray-700 mb-6">{item.why}</p>
          <button type="button" onClick={onNext} className="btn btn-primary">
            {index + 1 < LITTER.length ? 'Next item' : 'See my results'}
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// phase 4 — done
// ---------------------------------------------------------------------------

function DoneStep({
  trace,
  truth,
  predictScore,
  litterScore,
  maxScore,
}: {
  trace: StormDrainTrace
  truth: Truth
  predictScore: number
  litterScore: number
  maxScore: number
}) {
  const total = predictScore + litterScore
  const terminal = trace.waterways[trace.waterways.length - 1]

  return (
    <div className="card p-8">
      <h2 className="font-heading font-bold text-3xl mb-2 text-primary-green">
        {total} out of {maxScore}
      </h2>
      <p className="text-gray-600 mb-6">
        {predictScore} of 3 on the prediction, {litterScore} of {LITTER.length} on the litter
        rounds.
      </p>

      <div className="rounded-xl bg-primary-blue/5 border border-primary-blue/20 p-6 mb-6">
        <h3 className="font-heading font-bold text-xl mb-3">What you actually established</h3>
        <ul className="space-y-2 text-gray-700 list-disc list-inside">
          <li>
            Water leaving your catchment travels <strong>{truth.fineDirection}</strong> for{' '}
            <strong>{trace.totalKm.toFixed(1)} km</strong> to {formatCoord(trace.terminus)}.
          </li>
          {terminal?.name && (
            <li>
              The last named waterway it joins is <strong>{terminal.name}</strong>.
            </li>
          )}
          {trace.gauges.length > 0 && (
            <li>
              <strong>{trace.gauges.length}</strong> real USGS monitoring{' '}
              {trace.gauges.length === 1 ? 'station sits' : 'stations sit'} on that path,
              starting with {trace.gauges[0].name}.
            </li>
          )}
          <li>
            Nothing along the way filters it. Whether an item arrives depends only on whether it
            floats, sinks, or has already broken into pieces too small to collect.
          </li>
        </ul>
      </div>

      <p className="text-gray-700">
        Which makes the grate outside your house the cheapest place in the entire system to stop
        any of it. Everything below is downstream of the moment someone bends down and picks
        something up.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// printable sheet
// ---------------------------------------------------------------------------

function Line({ label }: { label: string }) {
  return (
    <p style={{ marginBottom: '14pt' }}>
      {label}{' '}
      <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '220pt' }}>
        &nbsp;
      </span>
    </p>
  )
}

function PrintSheet({
  place,
  trace,
  truth,
  isFixture,
}: {
  place: Place
  trace: StormDrainTrace
  truth: Truth
  isFixture: boolean
}) {
  const terminal = trace.waterways[trace.waterways.length - 1]

  return (
    <div className="print-sheet">
      <h1 style={{ fontSize: '20pt', marginBottom: '4pt' }}>Adopt-a-Drain log sheet</h1>
      <p style={{ marginBottom: '10pt' }}>
        EcoQuest Foundation · Storm Drain Detective · ecoquestfoundation.org/games/storm-drain/
      </p>

      <h2 style={{ fontSize: '13pt', marginTop: '14pt' }}>Where this drain&apos;s water goes</h2>
      {isFixture ? (
        place.city.trim().toLowerCase() === 'cerritos' ? (
          // The sample traces Cerritos itself; for a Cerritos player the trace
          // is the right one, it just came from the bundled copy.
          <p>
            <strong>Saved sample data for Cerritos, CA</strong> — the right town, but traced from
            the bundled copy rather than live. Re-run the game with a working connection to
            confirm it against the USGS service.
          </p>
        ) : (
          <p>
            <strong>Sample data from Cerritos, CA</strong> — this is not {place.city}. Re-run the
            game with a working connection to get the trace for your own ZIP code.
          </p>
        )
      ) : (
        <p>
          Traced for ZIP {place.zip} ({place.city}, {place.state}) using the USGS Network Linked
          Data Index.
        </p>
      )}
      <ul>
        <li>
          Direction of travel: <strong>{truth.fineDirection}</strong>
        </li>
        <li>
          Distance along the channel: <strong>{trace.totalKm.toFixed(1)} km</strong> (
          {(trace.totalKm * 0.621371).toFixed(1)} miles)
        </li>
        {terminal?.name && (
          <li>
            Last named waterway: <strong>{terminal.name}</strong>
          </li>
        )}
        <li>
          End of trace: <strong>{formatCoord(trace.terminus)}</strong>
        </li>
        {trace.gauges.length > 0 && (
          <li>
            USGS stations on the path:{' '}
            {trace.gauges.slice(0, 4).map((g) => `${g.name} (${g.id})`).join('; ')}
          </li>
        )}
      </ul>

      <h2 style={{ fontSize: '13pt', marginTop: '16pt' }}>Find your drain</h2>
      <Line label="Your name:" />
      <Line label="Date and time:" />
      <Line label="Nearest cross streets:" />
      <Line label="How many steps from your front door?" />
      <p style={{ marginBottom: '10pt' }}>
        Drain type (circle one): &nbsp; kerb inlet &nbsp; · &nbsp; flat grate &nbsp; · &nbsp;
        combination &nbsp; · &nbsp; other
      </p>
      <p style={{ marginBottom: '10pt' }}>
        Is there a stencil or plaque (&ldquo;no dumping — drains to ocean&rdquo;)? &nbsp; yes
        &nbsp; / &nbsp; no
      </p>
      <p style={{ marginBottom: '10pt' }}>Photograph taken? &nbsp; yes &nbsp; / &nbsp; no</p>

      <h2 style={{ fontSize: '13pt', marginTop: '16pt' }}>Count what is there</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Item', 'How many', 'Floats, sinks or breaks up?', 'Would it reach the end of the trace?'].map(
              (h) => (
                <th key={h} style={{ border: '1px solid #000', padding: '5pt', textAlign: 'left' }}>
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i}>
              {[0, 1, 2, 3].map((c) => (
                <td key={c} style={{ border: '1px solid #000', padding: '13pt' }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: '13pt', marginTop: '16pt' }}>Come back in a week</h2>
      <Line label="Week 2 — what changed?" />
      <Line label="Week 3 — what changed?" />
      <Line label="Week 4 — what changed?" />

      <p style={{ marginTop: '14pt', fontSize: '10pt' }}>
        Log your items in Marine Debris Tracker (debristracker.org) so they join an open
        dataset. Email a photo of this sheet to ecoquestfoundation@gmail.com and tell us what
        you found. Data: USGS NLDI and USGS Water Services, both public domain.
      </p>
    </div>
  )
}
