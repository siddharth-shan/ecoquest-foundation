'use client'

// Shared frame for every game: title, the place it is reading, score, restart,
// and the single polite live region that all in-game feedback speaks through.
//
// The games this replaced announced results with alert(), which blocks the main
// thread and is invisible to a screen reader as running commentary. Anything a
// sighted player learns from a colour change has to reach everyone else here.

import Link from 'next/link'
import type { Place } from '@/lib/place'

interface GameShellProps {
  title: string
  tagline: string
  place: Place
  isDemo: boolean
  onChangePlace: () => void
  /** Spoken politely on change. Keep it to what just happened and why. */
  announcement?: string
  score?: { label: string; value: string | number }[]
  onRestart?: () => void
  children: React.ReactNode
}

export default function GameShell({
  title,
  tagline,
  place,
  isDemo,
  onChangePlace,
  announcement,
  score,
  onRestart,
  children,
}: GameShellProps) {
  return (
    <>
      <div className="bg-gradient-eco text-white py-12 print:hidden">
        <div className="container-custom">
          <Link
            href="/games/"
            className="text-white/80 hover:text-white text-sm underline underline-offset-4"
          >
            ← All games
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-2 font-heading">{title}</h1>
          <p className="text-lg text-white/90">{tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <span aria-hidden="true">📍</span>
              {place.city}, {place.state} {place.zip}
            </span>
            <button
              type="button"
              onClick={onChangePlace}
              className="text-sm underline underline-offset-4 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 rounded px-1"
            >
              Change location
            </button>
            {isDemo && (
              <span className="text-sm text-white/80">
                (sample location — enter your own ZIP for local data)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* One polite region for the whole game. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <section className="section-padding pt-10">
        <div className="container-custom">
          {(score?.length || onRestart) && (
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
              <dl className="flex flex-wrap gap-6">
                {score?.map((s) => (
                  <div key={s.label}>
                    <dt className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                      {s.label}
                    </dt>
                    <dd className="text-2xl font-bold text-primary-green font-heading">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {onRestart && (
                <button type="button" onClick={onRestart} className="btn btn-outline">
                  Start over
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </section>
    </>
  )
}
