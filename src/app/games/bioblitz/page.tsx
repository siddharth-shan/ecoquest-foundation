'use client'

// Backyard Bioblitz — the IDENTIFY game.
//
// Ten rounds, ten real photographs of species that have actually been recorded
// and verified within 25km of the player's own ZIP code. Nothing on this page is
// written by us: the photo, the name, and the "seen 8,944 times near you" number
// all come from the same iNaturalist row. That is the point. A student who
// learns to pick the Western Fence Lizard out of four lizards has learned
// something true about their street, not about a cartoon.
//
// Three things here are obligations rather than features:
//
//  * Every photo shows its attribution as visible text. These are other people's
//    photographs under CC licences; the credit line is the licence term. The
//    filtering that makes this possible lives in lib/api/inaturalist.ts, which
//    refuses to build a record for a photo it cannot credit.
//  * The observation count is quoted, never computed or rounded into a claim.
//  * When the live lookup fails we play on bundled Cerritos data and say so, on
//    screen, every round. A player is never shown Cerritos and told it is home.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import PlaceGate from '@/components/games/PlaceGate'
import GameShell from '@/components/games/GameShell'
import ImpactPanel from '@/components/games/ImpactPanel'
import DataSourceNote from '@/components/games/DataSourceNote'
import { type Place } from '@/lib/place'
import { getBestScore, recordScore } from '@/lib/progress'
import { getCampaignBySlug, getNextEvent } from '@/lib/nextEvent'
import { failureMessage } from '@/lib/api/client'
import {
  fetchLocalSpecies,
  inatExploreUrl,
  licenseLabel,
  licenseUrl,
  photoPageUrl,
  DEFAULT_RADIUS_KM,
  type LocalSpecies,
} from '@/lib/api/inaturalist'
import {
  BIOBLITZ_FIXTURE_SPECIES,
  BIOBLITZ_FIXTURE_PLACE,
  BIOBLITZ_FIXTURE_CAPTURED,
} from '@/lib/fixtures/bioblitz'

const GAME_KEY = 'bioblitz'
const ROUND_COUNT = 10
const CHOICE_COUNT = 4
const BINGO_CELLS = 25

/** Plain-English names for iNaturalist's iconic taxon codes. */
const GROUP_LABELS: Record<string, string> = {
  Aves: 'Birds',
  Insecta: 'Insects',
  Plantae: 'Plants',
  Mammalia: 'Mammals',
  Reptilia: 'Reptiles',
  Amphibia: 'Amphibians',
  Arachnida: 'Spiders and relatives',
  Mollusca: 'Molluscs',
  Fungi: 'Fungi',
  Actinopterygii: 'Ray-finned fish',
  Animalia: 'Other animals',
  Protozoa: 'Protozoans',
  Chromista: 'Chromists',
}

function groupLabel(group: string): string {
  return GROUP_LABELS[group] ?? 'Other living things'
}

interface Round {
  answer: LocalSpecies
  choices: LocalSpecies[]
  /** False when the group was too small and we borrowed wider distractors. */
  sameGroup: boolean
}

function shuffle<T>(items: T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Builds the session.
 *
 * `pool` arrives sorted most-observed first, so slicing it into as many
 * contiguous tiers as there are rounds gives the difficulty ramp for free:
 * round 1 draws its answer from the species you cannot avoid seeing, round 10
 * from the ones you have to look for. Within a round the three wrong answers
 * come from the same iconic group as the right one wherever the local pool has
 * four of them — offering a mallard as an alternative to a garden snail teaches
 * nothing and insults the player.
 */
function buildRounds(pool: LocalSpecies[], rounds = ROUND_COUNT): Round[] {
  const usable = pool.filter((s) => s.count > 0)
  if (usable.length < CHOICE_COUNT) return []

  const byGroup = new Map<string, LocalSpecies[]>()
  for (const s of usable) {
    const list = byGroup.get(s.group)
    if (list) list.push(s)
    else byGroup.set(s.group, [s])
  }

  const total = Math.min(rounds, usable.length)
  const used = new Set<number>()
  const out: Round[] = []

  for (let i = 0; i < total; i++) {
    const from = Math.floor((i * usable.length) / total)
    const to = Math.max(from + 1, Math.floor(((i + 1) * usable.length) / total))
    const tier = usable.slice(from, to).filter((s) => !used.has(s.id))
    const candidates = tier.length > 0 ? tier : usable.filter((s) => !used.has(s.id))
    if (candidates.length === 0) break

    const answer = pick(candidates)
    used.add(answer.id)

    const siblings = (byGroup.get(answer.group) ?? []).filter((s) => s.id !== answer.id)
    const sameGroup = siblings.length >= CHOICE_COUNT - 1

    const distractors = shuffle(siblings).slice(0, CHOICE_COUNT - 1)
    if (distractors.length < CHOICE_COUNT - 1) {
      // Thin group: top up from the wider local pool rather than repeat a name.
      const taken = new Set(distractors.map((s) => s.id))
      taken.add(answer.id)
      for (const s of shuffle(usable)) {
        if (distractors.length >= CHOICE_COUNT - 1) break
        if (taken.has(s.id) || s.commonName === answer.commonName) continue
        taken.add(s.id)
        distractors.push(s)
      }
    }

    out.push({ answer, choices: shuffle([answer, ...distractors]), sameGroup })
  }

  return out
}

/** 25 species spread across the whole count range, so the card is a real mix. */
function buildBingo(pool: LocalSpecies[]): LocalSpecies[] {
  if (pool.length <= BINGO_CELLS) return pool.slice()
  const picked: LocalSpecies[] = []
  for (let i = 0; i < BINGO_CELLS; i++) {
    picked.push(pool[Math.round((i * (pool.length - 1)) / (BINGO_CELLS - 1))])
  }
  return shuffle(picked)
}

export default function BioblitzPage() {

  return (
    <PlaceGate
      purpose="We ask once so every photo you see is a species that has actually been recorded near you — not a stock animal from somewhere else."
    >
      {(place, isDemo, changePlace) => (
        <Bioblitz
          // A new ZIP is a new species pool, so it is a new game.
          key={place.zip}
          place={place}
          isDemo={isDemo}
          onChangePlace={changePlace}
        />
      )}
    </PlaceGate>
  )
}

type LoadState =
  | { status: 'loading' }
  | {
      status: 'ready'
      pool: LocalSpecies[]
      isFixture: boolean
      /** Why we are on sample data. Shown verbatim; empty when live. */
      fallbackReason: string
      radiusKm: number
      widened: boolean
    }

interface BioblitzProps {
  place: Place
  isDemo: boolean
  onChangePlace: () => void
}

function Bioblitz({ place, isDemo, onChangePlace }: BioblitzProps) {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [rounds, setRounds] = useState<Round[]>([])
  const [index, setIndex] = useState(0)
  const [chosenId, setChosenId] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [photoBroken, setPhotoBroken] = useState(false)
  const [best, setBest] = useState<{ best: number; played: number } | null>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const summaryRef = useRef<HTMLHeadingElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  // Focus is moved deliberately — on advancing, finishing and restarting — and
  // never on the first paint, where hijacking focus would be rude.
  const pendingFocus = useRef<'round' | 'summary' | null>(null)
  const recorded = useRef(false)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function run() {
      const res = await fetchLocalSpecies(place.lat, place.lon, { signal: controller.signal })
      if (cancelled) return

      if (res.ok) {
        setLoad({
          status: 'ready',
          pool: res.data.species,
          isFixture: false,
          fallbackReason: '',
          radiusKm: res.data.radiusKm,
          widened: res.data.widened,
        })
        setRounds(buildRounds(res.data.species))
        return
      }

      // Every failure path lands here: offline classroom, API down, or a ZIP
      // with too few verified records to make ten honest questions.
      setLoad({
        status: 'ready',
        pool: BIOBLITZ_FIXTURE_SPECIES,
        isFixture: true,
        fallbackReason: res.reason === 'empty' ? res.message : failureMessage(res),
        radiusKm: DEFAULT_RADIUS_KM,
        widened: false,
      })
      setRounds(buildRounds(BIOBLITZ_FIXTURE_SPECIES))
    }

    void run()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [place.lat, place.lon])

  useEffect(() => {
    setBest(getBestScore(GAME_KEY))
  }, [])

  const isFixture = load.status === 'ready' && load.isFixture
  // BIOBLITZ_FIXTURE_PLACE is "Cerritos, CA"; compare against the player's own city.
  const samePlaceAsFixture =
    `${place.city}, ${place.state}`.toLowerCase() === BIOBLITZ_FIXTURE_PLACE.toLowerCase()
  /** Where the counts are actually from. Never "you" when it is sample data. */
  const placeLabel = isFixture ? BIOBLITZ_FIXTURE_PLACE : `${place.city}, ${place.state}`
  const nearPhrase = isFixture ? `near ${BIOBLITZ_FIXTURE_PLACE}` : 'near you'

  const round: Round | undefined = rounds[index]
  const revealed = chosenId !== null
  const wasCorrect = revealed && chosenId === round?.answer.id

  // Move focus when the question changes and when the answer lands, so a
  // keyboard or screen-reader player is never left pointing at a stale button
  // — or, after a restart, at nothing at all.
  useEffect(() => {
    if (pendingFocus.current === 'round') headingRef.current?.focus()
    else if (pendingFocus.current === 'summary') summaryRef.current?.focus()
    else return
    pendingFocus.current = null
  })

  useEffect(() => {
    if (revealed) revealRef.current?.focus()
  }, [revealed])

  const event = useMemo(
    () => getCampaignBySlug('biodiversity-challenge-2026') ?? getNextEvent(),
    []
  )
  const bingo = useMemo(
    () => (load.status === 'ready' ? buildBingo(load.pool) : []),
    [load]
  )

  function answer(choice: LocalSpecies) {
    if (revealed || !round) return
    setChosenId(choice.id)
    const correct = choice.id === round.answer.id
    if (correct) setScore((s) => s + 1)
    setAnnouncement(
      `${correct ? 'Correct.' : `Not quite — you chose ${choice.commonName}.`} This is the ${round.answer.commonName}, ${round.answer.scientificName}. Verified ${round.answer.count.toLocaleString()} times ${nearPhrase}. Round ${index + 1} of ${rounds.length} complete.`
    )
  }

  function next(prefix = '') {
    if (index + 1 >= rounds.length) {
      if (!recorded.current) {
        recorded.current = true
        setBest(recordScore(GAME_KEY, score))
      }
      setFinished(true)
      pendingFocus.current = 'summary'
      setAnnouncement(
        `${prefix}Session complete. You identified ${score} of ${rounds.length} species ${nearPhrase}.`
      )
      return
    }
    pendingFocus.current = 'round'
    setIndex((i) => i + 1)
    setChosenId(null)
    setPhotoBroken(false)
    setAnnouncement(`${prefix}Round ${index + 2} of ${rounds.length}.`)
  }

  /** A photo that will not load cannot be identified, so it is not scored. */
  function skipPhoto() {
    next('Species skipped because its photograph would not load. ')
  }

  const restart = useCallback(() => {
    if (load.status !== 'ready') return
    setRounds(buildRounds(load.pool))
    setIndex(0)
    setChosenId(null)
    setScore(0)
    setFinished(false)
    setPhotoBroken(false)
    recorded.current = false
    pendingFocus.current = 'round'
    setAnnouncement('New session started.')
  }, [load])

  const scoreboard = [
    { label: 'Round', value: finished ? `${rounds.length} / ${rounds.length}` : `${Math.min(index + 1, rounds.length || 1)} / ${rounds.length || ROUND_COUNT}` },
    { label: 'Identified', value: score },
    ...(best && best.best > 0 ? [{ label: 'Your best', value: best.best }] : []),
  ]

  return (
    <GameShell
      title="Backyard Bioblitz"
      tagline="Real photos of species actually recorded where you live. Learn your neighbours."
      place={place}
      isDemo={isDemo}
      onChangePlace={onChangePlace}
      announcement={announcement}
      score={load.status === 'ready' && rounds.length > 0 ? scoreboard : undefined}
      onRestart={load.status === 'ready' && rounds.length > 0 ? restart : undefined}
    >
      {load.status === 'loading' && <LoadingSkeleton city={place.city} />}

      {load.status === 'ready' && rounds.length === 0 && (
        <div className="card p-8 max-w-2xl">
          <h2 className="font-heading font-bold text-2xl mb-2">No round to play</h2>
          <p className="text-gray-600">
            We could not assemble enough licensed photos to ask a fair question. Try a different
            ZIP code, or{' '}
            <Link href="/games/" className="text-primary-blue underline">
              pick another game
            </Link>
            .
          </p>
        </div>
      )}

      {load.status === 'ready' && rounds.length > 0 && (
        <>
          {isFixture && (
            <p className="mb-6 rounded-xl border-2 border-accent-orange/40 bg-accent-orange/10 p-4 text-sm text-gray-800">
              <span className="font-semibold text-accent-orange">Sample data. </span>
              These species are from {BIOBLITZ_FIXTURE_PLACE}, captured{' '}
              {BIOBLITZ_FIXTURE_CAPTURED}
              {/* The sample IS Cerritos, so for a Cerritos player the usual
                  "not from your town" disclaimer would read "from Cerritos —
                  not from Cerritos". Say the useful thing instead: the data is
                  right for here, it is just not live. */}
              {samePlaceAsFixture ? (
                <> — the right city, but a saved snapshot rather than today&apos;s live records.</>
              ) : (
                <>
                  {' '}
                  — not from {place.city}, {place.state}.
                </>
              )}{' '}
              {load.fallbackReason}
            </p>
          )}

          {!isFixture && load.widened && (
            <p className="mb-6 rounded-xl border-2 border-primary-blue/30 bg-primary-blue/5 p-4 text-sm text-gray-800">
              Records are sparse right around {place.zip}, so this round searched a{' '}
              {load.radiusKm} km radius instead of {DEFAULT_RADIUS_KM} km.
            </p>
          )}

          {!finished && round && (
            <RoundView
              round={round}
              index={index}
              total={rounds.length}
              revealed={revealed}
              wasCorrect={!!wasCorrect}
              chosenId={chosenId}
              nearPhrase={nearPhrase}
              photoBroken={photoBroken}
              onPhotoError={() => setPhotoBroken(true)}
              onAnswer={answer}
              onNext={() => next()}
              onSkip={skipPhoto}
              headingRef={headingRef}
              revealRef={revealRef}
            />
          )}

          {finished && (
            <Summary
              score={score}
              total={rounds.length}
              best={best?.best ?? score}
              placeLabel={placeLabel}
              isFixture={isFixture}
              onRestart={restart}
              headingRef={summaryRef}
            />
          )}

          <ImpactPanel
            mission={{
              title: 'Find five of these this week',
              body: `Use the print button in this panel to get a 5×5 bingo card, then take it outside. Every square is a species with verified records ${nearPhrase} — a park, a schoolyard, a sidewalk strip and an alley will between them hold most of the card. Photograph five and you have done a real survey.`,
              mailtoSubject: `Backyard Bioblitz — what I found in ${place.city}, ${place.state} ${place.zip}`,
            }}
            science={{
              title: 'Your photos become data',
              body: 'Every photo on this page was uploaded by somebody who did exactly this. Post yours to iNaturalist and, once two people confirm the ID, it becomes research-grade — the same grade as the records this game is built from. The City Nature Challenge each April is the biggest single push.',
              href: inatExploreUrl(place.lat, place.lon, DEFAULT_RADIUS_KM),
              linkLabel: 'See what is recorded near you',
            }}
            onPrint={() => window.print()}
            printLabel="Print the bingo card"
            event={event}
          />

          <BingoSheet species={bingo} placeLabel={placeLabel} isFixture={isFixture} />

          <DataSourceNote
            sources={[
              {
                label: 'iNaturalist species counts',
                href: inatExploreUrl(place.lat, place.lon, load.radiusKm),
              },
              { label: 'iNaturalist', href: 'https://www.inaturalist.org' },
            ]}
            note={`Species and observation counts are research-grade records within ${load.radiusKm} km of ${placeLabel}, meaning at least two people independently agreed on each identification. Photographs belong to the observers named beneath them and are used here under the Creative Commons licence shown; photos that are not openly licensed are skipped entirely.`}
            isFixture={isFixture}
            fixtureLabel={`Showing sample data from ${BIOBLITZ_FIXTURE_PLACE}, captured ${BIOBLITZ_FIXTURE_CAPTURED} — the live iNaturalist lookup for ${place.city}, ${place.state} is unavailable right now.`}
          />
        </>
      )}
    </GameShell>
  )
}

function LoadingSkeleton({ city }: { city: string }) {
  return (
    <div className="card p-6 max-w-3xl" aria-busy="true">
      <div className="h-5 w-56 rounded bg-gray-200 animate-pulse motion-reduce:animate-none" />
      <div className="mt-4 h-64 rounded-xl bg-gray-200 animate-pulse motion-reduce:animate-none" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 rounded-full bg-gray-200 animate-pulse motion-reduce:animate-none"
          />
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600">
        Looking up which species have been verified near {city}…
      </p>
    </div>
  )
}

interface RoundViewProps {
  round: Round
  index: number
  total: number
  revealed: boolean
  wasCorrect: boolean
  chosenId: number | null
  nearPhrase: string
  photoBroken: boolean
  onPhotoError: () => void
  onAnswer: (s: LocalSpecies) => void
  onNext: () => void
  onSkip: () => void
  headingRef: React.RefObject<HTMLHeadingElement>
  revealRef: React.RefObject<HTMLDivElement>
}

function RoundView({
  round,
  index,
  total,
  revealed,
  wasCorrect,
  chosenId,
  nearPhrase,
  photoBroken,
  onPhotoError,
  onAnswer,
  onNext,
  onSkip,
  headingRef,
  revealRef,
}: RoundViewProps) {
  const { answer, choices } = round

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
      <div className="card p-4 sm:p-6">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-heading font-bold text-xl mb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded"
        >
          Round {index + 1} of {total}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {round.sameGroup ? (
            <>
              All four answers are {groupLabel(answer.group).toLowerCase()} recorded {nearPhrase}.
            </>
          ) : (
            <>
              Fewer than four {groupLabel(answer.group).toLowerCase()} are recorded {nearPhrase},
              so some choices come from other groups.
            </>
          )}
        </p>

        {photoBroken ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-700 font-medium">This photograph would not load.</p>
            <p className="text-sm text-gray-500 mt-1">
              Rather than ask you to identify a blank box, skip it.
            </p>
            <button
              type="button"
              onClick={onSkip}
              className="btn btn-outline mt-4 min-h-[44px]"
            >
              Skip this species
            </button>
          </div>
        ) : (
          <figure className="m-0">
            <div className="overflow-hidden rounded-xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={answer.id}
                src={answer.photoUrl}
                alt={
                  revealed
                    ? `Photograph of a ${answer.commonName}`
                    : 'Photograph of an unidentified species recorded nearby — identify it using the choices below'
                }
                onError={onPhotoError}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
            {/*
              Licence term, not decoration: these photographs are other people's
              work and the credit line has to be readable on the page.
            */}
            <PhotoCredit species={answer} />
          </figure>
        )}
      </div>

      <div>
        <fieldset className="border-0 p-0 m-0">
          <legend className="font-heading font-bold text-lg mb-3">
            Which species is this?
          </legend>
          <ul className="grid gap-3 list-none p-0 m-0">
            {choices.map((choice) => {
              const isAnswer = choice.id === answer.id
              const isChosen = choice.id === chosenId
              const state = !revealed
                ? 'idle'
                : isAnswer
                  ? 'correct'
                  : isChosen
                    ? 'wrong'
                    : 'muted'

              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    onClick={() => onAnswer(choice)}
                    disabled={revealed}
                    aria-pressed={revealed ? isChosen : undefined}
                    className={[
                      'w-full text-left min-h-[56px] px-4 py-3 rounded-xl border-2 font-medium transition-colors',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                      'disabled:cursor-default',
                      state === 'idle' &&
                        'border-gray-300 bg-white hover:border-primary-green hover:bg-primary-green/5',
                      state === 'correct' && 'border-primary-green bg-primary-green/10',
                      state === 'wrong' && 'border-red-600 bg-red-50',
                      state === 'muted' && 'border-gray-200 bg-white opacity-70',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className="flex items-start gap-3">
                      {/* Icon + word, so the colour is never the only signal. */}
                      <span aria-hidden="true" className="text-lg leading-6 w-5 shrink-0">
                        {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : ''}
                      </span>
                      <span>
                        {choice.commonName}
                        {revealed && (isAnswer || isChosen) && (
                          <span
                            className={
                              isAnswer
                                ? 'block text-sm font-semibold text-primary-green'
                                : 'block text-sm font-semibold text-red-700'
                            }
                          >
                            {isAnswer ? 'Correct answer' : 'Your answer'}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </fieldset>

        {revealed && (
          <div
            ref={revealRef}
            tabIndex={-1}
            className={[
              'mt-6 rounded-xl border-2 p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green',
              wasCorrect ? 'border-primary-green bg-primary-green/5' : 'border-red-600 bg-red-50',
            ].join(' ')}
          >
            <p className="font-heading font-bold text-lg flex items-center gap-2">
              <span aria-hidden="true">{wasCorrect ? '✓' : '✗'}</span>
              {wasCorrect ? 'Correct' : 'Not quite'}
            </p>
            <p className="mt-2 text-gray-800">
              This is the <strong>{answer.commonName}</strong> (
              <em>{answer.scientificName}</em>), {groupLabel(answer.group).toLowerCase()}.
            </p>
            {/* The one number on the page, quoted straight from the API row. */}
            <p className="mt-2 text-gray-800">
              Seen <strong>{answer.count.toLocaleString()}</strong> times {nearPhrase} — that many
              verified observations.
            </p>
            <a
              href={`https://www.inaturalist.org/taxa/${answer.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-primary-blue underline hover:no-underline"
            >
              Read about the {answer.commonName} on iNaturalist
            </a>
            <div className="mt-5">
              <button type="button" onClick={onNext} className="btn btn-primary min-h-[44px]">
                {index + 1 >= total ? 'See your results' : 'Next species'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface SummaryProps {
  score: number
  total: number
  best: number
  placeLabel: string
  isFixture: boolean
  onRestart: () => void
  headingRef: React.RefObject<HTMLHeadingElement>
}

function Summary({
  score,
  total,
  best,
  placeLabel,
  isFixture,
  onRestart,
  headingRef,
}: SummaryProps) {
  return (
    <div className="card p-8 max-w-2xl">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-heading font-bold text-3xl mb-2 text-primary-green focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green rounded"
      >
        {score} of {total} identified
      </h2>
      <p className="text-gray-700">
        Every one of those photographs is a species somebody actually found and verified around{' '}
        {placeLabel}
        {isFixture ? ' — a sample location, not your ZIP code' : ''}. Knowing their names is the
        difference between &ldquo;a bird&rdquo; and a record that a researcher can use.
      </p>
      {best > score && (
        <p className="mt-3 text-sm text-gray-600">
          Your best on this device is {best} of {total}.
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRestart} className="btn btn-primary min-h-[44px]">
          Play a new set
        </button>
        <Link href="/games/" className="btn btn-outline min-h-[44px]">
          All games
        </Link>
      </div>
    </div>
  )
}

/**
 * The credit line under a photograph, which is a licence condition rather than
 * a courtesy. CC BY 4.0 and its NC/SA variants share one attribution clause,
 * §3(a)(1), and it asks for four things: the photographer's name, the notice
 * iNaturalist supplied, a link to the licence itself, and a link to the work.
 * `attribution` covers the first two. The two links cover the rest — and
 * because the photo is cropped to the frame above, §3(a)(1)(B) wants that said
 * out loud too.
 *
 * A licence code we cannot resolve to a URL degrades to plain text instead of
 * linking somewhere invented.
 */
function PhotoCredit({ species }: { species: LocalSpecies }) {
  const href = licenseUrl(species.license)
  const label = licenseLabel(species.license)

  return (
    <figcaption className="mt-2 text-xs leading-relaxed text-gray-500">
      {species.attribution} &middot;{' '}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="license noopener noreferrer"
          className="underline hover:text-primary-green"
        >
          {label}
        </a>
      ) : (
        label
      )}{' '}
      &middot;{' '}
      <a
        href={photoPageUrl(species.photoUrl, species.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-primary-green"
      >
        via iNaturalist
      </a>{' '}
      &middot; shown cropped
    </figcaption>
  )
}

/**
 * The offline half of the game. Hidden on screen by `.print-sheet` and printed
 * as a plain 5×5 grid — names only, because a page of colour photographs is a
 * page a classroom will not print, and names-only keeps the sheet free of
 * reproduction questions about other people's licensed images.
 */
function BingoSheet({
  species,
  placeLabel,
  isFixture,
}: {
  species: LocalSpecies[]
  placeLabel: string
  isFixture: boolean
}) {
  if (species.length === 0) return null
  const rows: LocalSpecies[][] = []
  for (let i = 0; i < species.length; i += 5) rows.push(species.slice(i, i + 5))

  return (
    <div className="print-sheet">
      <h2 style={{ fontSize: '18pt', fontWeight: 700, marginBottom: '4pt' }}>
        Backyard Bioblitz — {placeLabel}
      </h2>
      <p style={{ fontSize: '10pt', marginBottom: '8pt' }}>
        Every species on this card has verified iNaturalist records near {placeLabel}
        {isFixture ? ' (sample location — this card is not for your own ZIP code)' : ''}. Cross off
        each one you photograph. Five in a row is a bingo; five anywhere is a survey.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <caption className="sr-only">
          Five by five bingo card of species recorded near {placeLabel}
        </caption>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((s) => (
                <td
                  key={s.id}
                  style={{
                    border: '1px solid #333',
                    padding: '6pt',
                    height: '1.1in',
                    verticalAlign: 'top',
                    fontSize: '9pt',
                  }}
                >
                  <strong>{s.commonName}</strong>
                  <br />
                  <em style={{ fontSize: '8pt' }}>{s.scientificName}</em>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '9pt', marginTop: '8pt' }}>
        Name: ______________________ Date: ____________ Species found: ______ of 25
      </p>
      <p style={{ fontSize: '8pt', marginTop: '4pt' }}>
        Species list from iNaturalist research-grade observations (inaturalist.org). Photographs of
        every species on this card can be seen there. EcoQuest Foundation ·
        ecoquestfoundation@gmail.com
      </p>
    </div>
  )
}
