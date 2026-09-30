// USGS hydrology for Storm Drain Detective.
//
// Four keyless, CORS-open endpoints, all probed 2026-09-29:
//
//   1. NLDI  comid/position          — which mapped stream catchment am I standing in?
//   2. NLDI  navigation/DM/flowlines — the real downstream path from there
//   3. NLDI  navigation/DM/nwissite  — the real stream gauges along that path
//   4. NWIS  iv (instantaneous values) — how fast the water is moving right now
//   5. geoconnex reference mainstems — the real *names* of the waterways
//
// The single rule this module exists to enforce: we never invent hydrology.
// Plenty of real addresses are not on NHDPlus's mapped network at all — closed
// inland basins, much of Hawaii, some coastal ZIPs — and for those the honest
// answer is "USGS has no mapped stream here", not a guessed line to the sea.
// So every function returns a Result and an empty/absent trace is a first-class
// outcome the UI is required to state plainly.

import { fetchJson, type Result } from './client'

const NLDI = 'https://api.water.usgs.gov/nldi/linked-data'
const NWIS_IV = 'https://waterservices.usgs.gov/nwis/iv/'

/** [lon, lat] — GeoJSON order, kept as-is so nothing gets silently swapped. */
export type LonLat = [number, number]

export interface TraceSegment {
  /** NHDPlus v2 COMID — the real identifier for this stream reach. */
  comid: number
  coords: LonLat[]
}

export interface Gauge {
  /** e.g. "USGS-11090500" */
  id: string
  /** e.g. "11090500" — what NWIS wants */
  siteNo: string
  /** e.g. "COYOTE C NR ARTESIA CA" */
  name: string
  lon: number
  lat: number
  comid: number
  url: string
  mainstemUrl?: string | null
}

export interface Waterway {
  id: string
  name: string
  lengthKm: number | null
  /** No downstream mainstem in the reference network — the end of the line. */
  terminal: boolean
}

export interface StormDrainTrace {
  origin: { lat: number; lon: number }
  comid: number
  distanceLimitKm: number
  /** Summed great-circle length of the traced path. */
  totalKm: number
  /** True when the path ran into our distance limit rather than an outlet. */
  truncated: boolean
  segments: TraceSegment[]
  gauges: Gauge[]
  /** Named waterways, upstream → downstream. May be empty; never guessed. */
  waterways: Waterway[]
  terminus: LonLat
}

export interface GaugeReading {
  siteNo: string
  siteName: string
  value: number
  unit: string
  dateTime: string
}

/** How far downstream we ask NLDI to walk, in km. */
export const TRACE_DISTANCE_KM = 80

// ---------------------------------------------------------------------------
// geometry
// ---------------------------------------------------------------------------

const EARTH_KM = 6371.0088

export function haversineKm(a: LonLat, b: LonLat): number {
  const dLon = ((b[0] - a[0]) * Math.PI) / 180
  const dLat = ((b[1] - a[1]) * Math.PI) / 180
  const la1 = (a[1] * Math.PI) / 180
  const la2 = (b[1] * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h))
}

export function pathLengthKm(segments: TraceSegment[]): number {
  let total = 0
  for (const seg of segments) {
    for (let i = 1; i < seg.coords.length; i++) {
      total += haversineKm(seg.coords[i - 1], seg.coords[i])
    }
  }
  return total
}

/** Initial great-circle bearing from a to b, in degrees clockwise from north. */
export function bearingDeg(a: LonLat, b: LonLat): number {
  const la1 = (a[1] * Math.PI) / 180
  const la2 = (b[1] * Math.PI) / 180
  const dLon = ((b[0] - a[0]) * Math.PI) / 180
  const y = Math.sin(dLon) * Math.cos(la2)
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

const COMPASS_8 = [
  'north',
  'northeast',
  'east',
  'southeast',
  'south',
  'southwest',
  'west',
  'northwest',
] as const

export type Cardinal = 'north' | 'east' | 'south' | 'west'

/** Bearing as one of the 8 principal directions — used in prose. */
export function bearingLabel(a: LonLat, b: LonLat): string {
  return COMPASS_8[Math.round(bearingDeg(a, b) / 45) % 8]
}

/**
 * Bearing collapsed to one of 4 cardinals — used for the prediction question,
 * where eight choices would be guesswork rather than reasoning.
 */
export function cardinalLabel(a: LonLat, b: LonLat): Cardinal {
  const quarters: Cardinal[] = ['north', 'east', 'south', 'west']
  return quarters[Math.round(bearingDeg(a, b) / 90) % 4]
}

export interface Projection {
  width: number
  height: number
  /** Maps a [lon, lat] to viewBox coordinates. */
  project: (p: LonLat) => [number, number]
}

/**
 * Equirectangular fit of a lon/lat path into an SVG viewBox.
 *
 * Longitude degrees get narrower toward the poles, so x is scaled by
 * cos(mean latitude); without that a north-south river looks stretched.
 * No map library and no projection dependency — this is the whole of it.
 */
export function makeProjection(
  points: LonLat[],
  width: number,
  height: number,
  pad: number
): Projection {
  const fallback: Projection = {
    width,
    height,
    project: () => [width / 2, height / 2],
  }
  if (points.length === 0) return fallback

  const lats = points.map((p) => p[1])
  const lons = points.map((p) => p[0])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180) || 1

  const spanX = Math.max((maxLon - minLon) * kx, 1e-9)
  const spanY = Math.max(maxLat - minLat, 1e-9)
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY)

  // Centre whichever axis has slack, so the path is not pinned to a corner.
  const offX = (width - spanX * scale) / 2
  const offY = (height - spanY * scale) / 2

  return {
    width,
    height,
    project: (p: LonLat) => [
      offX + (p[0] - minLon) * kx * scale,
      // SVG y grows downward; latitude grows upward.
      offY + (maxLat - p[1]) * scale,
    ],
  }
}

/** All points of a trace, in downstream order. */
export function tracePoints(segments: TraceSegment[]): LonLat[] {
  const out: LonLat[] = []
  for (const seg of segments) {
    for (const c of seg.coords) {
      // NLDI repeats the shared vertex between consecutive segments.
      const last = out[out.length - 1]
      if (last && last[0] === c[0] && last[1] === c[1]) continue
      out.push(c)
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// raw API shapes
// ---------------------------------------------------------------------------

interface NldiFeatureCollection<P, G> {
  features?: Array<{ properties?: P; geometry?: G }>
}

type LineGeometry = { type?: string; coordinates?: number[][] }
type PointGeometry = { type?: string; coordinates?: number[] }

function isLonLat(v: unknown): v is LonLat {
  return (
    Array.isArray(v) &&
    v.length >= 2 &&
    Number.isFinite(v[0]) &&
    Number.isFinite(v[1])
  )
}

// ---------------------------------------------------------------------------
// 1. which stream reach is under this point
// ---------------------------------------------------------------------------

/**
 * Resolves coordinates to an NHDPlus COMID.
 *
 * A 404 here is not a bug — it means USGS has no mapped catchment at that
 * point, which is a real and common answer. It is mapped to `empty` so callers
 * can tell "there is genuinely no stream here" apart from "the network failed".
 */
export async function findComid(lat: number, lon: number): Promise<Result<number>> {
  const url = `${NLDI}/comid/position?coords=POINT(${lon}%20${lat})`
  const res = await fetchJson<NldiFeatureCollection<{ comid?: number }, LineGeometry>>(url)

  if (!res.ok) {
    if (res.reason === 'http') {
      return {
        ok: false,
        reason: 'empty',
        message: 'The USGS river network has no mapped stream catchment at this location.',
      }
    }
    return res
  }

  const comid = res.data?.features?.[0]?.properties?.comid
  if (typeof comid !== 'number') {
    return {
      ok: false,
      reason: 'empty',
      message: 'The USGS river network has no mapped stream catchment at this location.',
    }
  }
  return { ok: true, data: comid }
}

// ---------------------------------------------------------------------------
// 2. the downstream path
// ---------------------------------------------------------------------------

export async function traceDownstream(
  comid: number,
  distanceKm: number = TRACE_DISTANCE_KM
): Promise<Result<TraceSegment[]>> {
  const url = `${NLDI}/comid/${comid}/navigation/DM/flowlines?f=json&distance=${distanceKm}`
  const res = await fetchJson<NldiFeatureCollection<{ nhdplus_comid?: number | string }, LineGeometry>>(url)
  if (!res.ok) return res

  const segments: TraceSegment[] = []
  for (const f of res.data?.features ?? []) {
    const raw = f.geometry?.coordinates
    if (!Array.isArray(raw)) continue
    const coords = raw.filter(isLonLat).map((c) => [c[0], c[1]] as LonLat)
    if (coords.length < 2) continue
    segments.push({ comid: Number(f.properties?.nhdplus_comid ?? comid), coords })
  }

  if (segments.length === 0) {
    return {
      ok: false,
      reason: 'empty',
      message: 'USGS returned no downstream flowlines from this stream reach.',
    }
  }
  return { ok: true, data: segments }
}

// ---------------------------------------------------------------------------
// 3. real gauges on that path
// ---------------------------------------------------------------------------

interface NwisSiteProps {
  identifier?: string
  name?: string
  comid?: number
  uri?: string
  mainstem?: string
}

/** Never fails the run: no gauges is a perfectly ordinary result. */
export async function findGauges(
  comid: number,
  distanceKm: number = TRACE_DISTANCE_KM
): Promise<Gauge[]> {
  const url = `${NLDI}/comid/${comid}/navigation/DM/nwissite?f=json&distance=${distanceKm}`
  const res = await fetchJson<NldiFeatureCollection<NwisSiteProps, PointGeometry>>(url)
  if (!res.ok) return []

  const gauges: Gauge[] = []
  for (const f of res.data?.features ?? []) {
    const p = f.properties
    const g = f.geometry?.coordinates
    if (!p?.identifier || !p.name || !isLonLat(g)) continue
    gauges.push({
      id: p.identifier,
      siteNo: p.identifier.includes('-') ? p.identifier.split('-')[1] : p.identifier,
      name: p.name,
      lon: g[0],
      lat: g[1],
      comid: Number(p.comid ?? comid),
      url: p.uri ?? `https://waterdata.usgs.gov/monitoring-location/${p.identifier}`,
      mainstemUrl: p.mainstem ?? null,
    })
  }
  return gauges
}

// ---------------------------------------------------------------------------
// 4. named waterways
// ---------------------------------------------------------------------------

interface MainstemDoc {
  properties?: {
    id?: string
    name_at_outlet?: string
    lengthkm?: number | string
    downstream_mainstem_id?: string
  }
}

/**
 * Walks the geoconnex reference-mainstem chain downstream to collect real
 * waterway names ("Coyote Creek" → "San Gabriel River").
 *
 * Best-effort enrichment only. If it yields nothing the game shows COMIDs and
 * coordinates instead — an unnamed real path beats a named invented one.
 */
export async function fetchWaterwayChain(
  mainstemUrl: string | null | undefined,
  maxHops = 4
): Promise<Waterway[]> {
  const out: Waterway[] = []
  const seen = new Set<string>()
  let url = mainstemUrl ?? ''

  for (let i = 0; i < maxHops && url && !seen.has(url); i++) {
    seen.add(url)
    const res = await fetchJson<MainstemDoc>(url, { retries: 0, timeoutMs: 5000 })
    if (!res.ok) break

    const p = res.data?.properties
    const name = p?.name_at_outlet?.trim()
    if (!name) break

    const next = p?.downstream_mainstem_id?.trim() ?? ''
    const len = Number(p?.lengthkm)
    out.push({
      id: p?.id ?? String(i),
      name,
      lengthKm: Number.isFinite(len) ? len : null,
      terminal: next === '',
    })
    url = next
  }
  return out
}

// ---------------------------------------------------------------------------
// 5. live discharge
// ---------------------------------------------------------------------------

interface NwisIvResponse {
  value?: {
    timeSeries?: Array<{
      sourceInfo?: { siteName?: string }
      variable?: { unit?: { unitCode?: string } }
      values?: Array<{ value?: Array<{ value?: string; dateTime?: string }> }>
    }>
  }
}

/**
 * Current discharge (parameter 00060, cubic feet per second) at one gauge.
 *
 * Resolves to `null` when the gauge reports nothing right now. That is the
 * normal case, not an error: both Coyote Creek gauges returned zero time
 * series when this was probed, because a Southern California creek in
 * September is dry and the sensor is seasonal. The game says "no current
 * reading" rather than printing a number nobody measured.
 */
export async function fetchLiveFlow(siteNo: string): Promise<GaugeReading | null> {
  const url = `${NWIS_IV}?format=json&sites=${encodeURIComponent(siteNo)}&parameterCd=00060&siteStatus=active`
  const res = await fetchJson<NwisIvResponse>(url, { retries: 0 })
  if (!res.ok) return null

  const series = res.data?.value?.timeSeries ?? []
  for (const t of series) {
    const points = t.values?.[0]?.value ?? []
    const latest = points[points.length - 1]
    const value = Number(latest?.value)
    // NWIS uses -999999 as its "no data" sentinel.
    if (!latest || !Number.isFinite(value) || value <= -999999) continue
    return {
      siteNo,
      siteName: t.sourceInfo?.siteName ?? siteNo,
      value,
      unit: t.variable?.unit?.unitCode ?? 'ft3/s',
      dateTime: latest.dateTime ?? '',
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// orchestration
// ---------------------------------------------------------------------------

/**
 * The whole trace for one location, or an honest failure.
 *
 * Steps 1 and 2 are load-bearing: without a COMID and a flowline there is no
 * game, and we say so. Steps 3 and 5 are enrichment and degrade to nothing.
 */
export async function buildTrace(
  lat: number,
  lon: number,
  distanceKm: number = TRACE_DISTANCE_KM
): Promise<Result<StormDrainTrace>> {
  const comidRes = await findComid(lat, lon)
  if (!comidRes.ok) return comidRes

  const comid = comidRes.data
  const flowRes = await traceDownstream(comid, distanceKm)
  if (!flowRes.ok) return flowRes

  const segments = flowRes.data
  const gauges = await findGauges(comid, distanceKm)
  const waterways = await fetchWaterwayChain(gauges.find((g) => g.mainstemUrl)?.mainstemUrl)

  const points = tracePoints(segments)
  const totalKm = pathLengthKm(segments)

  return {
    ok: true,
    data: {
      origin: { lat, lon },
      comid,
      distanceLimitKm: distanceKm,
      totalKm,
      // Within 2% of the limit we asked for means NLDI stopped because we told
      // it to, not because the water ran out. The UI must not call that an end.
      truncated: totalKm >= distanceKm * 0.98,
      segments,
      gauges,
      waterways,
      terminus: points[points.length - 1] ?? [lon, lat],
    },
  }
}

/** Formats a coordinate the way a map search box will accept it. */
export function formatCoord([lon, lat]: LonLat): string {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
}

export function osmLink([lon, lat]: LonLat): string {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lon.toFixed(5)}#map=14/${lat.toFixed(5)}/${lon.toFixed(5)}`
}
