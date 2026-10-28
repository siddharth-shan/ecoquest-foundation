'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  activityFor,
  countdown,
  icsFor,
  nextAwarenessDays,
  seasonFor,
  slugify,
  weeklyPick,
  type UpcomingDay,
} from '@/lib/planetCalendar'

// Everything here is worked out from the date alone, so nobody has to edit it.
// The first render uses the build date, so the static HTML is never empty and
// hydration matches; the effect then swaps in the visitor's own date, which
// keeps the section right between deploys.
//
// builtOn is a YYYY-MM-DD string parsed as a *local* date: an ISO timestamp
// would land on different calendar days on a UTC build server and a Pacific
// browser, and the two renders would disagree.

function localDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}

const longDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
const monthShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' })

function downloadIcs(u: UpcomingDay) {
  const url = URL.createObjectURL(new Blob([icsFor(u)], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${slugify(u.day.name)}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Revoking in the same tick can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function ThisWeekForPlanet({ builtOn }: { builtOn: string }) {
  const [today, setToday] = useState(() => localDate(builtOn))
  useEffect(() => setToday(new Date()), [])

  const { activity, because } = weeklyPick(today)
  const upcoming = nextAwarenessDays(today, 4)
  const season = seasonFor(today)
  const seasonActivity = activityFor(season.activity)

  return (
    <section className="section-padding" aria-labelledby="this-week-heading">
      <div className="container-custom">
        <div className="section-header">
          <h2 id="this-week-heading" className="section-title">This Week for the Planet</h2>
          <div className="section-underline" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <article className="card overflow-hidden flex flex-col">
              <img src={activity.img} alt="" className="w-full h-48 sm:h-56 object-contain bg-gray-50" />
              <div className="p-6 flex flex-col flex-1">
                <p className="text-sm font-semibold text-primary-blue mb-2">
                  {because
                    ? `${because.day.name} is ${because.daysAway === 0 ? 'today' : longDate(because.date)} — so this week:`
                    : 'This week’s pick'}
                </p>
                <h3 className="font-heading font-bold text-2xl text-primary-green mb-3">{activity.title}</h3>
                <p className="text-gray-600 mb-6">{activity.summary}</p>
                <Link href={activity.href} className="btn btn-primary self-start mt-auto">
                  {activity.cta} &rarr;
                </Link>
              </div>
            </article>

            <article className="card p-6" aria-labelledby="season-heading">
              <p className="text-sm font-semibold text-primary-blue mb-2">This season in Southern California</p>
              <h3 id="season-heading" className="font-heading font-bold text-xl text-primary-green mb-2">
                {season.heading}
              </h3>
              <p className="text-gray-600 mb-3">{season.text}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a
                  href={season.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source: ${season.sourceLabel} (opens in a new tab)`}
                  className="text-xs text-gray-500 hover:text-primary-green underline"
                >
                  Source: {season.sourceLabel} ↗
                </a>
                <Link href={seasonActivity.href} className="text-sm font-semibold text-primary-blue hover:underline">
                  Try: {seasonActivity.title} &rarr;
                </Link>
              </div>
            </article>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-xl text-gray-800 mb-4">Coming up for the planet</h3>
            <ul className="space-y-4">
              {upcoming.map((u) => {
                const { day, date, daysAway, activity: a } = u
                return (
                  <li key={day.name} className="card p-4 flex gap-4 items-start">
                    <div className="text-center min-w-[3.5rem]" aria-hidden="true">
                      <div className="text-xs uppercase font-semibold text-gray-500">{monthShort(date)}</div>
                      <div className="text-2xl font-bold text-primary-green leading-none">{date.getDate()}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">{day.name}</span>
                        <span
                          className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                            daysAway === 0 ? 'bg-primary-green-dark text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {countdown(daysAway)}
                        </span>
                      </div>
                      <span className="sr-only">{longDate(date)}.</span>
                      <p className="text-sm text-gray-600 mt-1">{day.why}</p>
                      <a
                        href={day.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${day.name} — ${day.source} page (opens in a new tab)`}
                        className="text-xs text-gray-500 hover:text-primary-green underline"
                      >
                        {day.source} ↗
                      </a>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <Link href={a.href} className="text-sm font-semibold text-primary-blue hover:underline">
                          Try: {a.title} &rarr;
                        </Link>
                        <button
                          type="button"
                          onClick={() => downloadIcs(u)}
                          aria-label={`Add to calendar: ${day.name}`}
                          className="text-sm text-gray-600 hover:text-primary-green underline"
                        >
                          Add to calendar
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
