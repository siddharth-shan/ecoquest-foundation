// UN-recognized environmental days with a fixed calendar date, each paired with
// the EcoQuest activity closest to its subject. Dates and links were checked
// against un.org/en/observances/list-days-weeks on 2026-10-27.
//
// Fixed dates only: the homepage works out what is next from the visitor's
// clock, so a day whose date moves each year (Arbor Day) would need a rule, not
// a date. The pairing is ours, not the UN's — the page labels the day "UN
// observance" and offers our activity as "Try: …".

export interface AwarenessDay {
  month: number
  day: number
  name: string
  /** The official observance page. */
  url: string
  /** Key of a PlanetActivity in src/lib/planetCalendar.ts. */
  activity: string
}

export const awarenessDays: AwarenessDay[] = [
  { month: 1, day: 26, name: 'International Day of Clean Energy', url: 'https://www.un.org/en/observances/clean-energy-day', activity: 'energy' },
  { month: 2, day: 2, name: 'World Wetlands Day', url: 'https://www.un.org/en/observances/world-wetlands-day', activity: 'storm-drain' },
  { month: 3, day: 3, name: 'World Wildlife Day', url: 'https://www.un.org/en/observances/world-wildlife-day', activity: 'bioblitz' },
  { month: 3, day: 21, name: 'International Day of Forests', url: 'https://www.fao.org/international-day-of-forests/en', activity: 'bioblitz' },
  { month: 3, day: 22, name: 'World Water Day', url: 'https://www.un.org/en/observances/water-day', activity: 'water' },
  { month: 3, day: 30, name: 'International Day of Zero Waste', url: 'https://www.un.org/en/observances/zero-waste-day', activity: 'zero-waste' },
  { month: 4, day: 22, name: 'International Mother Earth Day', url: 'https://www.un.org/en/observances/earth-day', activity: 'climate-record' },
  { month: 5, day: 22, name: 'International Day for Biological Diversity', url: 'https://www.un.org/en/observances/biological-diversity-day', activity: 'bioblitz' },
  { month: 6, day: 5, name: 'World Environment Day', url: 'https://www.un.org/en/observances/environment-day', activity: 'zero-waste' },
  { month: 6, day: 8, name: 'World Oceans Day', url: 'https://www.un.org/en/observances/oceans-day', activity: 'storm-drain' },
  { month: 9, day: 7, name: 'International Day of Clean Air for Blue Skies', url: 'https://www.cleanairblueskies.org/', activity: 'air-detective' },
  { month: 9, day: 16, name: 'International Day for the Preservation of the Ozone Layer', url: 'https://www.un.org/en/observances/ozone-day', activity: 'air-detective' },
  { month: 9, day: 20, name: 'World Cleanup Day', url: 'https://www.un.org/en/observances/cleanup-day', activity: 'cleanup' },
  { month: 9, day: 29, name: 'International Day of Awareness of Food Loss and Waste', url: 'https://www.fao.org/platform-food-loss-waste/flw-events/international-day-food-loss-and-waste/en', activity: 'zero-waste' },
  { month: 10, day: 31, name: 'World Cities Day', url: 'https://www.un.org/en/observances/cities-day', activity: 'storm-drain' },
  { month: 12, day: 5, name: 'World Soil Day', url: 'https://www.un.org/en/observances/world-soil-day', activity: 'bioblitz' },
]
