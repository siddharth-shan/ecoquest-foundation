// One "This season in Southern California" card per month. Each entry is a
// paraphrase of its source page (supporting quotes:
// docs/superpowers/specs/2026-10-27-this-week-v2-sources.md). No entry names a
// year, so the card is right every year. Month placement is editorial.

export interface Season {
  /** 1–12 */
  month: number
  heading: string
  /** Two factual sentences. */
  text: string
  sourceLabel: string
  sourceUrl: string
  /** Key of a PlanetActivity in src/lib/planetCalendar.ts. */
  activity: string
}

export const seasons: Season[] = [
  {
    month: 1,
    heading: 'Rain and beach water',
    text: 'After a rain, storm drains carry runoff to the ocean, which can raise bacteria levels at the beach. LA County advises avoiding ocean water for at least 72 hours after rainfall.',
    sourceLabel: 'LA County Public Health',
    // Served over http only.
    sourceUrl: 'http://publichealth.lacounty.gov/beach/',
    activity: 'storm-drain',
  },
  {
    month: 2,
    heading: 'Wildflower season begins',
    text: "In the Antelope Valley, wildflower season can start as early as mid-February. The blooms change through spring, so it's a good time to look closely at local plants.",
    sourceLabel: 'California State Parks',
    sourceUrl: 'https://www.parks.ca.gov/poppyreserve',
    activity: 'bioblitz',
  },
  {
    month: 3,
    heading: 'Spring bird migration',
    text: 'Each spring, starting around March, birds of every kind fly north from their winter homes. More than a billion birds pass over California on the way.',
    sourceLabel: 'Audubon California',
    sourceUrl: 'https://www.audubon.org/california/news/spring-migration-california',
    activity: 'bioblitz',
  },
  {
    month: 4,
    heading: 'Peak wildflower viewing',
    text: 'Antelope Valley wildflowers bloom from March through May. California State Parks lists mid-April as the usual peak.',
    sourceLabel: 'California State Parks',
    sourceUrl: 'https://www.parks.ca.gov/AccessibleFeatures/Details/627',
    activity: 'bioblitz',
  },
  {
    month: 5,
    heading: 'Ozone season begins',
    text: 'May marks the start of ozone season in Southern California. Heat, sunlight and still air can raise ground-level ozone, especially inland in the afternoon.',
    sourceLabel: 'South Coast AQMD',
    sourceUrl: 'https://www.aqmd.gov/home/research/pubs-docs-reports/newsletters/may-jun-jul-2026/ozone-season-begins-across-the-south-coast-air-basin',
    activity: 'air-detective',
  },
  {
    month: 6,
    heading: 'May Gray, June Gloom',
    text: 'Each year, Southern Californians see a long run of gray, overcast days known as "May Gray" and "June Gloom." Heavy cloud banks roll in off the ocean and sometimes bring a light drizzle.',
    sourceLabel: 'NASA Earthdata',
    sourceUrl: 'https://www.earthdata.nasa.gov/news/feature-articles/cloudy-chance-drizzle',
    activity: 'climate-record',
  },
  {
    month: 7,
    heading: 'Grunion on the beach',
    text: 'Grunion are small, silvery fish found only along the coast of Southern California and northern Baja California. They leave the water at night to spawn on beaches in spring and summer.',
    sourceLabel: 'California Dept. of Fish and Wildlife',
    sourceUrl: 'https://wildlife.ca.gov/Fishing/Ocean/Grunion',
    activity: 'bioblitz',
  },
  {
    month: 8,
    heading: 'Hot days, busy power grid',
    text: "On very hot days, California's power grid can be under stress. Flex Alerts ask people to use less electricity, especially in the late afternoon and evening.",
    sourceLabel: 'California Public Utilities Commission',
    sourceUrl: 'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/flex-alert',
    activity: 'energy',
  },
  {
    month: 9,
    heading: 'Coastal Cleanup Day',
    text: "California Coastal Cleanup Day is held each September. It is the state's largest yearly volunteer event, removing trash from beaches and inland waterways.",
    sourceLabel: 'California Coastal Commission',
    sourceUrl: 'https://www.coastal.ca.gov/publiced/ccd/ccd.html',
    activity: 'cleanup',
  },
  {
    month: 10,
    heading: 'Fall bird migration',
    text: 'Fall migration is one of the great natural sights in California. It peaks in October and November.',
    sourceLabel: 'Audubon California',
    sourceUrl: 'https://www.audubon.org/california/news/top-16-places-spot-migratory-birds-california',
    activity: 'bioblitz',
  },
  {
    month: 11,
    heading: 'First storms of the season',
    text: 'Southern California has a rainy season and a dry season. After months without rain, the first storms can wash built-up pollution into storm drains.',
    sourceLabel: 'LA County Public Works',
    sourceUrl: 'https://pw.lacounty.gov/general/faq/index.cfm?Action=getAnswers&FaqID=IyMtMz0K&Theme=default&ShowTemplate=',
    activity: 'storm-drain',
  },
  {
    month: 12,
    heading: 'King tide season',
    text: "Winter is king tide season on California's coast. The Coastal Commission invites people to photograph king tides to help document coastal flood risk.",
    sourceLabel: 'California Coastal Commission',
    sourceUrl: 'https://www.coastal.ca.gov/kingtides/learn.html',
    activity: 'climate-record',
  },
]
