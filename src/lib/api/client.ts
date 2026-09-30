// Shared fetch wrapper for the games' public-data calls.
//
// Every game in /games reads live data from a keyless, CORS-open public API.
// None of those APIs are ours, so any of them can be slow, rate-limited, or
// down while a student is mid-game. This module makes that a normal, typed
// outcome instead of an exception: callers get a Result and must decide what
// to show. No game may throw a network error at a player.

export type FailReason = 'timeout' | 'network' | 'http' | 'parse' | 'empty'

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; reason: FailReason; message: string }

export interface FetchOptions {
  /** Hard ceiling per attempt. Kept short: a student will not wait 30s. */
  timeoutMs?: number
  /** Retries after the first attempt. One is enough for a transient blip. */
  retries?: number
  signal?: AbortSignal
}

const DEFAULT_TIMEOUT = 8000
const DEFAULT_RETRIES = 1

function fail(reason: FailReason, message: string): Result<never> {
  return { ok: false, reason, message }
}

/**
 * GET a JSON document. Resolves to a Result — it does not throw for network
 * or HTTP failures, only surfaces them as `ok: false`.
 */
export async function fetchJson<T>(url: string, opts: FetchOptions = {}): Promise<Result<T>> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT
  const retries = opts.retries ?? DEFAULT_RETRIES

  let last: Result<T> = fail('network', 'Request was never attempted.')

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (opts.signal?.aborted) return fail('network', 'Cancelled.')

    // Per-attempt controller so a retry is not killed by the previous timeout.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const onOuterAbort = () => controller.abort()
    opts.signal?.addEventListener('abort', onOuterAbort)

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) {
        // 4xx will not fix itself on retry; 5xx and 429 might.
        last = fail('http', `Service returned ${res.status}.`)
        if (res.status < 500 && res.status !== 429) return last
      } else {
        try {
          return { ok: true, data: (await res.json()) as T }
        } catch {
          return fail('parse', 'Response was not valid JSON.')
        }
      }
    } catch (err) {
      // An outer-signal abort is a real cancellation, not a timeout.
      if (opts.signal?.aborted) return fail('network', 'Cancelled.')
      last =
        err instanceof DOMException && err.name === 'AbortError'
          ? fail('timeout', 'The data service took too long to answer.')
          : fail('network', 'Could not reach the data service.')
    } finally {
      clearTimeout(timer)
      opts.signal?.removeEventListener('abort', onOuterAbort)
    }

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
    }
  }

  return last
}

/** Plain-language text for a failure, safe to show a student. */
export function failureMessage(r: Extract<Result<unknown>, { ok: false }>): string {
  switch (r.reason) {
    case 'timeout':
      return 'The live data service is taking too long to respond.'
    case 'empty':
      return 'The live data service had no data for this location.'
    default:
      return 'We could not reach the live data service.'
  }
}
