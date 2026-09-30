'use client'

// The player's location, entered once and shared by all four games.
//
// Everything the games teach is anchored to a real place: the species actually
// recorded near you, the river your street drains into, the air you breathed
// last January. That needs coordinates, and the only thing we ask a student for
// is a ZIP code.
//
// Nothing here leaves the browser. There is no account and no server — the site
// is a static export — which is also the arrangement that keeps a K-12 audience
// clear of COPPA's consent requirements.

import { useCallback, useEffect, useState } from 'react'
import { fetchJson, type Result } from './api/client'

export interface Place {
  zip: string
  city: string
  state: string
  lat: number
  lon: number
}

/**
 * Cerritos — EcoQuest's own city. Used so every game is instantly playable
 * without typing anything (classrooms, reviewers), and as the labelled sample
 * when a live lookup fails. Always disclosed, never passed off as the
 * player's own location.
 */
export const DEMO_PLACE: Place = {
  zip: '90703',
  city: 'Cerritos',
  state: 'CA',
  lat: 33.8669,
  lon: -118.0686,
}

const STORAGE_KEY = 'ecoquest:place'

interface ZippopotamResponse {
  'post code': string
  places: Array<{
    'place name': string
    'state abbreviation': string
    latitude: string
    longitude: string
  }>
}

export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip.trim())
}

/** Look up a US ZIP. Keyless and CORS-open; verified 2026-09-29. */
export async function resolveZip(zip: string): Promise<Result<Place>> {
  const clean = zip.trim()
  if (!isValidZip(clean)) {
    return { ok: false, reason: 'empty', message: 'Enter a 5-digit US ZIP code.' }
  }

  const res = await fetchJson<ZippopotamResponse>(`https://api.zippopotam.us/us/${clean}`)
  if (!res.ok) {
    // Zippopotam answers 404 for a ZIP that does not exist.
    if (res.reason === 'http') {
      return { ok: false, reason: 'empty', message: `We could not find the ZIP code ${clean}.` }
    }
    return res
  }

  const p = res.data?.places?.[0]
  const lat = Number(p?.latitude)
  const lon = Number(p?.longitude)
  if (!p || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return { ok: false, reason: 'empty', message: `No location data for ${clean}.` }
  }

  return {
    ok: true,
    data: {
      zip: clean,
      city: p['place name'],
      state: p['state abbreviation'],
      lat,
      lon,
    },
  }
}

function isPlace(v: unknown): v is Place {
  if (!v || typeof v !== 'object') return false
  const p = v as Record<string, unknown>
  return (
    typeof p.zip === 'string' &&
    typeof p.city === 'string' &&
    typeof p.state === 'string' &&
    typeof p.lat === 'number' &&
    typeof p.lon === 'number'
  )
}

export function loadPlace(): Place | null {
  // Static export: this module is imported during prerender, where there is no
  // window. Guard rather than assume a browser.
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isPlace(parsed) ? parsed : null
  } catch {
    // Private mode, blocked storage, or corrupt value — all mean "no place yet".
    return null
  }
}

export function savePlace(place: Place): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(place))
  } catch {
    /* Storage is a convenience here; the session still works without it. */
  }
}

export function clearPlace(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* no-op */
  }
}

export interface UsePlace {
  place: Place | null
  /** True until the first client-side read completes. Prevents an SSR flash. */
  loading: boolean
  /** True when `place` is the Cerritos sample rather than the player's own ZIP. */
  isDemo: boolean
  setPlace: (place: Place) => void
  useDemoPlace: () => void
  reset: () => void
}

export function usePlace(): UsePlace {
  const [place, setPlaceState] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const stored = loadPlace()
    if (stored) {
      setPlaceState(stored)
      setIsDemo(stored.zip === DEMO_PLACE.zip)
    }
    setLoading(false)
  }, [])

  const setPlace = useCallback((next: Place) => {
    setPlaceState(next)
    setIsDemo(next.zip === DEMO_PLACE.zip)
    savePlace(next)
  }, [])

  const useDemoPlace = useCallback(() => {
    setPlaceState(DEMO_PLACE)
    setIsDemo(true)
    savePlace(DEMO_PLACE)
  }, [])

  const reset = useCallback(() => {
    setPlaceState(null)
    setIsDemo(false)
    clearPlace()
  }, [])

  return { place, loading, isDemo, setPlace, useDemoPlace, reset }
}
