'use client'

// What a player is asked to do once the game is over.
//
// A game that ends in a score has taught something and changed nothing. Each
// game supplies three things here: a physical task for this week, a real public
// science project the task feeds, and a printable sheet for classroom use. The
// fourth panel is a genuine dated EcoQuest event, read from src/data.

import type { NextEvent } from '@/lib/nextEvent'

export interface OfflineMission {
  title: string
  body: string
  /** Pre-fills the site's existing mailto: hand-off so a student can report back. */
  mailtoSubject?: string
}

export interface ScienceHandoff {
  title: string
  body: string
  href: string
  linkLabel: string
}

interface ImpactPanelProps {
  mission: OfflineMission
  science: ScienceHandoff
  onPrint?: () => void
  printLabel?: string
  event: NextEvent | null
}

const CONTACT_EMAIL = 'ecoquestfoundation@gmail.com'

export default function ImpactPanel({
  mission,
  science,
  onPrint,
  printLabel = 'Print the worksheet',
  event,
}: ImpactPanelProps) {
  const mailto = mission.mailtoSubject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mission.mailtoSubject)}`
    : null

  return (
    <section className="mt-12 print:hidden" aria-labelledby="impact-heading">
      <h2
        id="impact-heading"
        className="font-heading font-bold text-3xl mb-2 text-primary-green"
      >
        Now take it outside
      </h2>
      <p className="text-gray-600 mb-8 max-w-3xl">
        You just read real data about where you live. Here is how to act on it.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <div className="text-3xl mb-3" aria-hidden="true">🎯</div>
          <h3 className="font-heading font-bold text-xl mb-2">{mission.title}</h3>
          <p className="text-gray-600 mb-4">{mission.body}</p>
          {mailto && (
            <a href={mailto} className="btn btn-outline">
              Tell us what you found
            </a>
          )}
        </div>

        <div className="card p-6">
          <div className="text-3xl mb-3" aria-hidden="true">🔬</div>
          <h3 className="font-heading font-bold text-xl mb-2">{science.title}</h3>
          <p className="text-gray-600 mb-4">{science.body}</p>
          <a
            href={science.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            {science.linkLabel}
          </a>
        </div>

        {event && (
          <div className="card p-6">
            <div className="text-3xl mb-3" aria-hidden="true">📅</div>
            <h3 className="font-heading font-bold text-xl mb-1">{event.title}</h3>
            <p className="text-sm font-semibold text-primary-blue mb-2">
              {event.displayDate} · {event.displayTime}
            </p>
            <p className="text-gray-600 mb-4 line-clamp-4">{event.description}</p>
            <a
              href={event.href}
              {...(event.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="btn btn-primary"
            >
              {event.ctaLabel}
            </a>
          </div>
        )}

        {onPrint && (
          <div className="card p-6">
            <div className="text-3xl mb-3" aria-hidden="true">🖨️</div>
            <h3 className="font-heading font-bold text-xl mb-2">For teachers</h3>
            <p className="text-gray-600 mb-4">
              A printable sheet for this activity. No sign-in, works on paper, and the
              questions match what the class just played.
            </p>
            <button type="button" onClick={onPrint} className="btn btn-outline">
              {printLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
