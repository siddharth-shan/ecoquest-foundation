'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export interface Slide {
  /** Shown as the slide heading. */
  title: string
  /** Optional line above the title (section label, source note). */
  eyebrow?: string
  /** Body bullets. Keep each to one idea — these are read aloud, not scanned. */
  bullets?: string[]
  /** A single pull-quote or headline number to anchor the slide. */
  callout?: string
  /** Speaker notes. Visible on the page, hidden in presentation mode. */
  notes?: string
}

interface SlideDeckProps {
  deckTitle: string
  sessionDate: string
  slides: Slide[]
}

/**
 * A presentable deck that lives on our own domain, so every session has a
 * permanent public URL. Arrow keys navigate; "F" enters fullscreen for
 * screen-sharing over Zoom. Print the page to get a PDF.
 */
export default function SlideDeck({ deckTitle, sessionDate, slides }: SlideDeckProps) {
  const [current, setCurrent] = useState(0)
  const [presenting, setPresenting] = useState(false)

  const goNext = useCallback(
    () => setCurrent((i) => Math.min(i + 1, slides.length - 1)),
    [slides.length]
  )
  const goPrev = useCallback(() => setCurrent((i) => Math.max(i - 1, 0)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'f' || e.key === 'F') {
        setPresenting((p) => !p)
      } else if (e.key === 'Escape') {
        setPresenting(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const slide = slides[current]

  return (
    <div className={presenting ? 'fixed inset-0 z-50 bg-white flex flex-col' : ''}>
      {!presenting && (
        <div className="bg-gradient-eco text-white py-12">
          <div className="container-custom">
            <Link href="/events/" className="text-white/80 hover:text-white text-sm font-semibold">
              ← Back to Events
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-2 font-heading">{deckTitle}</h1>
            <p className="text-white/90">EcoQuest Online Seminar Series · {sessionDate}</p>
          </div>
        </div>
      )}

      <div className={presenting ? 'flex-1 flex flex-col p-6 md:p-12' : 'container-custom py-10'}>
        {/* Slide surface */}
        <div
          className={`bg-white border-2 border-gray-200 rounded-2xl shadow-lg flex flex-col justify-center ${
            presenting ? 'flex-1 p-10 md:p-16' : 'p-8 md:p-14 min-h-[26rem]'
          }`}
        >
          {slide.eyebrow && (
            <p className="text-primary-blue font-semibold uppercase tracking-wide text-sm mb-3">
              {slide.eyebrow}
            </p>
          )}
          <h2
            className={`font-bold text-primary-green font-heading mb-6 ${
              presenting ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'
            }`}
          >
            {slide.title}
          </h2>

          {slide.callout && (
            <p
              className={`text-gray-800 font-semibold border-l-4 border-accent-yellow pl-5 mb-6 ${
                presenting ? 'text-2xl md:text-3xl' : 'text-xl'
              }`}
            >
              {slide.callout}
            </p>
          )}

          {slide.bullets && (
            <ul className={`space-y-4 ${presenting ? 'text-xl md:text-2xl' : 'text-lg'}`}>
              {slide.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-primary-green font-bold shrink-0" aria-hidden>
                    ▸
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={goPrev}
            disabled={current === 0}
            className="flex items-center gap-1 px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-gray-700"
          >
            <HiChevronLeft size={20} /> Previous
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-semibold">
              {current + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={() => setPresenting((p) => !p)}
              className="text-sm font-semibold text-primary-green hover:underline"
            >
              {presenting ? 'Exit (Esc)' : 'Present (F)'}
            </button>
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={current === slides.length - 1}
            className="flex items-center gap-1 px-5 py-2.5 rounded-full bg-primary-green text-white hover:bg-primary-green-dark disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
          >
            Next <HiChevronRight size={20} />
          </button>
        </div>

        {/* Speaker notes — presentation mode hides these */}
        {!presenting && slide.notes && (
          <div className="mt-6 bg-gray-50 border-l-4 border-primary-blue rounded-lg p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-blue mb-2">
              Speaker notes
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">{slide.notes}</p>
          </div>
        )}
      </div>

      {!presenting && (
        <div className="container-custom pb-12">
          <p className="text-sm text-gray-500">
            Use the arrow keys to move between slides, or press <strong>F</strong> to present
            full-screen for screen sharing. To save a PDF, use your browser&apos;s Print command.
          </p>
        </div>
      )}
    </div>
  )
}
