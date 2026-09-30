// iNaturalist species observed near a point.
//
// One endpoint, keyless and CORS-open (verified 2026-09-29):
//   GET /v1/observations/species_counts?lat&lng&radius&quality_grade=research&per_page=200
// It answers "which species have actually been photographed and verified near
// here, and how often" — which is the whole premise of the Bioblitz game. The
// counts it returns are the only numbers the game is allowed to state.
//
// Two rules are enforced here rather than in the UI, because getting either one
// wrong in a component would be a defect that ships silently:
//
//  1. LICENSING. iNaturalist photos belong to the people who took them. A photo
//     whose `license_code` is absent, null, or 'c' (all rights reserved) may not
//     be displayed at all, and one that may be displayed has to carry its
//     `attribution` string as visible text. `toLocalSpecies` refuses to build a
//     record that cannot satisfy both, so an unlicensed photo can never reach a
//     render path.
//  2. PLAYABILITY. A rural ZIP can come back with a handful of species, which is
//     not a game. `fetchLocalSpecies` widens the radius once before giving up,
//     and gives up loudly so the caller can fall back to labelled sample data.

import { fetchJson, type Result } from './client'

/** Raw shapes, as returned. Optional wherever the API may omit a field. */
export interface InatPhoto {
  medium_url?: string | null
  square_url?: string | null
  attribution?: string | null
  license_code?: string | null
}

export interface InatTaxon {
  id: number
  name?: string | null
  preferred_common_name?: string | null
  rank?: string | null
  iconic_taxon_name?: string | null
  default_photo?: InatPhoto | null
}

export interface InatSpeciesCount {
  count: number
  taxon: InatTaxon
}

export interface InatSpeciesCountsResponse {
  total_results?: number
  results?: InatSpeciesCount[]
}

/** One playable species: a real photo we are allowed to show, plus its credit. */
export interface LocalSpecies {
  id: number
  commonName: string
  scientificName: string
  /** iNaturalist `iconic_taxon_name` — 'Aves', 'Insecta', 'Plantae', … */
  group: string
  /** Verified observations of this species within the search radius. */
  count: number
  photoUrl: string
  thumbUrl: string
  /** MUST be rendered as visible text next to the photo. Not alt text. */
  attribution: string
  license: string
}

export const INAT_BASE = 'https://api.inaturalist.org/v1'
export const INAT_SITE = 'https://www.inaturalist.org'

/** Below this, the pool cannot fill ten non-repeating rounds with distractors. */
export const MIN_USABLE_SPECIES = 40

/** Starting search radius, in kilometres. */
export const DEFAULT_RADIUS_KM = 25
/** One widening attempt for a thin-data ZIP before falling back. */
export const WIDE_RADIUS_KM = 75

/**
 * Licenses that permit display. Anything not on this list — including `null`,
 * an empty string, and `'c'` (all rights reserved) — is skipped outright.
 * Allow-list rather than deny-list: an unfamiliar future code fails closed.
 */
const DISPLAYABLE_LICENSES = new Set([
  'cc0',
  'cc-by',
  'cc-by-sa',
  'cc-by-nd',
  'cc-by-nc',
  'cc-by-nc-sa',
  'cc-by-nc-nd',
])

export function isDisplayableLicense(code: string | null | undefined): boolean {
  return typeof code === 'string' && DISPLAYABLE_LICENSES.has(code.trim().toLowerCase())
}

export function speciesCountsUrl(lat: number, lon: number, radiusKm = DEFAULT_RADIUS_KM): string {
  const q = new URLSearchParams({
    lat: String(lat),
    lng: String(lon),
    radius: String(radiusKm),
    quality_grade: 'research',
    per_page: '200',
  })
  return `${INAT_BASE}/observations/species_counts?${q.toString()}`
}

/**
 * Narrows one raw row to a playable species, or returns null.
 *
 * Rejects, in order: non-species ranks (a genus-level "photo of a gull" makes an
 * unanswerable question), missing common name (the answer buttons need words a
 * student knows), missing photo, unusable licence, missing credit line.
 */
export function toLocalSpecies(entry: InatSpeciesCount | null | undefined): LocalSpecies | null {
  const taxon = entry?.taxon
  if (!taxon || typeof taxon.id !== 'number') return null
  if (taxon.rank !== 'species') return null

  const commonName = taxon.preferred_common_name?.trim()
  if (!commonName) return null

  const photo = taxon.default_photo
  const photoUrl = photo?.medium_url?.trim()
  if (!photo || !photoUrl) return null

  if (!isDisplayableLicense(photo.license_code)) return null

  // A displayable licence is worthless without the credit line to display.
  const attribution = photo.attribution?.trim()
  if (!attribution) return null

  const count = Number(entry?.count)
  if (!Number.isFinite(count) || count <= 0) return null

  return {
    id: taxon.id,
    commonName,
    scientificName: taxon.name?.trim() || commonName,
    group: taxon.iconic_taxon_name?.trim() || 'Unknown',
    count,
    photoUrl,
    thumbUrl: photo.square_url?.trim() || photoUrl,
    attribution,
    license: (photo.license_code as string).trim().toLowerCase(),
  }
}

/** Filters a raw response to usable species, most-observed first, deduped by id. */
export function usableSpecies(res: InatSpeciesCountsResponse | null | undefined): LocalSpecies[] {
  const seen = new Set<number>()
  const out: LocalSpecies[] = []
  for (const entry of res?.results ?? []) {
    const s = toLocalSpecies(entry)
    if (!s || seen.has(s.id)) continue
    seen.add(s.id)
    out.push(s)
  }
  return out.sort((a, b) => b.count - a.count)
}

export interface LocalSpeciesResult {
  species: LocalSpecies[]
  /** The radius that produced this pool — 25km normally, 75km after widening. */
  radiusKm: number
  /** True when the first radius was too thin and we had to widen. */
  widened: boolean
}

/**
 * Fetches the playable species pool for a point.
 *
 * Widens the radius once if the first pass cannot fill a game, and reports
 * `reason: 'empty'` rather than pretending — the caller is expected to fall back
 * to labelled sample data and tell the player it did.
 */
export async function fetchLocalSpecies(
  lat: number,
  lon: number,
  opts: { signal?: AbortSignal; minimum?: number } = {}
): Promise<Result<LocalSpeciesResult>> {
  const minimum = opts.minimum ?? MIN_USABLE_SPECIES
  const radii = [DEFAULT_RADIUS_KM, WIDE_RADIUS_KM]

  let thin: LocalSpeciesResult | null = null

  for (let i = 0; i < radii.length; i++) {
    const radiusKm = radii[i]
    const res = await fetchJson<InatSpeciesCountsResponse>(speciesCountsUrl(lat, lon, radiusKm), {
      signal: opts.signal,
    })
    if (!res.ok) return res

    const species = usableSpecies(res.data)
    if (species.length >= minimum) {
      return { ok: true, data: { species, radiusKm, widened: i > 0 } }
    }
    thin = { species, radiusKm, widened: i > 0 }
  }

  return {
    ok: false,
    reason: 'empty',
    message: `Only ${thin?.species.length ?? 0} usable species have been recorded near this ZIP — not enough for a round.`,
  }
}

/** Deep link to iNaturalist's own map for a place, for the community hand-off. */
export function inatExploreUrl(lat: number, lon: number, radiusKm = DEFAULT_RADIUS_KM): string {
  const q = new URLSearchParams({
    lat: String(lat),
    lng: String(lon),
    radius: String(radiusKm),
    quality_grade: 'research',
  })
  return `${INAT_SITE}/observations?${q.toString()}`
}

/**
 * Where the licence itself lives.
 *
 * CC BY-NC 4.0 §3(a)(1)(C) does not accept the licence's name on its own: a
 * credit line has to carry "the text of, or the URI or hyperlink to, this
 * Public License". Naming it "CC BY-NC" is therefore short of the requirement,
 * and it is also ambiguous, because 2.0 and 4.0 are not the same deal.
 *
 * iNaturalist issues its CC licences at version 4.0 and links them there from
 * its own photo pages, so that is the version we resolve to. Returns null for
 * a code we do not recognise rather than guessing at a URL.
 */
export function licenseUrl(code: string): string | null {
  if (code === 'cc0') return 'https://creativecommons.org/publicdomain/zero/1.0/'
  const slug = code.startsWith('cc-') ? code.slice(3) : null
  if (!slug || !/^by(-nc)?(-sa|-nd)?$/.test(slug)) return null
  return `https://creativecommons.org/licenses/${slug}/4.0/`
}

/** A species' page on iNaturalist. */
export function taxonUrl(id: number): string {
  return `${INAT_SITE}/taxa/${id}`
}

/**
 * Where this exact photograph lives on iNaturalist — the URI the attribution
 * clause wants, and a page that shows the photo beside its photographer and
 * licence, which is what §3(a)(2) accepts in place of separate links.
 *
 * Derived from the image URL rather than stored, because every iNaturalist
 * photo URL already carries its id (`.../photos/36416485/medium.jpeg`), so
 * neither the API client nor the offline fixture needs a new field.
 *
 * The taxon page is only a fallback. It is the weaker link: a taxon's default
 * photo can be swapped out, at which point it would credit the wrong person.
 */
export function photoPageUrl(photoUrl: string, taxonId: number): string {
  const id = /\/photos\/(\d+)\//.exec(photoUrl)?.[1]
  return id ? `${INAT_SITE}/photos/${id}` : taxonUrl(taxonId)
}

/** Human-readable licence name for the credit line. */
export function licenseLabel(code: string): string {
  switch (code) {
    case 'cc0':
      return 'CC0'
    case 'cc-by':
      return 'CC BY'
    case 'cc-by-sa':
      return 'CC BY-SA'
    case 'cc-by-nd':
      return 'CC BY-ND'
    case 'cc-by-nc':
      return 'CC BY-NC'
    case 'cc-by-nc-sa':
      return 'CC BY-NC-SA'
    case 'cc-by-nc-nd':
      return 'CC BY-NC-ND'
    default:
      return code.toUpperCase()
  }
}
