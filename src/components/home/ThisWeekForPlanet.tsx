'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { nextAwarenessDays, weeklyPick } from '@/lib/planetCalendar'

// Both halves are worked out from the date alone, so nobody has to edit them.
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

export default function ThisWeekForPlanet({ builtOn }: { builtOn: string }) {
  const [today, setToday] = useState(() => localDate(builtOn))
  useEffect(() => setToday(new Date()), [])

  const { activity, because } = weeklyPick(today)
  const upcoming = nextAwarenessDays(today, 3)

  return (
    <section className="section-padding" aria-labelledby="this-week-heading">
      <div className="container-custom">
        <div className="section-header">
          <h2 id="this-week-heading" className="section-title">This Week for the Planet</h2>
          <div className="section-underline" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <article className="card overflow-hidden lg:col-span-3 flex flex-col">
            <img src={activity.img} alt="" className="w-full h-56 object-cover" />
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

          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-xl text-gray-800 mb-4">Coming up for the planet</h3>
            <ul className="space-y-4">
              {upcoming.map(({ day, date, daysAway, activity: a }) => (
                <li key={day.name} className="card p-4 flex gap-4 items-start">
                  <div className="text-center min-w-[3.5rem]" aria-hidden="true">
                    <div className="text-xs uppercase font-semibold text-gray-500">{monthShort(date)}</div>
                    <div className="text-2xl font-bold text-primary-green leading-none">{date.getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{day.name}</span>
                      {daysAway === 0 && (
                        <span className="text-xs font-semibold bg-primary-green text-white rounded-full px-2 py-0.5">Today</span>
                      )}
                    </div>
                    <span className="sr-only">{longDate(date)}.</span>
                    <a
                      href={day.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${day.name} — UN observance page (opens in a new tab)`}
                      className="text-xs text-gray-500 hover:text-primary-green underline"
                    >
                      UN observance ↗
                    </a>
                    <div>
                      <Link href={a.href} className="text-sm font-semibold text-primary-blue hover:underline mt-2 inline-block">
                        Try: {a.title} &rarr;
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
