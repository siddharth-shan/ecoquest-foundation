import Link from 'next/link'

// The four games were rebuilt in September 2026 around a single rule: every
// number a player sees is fetched live from a public scientific dataset for
// the ZIP code they typed in, or it is not shown at all. That is why these
// cards advertise a data source instead of a difficulty rating — the source is
// the product. See docs/superpowers/specs/2026-09-29-games-revamp-design.md.
//
// The card images are real screenshots of these four games running, not mockups.
// They all show Cerritos, CA (ZIP 90703, EcoQuest's own city) because a screenshot
// has to show one place and that is the honest one to pick; a player who enters
// their own ZIP gets their own town's data in the same layouts. The disclosure
// under the grid says so.
//
// The Bioblitz still carries the photographer's CC BY-NC credit line inside the
// image itself, which is what keeps republishing that photo here licence-compliant.

export const metadata = {
  title: 'Environmental Games',
  description:
    'Four free games built on live public science data for your own ZIP code — identify the species around you, trace where your storm drain flows, read your air-quality record, and compare your town’s climate to the 1950s.',
  alternates: { canonical: '/games/' },
  openGraph: {
    title: 'Environmental Games - EcoQuest Foundation',
    description:
      'Free games built on real public data for your own neighborhood: local biodiversity, storm drain tracing, air-quality forensics, and your town’s 75-year climate record.',
  },
}

const games = [
  {
    id: 'storm-drain',
    verb: 'Trace',
    title: 'Storm Drain Detective',
    description:
      'Guess where the water on your street ends up, then watch the real answer draw itself. Uses the U.S. Geological Survey’s river network to follow your nearest waterway downstream, naming the real gauges it passes and the real place it reaches the sea.',
    ageRange: 'Grades 5-12',
    topics: ['Watersheds', 'Ocean Pollution', 'Litter'],
    source: 'USGS Hydro Network',
    img: '/images/games/storm-drain.png',
    alt:
      'Storm Drain Detective mid-trace: a blue flowline running south from the centre of ZIP 90703 in Cerritos, California, past two numbered USGS gauges to a red marker where the trace ends.',
  },
  {
    id: 'bioblitz',
    verb: 'Identify',
    title: 'Backyard Bioblitz',
    description:
      'Every photo is a real plant or animal that somebody actually recorded near your ZIP code. Learn to tell them apart, find out how often each one has been seen where you live, and print a bingo card of species you can genuinely go out and find.',
    ageRange: 'Grades 3-12',
    topics: ['Biodiversity', 'Species ID', 'Community Science'],
    source: 'iNaturalist',
    img: '/images/games/bioblitz.jpg',
    alt:
      'Backyard Bioblitz on round 1 of 10: a photograph of a Western Fence Lizard recorded near Cerritos, California, its iNaturalist credit line beneath it, and four reptile names to choose from.',
  },
  {
    id: 'air-detective',
    verb: 'Deduce',
    title: 'Air Detective',
    description:
      'Real hourly pollution data from your own area, with the cause hidden. Read the clues — which pollutant moved, what time of day, what season — and work out what happened. Sometimes the honest answer is that the evidence is not strong enough, and saying so scores full marks.',
    ageRange: 'Grades 6-12',
    topics: ['Air Quality', 'Urban Heat', 'Evidence'],
    source: 'Copernicus / Open-Meteo',
    img: '/images/games/air-detective.png',
    alt:
      'Air Detective\u2019s evidence board: four panels of real PM2.5 and ozone readings for Cerritos, California, with the 24 February spike picked out against the surrounding week.',
  },
  {
    id: 'climate-record',
    verb: 'Predict',
    title: 'Your Climate Record',
    description:
      'Commit to a guess about your own town before you see anything: how much warmer is it than the 1950s, and how many more hot days? Then meet the real 75-year record. You are scored on how close your guess was — not on how alarming the answer is.',
    ageRange: 'Grades 6-12',
    topics: ['Climate', 'Signal vs. Noise', 'Local Data'],
    source: 'Open-Meteo Reanalysis',
    img: '/images/games/climate-record.png',
    alt:
      'Your Climate Record\u2019s result screen: average daily high in Cerritos, California by decade from the 1950s to the 2020s, with the 1950s and 2016-2025 averages drawn in and a +0.75 degrees Fahrenheit caption.',
  },
]

export default function GamesPage() {
  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Environmental Games</h1>
          <p className="text-xl">Real data about the place you actually live</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Type in a ZIP code and each of these games rebuilds itself around that
              neighborhood, using the same public scientific datasets that researchers and
              government agencies use. Nothing is invented for effect: if the data for your
              town is undramatic, the game tells you so. Every game finishes with something
              you can do outdoors.
            </p>
            <p className="text-sm text-gray-500 max-w-3xl mx-auto mt-4">
              Free, no account, and nothing you enter leaves your device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {games.map((game) => (
              <div key={game.id} className="card card-hover overflow-hidden flex flex-col">
                <div className="relative bg-white border-b border-gray-100">
                  {/* Native 2:1, so the screenshot is shown whole rather than cropped. */}
                  <img
                    src={game.img}
                    alt={game.alt}
                    className="w-full aspect-[2/1] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm uppercase tracking-wide">
                    {game.verb}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-heading font-bold text-2xl mb-2 text-primary-green">
                    {game.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{game.description}</p>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Age Range:</div>
                    <span className="inline-block bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-sm font-medium">
                      {game.ageRange}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Learning Topics:</div>
                    <div className="flex flex-wrap gap-2">
                      {game.topics.map((topic) => (
                        <span
                          key={topic}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Live data from:</span>{' '}
                    {game.source}
                  </div>

                  <Link
                    href={`/games/${game.id}/`}
                    className="btn btn-primary w-full text-center inline-block mt-auto"
                  >
                    Play {game.title} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 max-w-3xl mx-auto mt-10 text-center">
            Those four pictures are real screenshots of the games running, not mockups.
            Each one shows Cerritos, California &mdash; EcoQuest&rsquo;s own city &mdash; because a
            screenshot can only show one place. Enter your ZIP code and you will see the
            same screens drawn from your town&rsquo;s data instead. The Bioblitz photo is
            &copy; Steven Kurniawidjaja, CC BY-NC, via iNaturalist.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-green font-heading">
            How These Games Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                &#128205;
              </div>
              <h3 className="font-bold text-xl mb-2 text-primary-green">Built Around Your ZIP</h3>
              <p className="text-gray-600">
                The species, the river, the air and the weather are all pulled for the place you
                enter — not a generic example.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                &#128300;
              </div>
              <h3 className="font-bold text-xl mb-2 text-primary-green">Real Public Science</h3>
              <p className="text-gray-600">
                Every game names its data source on the page, and says plainly when a reading is a
                model estimate rather than a ground measurement.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                &#127757;
              </div>
              <h3 className="font-bold text-xl mb-2 text-primary-green">Ends Outdoors</h3>
              <p className="text-gray-600">
                Each game finishes with a real task, a printable sheet for classrooms, and a way to
                contribute observations that scientists actually use.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="/events/" className="btn btn-outline">
              See Upcoming EcoQuest Events &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
