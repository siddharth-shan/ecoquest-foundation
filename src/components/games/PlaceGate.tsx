'use client'

// Asks once for the ZIP the games are built around, then gets out of the way.

import { useState, type FormEvent } from 'react'
import { resolveZip, isValidZip, usePlace, type Place, DEMO_PLACE } from '@/lib/place'

interface PlaceGateProps {
  /** What this particular game will do with the location. One short sentence. */
  purpose: string
  children: (place: Place, isDemo: boolean) => React.ReactNode
}

export default function PlaceGate({ purpose, children }: PlaceGateProps) {
  const { place, loading, isDemo, setPlace, useDemoPlace } = usePlace()
  const [zip, setZip] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isValidZip(zip)) {
      setError('Enter a 5-digit US ZIP code.')
      return
    }
    setBusy(true)
    const res = await resolveZip(zip)
    setBusy(false)
    if (res.ok) setPlace(res.data)
    else setError(res.message)
  }

  if (loading) {
    return (
      <div className="container-custom py-20" aria-busy="true">
        <div className="h-40 rounded-xl bg-gray-100 animate-pulse motion-reduce:animate-none" />
        <span className="sr-only">Loading…</span>
      </div>
    )
  }

  if (place) return <>{children(place, isDemo)}</>

  return (
    <div className="container-custom py-16">
      <div className="card max-w-xl mx-auto p-8">
        <h2 className="font-heading font-bold text-2xl mb-2 text-primary-green">
          Where are you playing from?
        </h2>
        <p className="text-gray-600 mb-6">{purpose}</p>

        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="zip-input" className="block text-sm font-semibold text-gray-700 mb-2">
            US ZIP code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="zip-input"
              name="zip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
              placeholder="90703"
              aria-describedby={error ? 'zip-error' : 'zip-help'}
              aria-invalid={error ? true : undefined}
              className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/30"
            />
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Looking up…' : 'Start'}
            </button>
          </div>

          <p id="zip-help" className="text-sm text-gray-500 mt-3">
            Your ZIP stays in this browser. We never send it anywhere, and there is no sign-in.
          </p>

          <div aria-live="polite">
            {error && (
              <p id="zip-error" className="text-sm text-red-700 mt-2 font-medium">
                {error}
              </p>
            )}
          </div>
        </form>

        <hr className="my-6 border-gray-200" />
        <button type="button" onClick={useDemoPlace} className="btn btn-outline w-full">
          Play with {DEMO_PLACE.city}, {DEMO_PLACE.state} instead
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {DEMO_PLACE.city} is EcoQuest&apos;s home city — a good sample if you would rather not
          enter a ZIP.
        </p>
      </div>
    </div>
  )
}
