// Environmental observances, each paired with the EcoQuest activity closest to
// its subject. Dates, rules and links were checked against the UN observances
// list and each organizer's own site on 2026-10-27; the `why` lines paraphrase
// the linked page (supporting quotes: docs/superpowers/specs/2026-10-27-this-week-v2-sources.md).
//
// Nothing here names a year. Fixed days carry a date; days that move (Arbor
// Day, Coastal Cleanup Day) carry a rule that planetCalendar re-derives for
// every year. The pairing is ours, not the organizer's — the page labels the
// day with its `source` and offers our activity as "Try: …".

/** 0 = Sunday, as Date#getDay. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type DateRule =
  | { month: number; day: number }
  | { month: number; weekday: Weekday; nth: 1 | 2 | 3 | 4 | 'last' }

export interface AwarenessDay {
  name: string
  when: DateRule
  /** Who declares the day; shown as the link text. */
  source: string
  /** The organizer's official page. */
  url: string
  /** One sentence, paraphrased from `url`. */
  why: string
  /** Key of a PlanetActivity in src/lib/planetCalendar.ts. */
  activity: string
}

// Kept in calendar order (rule days at their usual place) so same-date ties read naturally.
export const awarenessDays: AwarenessDay[] = [
  {
    name: 'International Day of Clean Energy',
    when: { month: 1, day: 26 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/clean-energy-day',
    why: 'This day encourages people everywhere to support a fair and inclusive switch to clean energy that helps people and the planet.',
    activity: 'energy',
  },
  {
    name: 'World Wetlands Day',
    when: { month: 2, day: 2 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/world-wetlands-day',
    why: 'About one in eight people on Earth depend on wetlands for their livelihoods, which is why this day celebrates them.',
    activity: 'storm-drain',
  },
  {
    name: 'World Seagrass Day',
    when: { month: 3, day: 1 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/seagrass-day',
    why: 'Seagrasses give fish food, shelter and nursery areas, keep water cleaner and help stop coastal erosion.',
    activity: 'storm-drain',
  },
  {
    name: 'World Wildlife Day',
    when: { month: 3, day: 3 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/world-wildlife-day',
    why: 'This day celebrates the many kinds of wild animals and plants, and the benefits that protecting them brings to people.',
    activity: 'bioblitz',
  },
  {
    name: 'International Day of Forests',
    when: { month: 3, day: 21 },
    source: 'FAO',
    url: 'https://www.fao.org/international-day-of-forests/en',
    why: 'This day celebrates all types of forests and encourages local activities such as tree planting.',
    activity: 'bioblitz',
  },
  {
    name: 'World Day for Glaciers',
    when: { month: 3, day: 21 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/world-glaciers-day',
    why: "Glaciers, snow and ice play a key role in Earth's climate and water cycle, and this day raises awareness of them.",
    activity: 'climate-record',
  },
  {
    name: 'World Water Day',
    when: { month: 3, day: 22 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/water-day',
    why: 'This day celebrates water and inspires action on the global water crisis, which affects everyone but not equally.',
    activity: 'water',
  },
  {
    name: 'World Meteorological Day',
    when: { month: 3, day: 23 },
    source: 'WMO',
    url: 'https://wmo.int/events-and-meetings/world-met-day',
    why: 'This day highlights how weather and water services help keep communities safe.',
    activity: 'climate-record',
  },
  {
    name: 'International Day of Zero Waste',
    when: { month: 3, day: 30 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/zero-waste-day',
    why: 'This day promotes more sustainable ways of making and using things, so less ends up as waste.',
    activity: 'zero-waste',
  },
  {
    name: 'International Mother Earth Day',
    when: { month: 4, day: 22 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/earth-day',
    why: 'This day recognizes that we share a responsibility to live in harmony with nature and the Earth.',
    activity: 'climate-record',
  },
  {
    name: 'National Arbor Day',
    when: { month: 4, weekday: 5, nth: 'last' },
    source: 'Arbor Day Foundation',
    url: 'https://www.arborday.org/celebrate/globe',
    why: 'National Arbor Day celebrates planting trees; each state also holds its own Arbor Day at its best planting time.',
    activity: 'bioblitz',
  },
  {
    name: 'World Migratory Bird Day',
    when: { month: 5, weekday: 6, nth: 2 },
    source: 'World Migratory Bird Day',
    url: 'https://www.migratorybirdday.org/',
    why: 'This day celebrates migratory birds and the people working to protect them.',
    activity: 'bioblitz',
  },
  {
    name: 'International Day of Plant Health',
    when: { month: 5, day: 12 },
    source: 'FAO',
    url: 'https://www.fao.org/plant-health-day/en',
    why: 'Protecting plant health helps end hunger, protect biodiversity and the environment, and keep food on our tables.',
    activity: 'bioblitz',
  },
  {
    name: 'World Bee Day',
    when: { month: 5, day: 20 },
    source: 'FAO',
    url: 'https://www.fao.org/world-bee-day/en',
    why: 'Bees and other pollinators help keep people and the planet healthy, and this day raises awareness of the challenges they face.',
    activity: 'bioblitz',
  },
  {
    name: 'International Day for Biological Diversity',
    when: { month: 5, day: 22 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/biological-diversity-day',
    why: 'Biodiversity is the variety of life on Earth, and people depend on it.',
    activity: 'bioblitz',
  },
  {
    name: 'World Environment Day',
    when: { month: 6, day: 5 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/environment-day',
    why: 'Held every year since 1973, this is the largest global day for environmental outreach, celebrated by millions of people.',
    activity: 'zero-waste',
  },
  {
    name: 'World Oceans Day',
    when: { month: 6, day: 8 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/oceans-day',
    why: 'The ocean covers about two-thirds of Earth, and this day helps people learn how our actions affect it.',
    activity: 'storm-drain',
  },
  {
    name: 'World Day to Combat Desertification and Drought',
    when: { month: 6, day: 17 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/desertification-day',
    why: 'The UN calls desertification one of the greatest environmental challenges of our time.',
    activity: 'water',
  },
  {
    name: 'International Day of Combating Sand and Dust Storms',
    when: { month: 7, day: 12 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/day-of-combating-sand-and-dust-storms',
    why: "Sand and dust storms can harm people's health, so this day encourages ways to reduce their effects.",
    activity: 'air-detective',
  },
  {
    name: 'World Lake Day',
    when: { month: 8, day: 27 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/world-lake-day',
    why: 'Lakes supply fresh water and habitat for wildlife, but overuse and pollution put them under pressure.',
    activity: 'water',
  },
  {
    name: 'International Day of Clean Air for Blue Skies',
    when: { month: 9, day: 7 },
    source: 'UNEP',
    url: 'https://www.cleanairblueskies.org/',
    why: 'Clean air is fundamental to healthy people, and this day calls on everyone to act for cleaner air.',
    activity: 'air-detective',
  },
  {
    name: 'International Day for the Preservation of the Ozone Layer',
    when: { month: 9, day: 16 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/ozone-day',
    why: 'The ozone layer shields Earth from harmful sun rays; this day marks the 1987 Montreal Protocol that protects it.',
    activity: 'air-detective',
  },
  {
    name: 'California Coastal Cleanup Day',
    when: { month: 9, weekday: 6, nth: 3 },
    source: 'California Coastal Commission',
    url: 'https://www.coastal.ca.gov/publiced/ccd/ccd.html',
    why: "California's largest yearly volunteer event, removing trash from beaches and inland waterways across the state.",
    activity: 'cleanup',
  },
  {
    name: 'World Cleanup Day',
    when: { month: 9, day: 20 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/cleanup-day',
    why: 'Clean-ups remind us that we share responsibility for keeping our surroundings clean and healthy.',
    activity: 'cleanup',
  },
  {
    name: 'World Rivers Day',
    when: { month: 9, weekday: 0, nth: 4 },
    source: 'World Rivers Day',
    url: 'https://worldriversday.com/about/',
    why: "This day celebrates the world's waterways and encourages better care of rivers everywhere.",
    activity: 'storm-drain',
  },
  {
    name: 'International Day of Awareness of Food Loss and Waste',
    when: { month: 9, day: 29 },
    source: 'FAO',
    url: 'https://www.fao.org/platform-food-loss-waste/flw-events/international-day-food-loss-and-waste/en',
    why: 'This day builds awareness and action to reduce food that is lost or wasted.',
    activity: 'zero-waste',
  },
  {
    name: 'International Day for Disaster Risk Reduction',
    when: { month: 10, day: 13 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/disaster-reduction-day',
    why: 'This day celebrates how people and communities are reducing their risk from disasters.',
    activity: 'air-detective',
  },
  {
    name: 'World Food Day',
    when: { month: 10, day: 16 },
    source: 'FAO',
    url: 'https://www.fao.org/world-food-day/en',
    why: 'This day raises awareness of hunger worldwide and encourages action for the future of food, people and the planet.',
    activity: 'zero-waste',
  },
  {
    name: 'World Cities Day',
    when: { month: 10, day: 31 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/cities-day',
    why: 'This day raises awareness of how cities are growing and supports efforts to make them sustainable.',
    activity: 'storm-drain',
  },
  {
    name: 'World Sustainable Transport Day',
    when: { month: 11, day: 26 },
    source: 'UN observance',
    url: 'https://www.un.org/en/observances/sustainable-transport-day',
    why: 'This day recognizes how safe, affordable and sustainable transport supports people and communities.',
    activity: 'energy',
  },
  {
    name: 'World Soil Day',
    when: { month: 12, day: 5 },
    source: 'FAO',
    url: 'https://www.fao.org/world-soil-day/en/',
    why: 'This day raises awareness of the role soil plays in growing food and keeping ecosystems working.',
    activity: 'bioblitz',
  },
]
