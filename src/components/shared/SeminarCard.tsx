import Link from 'next/link'
import { HiCalendar, HiClock, HiExternalLink, HiVideoCamera } from 'react-icons/hi'
import { HideAfter, TodayBadge } from '@/components/shared/EventTiming'
import {
  type Seminar,
  seminarSignup,
  seminarTile,
  seriesSessions,
  sessionNumber,
} from '@/data/seminars'

/** An upcoming online session on /events/. Disappears on its own once it ends. */
export default function SeminarCard({ seminar }: { seminar: Seminar }) {
  const minutes = Math.round((Date.parse(seminar.endDateTime) - Date.parse(seminar.startDateTime)) / 60000)
  return (
      <HideAfter endsAt={seminar.endDateTime}>
        <article className="card border-l-4 border-primary-green">
          <div className="p-6 md:p-8 flex gap-5 md:gap-7">
            {/* Date tile. Sessions are two weeks apart, so the date is
                the thing a reader scans for — it gets its own anchor
                instead of a line in the meta row. Hidden on phones,
                where a 64px column would squeeze the text into a
                gutter; the meta row carries the date there instead. */}
            <div className="hidden sm:block shrink-0 w-16 md:w-20 self-start rounded-xl border border-primary-green/25 bg-primary-green/5 py-3 text-center">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
                {seminarTile(seminar).top}
              </div>
              <div className="text-2xl md:text-3xl font-bold leading-tight text-primary-green-dark font-heading">
                {seminarTile(seminar).main}
              </div>
              <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-600">
                {seminarTile(seminar).bottom}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-primary-green/10 text-primary-green-dark text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Session {sessionNumber(seminar)} of {seriesSessions(seminar.series).length}
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Free
                </span>
                <TodayBadge startsAt={seminar.startDateTime} endsAt={seminar.endDateTime} />
              </div>

              <h3 className="font-bold text-xl md:text-2xl mb-3 text-gray-900 font-heading leading-snug">
                {seminar.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mb-4">
                <span className="sm:hidden inline-flex items-center gap-1.5">
                  <HiCalendar className="text-primary-green shrink-0" aria-hidden />
                  <span className="font-medium text-gray-800">{seminar.displayDate}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HiClock className="text-primary-green shrink-0" aria-hidden />
                  <span className="font-medium text-gray-800">
                  {seminar.displayTime} · {minutes} min
                </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HiVideoCamera className="text-primary-green shrink-0" aria-hidden />
                  Online via Zoom
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-5 max-w-prose">
                {seminar.description}
              </p>

              {(seminar.partner || seminar.game) && (
                <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
                  {seminar.partner && (
                    <a
                      href={seminar.partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary-green/30 bg-primary-green/5 px-3 py-1 font-semibold text-primary-green-dark hover:underline"
                    >
                      Take part: {seminar.partner.name}
                      <HiExternalLink className="opacity-70" aria-hidden />
                    </a>
                  )}
                  {seminar.game && (
                    <Link
                      href={seminar.game.href}
                      className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 font-semibold text-primary-blue-dark hover:underline"
                    >
                      Try: {seminar.game.name}
                    </Link>
                  )}
                </div>
              )}

              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-gray-100 pt-4">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    Who it&apos;s for
                  </dt>
                  <dd className="text-gray-700">{seminar.audience}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    Built on
                  </dt>
                  <dd className="text-gray-700">{seminar.builtOn}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* seminarSignup names the platform in the label (Eventbrite or
              Google Form): sign-up is held by a third party, not by a form
              on our own site. Eventbrite's logo is deliberately not used — the
              wordmark is their trademark and we have no partnership with
              them to display it. */}
          <div className="bg-gray-50 border-t border-gray-100 px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {(() => {
                const signup = seminarSignup(seminar)
                return signup.external ? (
                  <a
                    href={signup.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {signup.label}
                    <HiExternalLink className="text-base opacity-80" aria-hidden />
                  </a>
                ) : (
                  <Link href={signup.href} className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    {signup.label}
                  </Link>
                )
              })()}
              {seminar.hasDeck && (
                <Link
                  href={`/seminars/${seminar.slug}/`}
                  className="btn btn-outline whitespace-nowrap text-sm px-4"
                >
                  Preview Slides
                </Link>
              )}
              {seminar.listing && (
                <a
                  href={seminar.listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary-blue-dark hover:underline"
                >
                  Also listed on {seminar.listing.name}
                </a>
              )}
            </div>
            <p className="text-xs text-gray-500 sm:ml-auto sm:text-right">
              Hosted by EcoQuest Foundation, a 501(c)(3) nonprofit
            </p>
          </div>
        </article>
      </HideAfter>
  )
}
