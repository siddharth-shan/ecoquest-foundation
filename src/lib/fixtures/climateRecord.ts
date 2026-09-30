// Offline fallback for /games/climate-record/ — real Cerritos figures, not a mock.
//
// Every number below was aggregated from an actual Open-Meteo archive response
// for 33.8669, -118.0686 (Cerritos, CA 90703), captured 2026-09-29:
//
//   GET archive-api.open-meteo.com/v1/archive?latitude=33.8669&longitude=-118.0686
//       &start_date=1950-01-01&end_date=2025-12-31&daily=temperature_2m_max
//       &temperature_unit=fahrenheit
//   → 27,759 daily highs, no gaps.
//
// The same reduction the live game runs was applied to that response: mean of
// every daily high in the decade, and days at or above 90 °F divided by years.
// Nothing here is rounded for effect and nothing is an estimate.
//
// This decade series is also the reason the game is built the way it is. The
// record warms by about +0.75 °F over seventy years — real, but with the 1970s
// arriving *cooler* than the 1950s and four of six decade-to-decade steps going
// down. A game that promised a dramatic reveal would have to misrepresent this
// town to deliver one, so the game reports whatever the arithmetic says.

import {
  assembleRecord,
  type ClimateRecord,
  type ClimateWindow,
  type DecadeWindow,
} from '@/lib/api/openMeteoArchive'
import { DEMO_PLACE } from '@/lib/place'

export const CERRITOS_DECADES: DecadeWindow[] = [
  { label: '1950s', startYear: 1950, endYear: 1959, years: 10, meanDailyHigh: 74.9248, hotDaysPerYear: 28.3, complete: true },
  { label: '1960s', startYear: 1960, endYear: 1969, years: 10, meanDailyHigh: 74.3417, hotDaysPerYear: 24.0, complete: true },
  { label: '1970s', startYear: 1970, endYear: 1979, years: 10, meanDailyHigh: 74.1005, hotDaysPerYear: 23.5, complete: true },
  { label: '1980s', startYear: 1980, endYear: 1989, years: 10, meanDailyHigh: 74.8472, hotDaysPerYear: 32.9, complete: true },
  { label: '1990s', startYear: 1990, endYear: 1999, years: 10, meanDailyHigh: 74.7371, hotDaysPerYear: 31.3, complete: true },
  { label: '2000s', startYear: 2000, endYear: 2009, years: 10, meanDailyHigh: 74.395, hotDaysPerYear: 24.7, complete: true },
  { label: '2010s', startYear: 2010, endYear: 2019, years: 10, meanDailyHigh: 75.8238, hotDaysPerYear: 30.9, complete: true },
  // Six years in, so it is drawn and labelled as unfinished and left out of the
  // trend fit — an incomplete decade cannot be compared with a whole one.
  { label: '2020s', startYear: 2020, endYear: 2029, years: 6, meanDailyHigh: 75.396, hotDaysPerYear: 31.5, complete: false },
]

export const CERRITOS_RECENT: ClimateWindow = {
  label: '2016–2025',
  startYear: 2016,
  endYear: 2025,
  years: 10,
  meanDailyHigh: 75.679,
  hotDaysPerYear: 31.4,
}

const assembled = assembleRecord(CERRITOS_DECADES, CERRITOS_RECENT, {
  firstYear: 1950,
  lastYear: 2025,
  dayCount: 27759,
})

if (!assembled) {
  // Impossible with the constants above; fail loudly in dev rather than ship a
  // game with no fallback.
  throw new Error('climateRecord fixture failed to assemble')
}

export const CERRITOS_CLIMATE_RECORD: ClimateRecord = assembled

export const CERRITOS_FIXTURE_LABEL =
  `Showing sample data from ${DEMO_PLACE.city}, ${DEMO_PLACE.state} — the live archive is unavailable right now, so this is not your town's record.`
