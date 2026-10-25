'use client'

import { useEffect, useState, type ReactNode } from 'react'

// Build-time filtering (hasEnded in src/data/) decides what a deploy contains,
// but this is a static export: without a redeploy, last month's build keeps
// advertising last month's events. These two components re-check the clock in
// the visitor's browser so an "upcoming" card cannot outlive its event.
//
// The server-rendered HTML still contains the card, so crawlers and no-JS
// visitors see what the last build saw — redeploying remains the real fix.

/** setTimeout overflows above ~24.8 days; anything further out needs no timer. */
const MAX_TIMEOUT = 2 ** 31 - 1

/** Renders children until `endsAt` passes, then removes them — live, without a reload. */
export function HideAfter({ endsAt, children }: { endsAt: string; children: ReactNode }) {
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const remaining = Date.parse(endsAt) - Date.now()
    if (remaining <= 0) {
      setEnded(true)
      return
    }
    if (remaining > MAX_TIMEOUT) return
    const timer = setTimeout(() => setEnded(true), remaining)
    return () => clearTimeout(timer)
  }, [endsAt])

  return ended ? null : <>{children}</>
}

/** 'YYYY-MM-DD' for an instant, on the Pacific calendar the events run on. */
function pacificDay(ms: number) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(ms)
}

/**
 * A "Today" pill for an event that starts on today's Pacific date and has not
 * ended. Rendered only in the browser — at build time there is no "today".
 */
export function TodayBadge({ startsAt, endsAt }: { startsAt: string; endsAt: string }) {
  const [today, setToday] = useState(false)

  useEffect(() => {
    const now = Date.now()
    setToday(pacificDay(Date.parse(startsAt)) === pacificDay(now) && now < Date.parse(endsAt))
  }, [startsAt, endsAt])

  if (!today) return null
  return (
    <span className="bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden />
      Today
    </span>
  )
}
