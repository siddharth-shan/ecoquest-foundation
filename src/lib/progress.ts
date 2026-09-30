'use client'

// Per-device game progress: best scores, badges, streaks.
//
// Deliberately small and local. There is no server to sync to and no account to
// attach it to, so this is a convenience for one browser, not a record of
// anything. Nothing here is ever presented as a public or comparative score —
// a leaderboard we cannot actually compute would be exactly the kind of
// unverifiable claim this site has to avoid.

const PREFIX = 'ecoquest:games:'

export function getGameState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setGameState<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* Storage unavailable — progress simply is not kept this session. */
  }
}

export interface BestScore {
  best: number
  played: number
}

/** Records a finished run and returns the updated record for that game. */
export function recordScore(gameKey: string, score: number): BestScore {
  const prev = getGameState<BestScore>(`${gameKey}:best`, { best: 0, played: 0 })
  const next: BestScore = {
    best: Math.max(prev.best, score),
    played: prev.played + 1,
  }
  setGameState(`${gameKey}:best`, next)
  return next
}

export function getBestScore(gameKey: string): BestScore {
  return getGameState<BestScore>(`${gameKey}:best`, { best: 0, played: 0 })
}
